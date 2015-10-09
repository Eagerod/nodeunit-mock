"use strict";

var mock = require("..");

// This is my test application.
var app = {
    regularFunction: function() {
        return 1;
    },
    argumentFunction: function(arg1, arg2) {
        return arg1 + arg2;
    }
};

module.exports = {
    "Regular function": {
        "Mock pass through": function(test) {
            test.expect(3);
            var rf = mock(test, app, "regularFunction");
            test.equal(app.regularFunction(), 1);
            test.equal(rf.callCount, 1);
            test.deepEqual(rf.callArguments, [[]]);
            test.done();
        },
        "Mock alternate return": function(test) {
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
        "Mock no function call": function(test) {
            test.expect(3);
            var rf = mock(test, app, "regularFunction", null);
            test.equal(app.regularFunction(), undefined);
            test.equal(rf.callCount, 1);
            test.deepEqual(rf.callArguments, [[]]);
            test.done();
        }
    },
    "Argument function": {
        "Mock pass through": function(test) {
            test.expect(3);
            var af = mock(test, app, "argumentFunction");
            test.equal(app.argumentFunction(1, 2), 3);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[1, 2]]);
            test.done();
        },
        "Mock alternate return": function(test) {
            test.expect(3);
            function replacementFunction(arg1, arg2) {
                return arg1 * arg2;
            }
            var af = mock(test, app, "argumentFunction", replacementFunction);
            test.equal(app.argumentFunction(1, 2), 2);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[1, 2]]);
            test.done();
        },
        "Mock no function call": function(test) {
            test.expect(3);
            var af = mock(test, app, "argumentFunction", null);
            test.equal(app.argumentFunction(1, 2), undefined);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[1, 2]]);
            test.done();
        }
    }
};
