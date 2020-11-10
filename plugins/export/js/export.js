
var TasksExportPlugin = ( function($) { "use strict";

    TasksExportPlugin = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options.$wrapper;
        that.url = '?plugin=export&module=export&action=process';

        that.$download_file_form = that.$wrapper.find('.t-plugin-export-download-file-form');
        that.$link = that.$wrapper.find('.t-plugin-export-link');
        that.$export_icon = that.$link.find('.t-export-icon');
        that.$loading_icon = that.$link.find('.t-loading-icon');

        // INIT
        that.init();
    };

    TasksExportPlugin.prototype.init = function () {
        var that = this;

        that.initLink();
    };

    TasksExportPlugin.prototype.initLink = function () {
        var that = this,
            $link = that.$link;

        $link.on('click', function (e) {
            e.preventDefault();
            if (confirm('Экспортировать все задачи в этом списке?')) {
                that.process();
            }
        });
    };

    TasksExportPlugin.prototype.process = function () {
        var that = this,
            url = that.url,
            processId  = null,
            timer = null,
            requests = 0,
            hash = location.hash || '#/tasks/',
            post_data = $.tasks.parseTasksHash(hash);

        // Sends messenger and delays next messenger in 1 second
        var process = function () {
            timer && clearTimeout(timer);
            timer = setTimeout(process, 1000);
            if (!processId || requests >= 2) {
                return;
            }
            post_data.processId = processId;
            $.post(url, post_data,
                function (response) {
                    requests--;

                    if (!processId || !response.ready) {
                        return;
                    }

                    // Stop sending messengers
                    var pid = processId;
                    if (!pid) {
                        return; // race condition is still possible, but not really dangerous
                    }

                    timer && clearTimeout(timer);
                    timer = null;
                    processId = null;

                    that.$export_icon.show();
                    that.$loading_icon.hide();

                    that.$download_file_form
                        .attr('action', url + '&processId=' + pid)
                        .appendTo('body')
                        .submit();

                },
                'json'
            );
            requests++;

        };

        that.$export_icon.hide();
        that.$loading_icon.show();
        $.post(url, post_data, function (data) {
            if (!data.processId) {
                alert('Error processing request.');
            }
            processId = data.processId;
            process();
        }, 'json');
    };

    return TasksExportPlugin;

})(jQuery);
