module.exports = function (api) {
  api.cache(true);

  return {
    "presets": [
      ["@babel/react", ],
      [ "@babel/env" ,{ "modules": false } ]
    ],
    "plugins": [
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-class-properties"
    ]
  }
}