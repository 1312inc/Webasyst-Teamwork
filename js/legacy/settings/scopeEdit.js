var TasksScopeEdit = (function ($) {

    TasksScopeEdit = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$form = that.$wrapper.find('form');
        that.$sidebar = $('#t-settings-sidebar-wrapper');

        // VARS
        that.messages = options.messages || {};
        that.scope = options.scope || {};
        that.just_saved = options.just_saved || false;
        that.errors = options.errors || {};

        // DYNAMIC VARS

        // INIT
        that.init();
    };

    TasksScopeEdit.prototype.init = function () {
        var that = this;
        that.ensureCorrectHash();
        that.showSavedIndicator();
        that.showErrors();
        that.initDatepicker();
        that.initDeleteLink();
        that.initSubmit();
        that.initSidebar();
        that.initArchiveLink();
        that.initRestoreLink();
    };

    TasksScopeEdit.prototype.initSubmit = function () {
        var that = this,
            $form = that.$form;
        $form.submit(function () {
            that.submit();
            return false;
        });
    };

    TasksScopeEdit.prototype.submit = function (data) {
        var that = this,
            $form = that.$form,
            form_data = $form.serializeArray();
        if ($.isArray(data) && data.length) {
            form_data = form_data.concat(data);
        }
        $form.find(':submit:first').parent().append('<i class="icon16 loading"></i>');
        $.post($form.attr('action'), form_data, function(r) {
            $('#content').html(r);
        });
    };

    TasksScopeEdit.prototype.initDeleteLink = function () {
        var that = this,
            $wrapper = that.$wrapper,
            $form = that.$form,
            $link = $wrapper.find('.t-scope-delete-link'),
            confirm_msg = that.messages.delete_confirm || '';

        $link.on('click', function() {
            if (confirm(confirm_msg)) {
                $(this).find('.icon16').attr('class', 'icon16 loading');
                $.post('?module=milestones&action=delete', { id: $form.find('[name="id"]').val() }, function() {
                    $.wa.setHash('#/settings/');
                }, 'json');
            }
        });
    };

    TasksScopeEdit.prototype.initSidebar = function () {
        var that = this,
            $sidebar = that.$sidebar,
            scope = that.scope;
        if (scope.id > 0) {
            $sidebar.data('sidebar').selectItem('scope', scope.id);
        }
    };

    TasksScopeEdit.prototype.initDatepicker = function () {
        var that = this,
            $form = that.$form,
            $date_hidden_field = $form.find('[name="milestone[due_date]"]'),
            ms = Date.parse($date_hidden_field.val()),
            date = ms ? new Date(ms) : null;

        $form.find('.datepicker-due-date').datepicker({
            changeYear: true,
            changeMonth: true,
            gotoCurrent: true,
            constrainInput: false,
            altField: $date_hidden_field,
            altFormat: 'yy-mm-dd'
        }).datepicker("setDate", date);
    };

    TasksScopeEdit.prototype.ensureCorrectHash = function () {
        var that = this;
        if (that.scope.id > 0) {
            $.tasks.forceHash('#/settings/scope/' + that.scope.id + '/');
        }
    };

    TasksScopeEdit.prototype.showSavedIndicator = function () {
        var that = this;
        if (!that.just_saved) {
            return;
        }
        var $wrapped = that.$wrapper,
            $saved = $wrapped.find('.t-saved');
        $saved.slideDown();
        setTimeout(function () {
            $saved.slideUp();
        }, 3000);
    };

    TasksScopeEdit.prototype.showErrors = function () {
        var that = this,
            $form = that.$form,
            errors = that.errors;
        $.each(errors, function(field_name, error) {
            var $field = $form.find('[name="'+field_name+'"]:visible:first').addClass('error');
            if (!$field.length) {
                $field = $form.find('[name="'+field_name+'"]:first').siblings(':visible:input:first').addClass('error');
            }
            if (!$field.length) {
                $field = $form.find(':submit:first');
            }
            $field.after($('<em class="errormsg"></em>').text(error));
        });

        // Clear validation errors when user changes the field
        that.$form.on('change keyup', '.error', function() {
            $(this).removeClass('error').siblings('.errormsg').remove();
        });
    };

    TasksScopeEdit.prototype.initArchiveLink = function () {
        var that = this,
            $wrapper = that.$wrapper;
        $wrapper.find('.t-scope-archive-link').click(function (e) {
            e.preventDefault();
            that.submit([{
                name: 'milestone[closed]',
                value: '1'
            }]);
        });
    };

    TasksScopeEdit.prototype.initRestoreLink = function () {
        var that = this,
            $wrapper = that.$wrapper;
        $wrapper.find('.t-scope-restore-link').click(function (e) {
            e.preventDefault();
            that.submit([{
                name: 'milestone[closed]',
                value: '0'
            }]);
        });
    };

    return TasksScopeEdit;

})(jQuery);
