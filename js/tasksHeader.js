/*
 * tasksHeader.js
 * JS logic for top panel above task list and single task pages.
 */
var TasksHeader = ( function($) {

    var storage = {
        shown_class: "is-shown",
        selected_class: "selected"
    };

    TasksHeader = function(options) {
        var that = this;

        options = options || {};

        // DOM
        that.$wrapper = $(".t-main-wrapper");
        that.$tasksWrapper = $("#t-tasks-wrapper");
        that.$header = that.$wrapper.find(".t-header-wrapper");
        that.$mainMenu = that.$header.find(".t-general-menu");
        that.$selectedMenu = that.$header.find(".t-selection-menu");
        that.$filters = that.$mainMenu.find(".t-tasks-filter"),
        that.$order_selector = that.$mainMenu.find(".t-order-selector"),
        that.$hash_filter = that.$mainMenu.find('.t-tasks-hash-type-filter');
        that.$tag_cloud_filter = that.$mainMenu.find('.t-tasks-tag-cloud-filter');

        // CONST
        that.messages = options.messages || {};
        that.total_count = options.total_count;
        that.is_single_page = that.$wrapper.find(".t-single-task-wrapper").length;
        that.is_in_my_list = options.is_in_my_list || false;
        
        // DYNAMIC VARS
        that.selectedTasks = {};
        that.selected_count = 0;

        // VAR


        // INIT
        that.initHeader();
    };

    var Header = TasksHeader.prototype;

    Header.initHeader = function() {
        var that = this;

        // Binds
        that.bindEvents();

        // Fix header menu at the top of window as long as at least one task is selected
        that.stickToTop( function() {
            return that.$selectedMenu.hasClass(storage.shown_class);
        });
        //
        that.initMultiSelections();
        //
        that.initHeaderPreview();
        //
        that.initTags();
        //
        that.initMultiPriorityChanger();

        that.initMultiDeadlineSetter();

        if (!that.is_single_page) {
            //
            that.initMyListToggle();
            //
            that.updateMyListCounter();
            //
            that.initAllFilters();
        }

        if (!that.is_in_my_list) {
           $('.t-preview-name').text(that.buildTitle());
        }

    };

    // Makes the header stick to the top of browser window when scrolled down,
    // as long as given callback keeps returning true.
    Header.stickToTop = function(keepSticky) {
        var that = this,
            $wrapper = that.$wrapper,
            $header = that.$header,
            headerOffset = $header.offset(),
            fixed_class = "is-fixed",
            is_active = false;

        var headerArea = {
            top: headerOffset.top,
            left: headerOffset.left,
            width: $header.outerWidth(),
            height: $header.outerHeight()
        };

        $(window).onWhile(isInDOM, "scroll resize", function() {
            if (!keepSticky()) {
                unstick();
                return;
            }

            // Update header fixed/static state
            var should_be_active = ( $(window).scrollTop() > headerArea.top );
            if (!is_active && should_be_active) {
                stick();
            } else if (is_active && !should_be_active) {
                unstick();
            }

            // Keep the sticky header 100% width
            if (is_active) {
                $header.width($wrapper.width());
            }
        }).trigger('scroll');

        // * * *

        function stick() {
            is_active = true;
            $wrapper.css("padding-top", headerArea.height);
            $header.addClass(fixed_class);
        }

        function unstick() {
            is_active = false;
            $wrapper.removeAttr("style");
            $header
                .removeAttr("style")
                .removeClass(fixed_class);
        }

        function isInDOM() {
            return $.contains(document, that.$selectedMenu[0]);
        }
    };

    Header.bindEvents = function() {
        var that = this,
            $selectedMenu = that.$selectedMenu;

        // Bulk actions with selected tasks
        $selectedMenu.on("click", ".t-delete-link", function() {
            that.deleteTasks();
            return false;
        });
        $selectedMenu.on("click", ".t-done-link", function() {
            that.doneTasks();
            return false;
        });
        $selectedMenu.on("click", ".t-forward-link", function() {
            that.forwardTasks();
            return false;
        });

        // Reset all filters
        that.$mainMenu.find('.t-remove-filters-link').click(function() {
            if (this.href && this.href.indexOf('inbox') >= 0) {
                $.storage.del('tasks/inbox_filters');
            }
        });
    };

    Header.buildTitle = function () {
        var that = this;
        var parts = [];
        that.$mainMenu.find(".js-header-title-participant").each(function () {
            var pageFilter = $(this).data('pageFilter');
            if (pageFilter && typeof pageFilter.getTitlePartForHeader === 'function') {
                parts.push(pageFilter.getTitlePartForHeader());
            }
        });

        parts = $.grep(parts, function(n) {
            return n || n === 0;
        });

        var title = parts.join(' / ');

        //add tasks count to title
        if (that.total_count > 0) {
            title += ' — ' + that.messages.tasks_count;
        } else {
            title += ' — ' + that.messages.no_tasks;
        }

        return title;
    };

    Header.initMyListToggle = function () {
        var that = this,
            $header = that.$header,
            $toggle = $header.find('.t-my-list-toggle');

        var showCreateDialog = function () {
            var $link = $(this),
                $icon = $link.find('.t-link-icon'),
                order = $link.data('order'),
                $loading = $link.find('.t-loading-icon');

            if ((location.hash || '').indexOf('list_id=') >= 0) {
                alert(that.messages['cant_create_list']);
                return;
            }

            $icon.hide();
            $loading.show();

            var hash = location.hash.replace('#/tasks/', ''),
                parsed = $.tasks.parseTasksHash(hash);
            
            var data = {
                hash_parsed: parsed,
                order: order,
                name: that.buildTitle()
            };

            $.post('?module=list&action=edit', data)
                .done(function (html) {
                    // clear old dialogs
                    $('.tasks-list-edit-dialog').remove();
                    // append new dialog
                    $('body').append(html);
                    //
                    new TaskListEdit({
                        '$wrapper': $('.tasks-list-edit-dialog'),
                        'callbacks': {
                            onDoneSubmit: function (r) {
                                $icon.removeClass('star-empty').addClass('star');
                                $link.data('id', r.data.view.id);
                                $link.prop('title', r.data.title);
                                $.tasks.reloadSidebar();
                            }
                        }
                    });
                })
                .always(function () {
                    $icon.show();
                    $loading.hide();
                });
        };

        var deleteView = function () {
            var $link = $(this),
                id = $link.data('id'),
                $icon = $link.find('.t-link-icon'),
                $loading = $link.find('.t-loading-icon');

            $icon.hide();
            $loading.show();

            $.post('?module=list&action=delete', { id: id })
                .done(function (r) {
                    $icon.removeClass('star').addClass('star-empty');
                    $link.data('id', null);
                    $link.prop('title', r.data.title);
                    $.tasks.reloadSidebar();
                })
                .always(function () {
                    $icon.show();
                    $loading.hide();
                });
        };

        $toggle.click(function (e) {
            if ($(this).data('id') > 0) {
                deleteView.call(this, e);
            } else {
                showCreateDialog.call(this, e);
            }
        });
    };

    Header.updateMyListCounter = function () {
        var that = this,
            total_count = that.total_count,
            current_hash = $.tasks.cleanHash(window.location.hash) || '#/tasks/',
            parsed = $.tasks.parseTasksHash(current_hash);
        if (parsed.list_id > 0 && total_count !== undefined) {
            $.tasks.updateCountOfMyList(parsed.list_id, total_count);
        }
    };

    // Init all filters in header of page
    Header.initAllFilters = function () {
        var that = this;
        
        var defaultInboxFilterReset = function () {
            var current_hash = $.tasks.cleanHash(window.location.hash) || '#/tasks/';
            if (current_hash.indexOf('inbox') >= 0) {
                $.storage.del('tasks/inbox_filters');
            }
        };

        that.$filters.each(function () {
            var $menu = $(this);
            new TasksFilterSelector($menu, {
                onSelect: defaultInboxFilterReset
            });
        });

        var $project = that.$filters.filter('[data-id="project_id"]'),
            $milestone = that.$filters.filter('[data-id="milestone_id"]');

        var updateMilestoneSelector = function (project_id) {
            var milestone_menu = $milestone.data('dropDownMenu');
            milestone_menu.eachOption(function (milestone_id, milestone) {
                if (!project_id || !milestone.project_id || milestone.project_id == project_id) {
                    milestone_menu.enableItem(milestone_id);
                } else {
                    milestone_menu.disableItem(milestone_id);
                }
            });
        };

        $project.data('dropDownMenu').onSelect(function (project_id) {
            updateMilestoneSelector(project_id);
        });
        updateMilestoneSelector($project.data('dropDownMenu').getSelected('value'));

        new TasksTagCloudFilterSelector(that.$tag_cloud_filter, {
            onSelect: defaultInboxFilterReset
        });

        // helper convert current hash in url to filter-param notation
        // Need for TasksHashFilterSelector
        var convert = function () {
            var $all_filters = $().add(that.$filters).add(that.$tag_cloud_filter);
            return function (context_hash) {
                var result = null;
                $all_filters.each(function () {
                    var pageFilter = $(this).data('pageFilter');
                    result = pageFilter.convert(context_hash);
                    if (result) {
                        return false;
                    }
                });
                return result;
            };
        }();

        // MUST BE CALLED AFTER that.$filters & $tag_cloud_filter initializing
        new TasksHashFilterSelector(that.$hash_filter, {
            convert: convert,
            onSelect: defaultInboxFilterReset
        });

        new TasksFilterSelector(that.$order_selector);

    };
    
    // Action with multiple tasks: done
    Header.doneTasks = function() {

        if (!confirm($_('Are you sure?'))) {
            return false;
        }

        var that = this;
        var task_ids = that.getSelectedTaskIds();
        $.post('?module=tasksBulk&action=done', { ids: task_ids }, function() {
            task_ids.forEach(function(id) {
                if (typeof Tasks == 'object' && Tasks[id]) {
                    var task = Tasks[id];
                    task.moveTask("right", function() {
                        task.removeTask();
                    });
                }
            });
            that.$selectedMenu.trigger("cancelSelection");
        });
    };

    // Action with multiple tasks: delete
    Header.deleteTasks = function() {

        if (!confirm($_('Are you sure?'))) {
            return false;
        }

        var that = this;
        var task_ids = that.getSelectedTaskIds();
        $.post('?module=tasks&action=delete', { id: task_ids }, function() {
            task_ids.forEach(function(id) {
                if (typeof Tasks == 'object' && Tasks[id]) {
                    var task = Tasks[id];
                    task.removeTask();
                }
            });
            that.$selectedMenu.trigger("cancelSelection");
        });

    };

    // Action with multiple tasks: forward
    Header.forwardTasks = function() {
        var that = this;
        var task_ids = that.getSelectedTaskIds();
        var title = $_('Forward (%d)').replace('%d', task_ids.length);
        $('#t-bulk-forward-dialog').empty().removeClass('dialog').waDialog({
            url: '?module=tasks&action=forward',
            title: title,
            onLoad: function(d) {
                var $dialog = $(this);
                var $content = $dialog.find('.dialog-content-indent');
                var $buttons = $dialog.find('.dialog-buttons-gradient').empty();
                var $form = $content.find('form');

                // Show dialog title
                $content.prepend($('<h1>').text(title));

                // Move buttons where appropriate
                $content.find('.t-hiddenform-cancel-link').closest('.value').children().appendTo($buttons);
                $content.find('.t-buttons-block').remove();

                // Add hidden ids to form
                task_ids.forEach(function(task_id) {
                    $form.prepend($.parseHTML('<input type="hidden" name="ids[]" value="'+task_id+'">'));
                });

                // Submit form when a button is clicked
                $buttons.find(':submit').click(function() {
                    $form.submit();
                });

                // Form submit via XHR
                $form.submit(function() {
                    $buttons.append('<i class="icon16 loading"></i>').find(':submit').prop('disabled', true);
                    $.post($form.attr('action'), $form.serialize(), function() {
                        $dialog.trigger('close');

                        // Animation removing tasks from the list
                        task_ids.forEach(function(id) {
                            if (typeof Tasks == 'object' && Tasks[id]) {
                                var task = Tasks[id];
                                task.moveTask("right", function() {
                                    task.removeTask();
                                });
                            }
                        });
                        that.$selectedMenu.trigger("cancelSelection");
                    });
                    return false;
                });

            }
        });

    };

    Header.getSelectedTaskIds = function() {
        return $('#t-tasks-wrapper .t-task-outer-container[data-task-id] .t-checkbox-item:checked').map(function() {
            return $(this).closest('[data-task-id]').data('task-id');
        }).get();
    };

    Header.initMultiSelections = function() {
        var that = this,
            $wrapper = that.$tasksWrapper,
            $checkAllInput = $("#check-all-tasks"),
            $lastSelectedTask = false; // DYNAMIC

        // When user selects or deselects tasks, show/hide a bulk actions menu
        $wrapper.on("click", ".t-checkbox-item", function(event) {
            onSelectTask(event, $(this));
        });

        $checkAllInput.on("click", function() {
            onSelectAll();
        });

        that.$selectedMenu.on("unSelectAll", function() {
            onSelectAll(false);
        });

        that.$selectedMenu.on("cancelSelection", function() {
            cancelSelection();
        });

        function getTasks() {
            return $wrapper.find(".t-task-outer-container");
        }

        function onSelectTask(event, $checkbox) {
            var is_shift_pressed = event.shiftKey,
                is_active = ( $checkbox.attr("checked") == "checked" ),
                $currentTask = $checkbox.closest(".t-task-outer-container"),
                $lastTask = ( $lastSelectedTask ) ? $lastSelectedTask : false;

            if (is_active && is_shift_pressed && $lastTask) {
                var $tasks = getTasks(),
                    do_selection = false;

                $tasks.each( function() {
                    var $task = $(this),
                        is_selected = $task.hasClass(storage.selected_class),
                        is_current = ($task[0] == $currentTask[0]),
                        is_last = ($task[0] == $lastTask[0]);

                    if (is_current || is_last) {
                        do_selection = !do_selection;

                        if (!is_selected) {
                            selectTask(is_active, $task);
                            $lastSelectedTask = $task;
                        }

                        // Stop after end
                        if (!do_selection) {
                            return false;
                        }
                    } else if (do_selection && !is_selected) {
                        $task.find(".t-checkbox-item").click();
                    }
                });

            } else {
                selectTask(is_active, $currentTask);
            }

            // Save data
            $lastSelectedTask = (is_active) ? $currentTask : false;

            // update the sticky/unsticky state of header, see stickToTop
            $(window).trigger('scroll');
        }

        function selectTask(is_active, $task) {
            var task_id = $task.data("task-id"),
                $selectedCounter = that.$selectedMenu.find(".counter");

            // Render
            if (is_active) {
                that.selected_count++;
                that.selectedTasks[task_id] = $task;

            } else {
                that.selected_count--;
                delete that.selectedTasks[task_id];
            }

            // Show menu
            if (that.selected_count > 0) {
                that.$mainMenu.removeClass(storage.shown_class);
                that.$selectedMenu.addClass(storage.shown_class);
                $selectedCounter.text("(" + that.selected_count + ")");

            } else {
                that.$selectedMenu.removeClass(storage.shown_class);
                that.$mainMenu.addClass(storage.shown_class);
                $selectedCounter.text("");
            }

            // Toggle selectAllInput
            var is_full_checked = (that.selected_count == getTasks().length);
            $checkAllInput.attr("checked", (is_full_checked) );
        }

        function onSelectAll(do_check_all ) {
            var $tasks = getTasks();

            do_check_all = (typeof do_check_all !== "undefined") ? do_check_all : ( $checkAllInput.attr("checked") == "checked" );

            // Set check-data to input at menu
            $checkAllInput.attr("checked", do_check_all );

            $tasks.each( function() {
                var $input = $(this).find(".t-checkbox-item"),
                    file_is_active = ( $input.attr("checked") == "checked");

                if (!file_is_active && do_check_all) {
                    $input.click();
                }
                if (file_is_active && !do_check_all) {
                    $input.click();
                }
            });
        }

        function cancelSelection() {
            // Render
            that.$selectedMenu.removeClass(storage.shown_class);
            that.$mainMenu.addClass(storage.shown_class);

            // Clear data
            that.selected_count = 0;
            that.selectedTasks = {};

            // update the sticky/unsticky state of header, see stickToTop
            $(window).trigger("scroll");
        }
    };

    Header.initHeaderPreview = function() {
        var header = this,
            $mainMenu = header.$mainMenu,
            $menu = $mainMenu.find(".t-menu-wrapper"),
            animate_class = "is-animated",
            active_sidebar_name,
            enter_timeout = 0,
            leave_timeout = 0,
            is_single_page = header.is_single_page,
            is_filters_set,
            that = this,
            is_entered = false;

        is_filters_set = checkIsFiltersSet();
        active_sidebar_name = getActiveSidebarName();

        if (is_single_page) {
            if(!that.is_in_my_list){
                showFilters(true);
            }

        } else {

            // Add animation class
            $menu.addClass(animate_class);

            setPreviewName(active_sidebar_name);

            $mainMenu.on("mouseenter", function() {
                showFilters(true);
                is_entered = true;
                return false;
            });

            $mainMenu.on("mousemove", function() {
                if (!is_entered) {
                    $mainMenu.trigger("mouseenter");
                }
            });

            $mainMenu.on("mouseleave", function() {
                showFilters(false);
                is_entered = false;
                return false;
            });

        }

        if (that.is_in_my_list){
            // Add animation class
            $menu.addClass(animate_class);

            $mainMenu.on("mouseenter", function() {
                showFilters(true);
                is_entered = true;
                return false;
            });

            $mainMenu.on("mousemove", function() {
                if (!is_entered) {
                    $mainMenu.trigger("mouseenter");
                }
            });

            $mainMenu.on("mouseleave", function() {
                showFilters(false);
                is_entered = false;
                return false;
            });
        }

        function checkIsFiltersSet() {
            var hash = location.hash;

            return hash.match("=");
        }

        function getActiveSidebarName() {
            var $selected = $(".t-sidebar-wrapper li.selected a");

            return ($selected.length) ? $selected.text() : false;
        }

        function showFilters(show) {
            var active_class = "is-filters-shown",
                lock_dropdown = "is-dropdown-locked",
                time = 400;

            if (enter_timeout) {
                clearTimeout(enter_timeout);
            }
            if (leave_timeout) {
                clearTimeout(leave_timeout);
            }

            if (show) {
                if (!$menu.hasClass(active_class)) {
                    $menu
                        .addClass(active_class)
                        .addClass(lock_dropdown);

                    enter_timeout = setTimeout( function() {
                        $menu.removeClass(lock_dropdown);
                    }, time);
                } else {
                    $menu.removeClass(lock_dropdown);
                }
            } else {
                leave_timeout = setTimeout( function() {
                    $menu.removeClass(active_class);
                }, time);
            }
        }

        function setPreviewName(text) {
            var $name = $menu.find(".t-preview-name");

            $name.text(text);
        }
    };

    Header.initTags = function() {
        var that = this,
            $tagsWrapper = that.$selectedMenu.find(".t-tags-dropdown"),
            $autocomplete = $tagsWrapper.find(".js-t-task-tags-autocomplete"),
            $add_tag_form = $tagsWrapper.find(".t-add-tag .t-submit"),
            add_tag_url = $add_tag_form.attr('action');

        // INIT TAG LINK
        $tagsWrapper.on("click", ".js-set-tag", function() {
            var $link = $(this),
                tag_id = $link.data("id"),
                tag_name = $link.text();
            setTags(tag_id, tag_name);
            return false;
        });

        // INIT ADD BUTTON
        $add_tag_form.submit(function(event) {
            event.preventDefault();

            var $val_input = $tagsWrapper.find(".t-input"),
                tag = $.trim($val_input.val());

            if (tag.length > 0) {
                createTag(add_tag_url, tag);
                $val_input.val("");
            }

        });

        // INIT AUTO-COMPLETE

        // First, handle 'keyup' - if tag not found and user tap "enter" need create new tag and bind to this task
        $autocomplete.on("keyup", function (event) {
            if (event.keyCode === 13) {
                createTag($(this).val());
                $(this).val('');
            }
        });

        // Second, call proper jquery ui component method
        $autocomplete.autocomplete({
            source: '?module=tags&action=autocomplete',
            minLength: 1,
            delay: 300,
            select: function (event, ui) {
                setTags(ui.item.id, ui.item.label);
                return false;
            }
        });

        // When focus on auto-complete input - than HOLD drop-down menu
        $autocomplete.on("focus", function() {
            $tagsWrapper.addClass(storage.shown_class);
        });

        // When focus is NOT on auto-complete input - than UNHOLD drop-down menu
        $autocomplete.on("blur", function() {
            $tagsWrapper.removeClass(storage.shown_class);
        });

        // HERE AND HOW ON TILL THE END OF METHOD - HELPER FUNCTIONS

        var setTags = function (tag_id, tag_name) {
            renderTags(tag_id, tag_name);
            var set_href = "?module=tags&action=set",
                set_data = getDataForSet(tag_id);
            $.post(set_href, set_data, function(response) {
                //console.log( response );
            });
        };

        var createTag = function(tag) {
            var create_data = getDataForCreate(tag);
            $.post(add_tag_url, create_data, function(response) {
                if (response && response.data) {
                    renderTags(response.data.id, response.data.name);
                }
            }, "json");
        };

        var renderTags = function(tag_id, tag_name) {
            var selectedTasks = that.selectedTasks;

            // TASK ID's
            $.each(selectedTasks, function(task_id) {
                if (Tasks.hasOwnProperty(task_id)) {
                    var task = Tasks[task_id];

                    task.renderTag(tag_id, tag_name);
                }
            });
        };

        var getDataForSet = function(tag_id) {
            var selectedTasks = that.selectedTasks,
                result = [];

            // TASK ID's
            $.each(selectedTasks, function(task_id) {
                result.push({
                    name: "task_id[]",
                    value: task_id
                })
            });

            // TAG ID
            result.push({
                name: "tag_id",
                value: tag_id
            });

            return result;
        };

        var getDataForCreate = function(tag_name) {
            var selectedTasks = that.selectedTasks,
                result = [];

            // TASK ID's
            $.each(selectedTasks, function(task_id) {
                result.push({
                    name: "task_id[]",
                    value: task_id
                })
            });

            // TAG ID
            result.push({
                name: "tag_name",
                value: tag_name
            });

            return result;
        };
    };

    Header.initMultiDeadlineSetter = function () {
        var that = this,
            $selectedMenu = that.$selectedMenu,
            $datepicker = null;

        var showDialog = function(options) {

            $.get('?module=tasks&action=deadlineSetDialog')
                .done(function (html) {
                    // remove all previous dialogs in DOM
                    $('.tasks-deadline-set-dialog').remove();
                    // append new dialog
                    $('body').append(html);
                    $('.tasks-deadline-set-dialog').waDialog(options || {});
                });
        };



        $selectedMenu.on('click', '.set-deadline-link', function (e) {
            e.preventDefault();
            showDialog({
                onLoad: function () {
                    var $dialog = $(this);
                    $datepicker = $dialog.find('.t-datepicker-wrapper');
                    $datepicker.datepicker({
                        changeYear: true,
                        changeMonth: true,
                        gotoCurrent: true,
                        constrainInput: true,
                        altFormat: 'yy-mm-dd'
                    });
                },
                onSubmit: function ($dialog) {
                    var $loading = $dialog.find('.t-loading'),
                        data = {
                            due_date: $.datepicker.formatDate('yy-mm-dd', $datepicker.datepicker('getDate')),
                            ids: that.getSelectedTaskIds()
                        };

                    $loading.show();
                    $.post('?module=tasksBulk&action=deadline', data)
                        .done(function () {
                            $dialog.trigger('close');
                            $.tasks.redispatch();
                        })
                        .always(function () {
                            $loading.hide();
                        });

                    return false;
                }
            });
        });

    };

    Header.initMultiPriorityChanger = function() {
        var that = this,
            $selectedMenu = that.$selectedMenu;

        $selectedMenu.on("click", ".set-priority-link", function() {
            showDialog();
            return false;
        });

        function showDialog() {

            // Destroy previous dialog just in case
            removeDialog();

            // Create a new dialog
            $('<div>').waDialog({
                width: '450px',
                height: '250px',
                url: '?module=tasks&action=priorityForm',
                onSubmit: function() {
                    return submitDialog($(this));
                },
                onLoad: function() {
                    var $dialog = $(this);

                    // Move buttons where appropriate
                    $dialog.find('.buttons-wrapper').appendTo( $dialog.find('.dialog-buttons-gradient') );

                    $.tasks.initPrioritySlider( $("#t-priority-multi-changer") );
                }
            });
        }

        function submitDialog($dialog) {

            $dialog.find('.dialog-buttons-gradient').append('<i class="icon16 loading"></i>');

            $.post('?module=tasksBulk&action=priority', {
                ids: that.getSelectedTaskIds(),
                priority: $dialog.find('[name="data[priority]"]').val()
            }, function(r) {
                removeDialog();
                $.tasks.redispatch();
            }, 'json');

            return false;
        }

        function removeDialog() {
            $('#t-priority-multi-changer').closest('.dialog').remove();
        }

    };

    return TasksHeader;

})(jQuery);
