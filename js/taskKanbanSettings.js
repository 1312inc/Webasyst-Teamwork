function KanbanTaskSettingHideNewAndCompleted(is_checked) {
    this.is_checked = is_checked;
}

KanbanTaskSettingHideNewAndCompleted.prototype.init = function () {
    var that = this;

    $('input[name="hide_new_and_completed_tasks"]').change(function () {
        var is_checked = ($(this).prop('checked') ? 1 : 0);

        $.post('?module=kanban&action=hideNewAndCompletedSave', { hide_new_and_completed_tasks: is_checked })
            .done(function (r) {
                that.is_checked = is_checked;
                hideNewAndCompletedTasks();
            })
            .error(function (r) {
                console.log(r);
            });
    });

    function hideNewAndCompletedTasks() {
        if (that.is_checked) {
            $('.t-kanban__list:first-of-type').hide();
            $('.t-kanban__list:last-of-type').hide();
        } else {
            $('.t-kanban__list:first-of-type').show();
            $('.t-kanban__list:last-of-type').show();
        }
    }
    hideNewAndCompletedTasks();
};

function KanbanTaskSettings(limits, milestone_id) {
    this.limits = limits;
    this.milestone_id = milestone_id;
}

KanbanTaskSettings.prototype.init = function () {
    var $html_template = '<span class="js-maximum-tasks-wrapper gray bold" style="display: none"> / \n' +
            '<span class="js-maximum-tasks-number">&infin;</span>\n' +
            '<input type="text" class="smallest js-maximum-tasks-input" style="display: none; width: 60px;">\n' +
        '</span>',
        limits = this.limits,
        milestone_id = this.milestone_id;

    $('.t-kanban__list').each(function (indx, el) {
        var $kanban_list = $(el),
            status_id = $kanban_list.find('.t-kanban__list__body').data('kanban-list-status-id'),
            $count_list = $kanban_list.find('.t-kanban__list__count'),
            $new_block = $count_list.after($html_template).siblings('.js-maximum-tasks-wrapper');

        $new_block.find('.js-maximum-tasks-input').attr('name', 'task_limit[' + status_id + ']').data('status-id', status_id);
        $new_block.show();

        if (status_id in limits) {
            $new_block.find('.js-maximum-tasks-number').html(limits[status_id]['limit']);
            if (Number($count_list.html()) > Number(limits[status_id]['limit'])) {
                $kanban_list.css('background-color', '#fcc');
            }
        }
    });

    $('.js-maximum-tasks-number').dblclick(function () {
        $(this).hide();
        $(this).siblings('.js-maximum-tasks-input').show().focus();
    });

    $('.js-maximum-tasks-input').keypress(function (e) {
        if (e.which === 13) {
            var $that = $(this),
                url = '?module=kanban&action=limitSave',
                status_id = $('div[data-kanban-list-status-id="' + $that.data('status-id') + '"]').data('kanban-list-status-id');

            $.post(url, { status_id: status_id, limit: $that.val(), milestone_id: milestone_id })
                .done(function (r) {
                    $that.siblings('.js-maximum-tasks-number').html($that.val()).show();
                    var $kanban_list = $that.parents('.t-kanban__list');
                    if (Number($kanban_list.find('.t-kanban__list__count').html()) > Number($that.val())) {
                        $kanban_list.css('background-color', '#fcc');
                    } else {
                        $kanban_list.css('background-color', '');
                    }
                    $that.hide();
                })
                .error(function (r) {
                    console.log(r);
                });
        }
    });
};

function KanbanTaskColor(task_id) {
    this.task_id = task_id;
}

KanbanTaskColor.prototype.setColor = function () {
    var $task_wrapper = $('.t-kanban__list__body__item[data-task-id="' + this.task_id + '"]'),
        task_color = $task_wrapper.find('.t-task-color-setting').data('kanban-task-color').toString();
    if (task_color.length) {
        if (task_color.startsWith('t-')) {
            $task_wrapper.removeClass('t-blue t-white t-gray t-yellow t-green t-red t-purple').addClass(task_color).css('background-color', '');
        } else {
            $task_wrapper.css('background-color', '#' + task_color);
        }
    }
};

$('body').on('click', '.kanban-task-link', function () {
    var $kanban_task_link = $(this);
    var task_id = $kanban_task_link.data('kanban-task-id');

    $.post('?module=kanban&action=settings', {id: task_id})
        .done(function (html) {
            $.waDialog({
                html: html,
                onOpen: function($dialog, dialog) {
                    $dialog.on("change", 'input[name="kanban_task_settings[color]"]', function() {
                        $dialog.find('input[name="kanban_task_settings[custom_color]"]').val('');
                    });

                    var $form = $dialog.find('form');
                    $form.on('submit', function(event) {
                        event.preventDefault();
                        var $loading = $dialog.find('.t-loading');

                        $loading.show();
                        $.post($form.attr('action'), $form.serialize(), 'json')
                            .done(function (r) {
                                if (r.data.status) {
                                    var $wrapper_kanban_task = $kanban_task_link.parent('.t-task-color-setting'),
                                        $colorbox = $dialog.find('.t-project-settings-colorbox');
                                    $kanban_task_link.parents('.t-kanban__list__body__item').removeClass($colorbox.data('colors'));
                                    $wrapper_kanban_task.data('kanban-task-color', r.data.new_color);
                                    var kanban_task_color = new KanbanTaskColor(task_id);
                                    kanban_task_color.setColor();
                                } else {
                                    console.log(r);
                                }
                            })
                            .always(function () {
                                $loading.hide();
                                dialog.close();
                            });
                    });
                },
            });
        })
        .error(function (r) {
            console.log(r);
        });
    return false;
    });
