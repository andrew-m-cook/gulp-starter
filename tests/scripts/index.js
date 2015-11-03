var $ = require('jquery');
var expect = require('chai').expect;
var assert = require('chai').assert;

var domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
};

domReady(function() {
  
  var header = document.getElementById('header');  
  var foo = 4;
  var bar = "bar";
  var baz = ["luke" , "han", "leia" , "chewbacca"];
  var beverages = { tea: ['chai', 'matcha', 'oolong'] };

  function square(num) {
    return num * num;
  }

  describe('assert test 01', function() {
    it('should work', function() {
      assert.typeOf(foo, "number", "foo is a string");
    });
  });

  describe('assert test 02', function() {
    it('should work', function() {
      assert.lengthOf(bar, 3, 'bar\'s value has a length of 3');
    });
  });

  describe('assert test 03', function() {
    it('should work', function() {
      assert.equal(bar, 'bar', 'bar equals bar');
    });
  });

  describe('assert test 04', function() {
    it('should work', function() {
      assert.lengthOf(baz, 4, 'baz array has a length of 4');
    });
  });

  describe('expect test 01', function() {
    it('should work', function() {
      expect(true).to.be.true;
    });
  });

  describe('expect test 02', function() {
    it('should work', function() {
      expect(foo).to.be.a('number');
    });
  });

  describe('expect test 03', function() {
    it('should work', function() {
      expect(bar).to.equal('bar');
    });
  });

  describe('expect test 04', function() {
    it('should work', function() {
      expect(bar).to.have.length(3);
    });
  });

  describe('expect test 05', function() {
    it('should work', function() {
      expect(beverages).to.have.property('tea').with.length(3);
    });
  });

  describe('expect function test 01', function() {
    it('should work', function() {
      expect(square(2)).to.equal(4);
    });
  });
  
  describe('expect dom test 01', function() {
    it('should work', function() {
      expect(header.innerHTML).to.equal('sign');
    });
  });  
  
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
  
});

