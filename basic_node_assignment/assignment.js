const http = require("http");
const routes = require("./routes_handler");

const server = http.createServer(routes);

server.listen(5000);
