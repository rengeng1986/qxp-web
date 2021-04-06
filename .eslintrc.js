module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:react/recommended', 'google', 'plugin:@typescript-eslint/recommended'],
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    window: true,
  },
  rules: {
    'no-nested-ternary': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'react/jsx-wrap-multilines': ['warn', {
      declaration: 'parens',
      assignment: 'parens',
      return: 'parens',
      arrow: 'parens',
      condition: 'parens',
      logical: 'parens',
      prop: 'parens',
    }],
    'react/display-name': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'no-invalid-this': 'off',
    'valid-jsdoc': 'off',
    'require-jsdoc': 'off',
    'object-curly-spacing': ['warn', 'always'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'error',
    radix: [1, 'as-needed'],
    'class-methods-use-this': 'off',
    'no-invalid-this': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': 'off',
    'react/no-danger': 'off',
    'no-plusplus': 'error',
    'no-mixed-operators': 'error',
    'func-names': 'off',
    'function-paren-newline': 'off',
    'newline-per-chained-call': 'off',
    '@typescript-eslint/camelcase': 'off',

    'max-len': [
      1,
      {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreTrailingComments: true,
        ignorePattern:
          // eslint-disable-next-line quotes
          "^(\\s*[a-zA-Z_]+: '[^']+'[,;]*)|(.*interpolate.*)|(.*require.*)|(.*_\\.template.*)|(<svg .*)|(<rect .*)|(<polygon .*)$",
      },
    ],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/prefer-stateless-function': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-find-dom-node': 'off',
    'react/jsx-no-bind': 'off',
    'react/sort-comp': [
      'warn',
      {
        order: ['static-methods', 'instance-variables', 'lifecycle', 'everything-else', 'render'],
        groups: {
          lifecycle: [
            'statics',
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'state',
            'getInitialState',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
        },
      },
    ],
    'prefer-promise-reject-errors': 'off',
  },
};
