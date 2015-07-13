module.exports = {
    name: 'custom',
    type: 'custom',
    options: [{
        text: 'a',
        value: 'a'
    }, {
        text: 'b',
        value: 'b'
    }],
    datasource: null,
    refresh_on_load: false,
    includeAll: false,
    allFormat: 'glob',
    query: 'a,b',
    current: {
        text: 'b',
        value: 'b'
    }
}
