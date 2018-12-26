module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base'],
  env: {
    browser: true
  },
  plugins: ['import'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.spec.js', '**/*conf*.js']
      }
    ]
  }
};
