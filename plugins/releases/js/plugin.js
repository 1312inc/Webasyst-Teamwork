var TasksReleasesPlugin = ( function($) { "use strict";

    TasksReleasesPlugin = {};

    // ACTION + PANIC RECOVERING

    window.TasksController.settingsTypesAction = function () {
        var that = this;
        that.load('?plugin=releases&module=types');
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

    return TasksReleasesPlugin;

})(jQuery);
