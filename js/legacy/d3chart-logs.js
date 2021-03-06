window.showLogsChart = function(dataset, options) {
    if (!dataset || !dataset.length || !dataset[0].data || !dataset[0].data.length) {
        return;
    }

    options = options || {};
    var groups,rect_ornament,rect;

    var storage = {
        $wrapper: options.costs_wrapper || $(".logs-chart-wrapper"),
        $hint_wrapper: options.hint_wrapper || $(".hint-wrapper"),
        document_width: false,
        padding: {
            top: 8,
            bottom: 28,
            right: 8,
            left: 8
        },
        xTicks: 10,
        yTicks: 3,
        colorsArray: ["#a7e0a7","#009900","#ae4410"],
        hovered_point: false, // Container for points logic
        getColumnWidth: function() {
            return parseInt( (this.getInnerWidth() * 0.8)/data_count );
        },
        getStepWidth: function() {
            var that = this.getStepWidth,
                point_step;
            // Cache
            if (that.data) {
                point_step = that.data;
            } else {
                var $svg = this.$wrapper.find("svg"),
                    offset = $svg.offset().left,
                    point_offset,
                    point_steps = [],
                    points_sum = 0;

                $svg.find(".profit-points-wrapper .point").each( function(index) {
                    point_offset = $(this).offset().left;
                    point_step = ( point_offset  + storage.point_radius.default - offset - storage.padding.left ) / index;
                    if (point_step > 0) {
                        points_sum += point_step;
                        point_steps.push(point_step);
                    }
                });

                point_step = points_sum/point_steps.length;
                that.data = point_step;
            }
            return point_step;
        },
        getTickFormat: function() {
            var data_array = data[0].date,
                first = data_array[0],
                second = data_array[1],
                delta = Math.abs(second - first),
                hour = 60 * 60 * 1000,
                day = hour * 24,
                month = day * 30,
                year = month * 12,
                tick_format;

            if (delta >= year) {
                tick_format = "year";
            } else if (delta > day) {
                tick_format = "month";
            } else {
                tick_format = "day";
            }

            return tick_format;
        },
        getWidth: function() {
            var that = this.getWidth,
                width;

            if (that.data) {
                width = that.data;
            } else {
                width = this.$wrapper.width();
                that.data = width;
            }
            return width;
        },
        getHeight: function() {
            var width = this.getWidth();
            return (width > 989) ? "350" : (width * 9)/(16 * 1.7);
        },
        getInnerWidth: function() {
            return this.getWidth() - this.padding.left - this.padding.right;
        },
        getInnerHeight: function() {
            return this.getHeight() - this.padding.top - this.padding.bottom;
        }
    };

    //logs-chart-wrapper
    var data_count = dataset[0].data.length;

    //Set up stack method
    var stack = d3.layout.stack();

    //Data, stacked
    stack( d3.range(dataset.length).map( function(d) {
        var data = dataset[d].data;
        return d3.range(data.length).map( function(d) {
            return data[d];
        });
    }));

    var first_data = dataset[0].data,
        xMin = first_data[0].time,
        xMax = first_data[first_data.length-1].time,
        yMax = d3.max(dataset, function(d) {
            d = d.data;
            return d3.max(d, function(d) {
                return d.y0 + d.y;
            });
        });

        xMin -= (xMax - xMin)/(9 * 5);
        xMax += (xMax - xMin)/(9);
        yMax += yMax/9;

    //Set up scales
    var xScale = d3.time.scale()
        .domain([new Date(xMin*1000),new Date(xMax*1000)])
        .rangeRound([0, storage.getInnerWidth()]);

    var yScale = d3.scale.linear()
        .domain([0,yMax])
        .range([storage.getInnerHeight(),0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(storage.xTicks);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .innerTickSize(2)
        .orient("right")
        .ticks(storage.yTicks);

    if ( options.refresh ) {
        svg = d3.select(storage.$wrapper.find('svg')[0]);
    } else {
        //Create SVG element
        var svg = d3.select(storage.$wrapper[0])
            .append("svg")
            .attr("width", storage.getWidth())
            .attr("height", storage.getHeight());

        // Паттерны
        ( function() {

            var width = 15,
                stroke_width = 6,
                stroke_color = "rgba(0,0,0,0.5)",
                getD = function( width ) {
                    return "M-"+ width/4 +","+ width/4 +" l"+ width/2 +",-"+ width/2 +" M0,"+ width +" l"+ width +",-"+ width +" M"+ width*3/4 +","+ width*5/4 +" l"+ width/2 +",-"+ width/2;
                };

            var defs = svg.append("defs");

                defs.append('pattern')
                    .attr('id', 'diagonalHatch')
                    .attr('patternUnits', 'userSpaceOnUse')
                    .attr('width', width)
                    .attr('height', width)
                    .append('path')
                    .attr('d', getD(width))
                    .attr("stroke", stroke_color)
                    .attr("stroke-width", stroke_width);

        })();

        // Render фона
        ( function(storage, svg) {
            var width = storage.getInnerWidth(),
                height = storage.getInnerHeight(),
                xTicks = 31,
                yTicks = 5,
                i;

            var background = svg.append("g")
                .attr("class", "background")
                .attr("transform", "translate(" + storage.padding.left + "," + storage.padding.top + ")");

            background.append("rect")
                .attr("width", width)
                .attr("height", height);

            for ( i = 0; i <= yTicks; i++) {
                var yVal = 1 + (height - 2) / yTicks * i;
                background.append("line")
                    .attr("x1", 1)
                    .attr("x2", width)
                    .attr("y1", yVal)
                    .attr("y2", yVal)
                ;
            }

            //for ( i = 0; i <= xTicks; i++) {
            //    var xVal = 1 + (width - 2) / xTicks * i;
            //    background.append("line")
            //        .attr("x1", xVal)
            //        .attr("x2", xVal)
            //        .attr("y1", 1)
            //        .attr("y2", height)
            //    ;
            //}
        })(storage, svg);

        // Render Осей
        svg.append("g")
            .attr("class","x axis")
            .attr("transform","translate(" + storage.padding.left + "," + (storage.getHeight() - storage.padding.bottom) + ")");

        svg.append("g")
            .attr("class","y axis")
            .attr("transform","translate(" + storage.padding.left + "," + storage.padding.top + ")");

    }

    // Render Осей
    var $x = svg.select(".x.axis"),
        $y = svg.select(".y.axis");

    $x.call(xAxis);
    $y.call(yAxis);

    // RENDERING RECT
    //UPDATE GROUP
    groups = svg.selectAll(".rgroups")
        .data(dataset)
        .attr("class", function(d) {
            return "rgroups " + d.type;
        });

    // UPDATE RECT
    rect = groups.selectAll(".rect")
        .data( function(d) {
            return d.data;
        });

    rect
        .transition()
        .duration(1000)
        .attr("width", storage.getColumnWidth())
        .attr("class","rect")
        .attr("x", function(d) {
            return xScale( new Date( (+d.time)*1000 ) ) - storage.getColumnWidth()/2;
        })
        .attr("y", function(d) {
            return -(-yScale(d.y0) - yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom)*2);
        })
        .attr("height", function(d) {
            return -yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom);
        })
        .attr("fill", function(d) {
            return d.color;
        });

    // UPDATE ORNAMENT
    rect_ornament = groups.selectAll(".ornament")
        .data( function(d) {
            return d.data;
        });

    rect_ornament
        .transition()
        .duration(1000)
        .attr("width", storage.getColumnWidth())
        .attr("class","ornament")
        .attr("x", function(d) {
            return xScale( new Date( (+d.time)*1000 ) ) - storage.getColumnWidth()/2;
        })
        .attr("y", function(d) {
            return -(-yScale(d.y0) - yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom)*2);
        })
        .attr("height", function(d,i,j) {
            var type = rect[j].parentNode.__data__.type,
                height = (storage.getHeight() - storage.padding.top - storage.padding.bottom) -yScale(d.y);
            if (type !== "campaign") {
                height = 0;
            }
            return height;
        })
        .attr("fill", "url(#diagonalHatch)");

    // RENDER NEW
    groups.enter()
        .append("g")
        .attr("class", function(d) {
            return "rgroups " + d.type;
        })
        .attr("transform","translate("+ storage.padding.left + "," + (storage.getHeight() - storage.padding.bottom) +")");

    // NEW RECT
    rect = groups.selectAll(".rect")
        .data( function(d) {
            return d.data;
        });

    rect.enter()
        .append("rect")
            .attr("width", storage.getColumnWidth())
            .attr("class","rect")
            .attr("style", function(d) {
                var x = parseInt( xScale( new Date( (+d.time)*1000 ) ) - storage.getColumnWidth()/2 );
                if ( x < 0 ) {
                    return "display: none;"
                }
            })
            .attr("x", function(d) {
                return xScale( new Date( (+d.time)*1000 ) ) - storage.getColumnWidth()/2;
            })
            .attr("y", function(d) {
                return -(-yScale(d.y0) - yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom)*2);
            })
            .attr("height", function(d) {
                return -yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom);
            })
            .attr("fill", function(d) {
                return d.color;
            })
            .on("mouseover", function(data, i, j) {
                onHover(data, i, j,  d3.select(this), d3.event);
            })
            .on("mousemove", function() {
                onMove(d3.event);
            })
            .on("mouseout", function(data) {
                onHoverOut(data, d3.select(this));
            });

    // NEW ORNAMENT
    rect_ornament = groups.selectAll(".ornament")
        .data( function(d) {
            return d.data;
        });

    rect_ornament
        .enter()
        .append("rect")
        .attr("width", storage.getColumnWidth())
        .attr("class","ornament")
        .attr("x", function(d) {
            return xScale( new Date( (+d.time)*1000 ) ) - storage.getColumnWidth()/2;
        })
        .attr("y", function(d) {
            return -(-yScale(d.y0) - yScale(d.y) + (storage.getHeight() - storage.padding.top - storage.padding.bottom)*2);
        })
        .attr("height", function(d,i,j) {
            var type = rect[j].parentNode.__data__.type,
                height = (storage.getHeight() - storage.padding.top - storage.padding.bottom) -yScale(d.y);
            if (type !== "campaign") {
                height = 0;
            }
            return height;
        })
        .attr("fill", "url(#diagonalHatch)")
        .on("mouseover", function(data, i, j) {
            onHover(data, i, j,  d3.select(this), d3.event);
        })
        .on("mousemove", function() {
            onMove(d3.event);
        })
        .on("mouseout", function(data) {
            onHoverOut(data, d3.select(this));
        });

    var onHover = function( data, i, j, $target, event) {

        var $wrapper = storage.$hint_wrapper,
            position = getHintPosition(event),
            html = "";

        // Show Hint
        html += "<div class=\"line\">" + data.header + "</div>";
        html += "<div class=\"line\">" + dataset[j].label + ": " + (data.amount_html || data.y) + "</div>";

        $wrapper
            .html(html)
            .addClass("is-shown")
            .css(position);

        // Marking column
        $target.attr("class","is-hovered");
    };

    // Hint Moving
    var onMove = function(event) {
        var $wrapper = storage.$hint_wrapper,
            position = getHintPosition(event);

        if (position) {
            $wrapper.css(position);
        } else {
            console.log("cant get mouse position");
        }
    };

    var onHoverOut = function( data, $target ) {
        // Hide Hint
        storage.$hint_wrapper.removeClass("is-shown");

        // Clear column opacity
        $target.attr("class","");
    };

    var getHintPosition = function(event) {
        var margin = {
            top: - parseInt($("#content").css("margin-top")) - 32,
            left: 24
        };

        var mouse_left = event.pageX,
            hint_left = mouse_left + margin.left,
            hint_right = "auto",
            hint_width = 200;

        // set document width
        if (!storage.document_width) {
            storage.document_width = $(document).width();
        }

        // Check mouse place
        if (mouse_left >= (storage.document_width - hint_width)) {
            hint_left = "auto";
            hint_right = storage.document_width - mouse_left + margin.left
        }
        return {
            top: event.pageY + margin.top,
            left: hint_left,
            right: hint_right
        };
    };

};

