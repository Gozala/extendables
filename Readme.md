# extendables #

Simple and elegant inheritance in JS.

## Install ##

    npm install extendables

## Require ##

    var Extendable = require('https!raw.github.com/Gozala/extendables/v0.2.0/extendables.js').Extendable

## Usage ##

    var Extendable = require('https!raw.github.com/Gozala/extendables/v0.2.0/extendables.js').Extendable
    var Base = Extendable.extend({
      inherited: function inherited() {
        return "inherited property"
      },
      overridden: function overridden() {
        return "property to override"
      },
      // No supers by default, use prototype and be proud, but if you really want
      // super get one!
      _super: function _super() {
        return Object.getPrototypeOf(Object.getPrototypeOf(this))
      }
    })
    // Adding static method.
    Base.implement = function implement(source) {
      // Going through each argument to copy properties from each source.
      Array.prototype.forEach.call(arguments, function(source) {
        // Going through each own property of the source to copy it.
        Object.getOwnPropertyNames(source).forEach(function(key) {
          // If property is already owned then skip it.
          if (Object.prototype.hasOwnProperty.call(this.prototype, key)) return null
          // Otherwise define property.
          Object.defineProperty(this.prototype, key,
                                Object.getOwnPropertyDescriptor(source, key))
        }, this)
      }, this)
    }

    var b1 = new Base
    console.log(b1 instanceof Base)              // -> true
    console.log(b1 instanceof Extendable)        // -> true
    console.log(b1.inherited())                  // -> "inherited property"

    var b2 = Base()                             // -> Works same as without `new`
    console.log(b2 instanceof Base)             // -> true
    console.log(b2 instanceof Extendable)       // -> true
    console.log(b2.inherited())                 // -> "inherited property"


    var Decedent = Base.extend({
      constructor: function Decedent(options) {
        this.name = options.name;
      },
      overridden: function override() {
        // I'd rather copied `overridden` with a diff name overriddenBase for
        // example or used `Base.prototype.overridden.call(this)`
        // But this works as well :)
        return "No longer " + this._super().overridden.call(this)
      },
      // overriddenBase: Base.prototype.overridden
    })
    Decedent.implement({
      bye: function bye() {
        return "Buy my dear " + this.name
      }
    })

    var d1 = new Decedent({ name: "friend" })
    console.log(d1 instanceof Decedent)       // -> true
    console.log(d1 instanceof Base)           // -> true
    console.log(d1 instanceof Extendable)     // -> true
    console.log(d1.inherited())               // -> "inherited property"
    console.log(d1.overridden())              // -> No longer a property to override
    console.log(d1.bye())                     // -> "Bye my dear friend"

