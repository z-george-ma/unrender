"use strict";

var it = require("it"),
    assert = require("assert"),
    unrender = require("../index"),
    fs = require("fs");

it.describe("parse text from template", function (it) {
  it.timeout(60000);
  
  it.describe("extract text with a token", function(it) {
    it.should("succeed", function(cb) {
      var tpl = fs.readFileSync("./test/assets/test.1.tpl", "utf8");
      var text = fs.readFileSync("./test/assets/test.txt", "utf8");
      var engine = unrender(tpl);
      var result = engine(text);
      assert.deepEqual(result, {
        value: 'ipsum dolor sit'
      });
      cb();
    });
  });
  
  it.describe("extract text with a token + transformation", function(it) {
    it.should("succeed", function(cb) {
      var tpl = fs.readFileSync("./test/assets/test.2.tpl", "utf8");
      var text = fs.readFileSync("./test/assets/test.txt", "utf8");
      var engine = unrender(tpl);
      var result = engine(text);
      assert.deepEqual(result, {
        value: 'FAMES AC ANTE IPSUM PRIMIS IN FAUCIBUS'
      });
      cb();
    });
  });

  it.describe("extract text with multiple tokens", function(it) {
    it.should("succeed", function(cb) {
      var tpl = fs.readFileSync("./test/assets/test.3.tpl", "utf8");
      var text = fs.readFileSync("./test/assets/test.txt", "utf8");
      var engine = unrender(tpl);
      var result = engine(text);
      assert.deepEqual(result, {
        value1: 'ipsum dolor sit',
        value2: 'FAMES AC ANTE IPSUM PRIMIS IN FAUCIBUS'
      });
      cb();
    });
  });

  it.describe("extract text with a function", function(it) {
    it.should("succeed", function(cb) {
      var tpl = fs.readFileSync("./test/assets/test.4.tpl", "utf8");
      var text = fs.readFileSync("./test/assets/test.txt", "utf8");
      var engine = unrender(tpl);
      var result = engine(text);
      assert.deepEqual(result, {
        value: 'ipsum dolor sit'
      });
      cb();
    });
  });
});


it.describe("advanced parsing", function (it) {
  it.timeout(60000);
  
  it.describe("skip one field when not present", function(it) {
    it.should("succeed", function(cb) {
      var tpl = fs.readFileSync("./test/assets/test.if.1.tpl", "utf8");
      var text = fs.readFileSync("./test/assets/test.if.1.txt", "utf8");
      var engine = unrender(tpl);
      var result = engine(text);
      assert.deepEqual(result, {
        name: "John",
        title: "Doctor",
        location: "Melbourne"
      });
      cb();
    });
  });
});