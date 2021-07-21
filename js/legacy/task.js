/**
 * Task.js
 * JS logic for single task in list view and in separate task pages.
 * */
var Task = ( function($) {

    var storage = {
        full_class: "is-full",
        shown_class: "is-shown",
        hidden_class: "is-hidden",
        selected_class: "selected",
        overflow_disabled_class: "is-overflow-disabled",
        add_task_url: "?module=tasks&action=edit",
        half_left_moved_class: "half-moved-left",
        half_right_moved_class: "half-moved-right",
        left_moved_class: "moved-left",
        right_moved_class: "moved-right",
        loading_html: '<i class="icon16 loading"></i>'
    };

    var toIntOrNull = function (val) {
        if (val === null) {
            return null;
        }
        var int = parseInt(val, 10);
        return isNaN(int) ? null : int;
    };

    Task = function(options) {
        var that = this;

        // DOM
        that.$task = options['$task'];
        that.$statusForm = that.$task.find(".t-status-form-wrapper");
        that.$commentForm = that.$task.find(".t-comment-form form");
        that.$content = that.$task.find(".t-content-column");
        that.$taskContent = that.$task.find(".t-task-wrapper");
        that.$tags = that.$task.find(".t-tags-wrapper");
        that.$selectInput = that.$task.find(".t-checkbox-item");

        // VARS

        // Important note:
        // Might be not full info here
        // Pass what you need explicitly to constructor
        that.task = options.task || {};
        that.task.assigned_contact_id = toIntOrNull(that.task.assigned_contact_id);

        // other vars
        that.tags = that.task.tags || {};
        that.priority = that.task.priority || '';
        that.show_status_form = options.show_status_form || false;
        that.time_since_update_template = options.time_since_update_template;
        that.time_since_update_period = options.time_since_update_period;
        that.is_single = that.$task.hasClass("is-single");
        that.task_id = that.task.id || that.$task.data("task-id");
        that.activeTaskClass = false;
        that.animationTime = 333;
        that.files_hash = options.files_hash || that.generateHash();
        that.user_id = toIntOrNull(options.user_id || 0);

        // DYNAMIC VARS
        that.is_opened = false;
        that.is_status_opened = false;

        if (that.is_single) {
            that.$statusWrapper = that.$task.find(".t-status-data-container");
        }

        // INIT
        that.initTask();
    };

    // Init insert image in ctrl + v to task
    Task.prototype.initPasteImage = function() {
        var defaults;
        $.event.fix = (function(originalFix) {
            return function(event) {
                event = originalFix.apply(this, arguments);
                if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
                    event.clipboardData = event.originalEvent.clipboardData;
                }
                return event;
            };
        })($.event.fix);
        defaults = {
            callback: $.noop,
            matchType: /image.*/
        };
        $.fn.pasteImageReader = function(options) {
            if (typeof options === "function") {
                options = {
                    callback: options
                };
            }
            options = $.extend({}, defaults, options);
            return this.each(function() {
                var $this, element;
                element = this;
                $this = $(this);
                return $this.bind('paste', function(event) {
                    var clipboardData, found;
                    found = false;
                    clipboardData = event.clipboardData;
                    return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
                        var file, reader;
                        if (found) {
                            return;
                        }
                        if (type.match(options.matchType) || clipboardData.items[i].type.match(options.matchType)) {
                            file = clipboardData.items[i].getAsFile();
                            var newFile;
                            if (!document.documentMode && !/Edge/.test(navigator.userAgent)) {
                                newFile = new File([file], Math.random().toString(36).substring(7) + $.now() + '.png', {
                                        type: 'image/png'
                                    }
                                );
                            }else{
                                newFile = file;
                            }
                            reader = new FileReader();
                            reader.onload = function(evt) {
                                return options.callback.call(element, {
                                    files: [newFile]
                                });
                            };
                            reader.readAsDataURL(file);

                            return found = true;
                        }
                    });
                });
            });
        };
    };

    Task.prototype.initTask = function() {
        var that = this;

        that.initPasteImage();

        that.initAppLinks();

        that.bindEvents();

        that.initGallery();

        that.maybeUpdateTimeCounter(); // initial call to set last update time

        that.initPriorityChanger();

        that.initCopyOnClick();

        that.initHeaderCommentController();

        that.initAddCommentController();

        that.initEditCommentController();

        that.initDeleteCommentController();

        that.initChangeStatusController();

        that.initTagsController();

        that.initTaskTagsAutocomplete();

        if (that.is_single) {
            var $task = that.$task;
            //
            that.toggleFullContent(true);
            //
            $task.find(".t-show-full-content").hide();
            $task.find(".t-hide-full-content").hide();
            //
            that.initTaskUpdateListener();
            //
            that.initCommentsPrettyPrint();
        }
    };

    Task.prototype.initCommentsPrettyPrint = function () {

        // Add prettyprint
        if (typeof prettyPrint == 'function') {
            var n = $('.js-comments-list-wrapper').find('pre').addClass('prettyprint').length,
                c = $('.js-quote-text').find('pre').addClass('prettyprint').length;
                d = $('.js-description-wrapper').find('pre').addClass('prettyprint').length;

            (n || c || d) && prettyPrint()
        }
    };

    Task.prototype.generateHash = function (length, init_hash) {
        length = typeof length === 'number' ? parseInt(length, 10) : 32;
        if (length <= 0) {
            length = 32;
        }
        var hash = [],
            getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };

        init_hash = typeof init_hash === 'string' ? init_hash.split('') : [];

        for (var i = 0; i < length; i++) {
            var a = getRandomInt(0, 16),
                b = null;
            if (init_hash[i]) {
                b = parseInt(init_hash[i], 16);
                if (!isNaN(b)) {
                    a ^= b;
                }
            }
            hash.push(a.toString(16));
        }
        return hash.join('');
    };

    Task.prototype.getUpdatedFilesHash = function () {
        return this.files_hash = this.generateHash(32, this.files_hash);
    };

    Task.prototype.bindEvents = function() {
        var that= this,
            $task = that.$task;

        $task.on("click", ".t-show-full-content", function() {
            that.toggleFullContent(true, true);
            return false;
        });

        $task.on("click", ".t-hide-full-content", function() {
            that.toggleFullContent(false);
            return false;
        });

        $task.on("click", ".t-delete-task-link", function() {
            if (confirm($_("Are you sure?"))) {
                that.deleteTask();
            }
            return false;
        });

        $task.on("click", ".t-set-favorite", function() {
            that.onFavorite( $(this) );
            return false;
        });

        $task.on("click", ".t-edit-task-link", function() {
            $.tasks.showEditTaskForm( that, $(this) );
            return false;
        });

        $task.on("mouseenter", ".dropdown", function() {
            $task.addClass(storage.overflow_disabled_class);
        });

        $task.on("mouseleave", ".dropdown", function() {
            $task.removeClass(storage.overflow_disabled_class);
        });

        $task.find('.t-postpone-wrapper .t-custom-select').on("onClick", function() {
            // Prevent postponing for high priority tasks
            var access_denied_message = $(this).data('errormsg');
            if (access_denied_message) {
                alert(access_denied_message);
                return false;
            }
        });

        $task.on("change", ".change-postpone-field", function() {
            that.changePostPone( $(this) );
        });

        that.$selectInput.on("click", function() {
            that.selectTask();
        });

        $task.on('click', '.js-t-delete-relations', function () {
            that.deleteRelations($(this));
        });

        $task.on('click', '.js-t-invert-relations', function () {
            that.invertRelations($(this));
        });
    };

    Task.prototype.initGallery = function() {
        var that = this,
            $images = that.$task.find(".wa-gallery-image");

        if ($images.length) {
            new waGallery($images);
        }
    };

    Task.prototype.initCopyOnClick = function() {
        var $wrapper = this.$task;
        var $priority_wrapper = $wrapper.find('.t-priority-wrapper');
        var $input = $('<input type="text">').css({
            position: 'fixed',
            top: '0',
            left: '0',
            width: '2em',
            height: '2em',
            padding: '0',
            background: 'transparent',
            boxShadow: 'none',
            outline: 'none',
            border: 'none'
        });

        $priority_wrapper.on('click', function(e) {
            if (!e.ctrlKey && !e.metaKey) {
                return;
            }

            $input.appendTo(document.body).val(
                $wrapper.find('.t-task-name-wrapper').first().text() +
                ' #' + $priority_wrapper.text()
            ).focus().select();

            var $icon = $('<i class="icon16 no"></i>');
            try {
                if (document.execCommand('copy')) {
                    $icon.removeClass('no').addClass('yes');
                }
            } catch (err) {
            }

            $priority_wrapper.append($icon.animate({ opacity: 0 }, 300, function() {
                $icon.remove();
                $input.detach();
            }));
        });
    };

    Task.prototype.initPriorityChanger = function() {
        var that = this,
            $task = that.$task,
            $wrapper = $task.find(".t-priority-changer-wrapper"),
            $changer = $wrapper.find(".t-priority-changer"),
            $priority = $task.find(".t-priority-wrapper"),
            shown_class = "is-shown",
            is_changer_shown = false,
            is_slider_init = false,
            timer = 0,
            timer_time = 2000;

        // Bind Events
        $task.on("click", function(event) {
            var $target = $(event.target),
                is_priority_changer = ( $target.hasClass(".t-priority-changer-wrapper") || $target.closest(".t-priority-changer-wrapper").length );

            if (!is_priority_changer && is_changer_shown) {
                hidePriorityChanger();
            }
        });

        $priority.on("dblclick", function(event) {
            showPriorityChanger();
            event.stopPropagation();
        });

        $changer.on("onStopSliding", function(event, data) {
            savePriority("is-" + data.name);
        });

        function showPriorityChanger() {
            // Init slider
            if (!is_slider_init) {
                $.tasks.initPrioritySlider($changer, that.priority);
                is_slider_init = true;
            }

            // Show
            $wrapper.addClass(shown_class);
            is_changer_shown = true;

            $(document).on("keydown", onEscPress);
        }

        function onEscPress(event) {
            var is_escape = (event.keyCode == 27);

            if (is_escape) {
                hidePriorityChanger();
            }
        }

        function hidePriorityChanger() {
            $wrapper.removeClass(shown_class);
            is_changer_shown = false;

            $(document).off("keydown", onEscPress);
        }

        function savePriority(priority_class) {
            clearTimeout(timer);

            //
            renderPriorityText(priority_class);

            timer = setTimeout( function() {
                var save_href = "?module=tasks&action=priority",
                    save_data = {
                        task_id: that.task_id,
                        priority: $changer.find(".t-input").val()
                    };

                $.post(save_href, save_data, function(response) {
                    if (response["status"] == "ok") {
                        //
                        hidePriorityChanger();
                    }
                });
            }, timer_time);
        }

        function renderPriorityText(priority_class) {
            var priorities = {
                    "is-urgent": {
                        "icon": "<i class=\"icon16 exclamation\"></i>"
                    },
                    "is-high": {
                        "icon": "<i class=\"icon16 exclamation-red\"></i>"
                    },
                    "is-normal": {
                        "icon": false
                    },
                    "is-low": {
                        "icon": "<i class=\"icon16 status-blue-tiny\"></i>"
                    }
                },
                active_priority = priorities[priority_class];

            if (active_priority) {
                // Remove old icon
                $priority.find("i").remove();

                // Add new icon
                if (active_priority.icon) {
                    $priority.append(active_priority.icon);
                }
            }

            // Remove old class
            $.each(priorities, function(index, priority) {
                $priority.removeClass(index)
            });

            // Add new class
            $priority.addClass(priority_class);
        }
    };

    Task.prototype.initChangeStatusController = function() {
        var that = this,
            $task = that.$task,
            $statusForm = that.$statusForm,
            filesController = null; // will be installed latter

        var bindEvents = function() {

            $task.on("click", ".t-forward-link", function() {
                showForwardForm();
                return false;
            });

            $task.on("click", ".t-return-link", function() {
                showReturnForm();
                return false;
            });

            $task.on("click", ".t-change-status-link", function(e) {
                var $link = $(this),
                    assigned_contact_id = that.task.assigned_contact_id,
                    status_id = $link.data('statusId'),
                    current_user_id = that.user_id,
                    skip_form = !!e.shiftKey;

                // assigned contact is current user, than show confirm dialog first
                var need_show_confirm_dialog = current_user_id !== null && assigned_contact_id !== null &&
                        assigned_contact_id !== current_user_id;

                if (!need_show_confirm_dialog) {
                    onChangeStatus($link, skip_form);
                    return false;
                }

                var $loading = $('<i class="icon16 loading"></i>'),
                    $label = $link.find('.t-change-status-link-label');

                $loading.css({
                    marginTop: '6px',
                    marginLeft: '4px'
                }).insertAfter($label);

                showConfirmDialog({
                    params: {
                        contact_id: assigned_contact_id,
                        status_id: status_id
                    },
                    onLoad: function () {
                        $loading.hide();
                        var $dialog = $(this),
                            $form = $dialog.find('form'),
                            $button = $dialog.find('.t-change-status-link');
                        $button.click(function (e) {
                            e.preventDefault();
                            $form.submit();
                        });
                    },
                    onSubmit: function ($dialog) {
                        $dialog.find('.t-loading').show();
                        onChangeStatus($link, skip_form);
                        $dialog.trigger('close');
                        return false;
                    }
                });

                return false;
            });

            $task.on("click", ".t-hiddenform-cancel-link", function() {
                if (that.is_single) {
                    hideHiddenContainer();
                } else {
                    hideHiddenForm();
                }
                return false;
            });

            $task.on("submit", ".t-return-form-block form", function() {
                onStatusSubmit($(this), "left");
                return false;
            });

            $task.on("submit", ".t-task-forward-wrapper form", function() {
                onStatusSubmit($(this), "right");
                return false;
            });

            $task.on("submit", ".t-status-form-block form", function() {
                onStatusSubmit($(this), "right");
                return false;
            });

            $statusForm.on("onResize", function() {
                resizeHiddenForm();
            });

            $(document).on("keyup", function(event) {
                var is_escape = ( event.keyCode == "27" );
                if (is_escape && that.is_status_opened) {
                    that.moveTask("reset");
                    that.is_status_opened = false;
                }
            });

        };

        var commentFileEvents = function() {
            var $commentWrapper = $task.find(".t-status-comment-wrapper");

            filesController = new TaskCommentFilesUploader({
                '$wrapper': $commentWrapper
            });

            // Init Paste img on textarea Ctrl+V
            $commentWrapper.find("textarea").pasteImageReader(function(result) {
                filesController.displayFiles(result.files, function () {
                    if (!that.is_single) {
                        resizeHiddenForm();
                    }
                });
            });

            $commentWrapper.on("change", ".t-attach-droparea input:file", function() {
                var $input = $(this),
                    input = $input.get(0);
                filesController.displayFiles(input.files, function() {
                    if (!that.is_single) {
                        resizeHiddenForm();
                    }
                });
                $input.val('');
            });

            $commentWrapper.on("drop", ".t-attach-droparea", function(event) {
                filesController.displayFiles(event.originalEvent.dataTransfer.files, function() {
                    if (!that.is_single) {
                        resizeHiddenForm();
                    }
                });
                return false;
            });

            $commentWrapper.on("click", ".t-file-item .t-file-delete", function() {
                var $file = $(this).closest(".t-file-item");
                filesController.deleteFile($file);
                return false;
            });

            $commentWrapper.on("click", ".t-image-item .t-file-delete", function() {
                var $file = $(this).closest(".t-image-item");
                filesController.deleteFile($file);
                return false;
            });

            // ACTUAL for single task page
            $task.find(".t-status-data-container form").on("submit", function() {
                onStatusSubmitAtSinglePage($(this));
                return false;
            });
        };

        var showForwardForm = function() {
            var forward_href = "?module=tasks&action=forward",
                forward_data = {
                    id: that.task_id
                },
                $deferred = $.Deferred();

            if (that.is_single) {

                $.post(forward_href, forward_data, function(html) {
                    $deferred.resolve(html);
                });

                showHiddenContainer($deferred);

            } else {

                showHiddenForm({
                    direction: "right",
                    beforeMove: function(afterLoad) {
                        // GET FORM HTML
                        $.post(forward_href, forward_data, function(html) {
                            afterLoad(html);
                        });
                    }
                });

            }
        };

        var showReturnForm = function() {
            var return_href = "?module=tasks&action=return",
                return_data = {id: that.task_id},
                $deferred = $.Deferred();

            if (that.is_single) {

                $.post(return_href, return_data, function (html) {
                    $deferred.resolve(html);
                });

                showHiddenContainer($deferred);

            } else {

                showHiddenForm({
                    direction: "left",
                    beforeMove: function (afterLoad) {
                        $.post(return_href, return_data, function (html) {
                            afterLoad(html);
                        });
                    }
                });

            }
        };

        var onStatusSubmitAtSinglePage = function($form) {
            var href = $form.attr("action"),
                data = $form.serializeArray(),
                files_hash = that.getUpdatedFilesHash();

            data.push({
                name: 'files_hash',
                value: files_hash
            });

            $form.showLoading();

            filesController.uploadFiles(files_hash, {
                onAllDone: function() {
                    $form.showLoading();
                    $.post(href, data, 'json')
                        .done(function () {
                            $.tasks.redispatch();
                        })
                        .always(function () {
                            $form.hideLoading();
                        });
                },
                onAllAlways: function () {
                    $form.hideLoading();
                }
            });
        };

        var onStatusSubmit = function($form, direction) {
            var href = $form.attr("action"),
                data = $form.serializeArray(),
                files_hash = that.getUpdatedFilesHash();

            if (!direction) {
                direction = "right";
            }

            data.push({
                name: "files_hash",
                value: files_hash
            });

            $form.showLoading();

            filesController.uploadFiles(files_hash, {
                onAllDone: function() {
                    $form.showLoading();
                    $.post(href, data, "json")
                        .done(function () {
                            $.tasks.reloadSidebar();
                            that.moveTask(direction, function() {
                                that.reloadTask();
                            });
                        })
                        .always(function () {
                            $form.hideLoading();
                        });
                },
                onAllAlways: function () {
                    $form.hideLoading();
                }
            });
        };

        var showConfirmDialog = function (options) {
            $.get('?module=tasks&action=changeStatusConfirm', options.params || {})
                .done(function (html) {
                    // remove all previous dialogs in DOM
                    $('.tasks-done-confirm-dialog').remove();
                    // append new dialog
                    $('body').append(html);
                    $('.tasks-done-confirm-dialog').waDialog(options);
                });
        };

        var onChangeStatus = function( $link, skip_form ) {
            var status_id = $link.data('status-id'),
                href,
                data;

            if (!skip_form && that.show_status_form && status_id != -1) {

                var status_href = '?module=tasks&action=statusform&id=' + that.task_id + '&status_id=' + status_id,
                    $deferred = $.Deferred();

                if (that.is_single) {

                    $.post(status_href, function(html) {
                        $deferred.resolve(html);
                    });

                    showHiddenContainer($deferred);

                } else {

                    showHiddenForm({
                        direction: "right",
                        beforeMove: function(afterLoad) {
                            // GET FORM HTML
                            $.post(status_href, function(html) {
                                afterLoad(html);
                            });
                        }
                    });

                }

            } else {
                href = '?module=tasksLog&id=' + that.task_id;
                data = {
                    status_id: status_id
                };

                if (that.is_single) {

                    // Send Request
                    $.post(href, data, function() {
                        $.tasks.redispatch();
                    }, 'json');

                } else {

                    // Send Request
                    $.post(href, data, function() {
                        $.tasks.reloadSidebar();
                    }, 'json');

                    // Render
                    that.moveTask("right", function() {
                        that.reloadTask();
                    });
                }
            }

        };

        var showHiddenForm = function(options) {
            var direction = ( options['direction'] || "right" ),
                beforeMove = ( options['beforeMove'] || false ),
                afterMove = ( options['afterMove'] || false ),
                right_class = "is-right",
                $statusForm = that.$statusForm,
                $loading;

            $loading = $("<div />").html(storage.loading_html).css({
                margin: "20px 0 0",
                "text-align": "center"
            });

            $statusForm.removeClass("is-animated");

            setTimeout( function() {

                if (direction == "left") {
                    $statusForm.addClass(right_class);
                } else {
                    $statusForm.removeClass(right_class);
                }

                // PRE-RENDER
                $statusForm
                    .html("")
                    .append($loading)
                    .addClass(storage.shown_class);

                setTimeout( function() {
                    $statusForm.addClass("is-animated");

                    if (beforeMove) {

                        beforeMove( function(html) {

                            // Render
                            $statusForm.html(html);

                            commentFileEvents();

                            // Focus
                            $statusForm.find("textarea").focus();

                            resizeHiddenForm();
                        });
                    }

                    // MOVE
                    var move_class = (direction == "right") ? "half-right" : "half-left";
                    that.moveTask(move_class, function() {
                        if (afterMove) {
                            afterMove();
                        }
                    });
                }, 30);

            }, 30);

            that.is_status_opened = true;
        };

        var hideHiddenForm = function() {
            var $content = that.$content,
                $statusForm = that.$statusForm,
                time = that.animationTime;

            // Hide
            setTimeout( function() {
                $statusForm.removeClass(storage.shown_class);
            }, time);

            $content.removeAttr("style");

            // Reset position
            that.moveTask("reset");

            that.is_status_opened = false;
        };

        var resizeHiddenForm = function() {
            var $statusForm = that.$statusForm,
                $content = that.$content,
                content_height = $content.outerHeight(),
                $button = $statusForm.find('.t-buttons-block'),
                button_height = $button.outerHeight()+15,
                status_height = $statusForm.outerHeight(),
                delta_height = parseInt( status_height - content_height);

            if (delta_height > 0) {
                $content.css({
                    height: status_height+button_height
                });
            }
        };

        var showHiddenContainer = function( $deferred ) {
            var $statusWrapper = that.$statusWrapper;

            $statusWrapper
                .html('<i class="icon16 loading" />')
                .addClass(storage.shown_class);

            $deferred.done( function(html) {
                $statusWrapper
                    .html( html );

                // Focus
                $statusWrapper.find("textarea").focus();

                commentFileEvents();
            });

            that.is_status_opened = true;
        };

        var hideHiddenContainer = function() {
            that.$statusWrapper
                .removeClass(storage.shown_class)
                .html("");

            that.is_status_opened = false;
        };

        bindEvents();

    };

    Task.prototype.initCommentForm = function ($commentForm, callbacks) {
        var that = this,
            filesController = new TaskCommentFilesUploader({
                '$wrapper': $commentForm
            });

        // Init Paste img on textarea Ctrl+V
        $commentForm.find("textarea").pasteImageReader(function(result) {
            filesController.displayFiles(result.files, true);
        });

        callbacks = $.isPlainObject(callbacks) ? callbacks : {};
        var onAllDone = typeof callbacks.onAllDone === 'function' ? callbacks.onAllDone : null;

        var bindEvents = function() {
            $commentForm.on("submit", function() {
                clearCommentErrors();
                if (validateComment()) {
                    addComment();
                }
                return false;
            });

            $commentForm.on("change", ".t-attach-droparea input:file", function() {
                var $input = $(this),
                    input = $input.get(0);
                filesController.displayFiles(input.files);
                $input.val('');
            });

            $commentForm.on("drop", ".t-attach-droparea", function(event) {
                filesController.displayFiles(event.originalEvent.dataTransfer.files);
                return false;
            });

            $commentForm.on("click", ".t-file-item .t-file-delete", function() {
                var $file = $(this).closest(".t-file-item");
                filesController.deleteFile($file);
                return false;
            });

            $commentForm.on("click", ".t-image-item .t-file-delete", function() {
                var $file = $(this).closest(".t-image-item");
                filesController.deleteFile($file);
                return false;
            });
        };

        var clearCommentErrors = function() {
            $commentForm.find('.error').removeClass('error');
            $commentForm.find('.errormsg').remove();
        };

        var validateComment = function() {
            var $textarea = $commentForm.find('textarea'),
                val = $.trim($textarea),
                old_files_count = $commentForm.find('.t-image-item:not(.is-template)').length,
                new_files_count = filesController.files_count,
                total_files_count = old_files_count + new_files_count;

            if (!val && !total_files_count) {
                $textarea.parent().append($('<em class="errormsg"></em>').text($_('Either text or attachment is required to add comment.')));
                return false;
            }

            return true;
        };

        var addComment = function() {
            var submit_href = $commentForm.attr("action"),
                submit_data = $commentForm.serializeArray(),
                files_hash = that.getUpdatedFilesHash();

            submit_data.push({
                name: "files_hash",
                value: files_hash
            });

            $commentForm.showLoading();

            filesController.uploadFiles(files_hash, {
                onAllDone: function() {
                    $commentForm.showLoading();
                    $.post(submit_href, submit_data, "json")
                        .done(function (response) {
                            if (response['status'] == "ok") {
                                var comment_id = response['data']['id'];
                                if (comment_id < 0) {
                                    alert("[`Error Comment ID`]");
                                    return;
                                }
                                onAllDone && onAllDone();
                            }
                        })
                        .always(function () {
                            $commentForm.hideLoading();
                        });
                },
                onAllAlways: function () {
                    $commentForm.hideLoading();
                }
            });

        };

        bindEvents();
    };

    Task.prototype.initAddCommentController = function() {
        var that = this,
            $commentForm = that.$commentForm;
        that.initCommentForm($commentForm, {
            onAllDone: function () {
                that.reloadTask({
                    afterReplace: function(task) {
                        // Show Comments
                        task.toggleFullContent(true, true);
                    }
                });
            }
        });
    };

    Task.prototype.initHeaderCommentController = function () {
        var that = this,
            $task = that.$task;

        $task.on("click", '.t-assign-comment-link', function (e) {
            e.preventDefault();

            var $link = $(this),
                log_id = $link.data('id');

            if ($link.hasClass('is-process') || $link.hasClass('disabled')) {
                return;
            }

            var $other_links = $task.find('.t-assign-comment-link').not($link);

            $link.addClass('in-process');
            $other_links.addClass('disabled');

            var has_selected = $link.hasClass('selected'),
                data = {
                    task_id: that.task_id,
                    log_id: log_id
                };

            $other_links.filter('.selected').removeClass('selected');

            var onDone = function () {
                that.reloadTask({
                    afterReplace: function (reloadedTask) {
                        reloadedTask.toggleFullContent(true);
                    }
                });
            };

            if (!has_selected) {
                $.post('?module=tasksComments&action=assign', data)
                    .done(function () {
                        $link.addClass('selected');
                        onDone();
                    });
            } else {
                $.post('?module=tasksComments&action=undo', data)
                    .done(function () {
                        $link.removeClass('selected');
                        onDone();
                    });
            }
        });

    };

    Task.prototype.initEditCommentController = function () {
        var that = this,
            $task = that.$task;

        $task.on("click", ".t-comment-edit-link", function(e) {

            e.preventDefault();

            var $link = $(this),
                $comment_wrapper = $link.closest('.t-comment-item-wrapper'),
                $comment_item = $comment_wrapper.find('.t-comment-item'),
                $comment_form_wrapper = $comment_wrapper.find('.t-comment-edit-form-wrapper'),
                id = $comment_wrapper.data('id');

            $.get('?module=tasksComment&action=edit', { id:  id})
                .done(function(html) {

                    $comment_item.hide();
                    $comment_form_wrapper.show().html(html);

                    var $form = $comment_form_wrapper.find('form');
                    that.initCommentForm($form, {
                        onAllDone: function () {
                            that.reloadTask({
                                afterReplace: function(task) {
                                    // Show Comments
                                    task.toggleFullContent(true);
                                }
                            });
                        }
                    });

                    $comment_form_wrapper.find('.t-cancel-link').click(function (e) {
                        e.preventDefault();
                        $comment_item.show();
                        $comment_form_wrapper.hide().html('');
                    });

                });
        });
    };

    Task.prototype.initDeleteCommentController = function () {
        var that = this,
            $task = that.$task;

        $task.on('click', '.t-comment-delete-link', function (e) {
            e.preventDefault();
            if (!confirm($_("Are you sure?"))) {
                return;
            }
            var $link = $(this);
            if ($link.data('disabled')) {
                return;
            }

            var id = $link.data('id'),
                $comment_wrapper = $link.closest('.t-comment-item-wrapper');

            $link.data('disabled', true);
            $.post('?module=tasksComments&action=delete', { id: id })
                .done(function (r) {
                    if (r.status == 'ok') {
                        $comment_wrapper.remove();
                    } else {
                        alert('Error');
                    }
                })
                .always(function () {
                    $link.data('disabled', false);

                });
        });
    };

    Task.prototype.initTagsController = function() {
        var that = this,
        $tags = that.$tags;

        $tags.on("click", ".js-set-tag", function() {
            var tag_id = $(this).data("id"),
                tag_name = $(this).text();
            that.setTag(tag_id, tag_name);
            return false;
        });

        $tags.on("click", ".t-remove-tag", function(event) {
            unsetTag( $(this).closest(".t-tag-item") );
            event.preventDefault();
        });

        /**
         * If tag not found and user tap "enter" need create new tag and bind to this task
         */
        $tags.on("keyup", ".js-t-task-tags-autocomplete", function (event) {
            if (event.keyCode === 13) {
                    var data = {
                        task_id: that.task_id,
                        tag_name: $(this).val()
                    };
                that.createTag(data);
                $(this).val('');
            }
        });

        $tags.on("focus", ".t-input", function() {
            $tags
                .addClass(storage.shown_class)
                .addClass(storage.overflow_disabled_class);
        });

        $tags.on("blur", ".t-input", function() {
            $tags
                .removeClass(storage.shown_class)
                .removeClass(storage.overflow_disabled_class);
        });

        var unsetTag = function( $tag ) {
            var tag_id = $tag.data("tag-id"),
                remove_href = "?module=tags&action=unset",
                remove_data = {
                    task_id: that.task_id,
                    tag_id: tag_id
                };

            $tag.remove();

            $.post(remove_href, remove_data, function(response) {
                //console.log( response );
            }, "json");
        };


    };

    Task.prototype.initAppLinks = function() {
        var that = this;
        var app_icons = $.tasks.options.app_icons || {};
        var escaped_names = $.map(app_icons, function(i, app_id) {
            return app_id.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        });
        var regexp = new RegExp('\/('+escaped_names.join('|')+')\/');
        that.$content.find('.t-description-wrapper a,.t-comment-content a').each(function() {
            var matches = this.pathname.match(regexp);
            if (matches) {
                var $a = $(this);
                if (!$a.hasClass('js-no-app-icon') && !$a.hasClass('t-tag-link')) {
                    $a.addClass('app-link app-'+matches[1]).prepend($.parseHTML(
                        '<i class="icon16 app-icon app-'+matches[1]+'" style="background-image:url('+app_icons[matches[1]]+');background-size:16px 16px;margin-top: 2px;"></i>'
                    ));
                }
            }
        });
    };

    Task.prototype.createTag = function(data) {
        var that = this,
            href = '?module=tags&action=set';

        $.post(href, data, function(response) {
            that.renderTag(response.data.id, response.data.name);
        }, "json");
    };

    Task.prototype.renderTag = function( tag_id, tag_name ) {
        // taskHeader.js use this method.
        var that = this,
            $tags = that.$tags,
            tag_href = "#/tasks/tag/" + tag_name + "/",
            $tag = $tags.find(".t-tag-item.is-template").clone().removeClass("is-template");

        // Render
        $tag.data("tag-id", tag_id)
            .attr("href", tag_href)
            .find("span").text(tag_name);

        $tags.find(".dropdown").before( $tag );

        return $tag;
    };

    Task.prototype.setTag = function (tag_id, tag_name) {
        var that = this;

        // Clone
        that.renderTag(tag_id, tag_name);
        var set_href = "?module=tags&action=set",
            set_data = {
                task_id: that.task_id,
                tag_name: tag_name
            };

        $.post(set_href, set_data, function (response) {
            //console.log( response );
        });
    };

    Task.prototype.initTaskTagsAutocomplete = function () {
        var that = this,
            $tags = that.$tags;

        $tags.find('.js-t-task-tags-autocomplete').autocomplete({
            source: '?module=tags&action=autocomplete',
            minLength: 1,
            delay: 300,
            select: function (event, ui) {
                that.setTag(ui.item.id, ui.item.label);
                return false;
            }
        });
    };

    Task.prototype.invertRelations = function ($this) {
        var that = this,
            $parent = $this.parent(),
            type = $parent.data('relation-type'),
            relation_task_id = $parent.data('relation-task'),
            invert_href = "?module=tasks&action=invertRelations",
            invert_data = {
                parent_id: null,
                child_id: null
            };

        if (type === 'child') {
            invert_data.parent_id = that.task_id;
            invert_data.child_id = relation_task_id
        } else {
            invert_data.parent_id = relation_task_id ;
            invert_data.child_id = that.task_id
        }

        $.post(invert_href, invert_data, function(response) {
            if (response.data.invert) {
                that.reloadTask();
                if (Tasks[relation_task_id]) {
                    Tasks[relation_task_id].reloadTask();
                }
            } else {
                //@todo Failure result
            }
        });
    };

    Task.prototype.deleteRelations = function ($this) {
        if (confirm('Are you sure')) {
            var that = this,
                $parent = $this.parent(),
                type = $parent.data('relation-type'),
                relation_task_id = $parent.data('relation-task'),
                delete_href = "?module=tasks&action=deleteRelations",
                delete_data = {
                    parent_id: null,
                    child_id: null
                };

            if (type === 'child') {
                delete_data.parent_id = that.task_id;
                delete_data.child_id = relation_task_id
            } else {
                delete_data.parent_id = relation_task_id;
                delete_data.child_id = that.task_id
            }

            $.post(delete_href, delete_data, function (response) {
                if (response.data.delete) {
                    that.reloadTask();
                } else {
                    //@todo Failure result
                }
            });
        }
    };

    Task.prototype.deleteTask = function() {
        var that = this,
            $deferred = $.Deferred(),
            delete_href = "?module=tasks&action=delete",
            delete_data = {
                id: that.task_id
            };

        $.post(delete_href, delete_data, function(response) {
            $deferred.resolve(response);
        });

        $.tasks.reloadSidebar();
        $deferred.done(function(response) {
            that.removeTask();
        });
    };

    Task.prototype.removeTask = function() {
        // delete only DOM, without delete from DB
        var that = this,
            $task = that.$task,
            time = that.animationTime;

        // Check Empty List
        var checkTasksCount = function(tasks) {
            var count = 0;
            for (var task in tasks) {
                if (tasks.hasOwnProperty(task)) {
                    count++;
                }
            }
            return count;
        };

        var task_count = checkTasksCount(Tasks);
        if (task_count > 1) {
            $task.slideUp(time, function() {
                $task.remove();
            });
            var $span = $('#end-of-tasks .js-tasks-list-counter');
            var text = ($span.html()||'').replace(/\d+/g, function(m) {
                return parseInt(m, 10) - 1;
            });
            $span.html(text);
        } else {
            if (that.is_single) {
                location.href = "#/";
            } else {
                $.tasks.redispatch();
            }
        }

        if (typeof Tasks && Tasks[that.task_id]) {
            delete Tasks[that.task_id];
        }

        that = null;
    };

    Task.prototype.moveTask = function(direction, callback) {
        var that = this,
            task = that.$task,
            currentClass = that.activeTaskClass,
            activeClass;

        if (!direction && (direction === "reset")) {
            activeClass = false;
        }

        if (direction === "left") {
            activeClass = storage.left_moved_class;
        }

        if (direction === "half-left") {
            activeClass = storage.half_left_moved_class;
        }

        if (direction === "half-right") {
            activeClass = storage.half_right_moved_class;
        }

        if (direction === "right") {
            activeClass = storage.right_moved_class;
        }

        // Remove Old Class
        if (currentClass) {
            task.removeClass(currentClass);
        }

        // Add new Class
        if (activeClass) {
            task.addClass(activeClass);
        }

        // Save
        that.activeTaskClass = activeClass;

        // Init Callback
        if (callback) {
            setTimeout(callback, that.animationTime);
        }
    };

    Task.prototype.reloadTask = function(callbacks) {
        var that = this,
            is_selected = (tasksHeader.selectedTasks.hasOwnProperty(that.task_id)),
            update_href,
            params = {};

        callbacks = callbacks || {};
        var afterReplace = typeof callbacks.afterReplace === 'function' ? callbacks.afterReplace : null;
        var beforeReplace = typeof callbacks.beforeReplace === 'function' ? callbacks.beforeReplace : null;

        update_href = "?module=tasks&action=info&id=" + that.task_id;

        // load the task info in the same context (by current hash)
        // if task isn't in current context, than it will not be shown
        if (!that.is_single) {
            var hash = location.hash.replace('#/tasks', ''),
                params = $.tasks.parseTasksHash(hash);
            params.view = 'large';
            params.filters = params.filters || '';
            if (params.filters.length > 0) {
                params.filters += '&id=' + that.task_id;
            } else {
                params.filters = 'id=' + that.task_id;
            }
            update_href = "?module=tasks";
        }

        if (is_selected) {
            that.selectTask(false);
        }

        $.get(update_href, params, function(response) {

            var $updatedTask = $(response).find(".t-task-outer-container");

            var replace = function () {
                var $task = that.$task;
                delete Tasks[that.task_id];
                $task.replaceWith($updatedTask);
                var reloadedTask = Tasks[that.task_id];
                if (is_selected) {
                    reloadedTask.selectTask(true);
                }
                afterReplace && afterReplace(reloadedTask);
            };

            if (beforeReplace) {
                var def = $.Deferred();
                def.done(replace);
                beforeReplace($updatedTask, def);
            } else {
                replace();
            }

        });

    };

    Task.prototype.changePostPone = function($field) {
        var that = this,
            hide_href = "?module=tasks&action=hide",
            hide_data = {
                id: that.task_id,
                interval: $field.val()
            };

        $.post(hide_href, hide_data, function (response) {
            if (response.status == 'ok') {
                that.reloadTask();
                $.tasks.reloadSidebar();
            }
        }, 'json');
    };

    Task.prototype.maybeUpdateTimeCounter = function() {
        // Called every 10 seconds by an interval in tasks.js

        var that = this;
        if (!that.time_since_update_template || !that.time_since_update_period || that.time_since_update_period > 3600*25) {
            return;
        }

        if (!that.last_time_counter_update) {
            that.last_time_counter_update = (new Date()).getTime();
        } else if (that.last_time_counter_update + that.time_since_update_period*1000 < (new Date()).getTime()) {
            var $date_wrapper = that.$task.find('.t-date-wrapper');
            var val = ($date_wrapper.html().match(/\d+/)||['0'])[0];
            //console.log('Updating date of task ' + that.task_id, val);
            $date_wrapper.html(that.time_since_update_template.replace('%d', parseInt(val, 10) + 1));
            that.last_time_counter_update = (new Date()).getTime();
        }
    };

    Task.prototype.onFavorite = function ($link) {
        var that = this,
            $i = $link.find('i'),
            value = $i.hasClass('star-empty') ? 1 : 0;

        $i.attr('class', 'icon16 loading');
        $.post('?module=tasks&action=favorite&id=' + that.task_id, {value: value}, function (response) {
            if (response.status == 'ok') {
                $.tasks.reloadSidebar();
                if (value) {
                    $i.attr('class', 'icon16 star');
                } else {
                    $i.attr('class', 'icon16 star-empty');
                }
            }
        });
    };

    Task.prototype.toggleFullContent = function(show, focus) {
        var that = this,
            $task = that.$taskContent,
            active_class = storage.full_class;

        that.is_opened = show;

        if (show) {
            $task.addClass(active_class);

            if (focus) {
                // Focus
                $task.find(".t-comment-form textarea").focus();
            }

        } else {
            $task.removeClass(active_class);
        }
    };

    Task.prototype.selectTask = function( is_selected ) {
        var that = this,
            $task = that.$task,
            $input = that.$selectInput,
            force_checked = true;

        if (typeof is_selected == "undefined") {
            is_selected =  ( $input.attr("checked") == "checked" );
            force_checked = false;
        }

        if (is_selected) {
            $task.addClass(storage.selected_class);

            if (force_checked) {
                $input.removeAttr("checked").click();
            }
        } else {
            $task.removeClass(storage.selected_class);

            if (force_checked) {
                $input.attr("checked", "checked").click();
            }
        }
    };

    Task.prototype.initTaskUpdateListener = function () {
        var that = this,
            task_info = null;

        var isChanged = function (new_task_info, old_task_info) {
            if (getTime(new_task_info.update_datetime) > getTime(old_task_info.update_datetime)) {
                return true;
            }
            if (new_task_info.log_count != old_task_info.log_count) {
                return true;
            }
            if (new_task_info.attach_count != old_task_info.attach_count) {
                return true;
            }
            if (new_task_info.log_texts_hash != old_task_info.log_texts_hash) {
                return true;
            }
            return false;
        };

        var getTime = function (datetime) {
            return new Date(datetime || '1970-01-01').getTime();
        };

        var checkUpdates = function () {
            var url = '?module=tasks&action=changes&id=' + that.task_id;
            return $.ajax(url, {
                suppressErrors: true
            })
        };

        var canBeReload = function () {
            if (that.$task.find('.t-return-form-block form').length) {
                return false;
            }
            if (that.$task.find('.t-task-forward-wrapper form').length) {
                return false;
            }
            if (that.$task.find('.t-status-form-block form').length) {
                return false;
            }

            var comment_text = $.trim(that.$commentForm.find("textarea").val() || '');
            if (comment_text.length) {
                return false;
            }

            if (that.$commentForm.find('.t-image-item').not('.is-template').length) {
                return false;
            }
            if (that.$commentForm.find('.t-file-item').not('.is-template').length) {
                return false;
            }

            if (that.$task.find(".t-comment-edit-form-wrapper .t-comment-form").length) {
                return false;
            }
            return true;
        };

        var controller = function () {
            var timeout = 15000;

            var reRun = function () {
                var contains = $.contains(document, that.$task.get(0));
                contains && setTimeout(controller, timeout);
            };
            var reloadTask = function (url) {
                var contains = $.contains(document, that.$task.get(0));
                if (!contains) {
                    return;
                }
                if (location.hash == url) {
                    that.reloadTask({
                        afterReplace: function(task) {
                            task.toggleFullContent(true);
                        }
                    });
                } else {
                    location.hash = url;
                }
            };
            checkUpdates().done(function (r) {
                if (r.status != 'ok') {
                    reRun();
                    return;
                }

                // first init task_info
                if (!task_info) {
                    task_info = r.data.task;
                    reRun();
                    return;
                }

                var is_changed = isChanged(r.data.task, task_info);
                task_info = r.data.task;

                if (is_changed) {
                    
                    if (canBeReload()) {
                        reloadTask(r.data.url);
                        return;
                    }

                    (function () {
                        var interval_timer = setInterval(function () {
                            if (canBeReload()) {
                                interval_timer && clearInterval(interval_timer);
                                reloadTask(r.data.url);
                            }
                        }, Math.min(timeout / 10, 250));
                    })();
                    return;
                }

                reRun();
           })
        };

        controller();
    };

    return Task;

})(jQuery);

