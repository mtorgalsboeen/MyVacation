var expect = require("chai").expect;
var simpleFunctions = require('../simpleFunction');

describe("Hello World", function() {
    it("It should return a Hello World string", function(done) {
        expect(simpleFunctions.helloWorld()).to.equal("Hello World");
        done();
    }) 
});


