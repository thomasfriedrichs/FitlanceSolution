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
  ]
}

module.exports = config;