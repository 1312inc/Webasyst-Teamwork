/**
 * {literal}
 */
"use strict";


var plugin_migrate = {
    form: null,
    ajax_pull: {},
    progress: false,
    id: null,
    debug: {
        'memory': 0.0,
        'memory_avg': 0.0
    },
    date: new Date(),
    validate: false,
    action: function () {

    },
    onInit: function (path) {
        if (path.action) {
            setTimeout(function () {
                $("#plugin-migrate-transport").val(path.action).change();
            }, 1000);
        }
    },
    blur: function () {

    },
    /**
     *
     * @param {submit} element
     * @returns {boolean}
     */
    migrateHandler: function (element) {
        var self = this;
        self.progress = true;
        self.form = $(element);
        var data = self.form.serialize();
        self.form.find('.errormsg').text('');
        self.form.find(':input').attr('disabled', true);
        self.form.find(':submit:last').hide();
        self.form.find('.progressbar .progressbar-inner').css('width', '0%');
        self.form.find('.progressbar').show();
        var url = $(element).attr('action');
        $.ajax({
            url: url + '&t=' + this.date.getTime(),
            data: data,
            dataType: 'json',
            type: 'post',
            success: function (response) {
                if (response.error) {
                    self.form.find(':input').attr('disabled', false);
                    self.form.find(':submit:last').show();
                    self.form.find('.js-progressbar-container').hide();
                    self.form.find('.tasks-ajax-status-loading').remove();
                    self.progress = false;
                    self.form.find('.errormsg').text(response.error);
                } else {
                    self.form.find('.progressbar').attr('title', '0.00%');
                    self.form.find('.progressbar-description').text('0.00%');
                    self.form.find('.js-progressbar-container').show();

                    self.ajax_pull[response.processId] = [];
                    self.ajax_pull[response.processId].push(setTimeout(function () {
                        $.wa.errorHandler = function (xhr) {
                            return !((xhr.status >= 500) || (xhr.status == 0));
                        };
                        self.progressHandler(url, response.processId, response);
                    }, 1000));
                    self.ajax_pull[response.processId].push(setTimeout(function () {
                        self.progressHandler(url, response.processId, response);
                    }, 2000));
                }
            },
            error: function () {
                self.form.find(':input').attr('disabled', false);
                self.form.find(':submit:last').show();
                self.form.find('.js-progressbar-container').hide();
                self.form.find('.tasks-ajax-status-loading').remove();
                self.form.find('.progressbar').hide();
            }
        });
        return false;
    },
    /**
     *
     * @param {string} url
     * @param {string} processId
     * @param {{ready:boolean=, memory:string,memory_avg:string,processId:string, report:string, stage_num:number, stage_count:number, stage_name:string, warning:string=, error:string=,progress:number}} response
     */
    progressHandler: function (url, processId, response) {
        // display progress
        // if not completed do next iteration
        var self =plugin_migrate;
        var $bar;
        if (response && response.ready) {
            $.wa.errorHandler = null;
            var timer;
            while (timer = self.ajax_pull[processId].pop()) {
                if (timer) {
                    clearTimeout(timer);
                }
            }
            // self.form.find(':input').attr('disabled', false);
            // self.form.find(':submit').show();
            $bar = self.form.find('.progressbar .progressbar-inner');
            $bar.css({
                'width': '100%'
            });
            // self.form.find('.progressbar').hide();
            // self.form.find('.progressbar-description').hide();

            $.ajax({
                url: url + '&t=' + this.date.getTime(),
                data: {
                    'processId': response.processId,
                    'cleanup': 1
                },
                dataType: 'json',
                type: 'post',
                success: function (response) {
                    // show statistic
                    $("#plugin-migrate-submit").hide();
                    self.form.find('.progressbar').hide();
                    var $report = $("#plugin-migrate-report");
                    $report.show();
                    if (response.report) {
                        $report.find(".value:first").html(response.report);
                    }
                    // $.storage.del('tasks/hash');
                }
            });

        } else if (response && response.error) {

            self.form.find(':input').attr('disabled', false);
            self.form.find(':submit:last').show();
            self.form.find('.js-progressbar-container').hide();
            self.form.find('.tasks-ajax-status-loading').remove();
            self.form.find('.progressbar').hide();
            self.form.find('.errormsg').text(response.error);

        } else {
            var $description;
            if (response && (typeof(response.progress) != 'undefined')) {
                $bar = self.form.find('.progressbar .progressbar-inner');
                var progress = parseFloat(response.progress.replace(/,/, '.'));
                $bar.animate({
                    'width': progress + '%'
                });
                self.debug.memory = Math.max(0.0, self.debug.memory, parseFloat(response.memory) || 0);
                self.debug.memory_avg = Math.max(0.0, self.debug.memory_avg, parseFloat(response.memory_avg) || 0);

                var title = 'Memory usage: ' + self.debug.memory_avg + '/' + self.debug.memory + 'MB';
                title += ' (' + (1 + parseInt(response.stage_num)) + '/' + response.stage_count + ')';

                var message = response.progress + ' — ' + response.stage_name;

                $bar.parents('.progressbar').attr('title', response.progress);
                $description = self.form.find('.progressbar-description');
                $description.text(message);
                $description.attr('title', title);
            }
            if (response && (typeof(response.warning) != 'undefined')) {
                $description = self.form.find('.progressbar-description');
                $description.append('<i class="icon16 exclamation"></i><p>' + response.warning + '</p>');
            }

            var ajax_url = url;
            var id = processId;

            self.ajax_pull[id].push(setTimeout(function () {
                $.ajax({
                    url: ajax_url + '&t=' + self.date.getTime(),
                    data: {
                        'processId': id
                    },
                    dataType: 'json',
                    type: 'post',
                    success: function (response) {
                        self.progressHandler(url, response ? response.processId || id : id, response);
                    },
                    error: function () {
                        self.progressHandler(url, id, null);
                    }
                });
            }, 1000));
        }
    }
};

