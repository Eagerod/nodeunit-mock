# Nodeunit Mock

Simulating errors sucks.
Nodeunit-mock makes it suck a little less.

## Purpose

While writing out tests, it becomes a hassle trying to simulate errors.
Sometimes you need to prevent your application from making network requests that can naturally fail for reasons that you aren't explicitly trying to test.

Getting a particular database request to throw a certain error, or getting a specific network request to fail can be cumbersome. 

Mocking out methods in your nodeunit tests lets you simulate whatever you want from whatever function you can access in your test files.

## Interface

Mocking methods is trivial, and they clean themselves up, so there's no need to worry about them interfering with other tests. 

Mocking a function out of an object is as easy as:

```javascript
var fs = require("fs");
var mock = require("nodeunit-mock");

function testCase(test) {
    test.expect(3);
    mock(test, fs, "readFile", function(filepath, callback) {
        callback(new Error("I couldn't read the file!"));
    });
    fs.readFile("path/to/file.txt", function(err, data) {
        test.equal(err.message, "I couldn't read the file!");
        test.equal(fs.readFile.callCount, 1);
        test.equal(fs.readFile.callArguments[0][0], "path/to/file.txt");
        test.done();
    });
}
```

Nodeunit mocks hook themselves into the `test.done()` so that you don't have to worry about any kind of cleanup.

You can also use the return value of the mock function call to check things like the `callCount`, and `callArguments` of the function that was mocked.

The mocks also set up a non-mocked version of the function that you can call in the event that certain function calls should have the original behavior, and some shouldn't. 
One place where this feature becomes useful is in network mocking:

**Handler**
```
server.post("/externalrequest", function(req, res, next) {
    request.post({url:"http://example.com/upload"}, function(err, res, data) {
        if ( err ) {
            return next(err);
        }
        res.send(200);
        return next();
    })
});
```

**Test Case**

```javascript
var request = require("request");
var mock = require("nodeunit-mock");

function testCase(test) {
    test.expect(4);
    var post = mock(test, request, "post", function(reqObj, callback) {
        if ( reqObj.url === "http://localhost:8080/externalrequest" ) {
            return this.unmocked_post(reqObj, callback);
        }
        return callback(new Error("Failed to connect to the server"), null, null);
    });

    request.post({
        url: "http://localhost:8080/externalrequest"
    }, function(err, resp, body) {
        test.equal(JSON.parse(body).message, "Failed to connect to the server");
        test.equal(post.callCount, 2);
        test.equal(post.callArguments[0][0].url, "http://localhost:8080/externalrequest");
        test.equal(post.callArguments[1][0].url, "http://example.com/upload");
        test.done();
    });
}
```
## Future

Right now, I don't have any direct plans to add features to this module, but if any ideas come forward, or there are any issues found, I'll be maintaining it.
