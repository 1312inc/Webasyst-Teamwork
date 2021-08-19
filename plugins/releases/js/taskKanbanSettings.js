function KanbanTaskColor(task_id) {
    this.task_id = task_id;
}

KanbanTaskColor.prototype.setColor = function () {
    var $task_wrapper = $('.t-kanban__list__body__item[data-task-id="' + this.task_id + '"]'),
        task_color = $task_wrapper.find('.t-releases-plugin-task-color-setting').data('kanban-task-color').toString();
    if (task_color.length) {
        if (task_color.startsWith('t-')) {
            $task_wrapper.removeClass('t-blue').addClass(task_color).css('background-color', '');
        } else {
            $task_wrapper.css('background-color', '#' + task_color);
        }
    }
};

$(window).load(function() {
    $('body').on('click', '.kanban-task-link', function () {
        var url = '?plugin=releases&module=kanban&action=settings',
            $kanban_task_link = $(this),
            task_id = $kanban_task_link.data('kanban-task-id');

        $.post(url, {id: task_id})
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
                                        var $wrapper_kanban_task = $kanban_task_link.parent('.t-releases-plugin-task-color-setting'),
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
});

