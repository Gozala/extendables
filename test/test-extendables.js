/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint undef: true es5: true node: true devel: true
         forin: true latedef: false supernew: true */
/*global define: true */

(typeof define !== "function" ? function($){ $(require, exports, module); } : define)(function(require, exports, module, undefined) {

"use strict";

exports["test basics"] = function(assert) {
  var Extendable = require("../extendables.js").Extendable;
  var Foo = Extendable.extend({ foo: 'foo' });
  Foo.self = function () { return this; };
  var Bar = Foo.extend({
    constructor: function Bar() {
      this.bar = 'bar';
    }
  });
  var Baz = Foo.extend({
    constructor: function Baz() {
      return { x: 1, y: 2 };
    }
  });

  assert.ok(Extendable() instanceof Extendable, "`new` is optional");
  assert.equal((new Foo).foo, "foo", "instance has a property defined");
  assert.equal(Foo().foo, "foo", "`new` is optional on decedants");
  assert.ok(new Bar instanceof Bar,
            "instance is returned if constructor returns undefined");
  assert.ok(new Bar instanceof Foo,
            "derived class responds to instanceof");
  assert.equal((new Bar).bar, "bar",
               "constructor modifies instance even if it's not returned");
  assert.ok(Bar.self, "static properties are inherited");
  assert.equal(Bar.self(), Bar,
               "static methods have access to the constructor");
  assert.ok(!(new Baz instanceof Baz),
            "constructor may return non instance");
  assert.deepEqual(new Baz, { x: 1, y: 2 },
                   "correct value retuned by custom consructor");
  assert.ok(Baz.self, "inherited statics are inherited");
  assert.equal(Baz.self(), Baz,
               "inherited inherited properties have access to the constructor");
};

exports["test overridden properties"] = function(assert) {
  var Extendable = require("../extendables.js").Extendable;
  var Foo = Extendable.extend({
    name: "foo"
  });
  var Bar = Foo.extend({
    name: "bar",
    greet: function greet() {
      return "hello " + this.name
    },
    superGreet: function superGreet() {
      return "hello " + Foo.prototype.name;
    },
  });
  var foo = new Foo;
  var bar = new Bar;

  assert.ok(bar instanceof Bar, "instance of class");
  assert.ok(bar instanceof Foo, "instanceof Super class");
  assert.ok(bar instanceof Extendable, "instanceof Extendable");
  assert.ok(bar instanceof Object, "instanceof Object");
  assert.notEqual(bar.name, foo.name, "name is overridden");
  assert.equal(bar.greet(), "hello bar", "method behaves as expected");
  assert.equal(bar.greet.call({ name: "world" }), "hello world",
               "method can be passed `this` via call");
  assert.equal(bar.superGreet(), "hello foo",
               "properties of super class are accessible");

};

exports["test argumentless"] = function(assert) {
  var Extendable = require("../extendables.js").Extendable;
  var Base = Extendable.extend();
  var bas = new Base;

  assert.notEqual(Base, Extendable, "new constructor is created");
  assert.equal(Base.extend, Extendable.extend, "statics are inherited");
};

if (module == require.main)
  require("test").run(exports);

});
