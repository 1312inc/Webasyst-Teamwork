var TasksReleasesPluginTasksScopeStats = ( function($) {
    var Graph = ( function($) {

        Graph = function(options) {
            var that = this;

            // DOM
            that.$container = options["$container"];
            that.$wrapper = options["$wrapper"];
            that.$hint = that.$wrapper.find(".t-hint-wrapper");
            that.node = that.$wrapper.find(".t-graph")[0];
            that.d3node = d3.select(that.node);
            //
            that.show_class = "is-shown";

            // DATA
            that.charts = options.data;
            that.data = getData(that.charts);
            that.group_by = 'days';
            that.due_date = options["due_date"];
            that.due_date_txt = options["due_date_txt"];
            that.locales = options["locales"];

            // VARS
            that.margin = {
                top: 14,
                right: 10,
                bottom: 28,
                left: 34
            };
            that.area = getArea(that.node, that.margin);
            that.column_indent = 5;
            that.column_width = getColumnWidth(that.area.inner_width, that.column_indent, that.data[0].length);

            // DYNAMIC VARS
            that.svg = false;
            that.defs = false;
            that.x = false;
            that.y = false;
            that.xDomain = false;
            that.yDomain = false;

            // INIT
            that.initGraph();
        };

        Graph.prototype.initGraph = function() {
            var that = this,
                graphArea = that.area;

            that.initGraphCore();

            that.svg = that.d3node
                .append("svg")
                .attr("width", graphArea.outer_width)
                .attr("height", graphArea.outer_height+10);

            //
            that.renderBackground();
            // Render Graphs
            that.renderCharts();
            //
            that.renderAxis();
        };

        Graph.prototype.initGraphCore = function() {
            var that = this,
                data = that.data,
                graphArea = that.area;

            var x = that.x = d3.time.scale().range([0, graphArea.inner_width]);
            var y = that.y = d3.scale.linear().range([graphArea.inner_height, 0]);


            that.yDomain = getValueDomain();
            that.xDomain = getTimeDomain();

            x.domain(that.xDomain);
            y.domain(that.yDomain);

            function getValueDomain() {
                var min = d3.min(data, function(chart) {
                    return d3.min(chart, function(point) {
                        return point.value;
                    });
                });
                if (min > 0) {
                    min = 0;
                }
                var max = d3.max(data, function(chart) {
                    return d3.max(chart, function(point) {
                        return (point.value + point.y0);
                    });
                });

                return [min, max];
            }

            function getTimeDomain() {
                var min, max,
                    points_length = data[0].length,
                    first_point = data[0][0].date,
                    second_point = data[0][1].date,
                    last_point = data[0][points_length-1].date,
                    half_time_period = parseInt( ( second_point.getTime() - first_point.getTime() )/2 );

                min = new Date( first_point.getTime() - half_time_period );
                max = new Date( last_point.getTime() + half_time_period );

                return [min, max];
            }
        };

        Graph.prototype.renderAxis = function() {
            var that = this,
                x = that.x,
                y = that.y,
                svg = that.svg;

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(10);

            var yAxis = d3.svg.axis()
                .scale(y)
                .innerTickSize(2)
                .orient("right")
                .tickValues( getValueTicks(that.yDomain) )
                .tickFormat(function(d) { return d + ""; });

            // Render Осей
            var axis = svg.append("g")
                .attr("class","axis");

            axis.append("g")
                .attr("transform","translate(" + 10 + "," + that.margin.top + ")")
                .attr("class","y")
                .call(yAxis);

            axis.append("g")
                .attr("class","x")
                .attr("transform","translate(" + that.margin.left + "," + (that.area.outer_height - that.margin.bottom ) + ")")
                .call(xAxis);
        };

        Graph.prototype.renderBackground = function() {
            var that= this,
                width = that.area.inner_width,
                height = that.area.inner_height,
                xTicks = 31,
                yTicks = 5,
                i;

            var background = that.svg.append("g")
                .attr("class", "background")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

            background.append("rect")
                .attr("width", width)
                .attr("height", height);

            for (i = 0; i <= yTicks; i++) {
                var yVal = 1 + (height - 2) / yTicks * i;
                background.append("line")
                    .attr("x1", 1)
                    .attr("x2", width)
                    .attr("y1", yVal)
                    .attr("y2", yVal)
                ;
            }
        };

        Graph.prototype.renderCharts = function() {
            var that = this,
                svg = that.svg,
                data = that.data;

            var wrapper = svg.selectAll(".t-graph-wrapper")
                .data(data);

            wrapper
                .enter()
                .append("g")
                .attr("class", "t-graph-wrapper")
                .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");

            // Add End Date Line
            var deadline = new Date(that.due_date);

            wrapper
                .append("line")
                .attr("class", "line")
                .attr("x1", that.x(deadline))
                .attr("x2", that.x(deadline))
                .attr("y1", 0)
                .attr("y2", that.area.outer_height-41)
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "3")
                .attr("stroke", "red");

            // Add End Date Text
            wrapper
                .append("text")
                .attr("x", that.x(deadline)-65)
                .attr("y", that.area.outer_height-10)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .style("font-size", "12px")
                .style("fill", "#999")
                .text(that.due_date_txt);

            // Add Start Date Text
            var options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            wrapper
                .append("text")
                .attr("x", 0)
                .attr("y", that.area.outer_height-10)
                .attr("dy", ".35em")
                .style("font-size", "12px")
                .style("fill", "#999")
                .style("text-anchor", "start")
                .text(that.data[0][0].date.toLocaleDateString('ru-RU', options));

            var rect = wrapper.selectAll(".rect")
                .data( function(chart) {
                    return chart;
                });

            rect
                .enter()
                .append("rect")
                .attr("class", "rect")
                .attr("fill", function(data,point_index,chart_index) {
                    var color = that.charts[chart_index].color;
                    return color ? '#'+color : false;
                })
                .on("mouseover", onOver)
                .on("mousemove", onMove)
                .on("mouseout", onOut);

            rect
                .transition()
                .duration(1000)
                .attr("x", function(d, i) {
                    return that.x( d.date ) - that.column_width/2;
                })
                .attr("y", function(d) {
                    return ( that.y(d.y0) + that.y(d.value) ) - that.area.inner_height;
                })
                .attr("height", function(d) {
                    return that.area.inner_height - that.y(d.value);
                })
                .attr("width", that.column_width);

            rect.exit().remove();
            wrapper.exit().remove();

            function onOver(d,i,j) {
                that.showHint(d3.event, this, d, that.charts[j]);
            }

            function onMove() {
                that.moveHint(this);
            }

            function onOut() {
                that.hideHint();
            }
        };

        Graph.prototype.showHint = function(event, node, point, chart) {
            var that = this,
                $point = $(node),
                point_height = Math.ceil( $point.attr("height") ),
                has_height = ( point_height > 0 );

            if (!has_height) {
                return false;
            }

            var date = point.date,
                $date = that.$hint.find(".t-date"),
                $type = that.$hint.find(".t-type"),
                $count = that.$hint.find(".t-value");

            var hint_text = getHintText(date, that.group_by);

            $date.text(hint_text );
            $type.text(chart.name ? chart.name : 'without type');
            $count.text(point.value);

            var css = getHintPosition($point);

            that.$hint
                .css(css)
                .addClass(that.show_class);

            function getHintPosition($point) {
                var window_w = that.$wrapper.width(),
                    hint_w = that.$hint.outerWidth(),
                    hint_h = that.$hint.outerHeight(),
                    point_width = Math.ceil( $point.attr("width") ),
                    point_height = Math.ceil( $point.attr("height") ),
                    point_border_w = 2,
                    space = 10;

                var wrapperOffset = that.$wrapper.offset(),
                    pointOffset = $point.offset(),
                    hintOffset = {
                        left: pointOffset.left - wrapperOffset.left + point_width + space,
                        top: pointOffset.top - wrapperOffset.top + ( (point_height < hint_h) ? point_height - hint_h - point_border_w : point_border_w )
                    };

                if (window_w < hintOffset.left + hint_w + 10) {
                    hintOffset.left = hintOffset.left - (hint_w + space + 10);
                }

                return hintOffset;
            }

            function getHintText(date, group_by) {
                var month = parseInt( date.getMonth() ),
                    result;

                if (group_by == "months") {
                    var months = that.locales["months"];
                    if (months[month]) {
                        result = months[month];
                    } else {
                        months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
                        result = months[month];
                    }
                } else {
                    var day = date.getDate();
                    day = ( day < 10 ) ? "0" + day : day;

                    month += 1;
                    month = ( month < 10 ) ? "0" + month : month;

                    result = day + "." + month + "." + date.getFullYear();

                    try {
                        result = $.datepicker.formatDate(that.locales.dateFormat, date);
                    } catch(e) {
                        result = day + "." + month + "." + date.getFullYear();
                    }
                }

                return result;
            }
        };

        Graph.prototype.moveHint = function( ) {
            var that = this;
        };

        Graph.prototype.hideHint = function( ) {
            var that = this;

            that.$hint
                .removeAttr("style")
                .removeClass(that.show_class);
        };

        return Graph;

        // Получаем размеры для графика
        function getArea(node, margin) {
            var width = node.offsetWidth,
                height = node.offsetHeight;

            return {
                outer_width: width,
                outer_height: height,
                inner_width: width - margin.left - margin.right,
                inner_height: height - margin.top - margin.bottom
            };
        }

        function getData(charts) {
            var chartsData = [];

            for (var i = 0; i < charts.length; i++) {
                var chart = charts[i].data,
                    chartData = [];

                for (var j = 0; j < chart.length ; j++) {
                    var point = chart[j];

                    chartData.push({
                        date: formatDate( point.date ),
                        value: parseInt(point.count)
                    });
                }

                chartsData.push(chartData);
            }

            var stack = d3.layout.stack()
                .offset("zero")
                .values( function(d) { return d; })
                .x(function(d) { return d.date; })
                .y(function(d) { return d.value; });

            return stack(chartsData);

            function formatDate(date_string) {
                var dateArray = date_string.split("-"),
                    year = parseInt(dateArray[0]),
                    month = parseInt(dateArray[1]) - 1,
                    day = parseInt(dateArray[2]);

                return new Date(year, month, day);
            }
        }

        function getColumnWidth(width, indent, length) {
            var result = null;

            length = length + 1;

            if (width && length) {
                var indent_space = indent * ( length - 1 );
                result = (width - indent_space)/length;
                if (result < 0) {
                    result = 0;
                }
            }

            return result;
        }

        function getValueTicks(domain) {
            var min = domain[0],
                max = ( domain[1] || 1 ),
                delta = (max - min) + 1,
                period = 1,
                result = [];

            for (var i = 0; i <= max; i++) {
                var label = (delta > 10) ? Math.round( i * period ) : (parseInt(  i * period * 10 ) / 10 );
                result.push(label);
            }

            return result;
        }

    })(jQuery);


    TasksReleasesPluginTasksScopeStats = function(options) {
        var that = this;

        // DOM
        that.$container = options["$container"];
        that.$wrapper = options["$wrapper"];
        that.$graphWrapper = that.$wrapper.find("#t-graph-wrapper");
        that.graphData = options["graph"];
        that.dueDate = options["due_date"];
        that.dueDateTxt = options["due_date_txt"];

        // VARS
        that.group_by = 'days';
        that.locales = options["locales"];

        // DYNAMIC VARS
        that.graph = false;

        // INIT
        that.init();
    };

    TasksReleasesPluginTasksScopeStats.prototype.init = function () {
        var that = this;

        that.initGraph();


        // Hide graph if filter is selected
        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results==null){
                return null;
            }
            else{
                return decodeURI(results[1]) || 0;
            }
        }

        var is_setfilters = $.urlParam('hash');

        if (is_setfilters) {
            that.$container.hide();
        }

    };

    TasksReleasesPluginTasksScopeStats.prototype.initGraph = function() {
        var that = this;
        if (that.$graphWrapper.length && that.graphData && that.graphData.length) {
            that.graph = new Graph({
                $container: that.$container,
                $wrapper: that.$graphWrapper,
                data: prepareData(that.graphData),
                due_date: that.dueDate,
                due_date_txt: that.dueDateTxt,
                group_by: 'days',
                locales: that.locales
            });
        }

        function prepareData( data ) {
            var point_length = data[0].data.length;
            if (point_length === 1) {
                $.each(data, function(index) {
                    var point = data[index].data[0],
                        before_point = {
                            count: 0,
                            date: getLiftDate(point.date, false)
                        },
                        next_point = {
                            count: 0,
                            date: getLiftDate(point.date, true)
                        };

                    data[index].data = [before_point, point, next_point];
                });
            }

            return data;

            function getLiftDate(date_string, next) {
                var dateArray = date_string.split("-"),
                    year = parseInt(dateArray[0]),
                    month = parseInt(dateArray[1]) - 1,
                    day = parseInt(dateArray[2]);

                var one_day = 1000 * 60 * 60 * 24,
                    date = new Date( new Date(year, month, day).getTime() + (next ? one_day : -one_day) );

                var d_year = parseInt(date.getFullYear()),
                    d_month = parseInt(date.getMonth()) + 1,
                    d_day = parseInt(date.getDate());

                if (d_day < 10) {
                    d_day = "0" + d_day;
                }
                if (d_month < 10) {
                    d_month = "0" + d_month;
                }

                return [d_year, d_month, d_day].join("-");
            }
        }
    };

    return TasksReleasesPluginTasksScopeStats;

})(jQuery);