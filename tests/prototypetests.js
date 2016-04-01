"use strict";

var mock = require("..");

var PrototypeTests = module.exports;

function SomeClass(someNumber) {
    this.someNumber = someNumber;
}

SomeClass.someStaticFunction = function(mult1, mult2) {
    return mult1 * mult2;
};

SomeClass.prototype.someFunction = function(mult) {
    return this.someNumber * mult;
};

function Subclass(someNumber) {
    SomeClass.call(this, someNumber);
}

Subclass.prototype = Object.create(SomeClass.prototype);

PrototypeTests["Prototype Success"] = function(test) {
    var someInstance = new SomeClass(5);
    mock(test, SomeClass, "someFunction", function(power) {
        return Math.pow(this.someNumber, power);
    });
    test.equal(someInstance.someFunction(2), 25);
    test.done();
};

PrototypeTests["Overridden Prototype Success"] = function(test) {
    test.expect(2);
    var someInstance = new SomeClass(5);
    someInstance.someFunction = function() {
        return "I'm getting mocked out anyways";
    };
    var someOtherInstance = new SomeClass(5);
    mock(test, someInstance, "someFunction", function(power) {
        return Math.pow(this.someNumber, power);
    });
    test.equal(someInstance.someFunction(5), 3125);
    test.equal(someOtherInstance.someFunction(5), 25);
    test.done();
};

PrototypeTests["Instance Mocked"] = function(test) {
    test.expect(2);
    var someInstance = new SomeClass(5);
    var someOtherInstance = new SomeClass(5);
    mock(test, someInstance, "someFunction", function(power) {
        return Math.pow(this.someNumber, power);
    });
    test.equal(someInstance.someFunction(5), 3125);
    test.equal(someOtherInstance.someFunction(5), 25);
    test.done();
};

PrototypeTests["Static Success"] = function(test) {
    mock(test, SomeClass, "someStaticFunction", function(mult1, mult2) {
        return Math.sqrt(mult1, mult2);
    });
    test.equal(SomeClass.someStaticFunction(4, 2), 2);
    test.done();
};

PrototypeTests["Subclass Success"] = function(test) {
    var someInstance = new Subclass(5);
    mock(test, Subclass, "someFunction", function(power) {
        return Math.pow(this.someNumber, power);
    });
    test.equal(someInstance.someFunction(2), 25);
    test.done();
};
