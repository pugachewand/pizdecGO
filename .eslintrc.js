
module.exports = {
	'root': true,
	'extends': [
		'@react-native-community',
		'plugin:sonarjs/recommended',
		'plugin:prettier/recommended',
		'plugin:react/recommended',
		'plugin:promise/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'project': './tsconfig.json',
		'ecmaFeatures': {
			'jsx': true,
		}
	},
	'ignorePatterns': ['.eslintrc.js'],
	'plugins': [
		'react',
		'promise',
		'optimize-regex',
		'@typescript-eslint',
		'prefer-arrow',
		'import',
		'sonarjs',
	],
	'rules': {
		'prettier/prettier': 'off',
		//#region common rules
		"no-use-before-define": "off",
		"@typescript-eslint/no-use-before-define": ["error"],
		'arrow-body-style': ['error', 'as-needed'],
		'arrow-parens': ['error', 'as-needed'],
		'arrow-spacing': 'error',
		'comma-dangle': ['error', 'always-multiline'],
		'comma-style': 'error',
		'curly': ['error', 'all'],
		'eqeqeq': 'error',
		'func-style': ['error', 'expression'],
		'generator-star-spacing': ['error', { 'before': false, 'after': true }],
		'jsx-quotes': ['error', 'prefer-single'],
		'key-spacing': 'error',
		'keyword-spacing': 'error',
		'new-parens': 'error',
		'no-alert': 'warn',
		'no-bitwise': 'warn',
		'no-console': 'warn',
		'no-duplicate-imports': ['error', { 'includeExports': true }],
		'no-else-return': ['error', { 'allowElseIf': false }],
		'no-empty': 'error',
		'no-implicit-coercion': 'error',
		'no-labels': 'error',
		'no-lone-blocks': 'error',
		'no-lonely-if': 'warn',
		'no-multiple-empty-lines': 'error',
		'no-nested-ternary': 'off',
		'no-new': 'error',
		'no-new-func': 'error',
		'no-new-object': 'error',
		'no-new-wrappers': 'error',
		'no-unneeded-ternary': 'error',
		'@typescript-eslint/no-var-requires': 0,
		"no-restricted-syntax": [
			"error",
			{
				"selector": "TSEnumDeclaration",
				"message": "Don't declare enums. Use array as const instead"
			}
		],
		'no-return-assign': 'off',
		'no-return-await': 'error',
		'no-self-compare': 'error',
		'no-sequences': 'error',
		'no-shadow': 'error',
		'no-tabs': ['error', { 'allowIndentationTabs': true }],
		'no-template-curly-in-string': 'error',
		'no-throw-literal': 'error',
		'no-trailing-spaces': 'error',
		// 'no-use-before-define': ['error', { 'classes': false }],
		'no-useless-call': 'error',
		'no-useless-computed-key': 'error',
		'no-useless-concat': 'error',
		'no-useless-rename': 'error',
		'no-useless-return': 'error',
		'no-whitespace-before-property': 'error',
		'no-var': 'error',
		'object-curly-spacing': ['error', 'always'],
		'object-shorthand': ['error', 'always'],
		'prefer-arrow-callback': 'warn',
		'radix': ['error', 'as-needed'],
		'require-await': 'error',
		'prefer-destructuring': 'error',
		'prefer-promise-reject-errors': 'error',
		'quotes': ['error', 'single'],
		'quote-props': ["error", 'consistent-as-needed'],
		'rest-spread-spacing': ['error', 'never'],
		'semi': 'off',
		'semi-spacing': 'error',
		'sort-imports': 'error',
		'space-before-blocks': 'error',
		'space-before-function-paren': [
			'error',
			{
				'anonymous': 'always',
				'named': 'never',
				'asyncArrow': 'always',
			},
		],
		'space-in-parens': 'error',
		'space-infix-ops': 'error',
		'space-unary-ops': 'error',
		'spaced-comment': ['error', 'always'],
		'switch-colon-spacing': 'error',
		'template-curly-spacing': 'error',

		//#endregion

		//#region typescript plugin rules

		'@typescript-eslint/array-type': ['error', { 'default': 'array' }],

		'@typescript-eslint/brace-style': ['error', 'stroustrup'], // Enforce consistent brace style for blocks

		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': [
			'error',
			{ 'accessibility': 'no-public' },
		],

		'@typescript-eslint/func-call-spacing': ['error', 'never'], // Require or disallow spacing between function identifiers and their invocations

		'@typescript-eslint/indent': [
			'error',
			'tab',
			{ 'SwitchCase': 1, 'MemberExpression': 'off', 'flatTernaryExpressions': true },
		], // Enforce consistent indentation

		'@typescript-eslint/member-delimiter-style': [
			'error',
			{ 'multiline': { 'delimiter': 'none' } },
		], // Require a specific member delimiter style for interfaces and type literals,
		'@typescript-eslint/member-ordering': ['error', {
			'classes': ['static-field', 'static-method', 'abstract-field', 'abstract-method', 'instance-field', 'constructor', 'instance-method'],
			'interfaces': ['signature', 'constructor', 'field', 'method']
		}],

		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-extra-parens': ['error'], // Disallow unnecessary parentheses
		'@typescript-eslint/no-magic-numbers': [
			'error',
			{
				// 'ignoreNumericLiteralTypes': true,
				'ignoreEnums': true,
				'enforceConst': true,
				'ignoreReadonlyClassProperties': true,
				'detectObjects': true,
				'ignore': [0, 1, -1],
			},
		],
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-unnecessary-type-arguments': 'warn', // Warns if an explicitly specified type argument is the default for that type parameter
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_$' },
		],
		'@typescript-eslint/no-useless-constructor': 'error', // Disallow unnecessary constructors

		'@typescript-eslint/prefer-for-of': 'warn', // Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated
		'@typescript-eslint/prefer-function-type': 'warn', // Use function types instead of interfaces with call signatures
		'@typescript-eslint/prefer-readonly': 'warn', // Requires that private members are marked as readonly if they're never modified outside of the constructor

		'@typescript-eslint/quotes': ['error', 'single', { 'avoidEscape': true }], // Enforce the consistent use of either backticks, double, or single quotes

		'@typescript-eslint/semi': ['error', 'never'], // Require or disallow semicolons instead of ASI
		//#endregion

		//#region react plugin rules

		'react/no-set-state': 'error',
		'react/no-danger': 'error',
		'react/no-deprecated': 'error',
		'react/no-this-in-sfc': 'error',
		'react/no-unstable-nested-components': [
			"off" | "warn" | "error",
			{
			  "allowAsProps": true,
			  "customValidators": [] /* optional array of validators used for propTypes validation */
			}
			],
		'react/jsx-filename-extension': ['error', { 'extensions': ['.tsx'] }],
		'react/jsx-no-useless-fragment': 'error',
		'react/jsx-pascal-case': 'error',
		'react/jsx-key': 'error',
		'react/display-name': 'off',
		'react/prop-types': 'off',

		//#endregion

		//#region other plugins

		'import/no-default-export': 'error',
		'import/no-anonymous-default-export': 'error',
		'optimize-regex/optimize-regex': 'warn',
		'prefer-arrow/prefer-arrow-functions': 'error',
		'promise/catch-or-return': 'error',
		'promise/prefer-await-to-then': 'error',

		//#endregion
	},
	'settings': {
	  'import/resolver': {
		'babel-module': {}
	  }
	}
}
