function amchart (element, data, locale) {

    // TODO: make chart data dynamically

    if (window.logChart) {
        window.logChart.dispose();
    }

    am4core.addLicense('CH269543621');
    am4core.useTheme(am4themes_animated);

    const chartColors = {
        gray: am4core.color('#888888'),
    };

    const chart = am4core.create(element, am4charts.XYChart);

    if (locale !== 'en_US') {
        chart.language.locale = window[`am4lang_${locale}`];
    }

    const xAxis = chart.xAxes.push(new am4charts.DateAxis());
    xAxis.renderer.grid.template.location = 1;
    xAxis.renderer.grid.template.stroke = chartColors.gray;
    xAxis.renderer.line.strokeOpacity = 0.2;
    xAxis.renderer.line.strokeWidth = 1;
    xAxis.renderer.line.stroke = chartColors.gray;
    xAxis.renderer.labels.template.fill = chartColors.gray;
    xAxis.renderer.labels.template.location = 0.5;
    xAxis.renderer.cellStartLocation = 0.15;
    xAxis.renderer.cellEndLocation = 0.85;

    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.cursorTooltipEnabled = false;
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;

    chart.cursor = new am4charts.XYCursor();

    for (let d of data) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = d.label;
        series.dataFields.valueY = "y";
        series.dataFields.dateX = "time";
        series.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = true;

        series.tooltip.background.filters.clear();
        series.tooltip.background.strokeWidth = 0;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = d.color;

        series.yAxis = yAxis;
        series.xAxis = xAxis;

        series.stroke = d.color;
        series.columns.template.strokeWidth = 0;
        series.columns.template.fill = d.color;

        series.data = d.data.map(function (e) {
            return {
                time: e.time * 1000,
                y: e.y
            };
        });
    }

    window.logChart = chart;

}
