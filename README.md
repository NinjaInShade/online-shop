# Welcome to my online shop project (e-commerce).

# Live build: [...]

## This is an online store made with node that incorporates concepts and technologies like:

- MVC pattern.
- Templating engines.
- Middleware functions.
- Dynamic routing.
- Using SQL and NOSQL databases, using advanced models and querying db's inside node js.
- Authentication/Authorization system.
- Using sessions and cookies together to build an authentication system.

### Auth workflow for later reading:

#### Authentication (proving identity of a user)

- The workflow: <https://prnt.sc/xz0e98>
- User logins through a form, sending a POST request to backend.
- Login/sign up controller validates inputs, finds or creates the user (hash password if creating new user), creates a session and stores is authenticated state in the session and the user object.
- Store session id in a cookie (some libraries handle this automatically upon creating a session), then with every new request the cookie is sent and is checked if it's a valid session or if it's run out - if so then deny the request as the user's identity can't be proven.
- On logout destroy the session.

#### Authorization (limiting what a user can view/do depending on type of user)

- To protect routes in node, a good way is a custom middleware function. That function checks if their is a valid session or session data, and redirects if not authenticated, but calls next() if is, thus user is logged in. Place this middleware on every route where you need auth protection before the controller function. This works because middleware functions go from left to right, so the controller function will never get reached if user is redirected.

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

### CSRF notes

- Stands for cross site request forgery. It's a security risk that an attacker could exploit. Basically an attacker would send a fake email pretending to be your site, and actually have a link to your site, typically a form page, which sends a request and it would have fields already filled out. Since that user probably has a session, and the user clicked it himself, this could be a problem. The attacker could fill in some field to send you money, when the person didn't intend that.
- To prevent against this we include a so called "CSRF token" on all our views. This is used in all requests and if that token is not there it mean's the user didn't send that request from a view, so it isn't a legit request. The attacker has no way to guess the token because 1) it is a long hashed value, and 2) a new token is generated every time a new view is loaded.
- The csurf package is good for this. It can manage the generation of a new token every view (using it's middleware function it sets a req.csrfToken which you can pass to views to be stored in a hidden input) and can validate if a token is valid.
