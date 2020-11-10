
var TasksReleasesPluginMilestoneEdit = ( function($) { "use strict";

    TasksReleasesPluginMilestoneEdit = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.$editor = options.$editor;
        that.$milestone = that.$editor.find('select[name="milestone[project_id]"]')

        // Vars

        // Dynamic Vars

        // INIT
        that.init();
    };

    TasksReleasesPluginMilestoneEdit.prototype.init = function () {
        var that = this,
            $editor = that.$editor,
            $wrapper = that.$wrapper;

        $editor.find('.t-milestone-project-field').after($wrapper);

        that.initMilestoneSelector();
    };

    TasksReleasesPluginMilestoneEdit.prototype.initMilestoneSelector = function () {
        var that = this,
            $milestone = that.$milestone,
            $wrapper = that.$wrapper,
            $checkboxes = $wrapper.find('input[name="tasks_plugin_releases_milestone_project[]"]');

        var disableCheckbox = function () {
            var milestone_id = $milestone.val() || '';
            $checkboxes.attr('disabled', false);
            $checkboxes.filter('[value="' + milestone_id + '"]').attr('disabled', true).attr('checked', true);
        };

        that.$milestone.on('change', disableCheckbox);
        disableCheckbox();
    };

    return TasksReleasesPluginMilestoneEdit;

})(jQuery);
