const dummy_data = ["user1", "another_user", "user5000", "new_user"];

function routes_handler(req, res) {
  const url = req.url;
  const method = req.method;

  res.setHeader("Content-type", "text/html");

  if (url === "/" && method === "GET") {
    res.write("<html>");
    res.write("<head><title>My first assignment app</title></head>");
    res.write("<body>");
    res.write('<form action="/create-user" method="POST">');
    res.write('<input type="text" name="username"/><button type="submit">Submit</button>');
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/users" && method === "GET") {
    res.write("<html>");
    res.write("<head><title>My first assignment app</title></head>");
    res.write("<body>");
    res.write("<ul>");
    dummy_data.map((user) => {
      return res.write(`<li>${user}</li>`);
    });
    res.write("</ul>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", function (chunk) {
      body.push(chunk);
    });

    req.on("end", function () {
      // Parse data
      const parsed_data = Buffer.concat(body).toString();
      const form_data = parsed_data.split("=")[1];
      console.log(form_data);

      // Send back response
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
}

module.exports = routes_handler;
