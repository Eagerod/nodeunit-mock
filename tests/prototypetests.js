var mock = require("..");

var PrototypeTests = module.exports;

function SomeClass(someNumber) {
    this.someNumber = someNumber;
};

SomeClass.prototype.someFunction = function(mult) {
    return this.someNumber * mult;
};

PrototypeTests["Success"] = function(test) {
    var someInstance = new SomeClass(5);
    mock(test, SomeClass, "someFunction", function(power) {
        return Math.pow(this.someNumber, power); 
    });
    test.equal(someInstance.someFunction(2), 25);
    test.done();
};
