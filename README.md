Web Application Backend for Blinkit Assignment 
## Installation

Install my-project with npm


Clone the repo
```bash
git clone https://github.com/earth9890/blinkit-assignment-backend.git
```


Install packages
```bash
cd blinkit-assignment-backend-master
npm install
```

To run 

```bash
npm run dev
```



    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
You can use this API_KEYS and secrets its for temporary use only later will change.

```bash
PORT=8000
MONGODB_URL=mongodb+srv://archiveadmin:archive@archives.no5a8kl.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=20c9ad97c081d63397d76685a412227a40e23c
ACCESS_TOKEN_EXPIRY=5d
REFRESH_TOKEN_SECRET=8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e
REFRESH_TOKEN_EXPIRY=20d
CLOUDINARY_NAME=dqgwfbi1a
API_KEY_CLOUDINARY= 282193957982679
CLOUDINARY_API_SECRET=jGDoKl5LkcHXJTtf9SQlBeinCAE
```




# Routes ##


## Register
http://localhost:8000/api/v1/users/register should send data 
#### {username :  "", password : "" } 

## Login
http://localhost:8000/api/v1/users/login should send 
#### {username :  "", password : "" } 

## Upload Images 
http://localhost:8000/api/v1/users/upload

User can upload 3 images at a time will be stored on cloudinary and provided a URL of image (its secured route needs user logged-in( authentication and authorization ).
)

#### {username : "" , images : [],}


## Get Images
http://localhost:8000/api/v1/users/images its secured route needs user logged-in( authentication and authorization ).

## Logout
http://localhost:8000/api/v1/users/logout This route used to logout (will clear cookies).










