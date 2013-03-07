function Node() {
  this.eventListeners = {};
  this.classes = {};
}

Node.prototype.html = function() {
  return this;
};

Node.prototype.replaceWith = function() {
  return this;
};

Node.prototype.text = function() {
  return this;
};

Node.prototype.on = function(name, listener) {
  this.eventListeners[name] = listener;
  return this;
};

Node.prototype.addClass = function(className) {
  this.classes[className] = true;
  return this;
};

Node.prototype.removeClass = function(className) {
  delete this.classes[className];
  return this;
};

Node.prototype.hasClass = function(className) {
  return this.classes.hasOwnProperty(className);
};

Node.prototype.modal = function() {
  return this;
};

function create() {
  var selectors = {};
  var $ = function(selector) {
    return selectors[selector];
  };
  $.addSelector = function(selector, result) {
    selectors[selector] = result;
  };
  return $;
}

module.exports.Node = Node;
module.exports.create = create;
