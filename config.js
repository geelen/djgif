System.config({
  "paths": {
    "*": "*.js",
    "djgif/*": "lib/*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "fkit": "npm:fkit@0.16.2",
    "jsonp": "npm:jsonp@0.0.4",
    "x-gif": "github:geelen/x-gif@0.1.1",
    "github:jspm/nodelibs@0.0.8": {
      "Base64": "npm:Base64@0.2.1",
      "base64-js": "npm:base64-js@0.0.7",
      "ieee754": "npm:ieee754@1.1.4",
      "inherits": "npm:inherits@2.0.1",
      "json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:debug@2.1.1": {
      "ms": "npm:ms@0.6.2"
    },
    "npm:jsonp@0.0.4": {
      "debug": "npm:debug@2.1.1"
    }
  }
});

