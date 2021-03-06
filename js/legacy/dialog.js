/*
 * dialog.js
 * A slide-down dialog for new task form in list views.
 */
var Dialog = ( function($) { "use strict";

    Dialog = function(options) {
        var that = this;

        // LOAD
        that.$body = $("body");
        that.loadContent();

        // DOM
        that.$dialog = $("#t-dialog-wrapper");
        that.$content = $("#t-dialog-content");
        that.$tasksWrapper = $("#t-tasks-wrapper");
        that.$closeLink = that.$dialog.find(".t-close-dialog-link");

        // VARS
        that.html = ( options['html'] || false );
        that.type = ( options['type'] || false );
        that.onCancel = ( options['onCancel'] || false );
        that.project_color = ( options['project_color'] || false );
        that.task = ( options['task'] || false );
        that.storage = {
            showClass: "dialog-is-shown",
            hasOrnamentClass: "has-ornament"
        };
        that.animationTime = 333;

        // DYNAMIC VARS
        that.task_height = 0;

        // INIT
        that.initDialog();
    };

    Dialog.prototype.bindEvents = function() {
        var that = this,
            $dialog = that.$dialog,
            $content = that.$content,
            $closeLink = that.$closeLink;

        $dialog.on("click", function(event) {
            var $target = $(event.target),
                custom_select_class = "set-custom-select",
                is_custom_link = ($target.hasClass(custom_select_class) || $target.closest("." + custom_select_class).length ),
                $closeContent = $content.find(".t-close-link");

            if (!is_custom_link && $closeContent.length) {
                $closeContent.trigger("click");
            }
        });

        $content.on("click", function(event) {
            // Fix for custom select
            var $target = $(event.target),
                custom_select_class = "set-custom-select",
                is_custom_link = ($target.hasClass(custom_select_class) || $target.closest("." + custom_select_class).length );

            if (!is_custom_link) {
                event.stopPropagation();
            }
        });

        $closeLink.on("click", function(event) {
            that.hideDialog();

            event.stopPropagation();
        });
    };

    Dialog.prototype.loadContent = function() {
        var that = this;
        var $dialog = $('<div class="t-dialog-wrapper" id="t-dialog-wrapper"><div class="t-dialog-content" id="t-dialog-content"></div><a class="t-close-dialog-link" href="javascript:void(0);" style="display: none"></a></div>');
        $('#t-dialog-wrapper').remove();
        that.$body.append($dialog);
    };

    Dialog.prototype.initDialog = function() {
        var that = this;

        that.initialize();

        that.bindEvents();
    };

    Dialog.prototype.initialize = function() {
        var that = this;
        that.showDialog();
    };

    Dialog.prototype.cancelCallback = function() {
        var that = this;

        if (that.onCancel && typeof that.onCancel == "function") {
            that.onCancel();
        }
    };

    Dialog.prototype.showDialog = function() {
        var that = this,
            $dialog = that.$dialog,
            $content = that.$content,
            $tasksWrapper = that.$tasksWrapper,
            time = that.animationTime,
            easing = "linear";

        // Detect $task
        var $task = (that.task && that.task.$task && that.task.$task.length) ? that.task.$task : false,
            top = ($task) ? $task.offset().top : $("#content .t-main-wrapper").offset().top;

        // hidden load
        $content
            .html(that.html)
            .css({
                visibility: "hidden",
                top: top
            });

        // show class
        that.$body.addClass(that.storage.showClass);

        // get content height
        var $header = $content.find(".t-header-wrapper"),
            $block = $content.find(".t-task-page-block"),
            header_height = $header.outerHeight(),
            block_height = $block.outerHeight();

        $content.css({
            visibility: "visible"
        });

        $block.hide();

        // render
        setTimeout( function() {
            $dialog.addClass(that.storage.hasOrnamentClass);

            // EDIT
            if ($task) {

                // Correction
                if ($task) {
                    $content.css("top", top - header_height - 1);
                }

                that.task_height = $task.outerHeight();

                $task.animate({
                    height: block_height
                }, time, easing, function() {

                });

            // NEW
            } else {
                // place for dialog content
                $tasksWrapper.animate({
                    "padding-top": block_height
                }, time, easing, function() {

                });
            }

            // show dialog content
            $block.slideDown(time, easing, function() {
                $block.find("input").first().focus();
            });
        }, 0);

    };

    Dialog.prototype.hideDialog = function() {
        var that = this,
            $dialog = that.$dialog,
            $content = that.$content,
            $tasksWrapper = that.$tasksWrapper,
            $block = $content.find(".t-task-page-block"),
            time = that.animationTime,
            easing = "linear";

        var $task = (that.task && that.task.$task && that.task.$task.length) ? that.task.$task : false;

        $dialog.removeClass(that.storage.hasOrnamentClass);

        $block.slideUp(time, easing, function() {});

        // EDIT
        if ($task) {

            $task.animate({
                height: that.task_height
            },time ,easing, function() {
                that.task_height = 0;
                if ($.contains(document, $dialog[0])) {
                    $dialog.remove();
                    $(this).removeAttr("style");
                    that.$body.removeClass(that.storage.showClass);
                }
                that.cancelCallback();
            });

        // NEW
        } else {
            $tasksWrapper.animate({
                "padding-top": 0
            },time ,easing, function() {
                if ($.contains(document, $dialog[0])) {
                    $dialog.remove();
                    $(this).removeAttr("style");
                    that.$body.removeClass(that.storage.showClass);
                }
                that.cancelCallback();
            });
        }
    };

    return Dialog;

})(jQuery);