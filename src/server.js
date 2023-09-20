const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, callback) => {
  const body = []; // http library will give us the pieces in order, but we don't know when each one will arrive

  request.on("error", (err) => { // function to call if error occurred
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on("data", () => { // Called evey time we recieve a piece of data
    body.push(chunk);
  });

  request.on("end", () => { // Called when all data has been received
    console.log(body);
  });
}

const handlePost = (request, response, parsedUrl) => {
  if(parsedUrl.pathname === "/addUser"){ // Post request can come in chunks, so we need to piece it back together
    parseBody(request, response, jsonHandler.addUser);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if(request.method === "POST"){
    handlePost(request, response, parsedUrl);
  }else{
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
