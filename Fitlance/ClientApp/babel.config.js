const config = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3,
        "debug": false
      }
    ],
    "@babel/preset-react"
    ],
    "plugins": [
        "@babel/plugin-proposal-private-property-in-object"
    ]
}

module.exports = config;