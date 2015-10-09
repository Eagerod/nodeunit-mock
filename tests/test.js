"use strict";

var mock = require("..");

// This is my test application.
var app = {
    regularFunction: function() {
        return 1;
    }
};

module.exports = {
    "Regular function mock pass through": function(test) {
        test.expect(3);
        var rf = mock(test, app, "regularFunction");
        test.equal(app.regularFunction(), 1);
        test.equal(rf.callCount, 1);
        test.deepEqual(rf.callArguments, [[]]);
        test.done();
    },
    "Regular function mock alternate return": function(test) {
        test.expect(3);
        function replacementFunction() {
            return 2;
        }
        var rf = mock(test, app, "regularFunction", replacementFunction);
        test.equal(app.regularFunction(), 2);
        test.equal(rf.callCount, 1);
        test.deepEqual(rf.callArguments, [[]]);
        test.done();
    },
    "Regular function no function call": function(test) {
        test.expect(3);
        var rf = mock(test, app, "regularFunction", null);
        test.equal(app.regularFunction(), undefined);
        test.equal(rf.callCount, 1);
        test.deepEqual(rf.callArguments, [[]]);
        test.done();
    }
};
