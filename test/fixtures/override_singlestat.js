module.exports = {
	cacheTimeout: null,
	colorBackground: false,
	colorValue: false,
	colors: ['rgba(71, 212, 59, 0.4)', 'rgba(245, 150, 40, 0.73)', 'rgba(225, 40, 40, 0.59)'],
	editable: true,
	error: false,
	format: 'none',
	id: 2,
	interval: null,
	links: [],
	maxDataPoints: 100,
	nullPointMode: 'connected',
	nullText: null,
	postfix: '',
	postfixFontSize: '50%',
	prefix: '',
	prefixFontSize: '50%',
	span: 4,
	sparkline: {
		fillColor: 'rgba(134, 178, 214, 0.41)',
		full: true,
		lineColor: 'rgb(31, 193, 58)',
		show: true
	},
	targets: [],
	thresholds: '',
	title: 'custom title',
	type: 'singlestat',
	valueFontSize: '80%',
	valueMaps: [{
		op: '=',
		text: 'N/A',
		value: 'null'
	}],
	valueName: 'current'
}
