interface GrafanaSharedProps {
    // allowing to add properties undeclared in the types below, as those are incomplete
    [k: string]: any;
}

export interface GrafanaQueryTemplate extends GrafanaSharedProps {
    type: string;
    query: string;
    name: string;
    datasource: string;
    options: any[];
    current: object;
    includeAll: boolean;
    allFormat: string;
    allValue: null | string;
    refresh: boolean;
    multi: boolean;
}

export interface GrafanaCustomTemplate extends GrafanaSharedProps {
    name: string;
    type: string;
    options: any[];
    datasource: null;
    refresh: number;
    refresh_on_load: boolean;
    includeAll: boolean;
    allValue: string;
    allFormat: string;
    query: null | string;
    current: object;
}

export interface GrafanaGraphiteAnnotation extends GrafanaSharedProps {
    name: string;
    datasource: string;
    showLine: boolean;
    iconColor: string;
    lineColor: string;
    iconSize: number;
    enable: boolean;
    target: string;
}

export interface GrafanaDashboardListPanel extends GrafanaSharedProps {
    title: string;
    error: boolean;
    span: number;
    editable: boolean;
    type: 'dashlist';
    isNew: boolean;
    id: number;
    mode: string;
    query: string;
    limit: number;
    tags: any[];
    links: any[];
}

export interface GrafanaCondition extends GrafanaSharedProps {
    type: string;
    query: { params: string[] };
    reducer: { type: string; params: any[] };
    evaluator: { type: string; params: any[] };
    operator: { type: string };
}

export interface GrafanaAlert extends GrafanaSharedProps {
    name: string;
    conditions: GrafanaCondition[];
    for: string;
    frequency: string;
    message: string;
    notifications: any[];
    executionErrorState: string;
    noDataState: string;
    alertRuleTags: object;
    handler: number;
}

export interface GrafanaGraphPanel extends GrafanaSharedProps {
    alert?: GrafanaAlert;
    aliasColors: any;
    bars: boolean;
    editable: boolean;
    error: boolean;
    fill: number;
    grid: {
        leftMax: null;
        leftMin: null;
        rightMax: null;
        rightMin: null;
        threshold1: null;
        threshold1Color: string;
        threshold2: null;
        threshold2Color: string;
    };
    id: number;
    legend: {
        avg: boolean;
        current: boolean;
        max: boolean;
        min: boolean;
        show: boolean;
        total: boolean;
        values: boolean;
    };
    lines: boolean;
    linewidth: number;
    links: any[];
    nullPointMode: string;
    percentage: boolean;
    pointradius: number;
    points: boolean;
    renderer: string;
    seriesOverrides: any[];
    span: number;
    stack: boolean;
    steppedLine: boolean;
    targets: any[];
    title: string;
    tooltip: { shared: boolean; value_type: string };
    type: 'graph';
    'x-axis': boolean;
    'y-axis': boolean;
    y_formats: string[];
    datasource: string;
}

export interface GrafanaSingleStatPanel extends GrafanaSharedProps {
    cacheTimeout: null;
    colorBackground: boolean;
    colorValue: boolean;
    colors: string[];
    editable: boolean;
    error: boolean;
    format: string;
    id: number;
    interval: null;
    links: any[];
    maxDataPoints: number;
    nullPointMode: string;
    nullText: null;
    postfix: string;
    postfixFontSize: string;
    prefix: string;
    prefixFontSize: string;
    span: number;
    sparkline: {
        fillColor: string;
        full: boolean;
        lineColor: string;
        show: boolean;
    };
    targets: any[];
    thresholds: string;
    title: string;
    type: 'singlestat';
    valueFontSize: string;
    valueMaps: { op: string; text: string; value: string }[];
    valueName: string;
    datasource: string;
}

export interface GrafanaTablePanel extends GrafanaSharedProps {
    title: string;
    error: boolean;
    span: number;
    editable: boolean;
    type: 'table';
    isNew: boolean;
    id: number;
    // todo: should this be required?
    datasource?: string;
    styles: (
        | { type: 'date'; pattern: string; dateFormat: string }
        | {
              unit: string;
              type: 'number';
              decimals: number;
              colors: string[];
              colorMode: null;
              pattern: string;
              thresholds: any[];
          }
    )[];
    targets: any[];
    transform: string;
    pageSize: null;
    showHeader: boolean;
    columns: { text: string; value: string }[];
    scroll: boolean;
    fontSize: string;
    sort: { col: number; desc: boolean };
    links: any[];
}

export interface GrafanaTextPanel extends GrafanaSharedProps {
    title: string;
    error: boolean;
    span: number;
    editable: boolean;
    type: 'text';
    id: number;
    mode: string;
    content: string;
    style: any;
    links: any[];
}

export interface GrafanaRow extends GrafanaSharedProps {
    title: string;
    showTitle: boolean;
    height: string;
    editable: boolean;
    collapse: boolean;
    panels: any[];
}

export interface GrafanaExternalLink extends GrafanaSharedProps {
    title: string;
    tooltip: string;
    url: string;
    tags: any[];
    icon: string;
    targetBlank: boolean;
    type: string;
    includeVars: boolean;
    keepTime: boolean;
}

export interface GrafanaDashboard extends GrafanaSharedProps {
    id: null;
    title: string;
    originalTitle: string;
    tags: any[];
    style: string;
    timezone: string;
    editable: boolean;
    hideControls: boolean;
    sharedCrosshair: boolean;
    refresh: boolean | string;
    schemaVersion: number;
    hideAllLegends: boolean;
    rows: GrafanaRow[];
    annotations: { list: any[]; enable: boolean };
    templating: { list: any[]; enable: boolean };
    time: null;
    links: GrafanaExternalLink[];
}

export {};
