# A Simple Backend
A simple backend for storing users, their stories, and comments.

# Installation

Prerequisite: Node and npm.

Clone the Repo and in the terminal, change directory(cd) to the corresponding folder, then run this command:

```bash
npm i && npm run start
```

Congrats! The api is up and running at localhost:9000.


# Explanations

The program scaffolded by Express generator is a set of simple restful apis, which allows to create/delete users, stories, and comments. The request body should be x-www-form-urlencoded.

There is an opportunity to use a simple auth module (a simple middleware based on JWT). In case that is needed, simply uncomment the code that relates, and make http request with a ‘token’ parameter added to the request body in addition to parameters needed. The token is issued when user register or log in.

The project adopted Express.js and MongoDB, and the api specifications could be found in the following pages.

# Behaviours

When a user is deleted, all the data related to the user is deleted including all of stories and comments. Note that the comments from other users on this user’s stories get deleted as well. 

When a story is deleted, the comments on this story also get deleted.

Each successful request would receive a response code of 200. For failures, there are different error codes too. For simplicity, for something that does not exist or missing parameters, the code is 404 and for something that is not permittable, the code is 403.

# API Specifications

## Create User
```diff
POST /user/registration
```

This create a new user with a unique username.

Request body:

```
{
	username: string,
	password: string,
}
```

Sample response data:
```
{
	username: “Gerald”,
	storyIds: [ ],
	commentIds:[ ],
	_id: <SOME ID>,
	token: <JWT TOKEN>, // Optional
}
```

This will hash the user’s password (with salt of a round 10) before store the user in database. Then, it would return the current user on success.

## Log in User

```diff
POST /user/login
```

This log in a user with a unique username and password.

Request body:
```
{
	username: string,
	password: string,
}
```

Sample response data:
```
{
	username: “Gerald”,
	storyIds: [],
	commentIds:[],
	_id: <SOME ID>
	token: <JWT TOKEN>, // Optional
}
```

This will verify if the user exists, and whether the password matches. On success, it would return the current user.


## Retrieve stories of the current user

```diff 
GET /user/retrieve_stories
```

List all the stories created by the user.

Request body:
```
{
	username: string,
	token: string  //optional
}
```

Sample response data:
```
[ <STORY OBJECT 1>, <STORY OBJECT 2>]
```


On success, this would return a list of Story objects.


## Reset password

```diff
PATCH /user/reset_password
```

Resets the password of the current user.

Request body:
```
{
	username: string,
	password: string  // New password
	token: string  // Optional
}
```

Sample response data:
```
{
	username: “Gerald”,
	storyIds: [ ],
	commentIds:[ ],
	_id: <SOME ID>
}
```

On success, this would return the current user, with password changed.


## Log out

```diff
POST diff/user/logout
```

Log out the user. For simplicity, this won’t do anything, but in real case, if we use JWT, ask the frontend to remove the JWT from client side, or add the current JWT to an expire list in here. If use sessions, expire the session.

Request body:
```
{
	username: string,
	token: string  // Optional
}
```

Sample response data:
```
“Log-out succeeded.”
```

On success, this would return a message “Log-out succeeded.”.

## Delete

```diff
DELETE /user/delete
```

Delete the user. Recursively remove all data associated with this user as well. The user would be looking like “vanished” and leave no trace after this request.

Request body:
```
{
	username: string,
	token: string  // Optional
}
```

Sample response data:
```
"User and corresponding data successfully deleted."
```

On success, this would return a message "User and corresponding data successfully deleted.”

## Add story

```diff
POST /story/add
```

Add a new story. 

Request body:
```
{
	username: string,
	content: string
	token: string  // Optional
}
```

Sample response data:
```
{
	author: “Gerald”,
	time: <SOME TIME>,
	content: <SOME CONTENT>,
	commentIds: [ ],
	_id: <SOME ID>
	__v: 0
}
```

On success, this would return a Story object.


## Retrieve related comments

```diff
GET /story/retrieve_comments
```

List all the comments of the story.

Request body:
```
{
	storyId: string,
	token: string  // Optional
}
```

Sample response data:
```
[ <COMMENT OBJECT 1>, <COMMENT OBJECT 2>]
```

On success, this would return a list of Comment objects.

## Delete a story

```diff
DELETE /story/delete
```

Delete the story and all the corresponding comments.

Request body:
```
{
	storyId: string,
	token: string  // Optional
}
```

Sample response data:
```
"Story successfully deleted.”
```

On success, this would return a message "Story successfully deleted.”


## Add a comment

```diff
DELETE /comment/add
```

Add a comment to a specific story, along with the author of the comment.

Request body:
```
{
	storyId: string,
	username: string,
	content: string,
	token: string  // Optional
}
```

Sample response data:
```
{
	author: <SOME AUTHOR>,
	storyId: <SOME ID>,
	time: <SOME TIME>,
	content: <SOME CONTENT>,
	_id: <SOME ID>, // This is the id of the comment
	__v: 0,
}
```

On success, this would return a Comment object.


## Delete a comment

```diff
DELETE /comment/delete
```

Request body:
```
{
	commentId: string,
	token: string  // Optional
}
```

Sample response data:
```
"Comment successfully deleted.”
```

On success, this would return a message "Comment successfully deleted.”