$("#plugin-migrate-transport").change(function () {
    var $container = $("#t-plugin-migrate");
    $container.find(".plugin-migrate-transport-description:visible").hide();
    var $submit_container = $("#plugin-migrate-submit");
    $submit_container.hide();
    var $submit = $submit_container.find(':submit:last');
    $submit.val($submit.data('validate'));
    $submit.removeClass('green');

    if ($(this).val()) {
        $container.find('.plugin-migrate-transport-description:visible').hide();
        plugin_migrate.validate = false;
        $("#plugin-migrate-transport-" + $(this).val()).show();
        $("#plugin-migrate-transport-fields").html($_('Loading...') + '<i class="icon16 loading"></i>').load("?plugin=migrate&module=settings&action=transport", {
            'transport': $(this).val()
        }, function () {
            $("#plugin-migrate-submit").show();
        });
    } else {
        $("#plugin-migrate-transport-fields").empty();
    }

});

// Set up AJAX to never use cache
$.ajaxSetup({
    cache: false
});

$("#t-plugin-migrate").submit(function () {
    var $group = $('#plugin-migrate-transport-group');
    try {
        var $form = $(this);
        if (!plugin_migrate.validate) {
            $group.find(':input').attr('disabled', false);
            var item, data = $form.serializeArray();
            var params = {};
            while (item = data.shift()) {
                params[item.name] = item.value;
            }
            var loading = '<i class="icon16 loading"></i>';
            var url = "?plugin=migrate&module=settings&action=transport";
            $form.find(':submit:last').after(loading);
            $form.find(':input, :submit').attr('disabled', true);
            $group.find(':input').attr('disabled', true);

            $("#plugin-migrate-transport-fields").load(url, params, function () {
                $("#plugin-migrate-submit").show();
                $form.find(':submit:last ~ i.loading').remove();
                $form.find('#plugin-migrate-transport-fields :input, :submit').attr('disabled', false);
                var $submit = $form.find(':submit:last');
                if (plugin_migrate.validate) {
                    $submit.val($submit.data('import'));
                    $submit.addClass('green');
                    $group.find(':input').attr('disabled', true);
                } else {
                    $submit.val($submit.data('validate'));
                    $submit.removeClass('green');
                    $group.find(':input').attr('disabled', false);
                }
            });
        } else {
            $form.find(':input, :submit').attr('disabled', false);
            plugin_migrate.migrateHandler(this);
        }
    } catch (e) {
        $group.find(':input').attr('disabled', false);
        if (console) {
            console.error('Exception: ' + e.message, e);
        }
    }
    return false;
});
/**
 * {/literal}
 */
