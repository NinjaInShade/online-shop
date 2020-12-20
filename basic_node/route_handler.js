const fs = require("fs");

function RouteHandler(req, res) {
  // Setting general headers
  res.setHeader("Content-type", "text/html");

  // Putting req methods into constants
  const url = req.url;
  const method = req.method;

  // Req handler for index page
  if (url === "/") {
    res.write("<html><head><title>My node app</title></head>");
    res.write("<body>");
    res.write('<form action="/submit" method="POST"><input type="text" name="my_input"/><button type="submit">submit!</button></form>');
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  // Req handler for form submittion
  if (url === "/submit" && method === "POST") {
    // Parsing body data
    const body = [];
    req.on("data", function (chunk) {
      body.push(chunk);
    });

    // After req has finished processing
    req.on("end", function () {
      const parsed_body = Buffer.concat(body).toString();
      const form_data = parsed_body.split("=")[1];

      // Write a file using file system
      fs.writeFile("MyFormData.txt", `Submitted data: ${form_data}`, function (err) {
        // Send response data
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
}

module.exports = RouteHandler;
