"use strict";

var mock = require("..");

var SanityTests = module.exports;

SanityTests["Cannot Mock Undefined"] = function(test) {
    var obj = {};
    test.throws(function() {
        mock(test, obj.myProperty, "myFunction");
    }, Error, "Attempting to mock function myFunction of undefined.");
    test.done();
}
