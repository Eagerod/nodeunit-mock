"use strict";

/**
    Sets up a mocked function on the provided object that allows you to test things
    like the number of calls that were made on a function and the parameters that
    came into it.
    Should typically be used to prevent outgoing network calls, so that tests
    can be run in isolation without affecting any services.
*/
function mock(test, object, functionName, newFunction) {
    // Allow test writers to still let methods pass through, in case that's needed.
    var unmockedName = "unmocked_" + functionName;

    // Check to see if this object owns the property, or if it's possibly a class we're mocking.
    if (object.prototype && object.prototype[functionName] && !object.hasOwnProperty(functionName)) {
        object = object.prototype;
    }
    else if (!(functionName in object)) {
        throw new Error("No function found named (" + functionName + ")");
    }

    object[unmockedName] = object[functionName];

    // Actual function mock.
    object[functionName] = function() {
        ++object[functionName].callCount;
        var args = Array.prototype.slice.call(arguments);
        object[functionName].callArguments.push(args);
        if (newFunction) {
            return newFunction.apply(this, args);
        }
        else if (newFunction === undefined) { // if null, don't call anything.
            return object[unmockedName].apply(this, args);
        }
    };
    object[functionName].callCount = 0;
    object[functionName].callArguments = [];

    // Clean up in test.done()
    var oldDone = test.done;
    test.done = function() {
        object[functionName] = object[unmockedName];
        delete object[unmockedName];
        oldDone.apply(this, Array.prototype.slice.call(arguments));
    };
    return object[functionName];
}

module.exports = mock;