window.initLogsTimeframeSelector = function($wrapper) {
    var $visible_option = $wrapper.children('.t-logs-timeframe-dropdown').children('a');
    var $custom_wrapper = $wrapper.children('.t-custom-timeframe');

    // Initial selection in dropdown menu
    var timeframe = getTimeframeData();
    setActiveLi(timeframe.$li);
    if (timeframe.timeframe == 'custom') {
        $custom_wrapper.show();

        // Delay initialization to allow datepicker locale to set up properly.
        // Looks kinda paranoid, but otherwise localization sometimes fails in FF.
        $(function() {
            setTimeout(function() {
                initCustomSelector(timeframe);
            }, 100);
        });
    } else {
        $custom_wrapper.hide();
    }

    // Change selection when user clicks on dropdown list item
    $wrapper.children('.t-logs-timeframe-dropdown').on('click', 'ul li:not(.selected)', function() {
        var $li = $(this);
        var tf = getTimeframeData($li);
        setActiveLi($li);
        if (tf.timeframe == 'custom') {
            $custom_wrapper.show();
            initCustomSelector(tf);
        } else {
            $custom_wrapper.hide();
            reloadChart();
        }
    });

    // Load chart based on current selected dates
    function reloadChart() {
        var timeframe = getTimeframeData();
        var params = window.location.hash.substr(6).split('/')[0] || '';
        'to from groupby timeframe'.split(' ').forEach(function(name) {
            params = $.tasks.replaceParam(params, name, timeframe[name] || '');
        });

        $.wa.setHash($.tasks.cleanHash('#/log/' + params + '/'));
    }

    // Helper to get timeframe data from <li> element,
    // or when $li is not specified, deduce it from current selected element and/or URL hash.
    function getTimeframeData($li) {
        var result;
        if (!$li || !$li.length) {
            $li = $wrapper.find('ul li.selected').first();
            if (!$li.length) {
                // Determine active timeframe from url hash and find corresponding <li>
                var params = window.location.hash.substr(6).split('/')[0] || '';
                var timeframe = $.tasks.deparam(params);
                if (timeframe.timeframe && timeframe.groupby) {
                    $wrapper.find('ul li').each(function() {
                        var tf = getTimeframeData($(this));
                        if (tf.timeframe == timeframe.timeframe && tf.groupby == timeframe.groupby) {
                            $li = $(this);
                            return false;
                        }
                    });
                    if ($li) {
                        result = {
                            $li: $li,
                            timeframe: timeframe.timeframe,
                            groupby: timeframe.groupby
                        };
                        if (result.timeframe == 'custom') {
                            result.from = timeframe.from || null;
                            result.to = timeframe.to || null;
                        }
                        return result;
                    }
                }
            }
            if (!$li.length) {
                $li = $wrapper.find('ul li[data-default-choice]').first();
            }
            if (!$li.length) {
                throw new Error("Something's badly wrong with the timeframe selector.");
            }
        }

        result = {
            $li: $li,
            timeframe: ($li && $li.data('timeframe')) || 30,
            groupby: ($li && $li.data('groupby')) || 'days'
        };

        if (result.timeframe == 'custom') {
            result.from = $custom_wrapper.find('[name="from"]').datepicker('getDate');
            if (result.from) {
                result.from = result.from.getTime() / 1000;
            }
            result.to = $custom_wrapper.find('[name="to"]').datepicker('getDate');
            if (result.to) {
                result.to = result.to.getTime() / 1000;
            }
        }

        return result;
    }

    // Helper to set active timeframe <li>
    function setActiveLi($li) {
        $visible_option.find('b i').text($li.text());
        $li.addClass('selected').siblings('.selected').removeClass('selected');
    }

    // Helper to set up custom period selector
    function initCustomSelector(timeframe) {

        var $groupby = $custom_wrapper.find('select');
        var $inputs = $custom_wrapper.find('input');
        var $from = $inputs.filter('[name="from"]');
        var $to = $inputs.filter('[name="to"]');
        var delay_timeout = null;

        // One-time initialization
        (function() {
            $inputs.datepicker().change(function() {
                delay_timeout && clearTimeout(delay_timeout);
                delay_timeout = setTimeout(reloadChart, 500);
            }).keyup(function(e) {
                delay_timeout && clearTimeout(delay_timeout);
                if (e.which == 13 || e.which == 10) {
                    reloadChart();
                }
            });
            $inputs.datepicker('widget').hide();
            $groupby.change(reloadChart);
        })();

        // Code to run each time 'Custom' is selected
        initCustomSelector = function(timeframe) {
            // Set datepicker values depending on previously selected options
            if (timeframe.timeframe == 'custom') {
                $from.datepicker('setDate', timeframe.from ? new Date(timeframe.from*1000) : null);
                $to.datepicker('setDate', timeframe.to ? new Date(timeframe.to*1000) : null);
            } else if (timeframe.timeframe == 'all') {
                $from.datepicker('setDate', null);
                $to.datepicker('setDate', null);
            } else {
                $from.datepicker('setDate', '-'+parseInt(timeframe.timeframe, 10)+'d');
                $to.datepicker('setDate', new Date());
            }
            $groupby.val(timeframe.groupby);
        };

        initCustomSelector(timeframe);
    }
};