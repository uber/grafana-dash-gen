# Grafana Dash Gen

A collection of utility classes to construct and publish grafana graphs. The library is built ground up to incorporate grafana terminologies. 

- **Dashboard**: Represents the final dashboard that is displayed.
- **Row**: A row in grafana. Dashboard consists or many rows.
- **Pannel**: A visual display item. A pannel could be a graph, single stat or others. A row consists of many panels.
- **Target**: A dot separated graphite string. E.g, a.b.count. A Panel consissts of many targets.
- **Annotations**: Lined markers that will annotate a graph (panel). A Dashboard can have annotations added to it. 
- **Templates**: Variables that can be included in the state. E.g, a.$dc.b.count (to switch between datacenters). A Dashboard can have templates added to it. 

![Alt text](/grafana.png?raw=true "Optional Title")

## Code to generate the dashboard

You will be able to generate and publish a grafana graph using the following steps. 

#### Step 1: Configure grafana 
if you would like grafana to publish your dashboard you need this step. If you do not need grafana to publish your dashboard, you can skip this step. 
```
var grafana = require('grafana-dash-gen');
var Row = grafana.Row;
var Dashboard = grafana.Dashboard;
var Panels = grafana.Panels;
var Target = grafana.Target;
var Templates = grafana.Templates;

grafana.config({
	url: 'https://your.grafana.com/elasticsearch/grafana-dash/dashboard/',
	cookie: 'auth-openid=someidhere'
});
```
#### Step 2: Create a dashboard
```
var dashboard = new Dashboard({
	title: 'Api dashboard'
});
```
(or) Below is an example of a dashboard with a custom slug, templates `dc` and `smoothing` and annotations.
```
 var dashboard = new Dashboard({
 	title: 'Api dashboard',
  slug: 'api',
 	templating: [{
 		name: 'dc',
 		options: ['dc1', 'dc2']
 	}, {
 		name: 'smoothing',
 		options: ['30min', '10min', '5min', '2min', '1min']
 	}],
 	annotations: [{
 		name: 'Deploy',
 		target: 'stats.$dc.production.deploy'
 	}]
 });
```

If you do not wish to have any templates and annotations

#### Step 3: Create a new row
As said abolve, grafana dashboard contains a number of rows. 
```
var row = new Row();
```

#### Step 4: Create graphs to add to the row
There are two ways to add the graph to a row. Pass it while a graph is created as below
```
var pannel = new Panels.Graph({
	title: 'api req/sec',
	span: 5, 
	targets: [
		new Target('api.statusCode.*').
					transformNull(0).sum().hitcount('1seconds').scale(0.1).alias('rps')
	],
	row: row,
	dashboard: dashboard
});
```

(or) add it in a separate step
```
var pannel = new Panels.Graph({
	title: 'api req/sec',
	span: 5,
	targets: [
		new Target('api.statusCode.*').
					transformNull(0).sum().hitcount('1seconds').scale(0.1).alias('rps')
	]
});
row.addPanel(pannel);
```

If you would like to create a full width single stat (as in the image) the code is below. Notice how we create a new row on the fly. 
```
var requestVolume = new Panels.SingleStat({
	title: 'Current Request Volume',
	postfix: 'req/sec',
	targets: [
		new Target('stats.$dc.counts').
				sum().scale(0.1)
	],
	row: new Row(),
	dashboard: dashboard
});
```
#### Step 5: Publish the graph
```
grafana.publish(dashboard);
```

to generate the json and not publish use

```
console.log(dashboard.generate());
```

**A complete example of a dashboard is provided in example.js**


-----

## Installation

`npm install grafana-dash-gen`

## Tests

`npm test`

## Contributors

 - Evan Culver
 - Madan Thangavelu

## MIT Licenced


