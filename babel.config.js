let brand = 'iziGo';
if(process.env.BRAND_PATH) {
	brand = process.env.BRAND_PATH
}
console.log('Brand is:', brand)
module.exports = function (api) {
	api.cache(false)

	return {
		plugins: [
			// TODO: При мерже убрать
			// ["@babel/plugin-transform-typescript"],
			[
				'@babel/plugin-proposal-decorators',
				{
					legacy: true,
					// "loose": true
				},
			],
			// ['@babel/plugin-transform-class-properties', { "loose": true }],
			// ["@babel/plugin-transform-private-methods", { "loose": true }],
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'@brand': `./src/Brands/${brand}/`,
					},
					extensions: [
						'.ios.js',
						'.android.js',
						'.js',
						'.jsx',
						'.json',
						'.tsx',
						'.ts',
						'.native.js',
					],
				},
			],
			[
				'react-native-reanimated/plugin',
				{
					globals: ['__scanCodes'],
				},
			],
		],
		presets: [
			'module:metro-react-native-babel-preset',
			[
				'@babel/preset-flow',
				{
					allowDeclareFields: true,
				},
			],
		],
	}
}
