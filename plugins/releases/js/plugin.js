var TasksReleasesPlugin = ( function($) { "use strict";

    TasksReleasesPlugin = {};

    // ACTION + PANIC RECOVERING

    window.TasksController.settingsTypesAction = function () {
        var that = this;
        that.load('?plugin=releases&module=types');
    };

    window.TasksController.cfdAction = function(params) {
        this.load('?plugin=releases&module=reports&action=cfd&'+(params||''));
    };

    var history = window.TasksController.dispatchHistory,
        item = history[history.length - 1],
        url_pattern = /#\/settings\/types\//;

    if (item && ((item.hash || '').match(url_pattern))) {
        window.TasksController.load_protector = null;
        window.TasksController.settingsTypesAction();
    }

    // show resolution filter only task type Bug & Sr
    TasksReleasesPlugin.initTaskListPageHeaderFilter = function () {
        var filters = localStorage.getItem('tasks/inbox_filters');

        if (filters) {
            var filter_params = filters.split('&');
            $.each(filter_params, function (index, item) {
                var param_value = item.split('=');

                if (param_value[1] == 'bug' || param_value[1] == 'sr') {
                    $('.js-resolution-filter').show();
                }
            });
        }
    };

    TasksReleasesPlugin.initTaskListPageHeader = function (milestones) {

        $(window).one('wa_loaded', function () {
            var $header = $(".t-header-wrapper"),
                $project = $header.find('.js-dropdown-menu[data-id="project_id"]'),
                $milestone = $header.find('.js-dropdown-menu[data-id="milestone_id"]');


            var updateMilestoneSelector = function (project_id) {
                var milestone_menu = $milestone.data('dropDownMenu');
                milestone_menu.eachOption(function (milestone_id, milestone) {
                    var related_projects = milestones[milestone_id] ? (milestones[milestone_id].related_projects || []) : [];
                    if (!project_id || !milestone.project_id || milestone.project_id == project_id ||
                        related_projects.indexOf(project_id) >= 0) {
                        milestone_menu.enableItem(milestone_id);
                    } else {
                        milestone_menu.disableItem(milestone_id);
                    }
                });
            };

            $project.data('dropDownMenu').onSelect(function (project_id) {
                updateMilestoneSelector(project_id);
            });
            updateMilestoneSelector($project.data('dropDownMenu').getSelected('value'));
        });

    };

    // более-менее копипаста из initLogsTimeframeSelector, см. tasks/js/d3chart-logs.js
    // там захардкожены урлы, поэтому пришлось копировать
    TasksReleasesPlugin.initReportsTimeframeSelector = function($wrapper, hash_prefix) {
        var $visible_option = $wrapper.children('#timeframe .dropdown-toggle');
        var $custom_wrapper = $('.t-custom-timeframe');

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
        $wrapper.children('#timeframe .dropdown-body').on('click', 'li:not(.selected)', function() {
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

            $.wa.setHash($.tasks.cleanHash(hash_prefix + params + '/'));
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
            $visible_option.text($li.text());
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

    return TasksReleasesPlugin;

})(jQuery);
