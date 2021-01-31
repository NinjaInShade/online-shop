# Welcome to my online shop project (e-commerce).

## Live build: [...]

#### NOTE: Styling/Responsiveness was not the main focus, but backend inplementation. You may find one or two things that slightly overflow on smaller screen, but this isn't my priority. If i get time i may come back for this, but it's just not the reason i've made this project.

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

### Auth workflow for later reading if i forget:

- User logins through a form, sending a POST request to backend.
-

### Cookies notes

- Client side storage for key:value pairs.
- Not great for setting an is authenticated state as user's can easily modify it.
- Can set an expiration date.
- Since cookies contain which domain they come from, this is why they are used for tracking as it can still be accessed even if not on the site.

### Sessions notes

- Great for setting persistent sensitive data as it is handled by the backend and can't be accessed through the frontend.
- You can store a session id in a cookie, but it is a hashed value which would be detected if tampered with on the backend.