var TaskCommentFilesUploader = ( function($) {

    TaskCommentFilesUploader = function(options) {
        var that = this;

        // DOM
        that.$wrapper = options['$wrapper'];


        // CONST
        that.shown_class = "is-shown";

        // DYNAMIC VARS
        that.loaded_files_count = 0;
        that.attachedFiles = {};
        that.files_count = 0;
    };

    TaskCommentFilesUploader.prototype.uploadFiles = function(hash, callbacks) {
        var that = this,
            url = "?module=attachments&action=upload",
            files = that.attachedFiles;

        callbacks = $.isPlainObject(callbacks) ? callbacks : {};
        var onAllDone = typeof callbacks.onAllDone === 'function' ? callbacks.onAllDone : null,
            onAllAlways = typeof callbacks.onAllAlways === 'function' ? callbacks.onAllAlways : null;

        //onError = typeof callbacks.onError === 'function' ? callbacks.onError : null;

        if (that.files_count <= 0) {
            onAllAlways && onAllAlways();
            onAllDone && onAllDone();
            return;
        }

        var all_files_counter = that.files_count;

        that.clearErrors();

        $.each(files, function (index, file) {
            // Vars
            var formData = new FormData();

            // Set Filename only Ctrl+V paste
            var temp_file_name = 'image.png';
            if (temp_file_name == file.name) {
                var ext = file.name.split(".");
                ext = ext[ext.length-1].toLowerCase();
                var random_file_name = Math.random().toString(36).substring(7) + $.now() + '.' + ext;
                formData.append("files[]", file, random_file_name);
            }else{
                formData.append("files[]", file);
            }

            formData.append("hash", hash);

            // Ajax request
            $.ajax({
                url: url,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(r){

                    all_files_counter--;
                    if (all_files_counter <= 0) {
                        onAllAlways && onAllAlways();
                    }

                    if (r.status != 'ok') {
                        if (!$.isEmptyObject(r.errors)) {
                            that.renderError(r.errors, index, file);
                        }
                        return;
                    }

                    that.loaded_files_count++;
                    if (that.loaded_files_count === that.files_count) {
                        onAllDone && onAllDone();
                        that.loaded_files_count = 0;
                        that.files_count = 0;
                        that.attachedFiles = {};
                    }
                }
            });
        });

    };

    TaskCommentFilesUploader.prototype.displayFiles = function(files, callback) {
        var that = this,
            $wrapper = that.$wrapper;

        // Show form
        if (files.length && !that.files_count) {
            $wrapper.find(".t-attached-files-wrapper").addClass(that.shown_class);
        }

        $.each(files, function(i, file) {
            that.renderFile(file, callback);
        })
    };

    TaskCommentFilesUploader.prototype.renderFile = function(file, callback) {
        var that = this,
            $wrapper = that.$wrapper,
            image_type = /^image\/(png|jpe?g|gif)$/,
            current_index,
            $template,
            $newFile,
            file_name,
            file_size,
            is_image;

        var getImageHTML = function() {
            return $wrapper.find(".t-image-item.is-template");
        };

        var getFileHTML = function() {
            return $wrapper.find(".t-file-item.is-template");
        };

        current_index = that.files_count++;
        that.attachedFiles[current_index] = file;

        is_image = (file.type.match(image_type));
        $template = (is_image) ? getImageHTML() : getFileHTML();
        file_name = file.name;
        file_size = Math.round( file.size / 1024 ) + " Kb";
        $newFile = $template.clone().removeClass("is-template");

        // Set name
        $newFile.find(".t-file-name").text(file_name);
        // Set Size
        $newFile.find(".t-file-size").text(file_size);

        $newFile.data("file-id", current_index);

        if (is_image) {
            var $image = $newFile.find(".t-image-link img"),
                reader = new FileReader();

            reader.onload = ( function($image) {
                return function(event) {
                    $image.attr("src", event.target.result);
                    // Render
                    $template.before($newFile);

                    if (callback && typeof callback == "function") {
                        callback();
                    }
                };
            })($image);

            reader.readAsDataURL(file);
        } else {
            // Render
            $template.before($newFile);
            if (callback && typeof callback == "function") {
                callback();
            }
        }
    };

    TaskCommentFilesUploader.prototype.deleteFile = function($file) {
        var that = this,
            file_id = $file.data("file-id"),
            is_new_file = !!that.attachedFiles[file_id];

        if (is_new_file) {
            // Delete from storage
            delete that.attachedFiles[file_id];
            that.files_count--;

            // Delete DOM
            $file.remove();

        } else {
            if (confirm($_("Are you sure?"))) {
                var file_ident = $file.data("file-ident"),
                    delete_href = "?module=attachments&action=delete",
                    delete_data = {
                        id: file_ident
                    };

                $.post(delete_href, delete_data, function(response) {
                    //console.log(response);
                });

                // Delete DOM
                $file.remove();
            }
        }
    };

    TaskCommentFilesUploader.prototype.renderError = function (index, errors) {
        var that = this,
            $commentForm = that.$commentForm;
        if ($.isEmptyObject(errors)) {
            return;
        }
        var $wrapper = $commentForm.find(".t-attached-files-wrapper"),
            $items = $wrapper.find('.t-file-item,.t-image-item'),
            $item = $items.not('.is-template').not('[data-file-ident]').eq(index),
            $error_block = $item.find('.t-file-error');
        $error_block.show();
        $.each(errors, function (i, error) {
            var $error = $('<em class="errormsg"></em>').text(error);
            $error_block.append($error);
        });
    };

    TaskCommentFilesUploader.prototype.clearErrors = function () {
        this.$wrapper.find('.t-file-error').hide().empty();
    };

    return TaskCommentFilesUploader;

})(jQuery);
