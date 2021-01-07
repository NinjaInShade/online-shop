# Tips and notes on managing and handling requests through a middleware function.

## Due to express, the req and res have multiple useful parts.

- To access a url param that was defined in a route -> you can use req.params.name_of_param -> similar procedure is used to access query params but with req.query
- Access the body of a POST request instantly by using req.body
- Redirect the user using res.redirect()
