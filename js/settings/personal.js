var TasksSettingsPersonal = (function ($) {

    TasksSettingsPersonal = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$form = that.$wrapper.find('form');
        that.$button = that.$form.find(':submit');

        // VARS

        // DYNAMIC VARS

        // INIT
        that.initClass();
    };

    TasksSettingsPersonal.prototype.initClass = function () {
        var that = this;
        that.initChangeListener();
        that.initProjectList();
        that.initSubmit();
    };

    TasksSettingsPersonal.prototype.initProjectList = function () {
        var that = this,
            $wrapper = that.$wrapper,
            $checkbox = $wrapper.find('.t-project-checkbox'),
            $list = $wrapper.find('.t-project-list');

        var handler = function () {
            if ($checkbox.is(':checked')) {
                $list.find(':checkbox').attr('disabled', false);
                $list.show();
            } else {
                $list.find(':checkbox').attr('checked', false).attr('disabled', true);
                $list.hide();
            }

        };
        $checkbox.click(handler);
    };

    TasksSettingsPersonal.prototype.initChangeListener = function () {
        var that = this,
            $form = that.$form,
            $button = that.$button,
            $wrapper = that.$wrapper,
            $settings_list = $wrapper.find('.t-settings-list');

        function checkChangeForm($container, update) {
                var changed = false;
                var selector = ':input:not(.js-ignore-change)';
                if ($container.hasClass('t-setting-form')) {
                    if ($container.hasClass('ajax')) {
                        return false;
                    }
                }
                $container.find(selector).each(function () {
                    /** @this HTMLInputElement */
                    var type = ($(this).attr('type') || this.tagName).toLowerCase();
                    switch (type) {
                        case 'input':
                        case 'text':
                        case 'textarea':
                        case 'radio':
                            if (this.defaultChecked != this.checked) {
                                changed = true;
                                if (update) {
                                    this.defaultChecked = this.checked;
                                }
                            }
                            break;
                        case 'checkbox':
                            if (this.defaultChecked != this.checked) {
                                changed = true;
                                if (update) {
                                    this.defaultChecked = this.checked;
                                }
                            }
                            break;
                        case 'select':
                        case 'file':
                        case 'reset':
                        case 'button':
                        case 'submit':
                            // ignore it
                            break;
                        case 'hidden':
                            // do nothing
                            break;
                        default:
                            console.log('default');
                            break;
                    }
                    return update || !changed;
                });
                return changed;
        }

        $form.on('change', '.js-settings-checkbox', function () {
            if (checkChangeForm($form, false)) {
                $button.removeClass('green').addClass('yellow');
            }else{
                $button.removeClass('yellow').addClass('green');
            }
            if (!$settings_list.find('.js-settings-checkbox').is(':checked')) {
                $wrapper.find('.js-settings-notification[value="off"]').attr("checked", true);
                //Disable all checkboxes on Switch off
                $settings_list.find(':checkbox').attr('checked', false).attr('disabled', true);
                $wrapper.find('.t-project-list').hide();
            }
        });

        $form.on('click', '.js-settings-notification', function () {
            if (checkChangeForm($form, false)) {
                $button.removeClass('green').addClass('yellow');
            }else{
                $button.removeClass('yellow').addClass('green');
            }
            if ($(this).val() == 'off') {
                $settings_list.find(':checkbox').attr('checked', false).attr('disabled', true);
                $wrapper.find('.t-project-list').hide();
            } else {
                $settings_list.find(':checkbox').attr('disabled', false);
            }
        });
    };

    TasksSettingsPersonal.prototype.initSubmit = function () {
        var that = this,
            $button = that.$button,
            $form = that.$form;
        $form.submit(function (e) {

            e.preventDefault();

            var url = $form.attr('action'),
                data = $form.serialize(),
                $icon = $form.find('.t-loading');

            $icon.show();
            $button.attr('disabled', true);

            $.post(url, data)
                .done(function () {
                    // $.tasks.redispatch();
                    document.location.reload();
                })
                .always(function () {
                    $icon.hide();
                    $button.attr('disabled', false);
                });
        });
    };

    return TasksSettingsPersonal;

})(jQuery);
