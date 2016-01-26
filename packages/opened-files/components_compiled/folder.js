var __vue_template__ = "<li class=\"directory list-nested-item\" v-on=\"mouseenter: hover, mouseleave: unhover,mouseover: highlight, mouseout: unhighlight\" v-class=\"\n      selected: isSelected,\n      collapsed: isCollapsed,\n      expanded: !isCollapsed,\n      of-highlight:isHighlight &amp;&amp; shouldHighlight\n    \">\n    <div class=\"header list-item folder\" v-on=\"click: onClick\">\n      <span class=\"name\" data-name=\"{{entry.name}}\" data-path=\"{{entry.path}}\">{{entry.name}}</span>\n\n      <span v-class=\"hidden: !isHovered\" class=\"icon icon-x\" v-on=\"click: close\">\n      </span>\n    </div>\n    <ol class=\"entries list-tree\" v-on=\"mouseover: unhighlight\">\n      <folder v-repeat=\"entry: entry.folders\" track-by=\"path\">\n      </folder>\n      <file v-repeat=\"entry: entry.files\" track-by=\"path\">\n      </file>\n    </ol>\n  </li>";
var treeManager;

treeManager = null;

module.exports = {
  replace: true,
  data: function() {
    return {
      isSelected: false,
      isCollapsed: false,
      isHovered: false,
      shouldHighlight: atom.config.get("opened-files.highlightOnHover"),
      isHighlight: false,
      color: false
    };
  },
  methods: {
    hover: function(e) {
      return this.isHovered = true;
    },
    unhover: function(e) {
      e.stopPropagation();
      return this.isHovered = false;
    },
    highlight: function(e) {
      return this.isHighlight = true;
    },
    unhighlight: function(e) {
      e.stopPropagation();
      return this.isHighlight = false;
    },
    close: function(e) {
      this.$root.logFolder("closing", 2);
      e.stopPropagation();
      return this.$broadcast("close");
    },
    onClick: function(e) {
      this.$root.logFolder("selecting", 2);
      this.$root.selected(this.entry.path);
      this.toggleFolder();
      return e.stopPropagation();
    },
    toggleFolder: function() {
      this.isCollapsed = !this.isCollapsed;
      return setTimeout(this.$root.resize, 1);
    },
    isEmpty: function() {
      if (typeof this === "undefined" || this === null) {
        return true;
      }
      return this.entry.files.length === 0 && this.entry.folders.length === 0;
    }
  },
  created: function() {
    this.$root.logFolder("created", 2);
    this.$on("selected", (function(_this) {
      return function(path) {
        _this.isSelected = path === _this.entry.path;
        return true;
      };
    })(this));
    this.$on("removeFile", (function(_this) {
      return function(entry) {
        var ref;
        _this.$root.logFolder("removing " + entry.path);
        try {
          _this.entry.files.$remove(entry);
        } catch (_error) {}
        setTimeout((ref = _this.$root) != null ? ref.resize : void 0, 1);
        if (_this.isEmpty()) {
          if (_this != null) {
            _this.$dispatch("removeFolder", _this.entry);
          }
        }
        return false;
      };
    })(this));
    return this.$on("removeFolder", (function(_this) {
      return function(entry) {
        var ref;
        try {
          _this.entry.folders.$remove(entry);
        } catch (_error) {}
        setTimeout((ref = _this.$root) != null ? ref.resize : void 0, 1);
        if (_this.isEmpty()) {
          if (_this != null) {
            _this.$dispatch("removeFolder", _this.entry);
          }
        }
        return false;
      };
    })(this));
  },
  destroyed: function() {
    var ref;
    return (ref = this.$root) != null ? ref.resize() : void 0;
  }
};

;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;
