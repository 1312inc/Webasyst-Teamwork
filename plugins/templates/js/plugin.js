var TasksTemplatesPlugin = ( function($) { "use strict";

    TasksTemplatesPlugin = {

        '$sidebar': null,
        '$link_wrapper': null,

        init: function (options) {
            var that = this;

            // DOM
            that.$sidebar = options.$sidebar;
            that.$link_wrapper = options.$link_wrapper;

            $('.add-task-wrapper', that.$sidebar).after(that.$link_wrapper);

            that.$link_wrapper.find('.js-task-templates-menu .js-template-link').click(function () {
                var $saved_task_title = localStorage.getItem('task_title'),
                    $saved_task_text = localStorage.getItem('task_text');

                if ($saved_task_title || $saved_task_text) {
                    // Clear localStorage Task draft
                    localStorage.removeItem('task_title');
                    localStorage.removeItem('task_text');
                    localStorage.removeItem('draft_time');
                }
                $('.js-task-templates-menu').hide();

            });

        },

        selectMenuItem: function (id) {
            var that = this,
                $sidebar = that.$sidebar,
                $menu = $('.t-templates-plugin-templates-menu', $sidebar);

            $menu.find(".js-dropdown-menu-item.selected").removeClass('selected');

            if (id > 0) {
                var $item = $menu.find('.js-dropdown-menu-item[data-value="' + id + '"]');
                $item.addClass('selected');
            } else {
                $menu.find('.js-add-menu-item').addClass('selected');
            }
        },

        updateMenuItem: function (id, data) {
            var that = this,
                $sidebar = that.$sidebar,
                $menu = $('.t-templates-plugin-templates-menu', $sidebar);

            var $item = $menu.find('.js-dropdown-menu-item[data-value="' + id + '"]');

            if (data === null) {
                $item.remove();
                return;
            }

            // add template item
            if (!$item.length) {
                $item = $menu.find('.js-dropdown-menu-item.js-is-template').clone();
                $item.removeClass('js-is-template');
                $item.attr('data-value', data.id);
                $item.data('value', data.id);
                $item.find('.js-template-link').attr('href', '#/add/' + data.id + '/');
                $item.find('.js-edit-link').attr('href', '#/templates/edit/' + data.id + '/');
                $menu.find('.js-add-menu-item').before($item);
                $item.show();
            }

            // update item
            $item.find('.t-name').attr('title', data.name);
            $item.find('.t-name').text(data.name);
            $item.find('.t-icon').replaceWith('<i class="icon16 ' + data.icon + ' t-icon"></i>');
        }
    };

    // TEMPLATE ACTION + PANIC RECOVERING

    window.TasksController.templatesAction = function () {
        var that = this;
        if (arguments[0] === 'add') {
            that.load('?plugin=templates&module=template&action=edit', function () {
                TasksTemplatesPlugin.selectMenuItem('add');
            });
        } else if (arguments[0] === 'edit') {
            var id = arguments[1];
            that.load('?plugin=templates&module=template&action=edit&id=' + id, function () {
                TasksTemplatesPlugin.selectMenuItem(id);
            });
        } else {
            console.log("Not found :(");
            return;
        }
    };

    // #/templates/
    // #/templates/.../
    // #/templates/.../.../
    window.TasksController.panicRecovery(/#\/templates((\/.+:?)|\/)/,
        function () {
            console.log('Recovering...');
            console.log("'#/templates/...' is not implemented");
        },
        function () {
            console.log("No need to recover for '#/templates/...'");
        }
    );

    // ADD ACTION + LOAD TEMPLATE INFO

    (function () {

        var loadTemplateInfo = function (id, onTemplateInfoLoaded) {
            $.get('?plugin=templates&module=template&action=info', { id: id }, 'json')
                .done(function (r) {
                    if (!r || !r.data || !r.data.template || !r.data.template.id) {
                        return;
                    }
                    onTemplateInfoLoaded && onTemplateInfoLoaded(r.data.template);

                });
        };

        var isAddingContext = function () {
            var matched = (window.TasksController.currentHash || '').match(/#\/add\/(\d+)/);
            var template_id = 0;
            if (matched) {
                template_id = parseInt(matched[1], 10);
                template_id = !isNaN(template_id) ? template_id : 0;
            }
            return template_id;
        };

        var applyTemplateOnForm = function (template) {
            var $form = $('#t-edit-task-form');
            $form.find('input[name="data[name]"]').attr('placeholder', $.wa.encodeHTML(template.name || ''));
            $form.find('textarea[name="data[text]"]').val(template.text || '');
        };

        var template_id = isAddingContext();
        if (template_id > 0) {
            loadTemplateInfo(template_id, function (template) {
                applyTemplateOnForm(template);
            });
        }

        // OVERRIDE BASIC ACTION
        var prevAddAction = window.TasksController.addAction;
        window.TasksController.addAction = function () {
            var args = arguments;
            var template_id = 0;
            if (args.length > 0) {
                template_id = parseInt(args[0], 10);
                template_id = !isNaN(template_id) ? template_id : 0;
            }
            if (template_id <= 0) {
                return prevAddAction.apply(window.TasksController, args);
            }
            loadTemplateInfo(template_id, function (template) {
                prevAddAction.apply(window.TasksController, args);
                $(window).one('wa_loaded', function () {
                    var template_id = isAddingContext();
                    if (template_id > 0) {
                        applyTemplateOnForm(template);
                    }
                });
            });
        };
    })();


    return TasksTemplatesPlugin;

})(jQuery);
