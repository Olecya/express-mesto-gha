module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "airbnb-base",
    'plugin:react/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    "no-underscore-dangle": "off"
  }
}

/*eslint no-underscore-dangle: ["error", { "allowAfterThis": true }]*/