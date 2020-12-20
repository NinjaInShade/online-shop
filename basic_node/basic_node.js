// Importing required modules
const http = require("http");
const routes = require("./route_handler");

const server = http.createServer(routes);

server.listen(5000);
