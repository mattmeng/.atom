(function() {
  var Vue, camelize, decamelize, fs, getByName, getComponents, path, registry, simpleReload, vues;

  path = require("path");

  fs = require("fs");

  Vue = require("vue");

  simpleReload = require("simple-reload");

  decamelize = function(str) {
    return str.replace(/\B([A-Z]{1})/g, function(match, chr) {
      return "-" + (chr.toLowerCase());
    });
  };

  camelize = function(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
      if (chr) {
        return chr.toUpperCase();
      } else {
        return "";
      }
    });
  };

  registry = {};

  getByName = function(name, options) {
    var fullname;
    if (registry[name] != null) {
      return registry[name];
    }
    try {
      fullname = require.resolve("" + name);
    } catch (_error) {
      fullname = require.resolve(options.cwd + "/" + name);
    }
    if (options.reload) {
      return registry[name] = simpleReload(fullname, options.deep);
    } else {
      return registry[name] = require(fullname);
    }
  };

  getComponents = function(dependencyTree, options) {
    var children, component, componentName, components;
    components = {};
    for (componentName in dependencyTree) {
      children = dependencyTree[componentName];
      componentName = decamelize(componentName);
      component = getByName(componentName, options);
      components[componentName] = component;
      if (children != null) {
        component.components = getComponents(children, options);
      }
    }
    return components;
  };

  vues = {};

  module.exports = function(dependencyTree, options) {
    var dirname, ref, stat, vue, vueName;
    if (options == null) {
      options = {};
    }
    if (options.cwd == null) {
      options.cwd = "./";
    }
    if (options.cwd[0] === '.') {
      console.log(module.parent);
      dirname = module.parent.filename;
      stat = fs.statSync(dirname);
      if (stat.isFile()) {
        dirname = path.dirname(dirname);
      }
      options.cwd = path.resolve(dirname, options.cwd);
    }
    if (options.reload == null) {
      options.reload = false;
    }
    if (options.deep == null) {
      options.deep = false;
    }
    if (options.debug == null) {
      options.debug = false;
    }
    Vue.config.debug = options.debug;
    if (options.reload) {
      vues = {};
      registry = {};
    }
    ref = getComponents(dependencyTree, options);
    for (vueName in ref) {
      vue = ref[vueName];
      if (vues[vueName] == null) {
        vues[vueName] = new Vue(vue);
      }
    }
    return vues;
  };

}).call(this);
