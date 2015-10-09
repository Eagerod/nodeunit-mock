"use strict";

var mock = require("..");

// This is my test application.
var app = {
    propertyFunction: function(arg) {
        return arg;
    },
    regularFunction: function() {
        return 1;
    },
    argumentFunction: function(arg1, arg2) {
        return arg1 + arg2;
    },
    asyncFunction: function(callback) {
        setTimeout(function () {
            callback("callback, yo!");
        }, 0);
    },
    throwsFunction: function() {
        throw new Error("Uh oh!");
    }
};

module.exports = {
    "Properties": {
        "Call values": function(test) {
            var nOps = 25;
            test.expect(nOps + 2);
            var args = [];
            var pf = mock(test, app, "propertyFunction");
            for ( var i = 0; i < nOps; ++i ) {
                test.equal(app.propertyFunction(i), i);
                args.push([i]);
            }
            test.equal(pf.callCount, nOps);
            test.deepEqual(pf.callArguments, args);
            test.done();
        },
        "Unmocked function unaffected": function(test) {
            test.expect(4);
            var pf = mock(test, app, "propertyFunction", function(arg) {
                return arg * 2;
            });
            test.equal(app.propertyFunction(4), 8);
            test.equal(app.unmocked_propertyFunction(4), 4);
            test.equal(pf.callCount, 1);
            test.deepEqual(pf.callArguments, [[4]]);
            test.done();
        }
    },
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
    },
    "Async function": {
        "Mock pass through": function(test) {
            test.expect(3);
            var af = mock(test, app, "asyncFunction");
            function callback(value) {
                test.equal(value, "callback, yo!");
                test.done();
            }
            app.asyncFunction(callback);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[callback]]);
        },
        "Mock alternate callback arg": function(test) {
            test.expect(3);
            function replacementFunction(callback) {
                setTimeout(function() {
                    callback("yo, callback!");
                }, 0);
            }
            var af = mock(test, app, "asyncFunction", replacementFunction);
            function cb(value) {
                test.equal(value, "yo, callback!");
                test.done();
            }
            app.asyncFunction(cb);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[cb]]);
        }
    },
    "Throws function": {
        "Mock pass through": function(test) {
            test.expect(3);
            var af = mock(test, app, "throwsFunction");
            test.throws(function() {
                app.throwsFunction();
            });
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[]]);
            test.done();
        },
        "Mock alternate return": function(test) {
            test.expect(3);
            function replacementFunction() {
                // I don't throw!
            }
            var af = mock(test, app, "throwsFunction", replacementFunction);
            test.equal(app.throwsFunction(), undefined);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[]]);
            test.done();
        },
        "Mock no function call": function(test) {
            test.expect(3);
            var af = mock(test, app, "throwsFunction", null);
            test.equal(app.throwsFunction(), undefined);
            test.equal(af.callCount, 1);
            test.deepEqual(af.callArguments, [[]]);
            test.done();
        }
    }
};
