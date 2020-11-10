var GitSettings = ( function($) {

    GitSettings = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];
        that.$form = that.$wrapper.find('form');
        that.$button = that.$form.find('.js-save');

        // VARS

        // DYNAMIC VARS

        // INIT
        that.initClass();
    };

    GitSettings.prototype.initClass = function() {
        var that = this;

        that.initSubmit();
    };

    GitSettings.prototype.initSubmit = function() {
        var that = this,
            is_locked = false,
            $loading = $('<i class="icon16 loading" style="vertical-align: middle; margin: 0;"></i>');

        that.$form.on('submit', function (e) {
            e.preventDefault();
            if (!is_locked) {
                is_locked = true;
                that.$button.attr("disabled", true);
                $loading.appendTo(that.$button.parent());

                var href = "?plugin=git&module=settingsSave",
                    data = that.$form.serializeArray();

                $.post(href, data, function (r) {
                    that.$button.attr("disabled", false);
                    is_locked = false;
                    $('i.loading').remove();
                    if (r.status == "ok") {
                       location.reload();
                    }
                }, "json").always(function () {
                    that.$button.attr("disabled", false);
                    is_locked = false;
                    $('i.loading').remove();
                });
            }
        });
    };

    return GitSettings;

})(jQuery);