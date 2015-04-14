'use strict';

// Used to provide unique if for
// generated graphs

var graphId = 0;
function generateGraphId() {
	graphId = graphId + 1;
	return graphId;
}

module.exports = generateGraphId;
