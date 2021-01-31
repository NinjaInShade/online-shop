# Welcome to my online shop project (e-commerce).

# Live build: [...]

## This is an online store made with node that incorporates concepts and technologies like:

- MVC pattern.
- Templating engines.
- Middleware functions.
- Dynamic routing.
- Using SQL and NOSQL databases and ORM's - MySQL (sequelize) and MongoDB (mongoose) => and connecting them to a node application.
- How to create and use advanced models => A decent part of the project used OOP and storing data in a file. This helped me understand how databases work a bit better.
- Querying databases inside nodeJS.
- Reading documentation properly.
- Using sessions and cookies effectively.

### Auth workflow for later reading:

- User logins through a form, sending a POST request to backend.
- Login controller finds the user, creates a session and stores is authenticated state in the session and the user object.
- If the user has methods you need to use, since req.session.user won't store all metadata only fields, you can add a middleware function in app.js grabbing the full user from db using the req.session.user.\_id proprty and setting it in req.user. This is allowed because you grab the user from a persistent storage.
- On logout controller we destroy the session

### Cookies notes

- MDN docs for cookies, great doc: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies>
- Client side storage for key:value pairs.
- Not great for setting an is authenticated state as user's can easily modify it.
- Can set an expiration date.
- Since cookies contain which domain they come from, this is why they are used for tracking as it can still be accessed even if not on the site.

### Sessions notes

- Short explanation of what a session is: <https://www.quora.com/What-is-a-session-in-a-Web-Application>
- Great for setting persistent sensitive data as it is handled by the backend and can't be accessed through the frontend.
- You can store a session id in a cookie, but it is a hashed value which would be detected if tampered with on the backend.
- Express has a useful package called "express-session" to help with sessions. To get started setup it's middleware function.
- As we want to store it in our db instead of memory, we can use a useful package called "connect-mongodb-session".
- Can store any data in a session - often for authentication states/metadata though.
