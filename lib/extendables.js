/* vim:set ts=2 sw=2 sts=2 et: */
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is extendables library.
 *
 * The Initial Developer of the Original Code is the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Irakli Gozalishvili <rfobic@gmail.com> (Original Author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

(typeof define !== "function" ? function($){ $(require, exports, module); } : define)(function(require, exports, module, undefined) {

"use strict";

function getOwnPropertyDescriptors(object) {
  var descriptors = {};
  Object.getOwnPropertyNames(object).forEach(function(name) {
    descriptors[name] = Object.getOwnPropertyDescriptor(object, name);
  });
  return descriptors;
}

function Constructor(base) {
  return function Extendable() {
    var value, extendable = this;
    if (!(extendable instanceof Extendable))
        extendable = Object.create(Extendable.prototype);

    value = base.apply(extendable, arguments);
    return value === undefined ? extendable : value;
  }
}
function Extendable() {
  return this instanceof Extendable ? this : Object.create(Extendable.prototype);
}

Object.defineProperties(Extendable, {
  extend: {
    value: function extend(source) {
      var constructor, descriptors = getOwnPropertyDescriptors(source);
      // If `constructor` is not defined by `source` then we generate a default
      // `constructor` that delegates to the `constructor` of the base class.
      if (typeof descriptors.constructor !== "object")
        descriptors.constructor = { value: new Constructor(this) };
      // Overriding `prototype` of the `constructor` and adding static `extend`
      // method to it.
      var constructor = Object.defineProperties(descriptors.constructor.value, {
        extend: { value: extend, enumerable: true }
      });
      // TODO: Include `prototype` to the object passed to `defineProperties`
      // instead. Need to wait for bug fix in V8's behavior.
      constructor.prototype = Object.create(this.prototype, descriptors);
      return constructor;
    },
    enumerable: true
  }
});

exports.Extendable = Extendable;
});
