/*
 * taskEdit.js
 * JS logic for task editor, both in slide-down dialog in list views,
 * as well as on a separate page.
 */

var TaskEdit = ( function($) { "use strict";

    TaskEdit = function(options) {
        var that = this;

        // DOM
        that.$task = options['$task']; // .t-task-page-wrapper
        that.$block = that.$task.find(".t-task-page-block");
        that.$dropArea = that.$task.find(".t-attach-droparea");
        that.$attachWrapper = that.$task.find(".t-attached-files-wrapper");
        that.$imageHTML = that.$attachWrapper.find(".t-image-item.is-template");
        that.$fileHTML = that.$attachWrapper.find(".t-file-item.is-template");
        that.$form = that.$task.find("#t-edit-task-form");
        that.$menu = that.$task.find(".t-general-menu");
        that.$fields = that.$task.find(".t-more-fields-wrapper");
        that.$teamList = that.$task.find(".t-team-list-wrapper");
        that.$teamUsers = that.$teamList.find(".t-user-item");
        that.$milestoneSelector = that.$task.find(".t-milestone-wrapper");
        that.$due_date_block = that.$task.find(".t-due-date-wrapper");

        // Vars
        that.show_class = "is-shown";
        that.task_id = ( options['task_id'] || false );
        that.is_page = options['is_page'];
        that.priority = options.priority;
        that.project_color = ( options['project_color'] || false );
        that.projects_users = ( options['projects_users'] || false);
        that.projects_priority_users = ( options['projects_priority_users'] || false);
        that.is_new = ( that.task_id ) ? false : true;
        that.is_locked = ( that.is_new && !that.$form.find('[name="data[project_id]"]').val() ) ? true : false;
        that.animationTime = 333;
        that.files_hash = options['files_hash'] || that.generateHash();
        that.messages = options.messages || {};

        // Dynamic Vars
        that.files_count = 0;
        that.attachedFiles = {};
        that.loaded_files_count = 0;
        that.is_changed = false;
        that.project_id = ( options['project_id'] || false );
        that.is_date_picker_init = false;

        /**
         * @param {Object}
         */
        that.due_date = null;

        // INIT
        that.initTaskEdit();
    };

    // Init insert image in ctrl + v to task
    TaskEdit.prototype.initPasteImage = function() {
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

    TaskEdit.prototype.initTaskEdit = function() {
        var that = this;

        that.initPasteImage();

        that.bindEvents();

        if (that.is_new) {
            that.saveTaskDraft();
            that.setTaskDraft();
        }

        that.initTextareaAutocomplete();

        // Make sure everything that depend on current selected project
        // is rendered correctly

        that.initMilestoneSelector();
        that.onProjectChange();

        if (that.is_new) {
            that.setFilterParams();
        }

        // Init Priority Slider
        $.tasks.initPrioritySlider(that.$task.find(".t-priority-changer"), that.priority);

        that.due_date = that.initDueDate();

        $.event.trigger("onTaskEditInit", that);

    };

    TaskEdit.prototype.initMilestoneSelector = function () {
        var that = this,
            $selector = that.$milestoneSelector;
        new TasksDropDownMenu($selector, {
            $hidden: $selector.find('.js-milestones-hidden-input')
        });
        that.updateMilestoneSelector();
    };

    TaskEdit.prototype.updateMilestoneSelector = function () {
        var that = this,
            $selector = that.$milestoneSelector,
            selector = $selector.data('dropDownMenu'),
            project_id = that.project_id,
            enabled_options_count = 0;
        selector.eachOption(function (id, data) {
            // empty option
            if (!id) {
                return;
            }
            var item_project_id = data.projectId;
            if (item_project_id == project_id) {
                enabled_options_count++;
                selector.enableItem(id);
            } else {
                selector.disableItem(id);
            }
        });

        if (enabled_options_count) {
            $selector.show();
        } else {
            $selector.hide();
            selector.setSelected('');
        }
    };
    
    TaskEdit.prototype.setFilterParams = function () {
        var that = this,
            $task = that.$task,
            filter_params = localStorage.getItem('tasks/inbox_filters');

        if (filter_params) {
            filter_params = filter_params.split('&');

            $.each(filter_params, function (index, item) {
                var param_value = item.split('=');

                if (param_value[0] == 'assigned_contact_id') { // set task user
                    var $task_users_list = $task.find('.js-task-users-list .t-user-item');

                    if ($task_users_list.length) {
                        $task_users_list.each(function () {
                            var $users = $(this).find('input');
                            $users.prop("checked", false);
                            if (param_value[1]) {
                                if ($users.val() == param_value[1]) {
                                    $users.prop("checked", true);
                                }
                            }
                        });
                    }
                }

                if (param_value[0] == 'project_id') { // set task project
                    var $task_project_list = $task.find('.js-project-list .t-nav-item');

                    if ($task_project_list.length) {
                        var $project_hidden = $task.find('input[name="data[project_id]"]'),
                            $selected_project = $task.find('.js-selected-project');

                        $task_project_list.each(function () {
                            var $project = $(this).find('.js-project-select'),
                                $project_id = $project.data('value');
                            if ($project_id == param_value[1]) {
                                $project_hidden.val(param_value[1]);
                                $selected_project.html($project.html());
                            }

                        });
                    }

                }

                if (param_value[0] == 'milestone_id') { // set task milestone
                    var $milestone_wrapper = $task.find('.t-milestone-wrapper'),
                        $task_milestone_list = $milestone_wrapper.find('.js-milestones-list .js-milestones-item');


                    if ($task_milestone_list.length) {
                        var $selected_milestone = $task.find('.js-milestone-selected');

                        $task_milestone_list.each(function () {
                            var $milestone = $(this).find('.js-milestones-select-item'),
                                $milestone_id = $milestone.data('value'),
                                $milestone_hidden = $task.find('input[name="data[milestone_id]"]');

                            if ($milestone_id == param_value[1]) {
                                if ($milestone.parent().css('display') == 'none') {
                                    if (!$task_milestone_list.find(".js-milestones-item a").data('value')) {
                                        $selected_milestone.html($task_milestone_list.find(".js-milestones-item a").html());
                                        $milestone_hidden.val('');
                                    }
                                }else{
                                    if (param_value[1]) {
                                        $selected_milestone.html($milestone.html());
                                        $milestone_wrapper.attr("data-milestone-id", param_value[1]);
                                        $milestone_hidden.val(param_value[1]);
                                    }
                                }
                            }
                        });
                    }

                }

            });
        }
    };

    TaskEdit.prototype.generateHash = function (length) {
        length = typeof length === 'number' ? parseInt(length, 10) : 32;
        if (length <= 0) {
            length = 32;
        }
        var hash = [],
            getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };
        for (var i = 0; i < length; i++) {
            var val = getRandomInt(0, 16);
            hash.push(val.toString(16));
        }
        return hash.join('');
    };

    TaskEdit.prototype.bindEvents = function() {
        var that = this,
            $task = that.$task,
            $attachWrapper = that.$attachWrapper,
            $dropArea = that.$dropArea,
            $menu = that.$menu,
            $form = that.$form,
            $teamList = that.$teamList;

        // When user clicks on inner item in project or milestone selector,
        // update value in corresponding hidden input.
        $menu.on("onChange", ".t-project-select", function(event, $link) {
            that.onProjectChange($link);
        });

        $task.on("click", ".t-close-link", function() {
            that.prepareToClose();
            return false;
        });

        $task.on("click", ".show-more-fields", function() {
            that.toggleMoreFields();
            return false;
        });

        $teamList.on("click", ".show-team-users", function() {
            that.showProjectUsers( $(this) );
        });

        $dropArea.on("change", "input:file", function() {
            that.displayFiles(this['files']);
            $(this).val('');
        });

        // Init Paste img on textarea Ctrl+V
        $form.find('textarea').pasteImageReader(function(result) {
            that.displayFiles(result.files, true);
        });

        $dropArea.on("dragenter", function() {
            return false;
        });

        $dropArea.on("dragleave", function() {
            return false;
        });

        $dropArea.on("drop", function(event) {
            that.onDrop( event.originalEvent.dataTransfer.files );
            event.stopPropagation();
            return false;
        });

        $attachWrapper.on("click", ".t-file-item .t-file-delete", function() {
            var $file = $(this).closest(".t-file-item");
            that.deleteFile( $file );
            return false;
        });

        $attachWrapper.on("click", ".t-image-item .t-file-delete", function() {
            var $file = $(this).closest(".t-image-item");
            that.deleteFile( $file );
            return false;
        });

        $form.on("click", '.t-save-task-link', function(e) {
            that.onSubmit($form, !!e.shiftKey);
            return false;
        });
        $form.on("submit", function(e) {
            e.preventDefault();
            that.onSubmit($form);
            return false;
        });

        $form.find(".t-task-page-block").on("keydown paste change", "input, textarea, select", function(event) {
            var is_escape = ( event.keyCode === "27" );
            if (!is_escape) {
                if (!that.is_changed) {
                    that.is_changed = true;
                }
            }
        });

        var $selectPriority = $task.find(".t-priority-wrapper .t-custom-select");
        $selectPriority.on("onChange", function(event, $link, value) {
            var $selectedItem = $selectPriority.find(".selected-custom-item"),
                urgent_class = "is-urgent";
            if (value == 2) {
                $selectedItem.addClass(urgent_class);
            } else {
                $selectedItem.removeClass(urgent_class);
            }
        });

        var closeOnEsc = function(event) {
            var is_escape = ( event.keyCode == "27" );
            if (is_escape) {
                var $closeLink = $task.find(".t-close-link"),
                    is_exist = $(document).find($closeLink).length;

                if (is_exist) {
                    $closeLink.trigger("click");
                } else {
                    $(document).off("keydown", closeOnEsc);
                }
            }
        };
        $(document).on("keydown", closeOnEsc);

        if (window.FileReader == null) {
            alert($_('Your browser does not support File API!'));
        }

        if (that.is_page) {
            var $background = that.$task.closest(".t-main-wrapper").find(".t-background-wrapper");
            $background.on("click", function() {
                that.prepareToClose();
            });
        }
    };

    TaskEdit.prototype.initTextareaAutocomplete = function() {
        this.$form.find('textarea').textareaAutocomplete({
            url: '?action=tagsatcmpl',
            appendTo: '#content',
            autoFocus: false,
            delay: 300
        });
    };

    TaskEdit.prototype.onProjectChange = function($link) {
        var that = this,
            $selector = that.$milestoneSelector,
            selector = $selector.data('dropDownMenu');

        that.project_id = that.$menu.find('[name="data[project_id]"]').val();

        // Update background
        var color_class = $link && $link.data("project_color_class");
        color_class && that.setProjectColor(color_class);

        // Unlock for form validation
        that.is_locked = !that.project_id;

        // Update options in user and milestone selectors
        // as they depend on current selected project
        that.updateMilestoneSelector();

        // reset milestones on default value
        selector.setSelected('');

        //
        that.toggleTeamUsers();
    };

    TaskEdit.prototype.initDueDate = function () {
        var that = this,
            messages = that.messages,
            $due_date_block = that.$due_date_block,
            $date_hidden_field = $due_date_block.find('[name="data[due_date]"]'),
            $date_input = $due_date_block.find('.t-datepicker-due-date'),
            ms = Date.parse($date_hidden_field.val()),
            date = ms ? new Date(ms) : null,
            date_format = null;
        if ($.datepicker._defaults && $.datepicker._defaults.dateFormat) {
            date_format = $.datepicker._defaults.dateFormat;
        }

        $date_input.on('change', function (e) {
            e.preventDefault();
            if ($.trim($date_input.val()).length <= 0) {
                $date_hidden_field.val('');
            }
        });

        $date_input.datepicker({
            changeYear: true,
            changeMonth: true,
            gotoCurrent: true,
            constrainInput: true,
            altField: $date_hidden_field,
            altFormat: 'yy-mm-dd',
            dateFormat: date_format
        }).datepicker("setDate", date);

        return {
            isValid: function () {
                if (!date_format) {
                    return true;
                }
                var value = $date_input.val() || '';
                if (!value) {
                    return true;
                }
                var is_error = true;
                try {
                    if ($.datepicker.parseDate(date_format, value) instanceof Date) {
                        is_error = false;
                    }
                } catch (er) {
                }
                return !is_error;
            },
            showError: function () {
                $date_input.addClass('error');
                var message = messages['date_invalid'] || 'Date is invalid';
                var $error = $('<em class="errormsg"></em>').text(message);
                $due_date_block.find('.value').append($error);
            },
            clearError: function () {
                $date_input.removeClass('error');
                $due_date_block.find('.errormsg').remove();
            }
        }
    };


    // TEAM USERS

    TaskEdit.prototype.toggleTeamUsers = function() {
        var that = this,
            $teamList = that.$teamList,
            $users = $teamList.find(".t-user-item"),
            project = that.projects_users[that.project_id],
            project_count = project ? project.length : 0,
            max_count = 3,
            iteration = 0,
            show_unassigned = false,
            show_button = false;

        if (project_count > max_count) {
            show_unassigned = false;
            show_button = true;
        } else {
            show_unassigned = true;
            show_button = false;
        }

        $users.each( function() {
            var $user = $(this),
                user_id = parseInt( $user.data("user-id") || false),
                is_show = ( user_id && $.inArray(user_id, project) >= 0);

            if (is_show && iteration < max_count) {
                $user.addClass(that.show_class);
                iteration++;
            } else {
                $user.removeClass(that.show_class);
            }
        });

        if (show_unassigned) {
            $teamList.find(".is-unassigned").addClass(that.show_class);
        } else {
            $teamList.find(".is-unassigned").removeClass(that.show_class);
        }

        // Hide button
        if (show_button) {
            $teamList.find(".t-link-item").addClass(that.show_class);
        } else {
            $teamList.find(".t-link-item").removeClass(that.show_class);
        }
    };

    TaskEdit.prototype.showProjectUsers = function( $link ) {
        var that = this,
            $users = that.$teamUsers,
            project = that.projects_users[that.project_id];

        if (!project) {
            return false;
        }

        $users.each( function() {
            var $user = $(this),
                user_id = parseInt( $user.data("user-id") || false),
                is_show = ( user_id && ( user_id == 0 || $.inArray(user_id, project) >= 0 ));

            if (is_show) {
                $user.addClass(that.show_class);
            }
        });

        // Hide button
        $link.closest("li").removeClass(that.show_class);
    };

    TaskEdit.prototype.setProjectColor = function( new_color_class ) {
        if (!new_color_class) {
            return false;
        }

        var that = this,
            $block = that.$block,
            current_color = that.project_color;

        if (current_color) {
            $block.removeClass(current_color)
        }

        // Save
        that.project_color = new_color_class;

        // Set Class
        $block.addClass(new_color_class);
    };

    TaskEdit.prototype.prepareToClose = function() {
        var that = this,
            text = $.wa.locale["unsaved_data"],
            is_changed = that.is_changed;

        if (that.is_new) {
            text = $.wa.locale["saved_data_draft"];
        }

        var do_close = (!is_changed || confirm(text));
        if (do_close) {
            that.closePage();
        }
    };

    TaskEdit.prototype.closePage = function(saved_response, return_to_new) {
        var that = this,
            $task = that.$task,
            $dialog = $task.closest(".t-dialog-wrapper"),
            is_dialog = ( $dialog.length );

        // Reload Sidebar
        if (window.hasOwnProperty('TasksController')) {
            window['TasksController'].reloadSidebar();
        }

        if (is_dialog) {

            // NEW
            if (that.is_new) {

                if (saved_response) {
                    $.get('?module=tasks&hash='+encodeURIComponent('id/'+saved_response.id), {}, function(r) {
                        var $new_elements = $('<div>').html(r).find('#t-tasks-wrapper').children(':not(#end-of-tasks)').hide().addClass('new-task highlighted');
                        $new_elements.prependTo('#t-tasks-wrapper').slideDown();
                        $dialog.find(".t-close-dialog-link").trigger("click");

                        // return to adding form
                        if (return_to_new) {
                            $.tasks.showNewTaskForm(true);
                            return;
                        }

                        // stay in current context
                        // wait for a while, than try remove task or leave it here
                        (function (task_id, timeout) {
                            setTimeout(function () {
                                var task = Tasks[task_id];
                                if (!task) {
                                   return;
                                }
                                task.reloadTask({
                                    beforeReplace: function ($new_task, def) {

                                        task.$task.removeClass('new-task highlighted');

                                        // task belongs to current context - just leave
                                        if ($new_task.length) {
                                            def.resolve();
                                            return;
                                        }

                                        // task doesn't belong to current context - remove task
                                        task.moveTask("right", function () {
                                            def.resolve();
                                        });
                                    }
                                });
                            }, timeout);
                        })(saved_response.id, 15000);

                    });
                } else {
                    $dialog.find(".t-close-dialog-link").trigger("click");
                    if (return_to_new) {
                        $.tasks.showNewTaskForm(true);
                    }
                }

                // EDIT
            } else {

                if (Tasks.hasOwnProperty(that.task_id)) {
                    var task = Tasks[that.task_id];

                    task.reloadTask({
                        afterReplace: function() {
                            $dialog.find(".t-close-dialog-link").trigger("click");
                        }
                    });
                }

            }
        } else {
            if (return_to_new) {
                $.tasks.redispatch();
            } else if (saved_response) {
                location.href = '#/task/' + saved_response.url + '/';
            } else if (history.length > 2) {
                history.back();
            } else {

                var href = "#/";

                // We need to know project && task id
                if (that.task_id && that.$form.data('n')) {
                    location.href = '#/task/'+that.$form.data('n')+'/';
                }else{
                    location.href = href;
                }
            }
        }
    };

    // On Drop at Drop Area
    TaskEdit.prototype.onDrop = function( files ) {
        var that = this;

        if (files.length) {
            that.displayFiles(files);
        }
    };

    // Render added files
    TaskEdit.prototype.displayFiles = function(files) {
        var that = this;

        // Show form
        if (!that.files_count) {
            that.$attachWrapper.addClass(that.show_class);
        }

        $.each(files, function(i, file) {
            that.renderFile(file);
        })
    };

    // Render File
    TaskEdit.prototype.renderFile = function(file) {
        var that = this,
            image_type = /^image\/(png|jpe?g|gif)$/,
            current_index,
            $template,
            $newFile,
            file_name,
            file_size,
            is_image;

        current_index = that.files_count++;
        that.attachedFiles[current_index] = file;

        is_image = (file.type.match(image_type));
        $template = (is_image) ? that.$imageHTML : that.$fileHTML;
        file_name = file.name;
        file_size = Math.round( file.size / 1024 ) + " Кб";
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

                    setOrientation(file, $image);

                    $image.attr("src", event.target.result);
                    // Render
                    $template.before($newFile);
                };
            })($image);

            reader.readAsDataURL(file);
        } else {
            // Render
            $template.before($newFile);
        }

        var setOrientation = function(file, $image) {

            EXIF.getData(file, function() {
                var orientation = ( file.exifdata['Orientation'] || false );
                if (orientation) {

                    if (orientation == 1) {
                        return false;
                    }

                    var value = "rotate(0)";

                    if (orientation == 6) {
                        value = "rotate(90deg)";
                    }

                    if (orientation == 8) {
                        value = "rotate(-90deg)";
                    }

                    if (orientation == 3) {
                        value = "rotate(180deg)";
                    }

                    $image.css({
                        "-webkit-transform": value,
                        "transform": value
                    })
                }
            });

        };
    };

    // Delete File
    TaskEdit.prototype.deleteFile = function( $file ) {
        var that = this,
            file_id = $file.data("file-id"),
            is_new_file = ( that.attachedFiles[file_id] );

        if (is_new_file) {
            // Delete
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

    //Save task draft
    TaskEdit.prototype.saveTaskDraft = function() {
        var that = this,
            $task_title = that.$form.find('[name="data[name]"]'),
            $task_text = that.$form.find('[name="data[text]"]');

        $task_title.on('keyup',function(){
            //Save task draft title
            var data = new Date(),
                result = data.toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour:"2-digit",
                    minute: "2-digit"
                });
            localStorage.setItem('task_title', $task_title.val());
            localStorage.setItem('draft_time', result);
        });
        $task_text.on('keyup',function(){
            //Save task draft text
            var data = new Date(),
                result = data.toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour:"2-digit",
                    minute: "2-digit"
                });
            localStorage.setItem('task_text', $task_text.val());
            localStorage.setItem('draft_time', result);
        });
    };

    //Show alert task draft
    TaskEdit.prototype.setTaskDraft = function() {
        var that = this,
            $task_title = that.$form.find('[name="data[name]"]'),
            $task_text = that.$form.find('[name="data[text]"]'),
            $saved_task_title = localStorage.getItem('task_title'),
            $saved_task_text = localStorage.getItem('task_text');

        if (that.is_new) {
            if ($saved_task_title || $saved_task_text) {
                if (confirm($.wa.locale["unsaved_task"]+' '+localStorage.getItem('draft_time')+' '+$.wa.locale["continue_editing"])) {
                    if ($saved_task_title) {
                        $task_title.val($saved_task_title);
                    }
                    if ($saved_task_text) {
                        $task_text.val($saved_task_text);
                    }
                }else{
                    // Clear localStorage Task draft
                    localStorage.removeItem('task_title');
                    localStorage.removeItem('task_text');
                    localStorage.removeItem('draft_time');
                }
            }
        }
    };

    // Submit
    TaskEdit.prototype.onSubmit = function($form, return_to_new) {
        var that = this;

        // Validation Task Type
        var e = new $.Event('task_before_submit');
        $form.trigger(e);
        if (e.isDefaultPrevented()) {
            if ($form.data('validate') == false) {
                return false;
            }
        }

        if (that.is_locked) {
            alert($_("Select Project")); // !!! remove later?..
            return;
        }

        var due_date = that.due_date;
        due_date.clearError();
        if (!due_date.isValid()) {
            due_date.showError();
            return;
        }

        $form.showLoading();
        that.clearFileErrors();

        that.uploadFiles({
            onAllDone: function () {
                $form.showLoading();
                that.updateTask($form)
                    .done(
                        function(response) {
                            if (response.status == "ok") {
                                that.task_id = that.task_id ? that.task_id : response.data.id;
                                that.closePage(response.data, return_to_new);

                                if (that.is_new) {
                                    // Clear localStorage Task draft
                                    localStorage.removeItem('task_title');
                                    localStorage.removeItem('task_text');

                                }
                            }
                        }
                    )
                    .always(function () {
                        $form.hideLoading();
                    });
            },
            onAllAlways: function () {
                $form.hideLoading();
            },
            onError: function (errors, index) {
                that.renderFileError(index, errors);
            }
        });


        setTimeout(function() {
            var is_exist = $.contains(document, $form[0]);
            if (is_exist) {
                $form.hideLoading();
            }
        }, 30 * 1000);
    };

    // Create
    TaskEdit.prototype.updateTask = function( $form ) {
        var that = this,
            url = $form.attr("action"),
            dataArray = $form.serializeArray();
        dataArray.push({
            name: 'files_hash',
            value: that.files_hash
        });
        return $.post(url, dataArray);
    };

    // Upload
    TaskEdit.prototype.uploadFiles = function(callbacks) {
        var that = this,
            url = "?module=attachments&action=upload",
            hash = that.files_hash,
            files = that.attachedFiles;

        callbacks = $.isPlainObject(callbacks) ? callbacks : {};
        var onAllDone = typeof callbacks.onAllDone === 'function' ? callbacks.onAllDone : null,
            onAllAlways = typeof callbacks.onAllAlways === 'function' ? callbacks.onAllAlways : null,
            onError = typeof callbacks.onError === 'function' ? callbacks.onError : null;

        if (that.files_count <= 0) {
            onAllAlways && onAllAlways();
            onAllDone && onAllDone();
            return;
        }

        var all_files_counter = that.files_count;

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
                            onError && onError(r.errors, index, file);
                        }
                        return;
                    }

                    that.loaded_files_count++;
                    if (that.loaded_files_count === that.files_count) {
                        onAllDone && onAllDone();
                    }
                }
            });
        });

    };

    TaskEdit.prototype.renderFileError = function (index, errors) {
        if ($.isEmptyObject(errors)) {
            return;
        }
        var that = this,
            $wrapper = that.$attachWrapper,
            $items = $wrapper.find('.t-file-item,.t-image-item'),
            $item = $items.not('.is-template').not('[data-file-ident]').eq(index),
            $error_block = $item.find('.t-file-error');
        $error_block.show();
        $.each(errors, function (i, error) {
            var $error = $('<em class="errormsg"></em>').text(error);
            $error_block.append($error);
        });
    };

    TaskEdit.prototype.clearFileErrors = function () {
        this.$attachWrapper.find('.t-file-error').hide().empty();
    };


    /**
     * Handler need to determine whether we are on the page being edited / created task
     * Used by Tasks.js on Drag & Drop
     * return boolean;
     * */
    TaskEdit.prototype.isExist = function() {
        var that = this,
            is_exist = !!( $(document).find(that.$task).length );

        // Clear self
        if (!is_exist) {
            delete window['taskEdit'];
            that = null;
        }

        return is_exist;
    };

    TaskEdit.prototype.toggleMoreFields = function() {
        var that = this;
        that.$fields.toggleClass(that.show_class);
    };

    return TaskEdit;

})(jQuery);
