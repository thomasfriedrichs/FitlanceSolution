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
        require('@babel/plugin-proposal-private-property-in-object').default,
        require('@babel/plugin-proposal-private-methods').default
    ]
}

module.exports = config;