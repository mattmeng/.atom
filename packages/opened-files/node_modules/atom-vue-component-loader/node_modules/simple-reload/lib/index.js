(function() {
  var fs, path, recursiveDelete;

  path = require("path");

  fs = require("fs");

  if (require.cache[module.id]) {
    delete require.cache[module.id];
  }

  recursiveDelete = function(children) {
    var child, i, len;
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      if (require.cache[child.id]) {
        children = require.cache[child.id].children;
        delete require.cache[child.id];
        if (children != null) {
          recursiveDelete(children);
        }
      }
    }
    return null;
  };

  module.exports = function(name, deep) {
    var dirname, fullname, stat;
    if (deep == null) {
      deep = false;
    }
    if (name[0] === '.') {
      dirname = module.parent.filename;
      stat = fs.statSync(dirname);
      if (stat.isFile()) {
        dirname = path.dirname(dirname);
      }
      name = path.resolve(dirname, name);
    }
    fullname = require.resolve(name);
    if (require.cache[fullname]) {
      if (deep) {
        recursiveDelete(require.cache[fullname].children);
      }
      delete require.cache[fullname];
    }
    return require(fullname);
  };

}).call(this);
