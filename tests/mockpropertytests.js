"use strict";

var mock = require("..");

var PropertyTests = module.exports;

var testObject = {
    propertyFunction: function(arg) {
        return arg;
    }
};

PropertyTests["Call Values"] = function(test) {
    var nOps = 25;
    test.expect(nOps + 2);
    var args = [];
    var pf = mock(test, testObject, "propertyFunction");
    for ( var i = 0; i < nOps; ++i ) {
        test.equal(testObject.propertyFunction(i), i);
        args.push([i]);
    }
    test.equal(pf.callCount, nOps);
    test.deepEqual(pf.callArguments, args);
    test.done();
};

PropertyTests["Unmocked Function"] = function(test) {
    test.expect(4);
    var pf = mock(test, testObject, "propertyFunction", function(arg) {
        return arg * 2;
    });
    test.equal(testObject.propertyFunction(4), 8);
    test.equal(testObject.unmocked_propertyFunction(4), 4);
    test.equal(pf.callCount, 1);
    test.deepEqual(pf.callArguments, [[4]]);
    test.done();
};

PropertyTests["Throws Non-Existent Function"] = function(test) {
    test.expect(1);
    test.throws(function() {
        mock(test, testObject, "nonexistentFunction", function(arg) {
            return arg * 2;
        });
    });
    test.done();
};
