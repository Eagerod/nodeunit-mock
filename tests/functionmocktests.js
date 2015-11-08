"use strict";

var mock = require("..");

var FunctionMockTests = module.exports;
var NoArgFunctionTests = FunctionMockTests["No Argument Function"] = {};
var ArgsFunctionTests = FunctionMockTests["Argument Function"] = {};
var AsyncFunctionTests = FunctionMockTests["Async Function"] = {};
var ThrowsFunctionTests = FunctionMockTests["Throws Function"] = {};
var NestedMockTests = FunctionMockTests["Nested Mocks"] = {};

// Test object for mocking out properties
var testObject = {
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

NoArgFunctionTests["Mock Pass Through"] = function(test) {
    test.expect(3);
    var rf = mock(test, testObject, "regularFunction");
    test.equal(testObject.regularFunction(), 1);
    test.equal(rf.callCount, 1);
    test.deepEqual(rf.callArguments, [[]]);
    test.done();
};

NoArgFunctionTests["Mock Modified Function"] = function(test) {
    test.expect(3);
    function replacementFunction() {
        return 2;
    }
    var rf = mock(test, testObject, "regularFunction", replacementFunction);
    test.equal(testObject.regularFunction(), 2);
    test.equal(rf.callCount, 1);
    test.deepEqual(rf.callArguments, [[]]);
    test.done();
};

NoArgFunctionTests["Mock No Function"] = function(test) {
    test.expect(3);
    var rf = mock(test, testObject, "regularFunction", null);
    test.equal(testObject.regularFunction(), undefined);
    test.equal(rf.callCount, 1);
    test.deepEqual(rf.callArguments, [[]]);
    test.done();
};

ArgsFunctionTests["Mock pass through"] = function(test) {
    test.expect(3);
    var af = mock(test, testObject, "argumentFunction");
    test.equal(testObject.argumentFunction(1, 2), 3);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[1, 2]]);
    test.done();
};

ArgsFunctionTests["Mock alternate return"] = function(test) {
    test.expect(3);
    function replacementFunction(arg1, arg2) {
        return arg1 * arg2;
    }
    var af = mock(test, testObject, "argumentFunction", replacementFunction);
    test.equal(testObject.argumentFunction(1, 2), 2);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[1, 2]]);
    test.done();
};

ArgsFunctionTests["Mock no function call"] = function(test) {
    test.expect(3);
    var af = mock(test, testObject, "argumentFunction", null);
    test.equal(testObject.argumentFunction(1, 2), undefined);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[1, 2]]);
    test.done();
};

AsyncFunctionTests["Mock pass through"] = function(test) {
    test.expect(3);
    var af = mock(test, testObject, "asyncFunction");
    function callback(value) {
        test.equal(value, "callback, yo!");
        test.done();
    }
    testObject.asyncFunction(callback);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[callback]]);
};

AsyncFunctionTests["Mock alternate callback arg"] = function(test) {
    test.expect(3);
    function replacementFunction(callback) {
        setTimeout(function() {
            callback("yo, callback!");
        }, 0);
    }
    var af = mock(test, testObject, "asyncFunction", replacementFunction);
    function cb(value) {
        test.equal(value, "yo, callback!");
        test.done();
    }
    testObject.asyncFunction(cb);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[cb]]);
};

ThrowsFunctionTests["Mock pass through"] = function(test) {
    test.expect(3);
    var af = mock(test, testObject, "throwsFunction");
    test.throws(function() {
        testObject.throwsFunction();
    });
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[]]);
    test.done();
};

ThrowsFunctionTests["Mock alternate return"] = function(test) {
    test.expect(3);
    function replacementFunction() {
        // I don't throw!
    }
    var af = mock(test, testObject, "throwsFunction", replacementFunction);
    test.equal(testObject.throwsFunction(), undefined);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[]]);
    test.done();
};

ThrowsFunctionTests["Mock no function call"] = function(test) {
    test.expect(3);
    var af = mock(test, testObject, "throwsFunction", null);
    test.equal(testObject.throwsFunction(), undefined);
    test.equal(af.callCount, 1);
    test.deepEqual(af.callArguments, [[]]);
    test.done();
};

NestedMockTests["Success"] = function(test) {
    test.expect(3);
    mock(test, testObject, "asyncFunction", function(cb) {
        cb(testObject.regularFunction());
    });
    mock(test, testObject, "regularFunction", function() {
        return 2;
    });
    testObject.asyncFunction(function(val) {
        test.equal(val, 2);
        test.equal(testObject.regularFunction.callCount, 1);
        test.equal(testObject.asyncFunction.callCount, 1);
        test.done();
    });
};
