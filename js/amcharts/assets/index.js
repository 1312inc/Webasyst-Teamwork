function amchart (element, data, locale) {

    var root = am5.Root.new(element);

    root.locale = 'am5locales_' + locale;

    root.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX"
    }));

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomX"
    }));
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "day",
            count: 1
        },
        startLocation: 0.5,
        endLocation: 0.5,
        renderer: am5xy.AxisRendererX.new(root, {
            strokeOpacity: 0.2,
            strokeWidth: 1
        }),
        tooltip: am5.Tooltip.new(root, {})
    }));
    var xRenderer = xAxis.get("renderer");
    xRenderer.grid.template.setAll({
        strokeOpacity: 0.05
    });

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.2,
            strokeWidth: 1
        })
    }));
    var yRenderer = yAxis.get("renderer");
    yRenderer.grid.template.setAll({
        strokeOpacity: 0.05
    });

    for (var d of data) {
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: d.label,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "y",
            valueXField: "time",
            fill: am5.color(d.color),
            tooltip: am5.Tooltip.new(root, {
                labelText: "{name}: {valueY}"
            })
        }));

        var data = d.data.map(function (e) {
            return {
                time: e.time * 1000,
                y: e.y
            };
        });
        series.data.setAll(data);
    }

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
    }));

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);

}
