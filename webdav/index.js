
const webdav = require('webdav-server').v2;
const express = require('express');

const server = new webdav.WebDAVServer();
const app = express();

// Mount the WebDAVServer instance
app.use(webdav.extensions.express('/home/owner/', server));

app.get("/", (req, res)=> {
    res.send("AAAAAAAAAAA")
})

app.listen(1900); // Start the Express server

// const webdav = require('webdav-server').v2;
// const server = new webdav.WebDAVServer({
//     port: 1900
// });
// server.afterRequest((arg, next) => {
//     // Display the method, the URI, the returned status code and the returned message
//     console.log('>>', arg.request.method, arg.requested.uri, '>', arg.response.statusCode, arg.response.statusMessage);
//     // If available, display the body of the response
//     console.log(arg.responseBody);
//     next();
// });

// server.start(() => console.log('READY'));

