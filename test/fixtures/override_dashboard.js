module.exports = {
  id: null,
  title: 'custom title',
  originalTitle: 'Generated Dashboard',
  tags: ['foo', 'bar'],
  style: 'dark',
  timezone: 'browser',
  editable: true,
  hideControls: false,
  sharedCrosshair: false,
  refresh: false,
  version: 6,
  hideAllLegends: false,
  meta: { slug: 'custom-slug' },
  rows: [],
  templating: {
    enable: true,
    list: [{
        allFormat: 'glob',
        current: {
          text: 'b',
          value: 'b'
        },
        datasource: null,
        includeAll: false,
        name: 'myvar',
        options: [{
            text: 'a',
            value: 'a'
        }, {
            text: 'b',
            value: 'b'
        }],
        query: 'a,b',
        refresh_on_load: false,
        type: 'custom'
    }, {
        allFormat: 'glob',
        current: {
            text: '1min',
            value: '1min'
        },
        datasource: null,
        includeAll: false,
        name: 'smoothing',
        options: [{
            text: '30min',
            value: '30min'
        }, {
            text: '10min',
            value: '10min'
        }, {
            text: '5min',
            value: '5min'
        }, {
            text: '2min', value: '2min'
        }, {
            text: '1min',
            value: '1min'
        }],
        query: '30min,10min,5min,2min,1min',
        refresh_on_load: false,
        type: 'custom'
    }]
  },
  annotations: {
    enable: true,
    list: [{
        name: 'Deploy Completed',
        datasource: 'graphite',
        showLine: true,
        iconColor: 'rgb(255, 234, 0)',
        lineColor: 'rgba(165, 161, 70, 0.59)',
        iconSize: 10,
        enable: true,
        target: 'path.to.metric.with.annotation'
    }]
  },
  refresh: '1m'
};
