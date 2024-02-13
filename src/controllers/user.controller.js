import ApiError from "../utils/API_Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Api_Response } from "../utils/API_Response.js";

const generateAccessTokenAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.getAccessToken();
    const refreshToken = await user.getRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { username, fullName,  password } = req.body;
  
  if (
    [username, fullName,  password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, " All Fields are required !!");
  }

  const existedUser = await User.findOne({
     username 
  });

  if (existedUser) {
    throw new ApiError(409, "User with  or username already existed !!");
  }

 
  const user = await User.create({
    fullName,
    
 
    username: username.toLowerCase(),
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creting new User");
  }
  return res
    .status(201)
    .json(new Api_Response(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    throw new ApiError(400, "Enter  or username");
  }
  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);
  // delete user.password;
  // user.refreshToken = refreshToken;

  const loggedInUser = User.findOne(user._id).select("-password -refreshToken");

  const options = {
    http: true,
    secure: true,
  };
return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new Api_Response(
      200,
      {
        user: {
          // Extract necessary user information
          _id: loggedInUser._id,
          username: loggedInUser.username,
          // Add other user properties as needed
        },
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    )
  );

});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    http: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Api_Response(200, "User Logged Out "));
});

export { registerUser, loginUser, logoutUser };
