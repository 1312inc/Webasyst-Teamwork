/*
 * tasks.js
 * Main $.tasks controller for everything URL-hash-dispatch related.
 * ALso responsible for global initialization of the app, see init().
 */
(function () { "use strict";

    // Used to be a jQuery Store plugin
    var storage = {
        get: function(k) {
            if (window.localStorage) {
                return window.localStorage.getItem(k);
            } else {
                return undefined;
            }
        },
        set: function(k, v) {
            window.localStorage && window.localStorage.setItem(k, v);
        },
        del: function(k) {
            window.localStorage && window.localStorage.removeItem(k);
        }
    };

    // js controller
    var $, self = window.TasksController = {
        options: { // see Backend.html for init options
            contact_id: 0,
            accountName: '',
            priorities: {}
        },

        initBeforeJQuery: function(options) {
            options = options || {};
            for(var k in options) {
                if (options.hasOwnProperty(k)) {
                    this.options[k] = options[k];
                }
            }

            // Initial page dispatch
            this.setHash(self.cleanHash(window.location.hash) /*|| storage.get('tasks/hash')*/ || '#/tasks/inbox/');
            self.dispatch();
        },

        // init js controller
        init: function () {

            $ = window.jQuery;
            $.storage = storage; // backwards compatibility
            $.tasks = this;

            // Set up AJAX error handler
            $.wa.errorHandler = function () { };
            $(document).ajaxError(function(e, xhr, settings, exception) {
                // Ignore 502 error in background process
                if (xhr.status === 502 && exception == 'abort' || (settings.url && settings.url.indexOf('background_process') >= 0) || (settings.data && settings.data.indexOf('background_process') >= 0)) {
                    console && console.log && console.log('Notice: XHR failed on load: '+ settings.url);
                    return;
                }

                console && console.log("XHR error:", exception, xhr);

                // Never save pages causing an error as last hashes
                storage.del('tasks/hash');
                //self.forceHash('');

                if (settings.suppressErrors) {
                    return;
                }

                // Show error in a nice safe iframe
                if (xhr.responseText) {
                    var iframe = $('<iframe src="about:blank" style="width:100%;height:auto;min-height:500px;"></iframe>');
                    $("#content").empty().append(iframe);
                    var ifrm = (iframe[0].contentWindow) ? iframe[0].contentWindow : (iframe[0].contentDocument.document) ? iframe[0].contentDocument.document : iframe[0].contentDocument;
                    ifrm.document.open();
                    ifrm.document.write(xhr.responseText);
                    ifrm.document.close();

                    // Close all existing dialogs
                    $('.dialog:visible').trigger('close').remove();
                }
            });

            // Dispatch when URL hash changes
            $(window).bind('hashchange', function() {
                self.dispatch();
            });
            $(window).bind('wa_dispatched', function () {
                // Highlight current item in sidebar, if exists
                self.highlightSidebar();
                var $inner_sidebar = $('#content .sidebar');
                if ($inner_sidebar.length) {
                    self.highlightSidebar($inner_sidebar)
                }

                // Remove all non-persistent dialogs
                $('.dialog:not(.persistent),.t-dialog-wrapper:not(.persistent)').empty().remove();
            });

            // Reload sidebar every once in a while
            self.sidebar_reloader && clearInterval(self.sidebar_reloader);
            self.sidebar_reloader = setInterval(function() {
                self.reloadSidebar();
            }, 300000);

            // development hotkeys for redispatch
            $(document).keypress(function (e) {
                if ((e.which == 10 || e.which == 13)) {
                    if (e.shiftKey) {
                        self.reloadSidebar();
                    } else if (e.ctrlKey) {
                        //self.redispatch();
                    }
                }
            });

            $(function() {
                // Collapsible sections in sidebar
                self.initSidebar();

                // Highlight active item in outer left sidebar when DOM is ready
                self.highlightSidebar();

                self.initFilesDrop();

                // When user clicks on app icon in main menu, he probably wants to see all tasks without filtering
                // $('#wa-app-tasks a')[0].href += '#/tasks/';
            });

            $.fn.showLoading = function() {
                self.showLoading(this);
            };
            $.fn.hideLoading = function() {
                self.hideLoading(this);
            };

            self.initTaskDateUpdater();
            self.initCustomSelect();

            return self;
        },

        // Setter custom select data ( .dropdown )
        initCustomSelect: function() {

            var setCustomSelect = function() {
                var $link = $(this),
                    value = ( $link.data("value") || "" ),
                    $customSelect = $link.closest(".t-custom-select"),
                    $activeLink = $customSelect.find(".selected-custom-item"),
                    $menuV = $link.closest(".menu-v"),
                    $input = $customSelect.find("input:hidden"),
                    old_value = $input.val(),
                    is_changed = ( old_value != value );

                // Custom event that allows to cancel the change
                var e = $.Event('onClick');
                $customSelect.trigger(e, [$link, value, old_value]);
                if (e.isDefaultPrevented()) {
                    is_changed = false;
                    value = old_value;
                }

                // hide effect
                $menuV.hide();

                setTimeout( function() {
                    $menuV.removeAttr("style");
                }, 100);

                // If non changed
                if (is_changed) {
                    // Render
                    $activeLink.html( $link.html() );

                    // set value
                    $input.val(value).change();

                    // Custom event
                    $customSelect.trigger("onChange", [$link, value]);
                }

            };

            $(document).on("click", ".t-custom-select .set-custom-select", setCustomSelect);

        },

        // Keep last update datetime of tasks up to date ('14 mins' => '15 mins')
        initTaskDateUpdater: function() {
            setInterval(function() {
                $.each(window.Tasks || {}, function() {
                    this.maybeUpdateTimeCounter && this.maybeUpdateTimeCounter();
                });
            }, 10000);
        },

        initFilesDrop: function() {
            var $document = $(document),
                $wa = $("#wa"),
                hover_class = "file-hover",
                timeout = null,
                drop_area_timer = null,
                is_hover = false,
                is_single_task_page = false,
                is_inside_drag_element;

            $document
                .on("dragstart", onDragStart)
                .on("dragend", onDragEnd)
                .on("drop", onDrop)
                .on("dragover", onDragOver)
                .on("dragover", ".t-attach-droparea", function() {
                    onDragOverDropZone( $(this) );
                });

            function onDragStart() {
                is_inside_drag_element = true;
            }

            function onDragEnd() {
                is_inside_drag_element = false;
                is_single_task_page = false;
            }

            function onDragOver(event) {
                var $taskWrapper = ( isSingleTask() || isEditTask() ),
                    openedTasks = checkTaskIsOpen();

                if (!is_inside_drag_element && !openedTasks) {
                    is_single_task_page = ( $taskWrapper );

                    if (!timeout)  {
                        if (!is_hover) {
                            if (!is_single_task_page) {
                                $wa.addClass(hover_class);
                            }
                            is_hover = true;
                        }
                    } else {
                        clearTimeout(timeout);
                    }
                    timeout = setTimeout(function () {
                        // Render
                        if (!is_single_task_page) {
                            $wa.removeClass(hover_class);
                        }

                        // Save data
                        timeout = null;
                        is_hover = false;

                        //
                        onDragEnd()
                    }, 100);
                }
                event.preventDefault();
                return false;
            }

            function onDrop(event) {
                var taskEdit = getTaskEdit(),
                    is_exist = (taskEdit) ? taskEdit.isExist() : false,
                    files = event.originalEvent.dataTransfer.files,
                    openedTasks = checkTaskIsOpen();

                if ( !(files && files.length) ) {
                    return false;
                }

                if (!is_single_task_page && !openedTasks) {
                    // DETECT TASK EDIT PAGE
                    if (is_exist) {
                        setAttachFiles(files, taskEdit);

                        // load create_task page, and attach files
                    } else {
                        // Show page
                        self.showNewTaskForm();
                        // After init page
                        $(document).on("onTaskEditInit", function (e, taskEdit) {
                            setAttachFiles(files, taskEdit);
                        });
                    }
                }

                return false;
            }

            function setAttachFiles( files, taskEdit) {
                // Run
                taskEdit.onDrop( files );

                // Unset
                $(document).off("onTaskEditInit");
            }

            function getTaskEdit() {
                return ( window.hasOwnProperty('taskEdit') ) ? window['taskEdit'] : false
            }

            function isSingleTask() {
                var $tasks = $(".t-tasks-wrapper"),
                    single_class = "t-single-task-wrapper";

                return ($tasks.length == 1 && $tasks.hasClass(single_class)) ? $tasks : false;
            }

            function isEditTask() {
                var $editTask = $(".t-task-page-wrapper.is-single-page");

                return ($editTask.length == 1) ? $editTask : false;
            }

            function onDragOverDropZone( $dropArea ) {
                if (!drop_area_timer)  {
                    $dropArea.addClass(hover_class);
                } else {
                    clearTimeout(drop_area_timer);
                }

                drop_area_timer = setTimeout(function () {
                    $dropArea.removeClass(hover_class);

                    // Save data
                    drop_area_timer = false;
                }, 100);
            }

            function checkTaskIsOpen() {
                var result = [];

                $.each(Tasks, function(task_id, task) {
                    if (task.is_opened || task.is_status_opened) {
                        result.push(task);
                    }
                });

                return (result.length) ? result : false;
            }

        },

        // Change location hash without triggering dispatch
        forceHash: function (hash) {
            hash = self.cleanHash(hash);
            if (self.currentHash !== hash) {
                self.currentHash = hash;
                self.setHash(hash);
            }
        },

        // history.back() without triggering dispatch. Run callback when hash changes.
        // Used to go back after deletion so that we won't end up in non-existing page.
        backWithoutDispatch: function (callback) {
            callback && $(window).one('hashchange', function() {
                callback();
            });

            this.skipDispatch = 1;
            history.back();
        },

        // Dispatch again based on current hash
        redispatch: function (wa_loaded_callback) {
            this.currentHash = null;
            if (typeof wa_loaded_callback == 'function') {
                $(window).one('wa_loaded', wa_loaded_callback);
            }
            this.dispatch();
        },

        // if this is > 0 then this.dispatch() decrements it and ignores a call
        skipDispatch: 0,

        // last hash processed by this.dispatch()
        currentHash: null,

        cleanHash: function (hash) {
            if (typeof hash == 'undefined') {
                hash = window.location.hash.toString();
            }

            if (!hash.length) {
                hash = '' + hash;
            }
            while (hash.length > 0 && hash[hash.length - 1] === '/') {
                hash = hash.substr(0, hash.length - 1);
            }
            hash += '/';

            if (hash[0] != '#') {
                if (hash[0] != '/') {
                    hash = '/' + hash;
                }
                hash = '#' + hash;
            } else if (hash[1] && hash[1] != '/') {
                hash = '#/' + hash.substr(1);
            }

            if (hash == '#/') {
                return '';
            }

            return hash;
        },

        setHash: function(hash) {
            if($ && $.wa && $.wa.setHash) {
                $.wa.setHash(hash);
            } else {
                while(hash && hash[0] == '#') {
                    hash = hash.substr(1);
                }
                window.location.hash = hash; // in case jQuery is not loaded yet
            }
        },

        // useful for dynamic recovery, when action is temporary is not implemented yet
        // for example some plugin Action may be not loaded in this object
        // see this.panicRecovery method
        dispatchHistory: [],

        // dispatch call method by hash
        dispatch: function (hash) {
            if (this !== self) {
                return self.dispatch(hash);
            }

            // Someone politely asked to ignore this hashchange?
            if (self.skipDispatch > 0) {
                self.skipDispatch--;
                return false;
            }

            // Ignore if nothing changed
            hash = self.cleanHash(hash || undefined);
            if (self.currentHash == hash) {
                return;
            }

            var old_hash = self.currentHash;
            self.currentHash = hash;

            // Fire an event allowing to prevent navigation away from current hash
            if ($) {
                var e = new $.Event('wa_before_dispatched');
                $(window).trigger(e);
                if (e.isDefaultPrevented()) {
                    self.currentHash = old_hash;
                    self.setHash(old_hash);
                    return false;
                }
            }

            // Parse hash into array
            hash = (hash||'').replace(/^.*#\/?/, '').replace(/\/$/, '');
            hash = hash.split('/');
            if (!hash[0]) {
                hash = ['default'];
            }

            var ucfirst = function (str) {
                return str.substr(0, 1).toUpperCase() + str.substr(1);
            };

            var toCamelString = function (parts, func) {
                func = typeof func === 'function' ? func : null;
                return parts.map(function(part, index) {
                    if (index > 0) {
                        part = ucfirst(part);
                    }
                    if (func) {
                        part = func(part);
                    }
                    return part;
                }).join('');
            };

            // Dispatch based on the begining of hash
            var action_name = null,
                action_params = null;
            for (var i = 1; i <= hash.length; i++) {
                // Try to glue action name from hash[0...i] and see if it exists
                var candidate = toCamelString(hash.slice(0, i), function (part) {
                    return toCamelString(part.split('-'));
                });
                candidate += 'Action';
                if (typeof self[candidate] == 'function') {
                    action_params = hash.slice(i);
                    action_name = candidate;
                }
            }

            // history limit
            if (self.dispatchHistory.length >= 20) {
                self.dispatchHistory = self.dispatchHistory.slice(self.dispatchHistory.length / 2);
            }

            self.dispatchHistory.push({
                hash: self.currentHash,
                panic: !action_name
            });

            // When failed to dispatch, return everything back to normal
            if (!action_name) {
                window.console && console.log('Not implemented: ' + self.currentHash);
                self.currentHash = old_hash;
                self.setHash(old_hash || '#/');
                return;
            }

            // Run the action controller
            self.last_action = action_name;
            self.last_action_params = action_params;
            self[action_name].apply(self, action_params);
            storage.set('tasks/hash', self.currentHash);

            // Fire an event about successfull fispatch
            if ($) {
                var e;
                $(window).trigger(e = new $.Event('wa_dispatched'));
                if (!e.isDefaultPrevented()) {
                    $("html, body").animate({scrollTop: 0}, 200);
                }
            }
        },

        defaultAction: function() {
            $ && $('#wa-app > .t-sidebar-wrapper .selected').removeClass('selected');
            $('#wa-app > .t-sidebar-wrapper a[href="#/tasks/inbox/"]').parent().addClass('selected');
            storage.set('tasks/hash', '');
            this.tasksAction('inbox/');
        },

        pluginsAction: function (params) {
            if ($ && $('#wa-plugins-container').length) {
                $.plugins.dispatch(params);
            } else {
                this.load('?module=plugins');
            }
        },

        /**
         * Responsible for all task list views.
         * Parses hash for filters and other params to pass to PHP.
         */
        tasksAction: function() {
            var hash = [].slice.call(arguments).join('/');
            if (hash.indexOf('hash=') < 0) {
                hash = 'hash=' + hash;
            }

            var params = this.parseTasksHash(hash);

            if (params.view) {
                storage.set('tasks/list_view', params.view);
            } else {
                params.view = storage.get('tasks/list_view');
                if (!params.view) {
                    delete params.view;
                }
            }

            // Remember filters in inbox
            if (params.hash.substr(0, 5) == 'inbox') {
                if (params.filters) {
                    storage.set('tasks/inbox_filters', params.filters);
                } else {
                    params.filters = storage.get('tasks/inbox_filters')||'';
                    if (params.filters) {
                        var new_params = [];
                        for(var k in params) {
                            if (k != 'filters' && k != 'hash' && params.hasOwnProperty(k)) {
                                new_params.push(k+'='+encodeURIComponent(params[k]));
                            }
                        }
                        new_params.push.apply(new_params, params.filters.split('&'));
                        var new_hash = new_params.join('&');
                        new_hash += '&hash='+params.hash;
                        setTimeout(function() {
                            self.forceHash('#/tasks/'+new_hash);
                        }, 0);
                    }
                }
            }

            var params_str = [];
            for(var k in params) {
                if (params.hasOwnProperty(k)) {
                    params_str.push(k+'='+encodeURIComponent(params[k]||''));
                }
            }
            self.load('?module=tasks&' + params_str.join('&'), function() {
                if (params.hash.substr(0, 7) == 'search/') {
                    self.setTitle($_('Search') + ' ' + params.hash.substr(7));
                }
            });
        },

        /**
         * Recovering from panic for hash
         * If hash was dispatched (with no panic) callback onWasntPanic will be called
         * If hash wasn't dispatched (panic) onRecovery callback will be called
         * @param {RegExp}|{string} hash
         * [ @param {function} onRecovery ]
         * [ @param {function} onWasntPanic ]
         */
        panicRecovery: function (hash, onRecovery, onWasntPanic) {
            var item = this.dispatchHistory[this.dispatchHistory.length - 1];

            if (!item) {
                // wasn't panic for this hash
                onWasntPanic && onWasntPanic();
                return;
            }

            var match = false;
            if (hash instanceof RegExp) {
                match = !!(item.hash || '').match(hash);
            } else {
                match = item.hash === hash;
            }

            if (!match || !item.panic) {
                // wasn't panic for this hash
                onWasntPanic && onWasntPanic();
                return;
            }

            // stop previous action
            window.TasksController.load_protector = null;

            if (window.history) {
                window.history.pushState(null, null, item.hash);
            }
            onRecovery && onRecovery();

            this.dispatch(item.hash);

            return;
        },

        /***
         * trim function like in PHP
         * @url http://javascript.ru/php/trim
         * @param str
         * @param charlist
         */
        trim: function(str, charlist) {
            charlist = !charlist ? ' \\s\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
            var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
            return str.replace(re, '');
        },

        parseTasksHash: function (hash, parse_filters) {

            var that = this;

            var typecastValue = function (value) {
                var int = parseInt(value, 10);
                if (!isNaN(int)) {
                    return int;
                }
                if (typeof value === 'string') {
                    return that.trim(value) || '';
                }
                return '';
            };

            hash = (hash || '').replace('#/tasks/', '');
            hash = that.trim(hash, '/');

            if (hash.indexOf('hash=') < 0) {
                hash = 'hash='+hash;
            }

            var filters = [];
            var params = {};
            hash.split("&").forEach(function(part) {
                var item = part.split("=");
                if (item[0] == 'view' || item[0] == 'hash' || item[0] == 'order' || item[0] === 'list_id') {
                    params[item[0]] = typecastValue(item[1]);
                } else {
                    filters.push(part);
                }
            });

            if (parse_filters) {
                params.filters = {};
                var ops = new RegExp(/(\$=|\^=|\*=|==|!=|>=|<=|=|>|<)/);
                $.each(filters, function (index, expr) {
                    expr = expr.split(ops);
                    params.filters[expr[0]] = {
                        op: expr[1],
                        val: typecastValue(expr[2])
                    };
                });
            } else {
                params.filters = filters.join('&');
            }

            return params;

        },

        logAction: function(params) {
            this.load('?module=log&'+(params||''));
        },

        // Replace action parameter in list views (e.g. to set list view type)
        setListParam: function(name, value, ret) {
            var params;
            if (self.currentHash) {
                if (self.currentHash.substr(0, 8) != '#/tasks/') {
                    return;
                }
                var params = self.currentHash.substr(8);
            } else {
                params = '';
            }
            if (params.indexOf('hash=') < 0) {
                params = 'hash='+params;
            }
            params = self.replaceParam(params, name, value);
            params = params.replace(/^hash=/, '');
            var result = '#/tasks/'+params;
            !ret && self.setHash(result);
            return result;
        },

        // set name=value in a params string (e.g. a=b&c=d&e=11) and return new params string
        replaceParam: function(params, name, value) {
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            if (value == '') {
                params = params.replace(new RegExp(name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '=[^&]*', 'g'), '');
            } else if (params.indexOf(name+'=') < 0) {
                params = name+'='+value+'&'+params;
            } else {
                params = params.split('&').map(function(pair) {
                    if (pair.indexOf(name+'=') === 0) {
                        return name+'='+value;
                    } else {
                        return pair;
                    }
                }).join('&');
            }
            return params.replace(/&+/g, '&').replace(/^&|&$/g, '');
        },

        // Reversed $.param():
        // takes a param string (e.g. var1=value1&var2=value2) and converts it to an object { var1: value1, var2: value2 }
        deparam: function(str) {
            if (str) {
                try {
                    return JSON.parse('{"' + decodeURI(str).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                } catch (e) {
                    window.console && console.log('Unable to $.tasks.deparam() a string', str, e);
                }
            }

            return {};
        },

        addAction: function() {
            this.load('?module=tasks&action=edit', function () {

            });
        },

        taskAction: function(id, action) {
            this.load('?module=tasks&action=' + (action || 'info') + '&n=' + id, function () {

            });
        },

        settingsAction: function() {
            this.load('?module=settings', function () {

            });
        },

        personalSettingsAction: function () {
            this.load('?module=settingsPersonal', function () {

            });
        },

        settingsOrderingAction: function() {
            this.load('?module=settings&action=ordering');
        },

        settingsProjectAction: function(id) {
            this.load('?module=projects&action=edit&id='+id);
        },

        settingsScopeAction: function (id) {
            this.load('?module=milestones&action=edit&id=' + id);
        },

        settingsScopeAddAction: function () {
            this.load('?module=milestones&action=edit&id=new');
        },

        fromHelpdeskAction: function(request_id) {
            this.load('?module=from&action=helpdesk&id='+request_id);
        },

        fromHubAction: function(topic_id) {
            this.load('?module=from&action=hub&id='+topic_id);
        },

        /** Lazy loading for backend lists. Called from Tasks.html and Log.html */
        initLazyloader: function(o) {

            var $lazyloading_wrapper = o.lazyloading_wrapper;
            var $window = $(window), triggered = false;

            // When user clicks 'load more' link, fetch the next page
            $lazyloading_wrapper.on('click', '.click-to-load-more', function() {
                loadNextPage();
                return false;
            });

            // If lazyloading mode is enabled, when user scrolls close enough to $lazyloading_wrapper,
            // fetch the next page. This is done only once. The idea is that the page we're going to load
            // contains the same lazy-loading initialization and will take care of the rest.
            o.is_lazy && o.next_page_url && $window.onWhile(function() {
                return !triggered && $.contains(document, $lazyloading_wrapper[0]);
            }, 'scroll resize wa_try_lazyloading', function() {
                if (distanceBetweenBottoms($lazyloading_wrapper, $window) < 50) {
                    loadNextPage();
                }
            });

            // Check if lazyloading should be triggered immediately
            $window.trigger('wa_try_lazyloading');

            function loadNextPage() {
                triggered = true;
                $lazyloading_wrapper.find('.loading-indicator').show();
                $lazyloading_wrapper.find('.click-to-load-more').hide();
                $.get(o.next_page_url, function(r) {

                    // Remember all item ids on page
                    var item_exists = {};
                    if (o.item_id_data_attr) {
                        var $existing_items = $lazyloading_wrapper.siblings("[data-"+o.item_id_data_attr+"]");
                        $existing_items.each(function() {
                            item_exists[$(this).data(o.item_id_data_attr)] = 1;
                        });
                    }

                    // Add new items, skipping those already in the list for any reason
                    var $new_items = $('<div>').html(r).find(o.list_selector).children();
                    if (o.item_id_data_attr) {
                        $new_items = $new_items.filter(function() {
                            var item_id = $(this).data(o.item_id_data_attr);
                            return !item_id || !item_exists[item_id];
                        });
                    }
                    $lazyloading_wrapper.replaceWith($new_items);
                });
            }

            // Helper to calculate how close user scrolled to the bottom of the list
            function distanceBetweenBottoms(container, win, offset) {
                return (container.position().top + container.outerHeight() - (offset || 0)) - (win.scrollTop() + win.height());
            }

        },

        // Add prettyprint
        initPrettyPrint: function() {
            if (typeof prettyPrint == 'function') {
                var n = $('.js-comments-list-wrapper').find('pre').addClass('prettyprint').length,
                    c = $('.js-quote-text').find('pre').addClass('prettyprint').length,
                    d = $('.js-description-wrapper').find('pre').addClass('prettyprint').length;

                (n || c || d) && prettyPrint()
            }
        },

        /**
         * Updater for task lists: when new tasks appear in current list view,
         * load them on the fly and add to list. Called from Tasks.html
         */
        initTasksUpdater: function(updater_url, delay) {

            delay = delay || 120000;
            updater_url = updater_url || $('#task-list-updater-script').data('updater-url');
            if (!updater_url || !delay) {
                window.console && console.log('Error setting up list updater');
                return;
            }

            self.list_updater_timeout && clearTimeout(self.list_updater_timeout);
            var timeout = self.list_updater_timeout = setTimeout(loadUpdatedTasks, delay);

            function loadUpdatedTasks() {
                if (isTooLate()) {
                    return;
                }
                $.get(updater_url, {}, function(r) {
                    if (isTooLate()) {
                        return;
                    }

                    // When initial list were empty, it is safe to simply replace the whole content
                    var $tasks_wrapper = $('#t-tasks-wrapper');
                    if (!$tasks_wrapper.length) {
                        $('#content').html(r);
                        return;
                    }

                    // Parse the resulting HTML and find tasks there, if any
                    var $result = $('<div>').html(r);
                    var $new_tasks = $result.find('#t-tasks-wrapper > .t-task-outer-container');
                    if (!$new_tasks.length) {
                        timeout = self.list_updater_timeout = setTimeout(loadUpdatedTasks, delay);
                        return;
                    }

                    var $existing_tasks = $tasks_wrapper.children("[data-task-id]");

                    // Prepend new tasks to page, skipping duplicates
                    var task_exists = {};
                    $existing_tasks.each(function() {
                        task_exists[$(this).data('task-id')] = 1;
                    });
                    $new_tasks.filter(function() {
                        return !task_exists[$(this).data('task-id')];
                    }).addClass('new-task highlighted added-by-updater').prependTo($tasks_wrapper);

                    // Mark existing tasks as updated if they are present on page
                    var task_updated = {};
                    $new_tasks.each(function() {
                        task_updated[$(this).data('task-id')] = 1;
                    });
                    $existing_tasks.filter(function() {
                        return task_updated[$(this).data('task-id')];
                    }).addClass('updated');

                    // Set up new updater
                    $('#task-list-updater-script').remove();
                    $result.find('#task-list-updater-script').appendTo('#content');
                }, 'html');
            }

            function isTooLate() {
                return (self.list_updater_timeout != timeout) || !document.getElementById('task-list-updater-script');
            }
        },

        initSidebar: function() {
            self.initCollapsibleSidebar();

            // Click on current tasks list link in sidebar reloads the list
            $('#wa-app > .sidebar a[href^="#/tasks/"]').on("click", function(e) {
                if (e.which != 1) {
                    return; // not a left-mouse-button click
                }
                var $a = $(this),
                    href = $a.attr('href'),
                    is_current_page_href = ( self.cleanHash(href) == self.currentHash );

                $('#wa-app > .sidebar .selected').removeClass('selected');
                $a.closest('li').addClass('selected');
                if (is_current_page_href) {
                    self.redispatch();
                    return false;
                }
            });

            // 'New task' button opens a slide-down dialog in list views
            $("#add-task-link").on("click", function(event) {
                if (event.which != 1) { return; } // not a left-mouse-button click
                self.showNewTaskForm();
                return false;
            });
        },

        // Flag for opening new task page. Need for showNewTaskForm()
        is_new_task_displayed: false,

        showNewTaskForm: function(force) {
            var $list = $("#t-tasks-wrapper"),
                is_list_view = ( $list.length && $list.hasClass("is-detailed") );

            if (is_list_view) {

                if (force || !self.is_new_task_displayed) {
                    self.is_new_task_displayed = true;

                    $.get("?module=tasks&action=edit", {
                        is_dialog: true
                    }, function(response) {
                        new Dialog({
                            html: response,
                            type: "create",
                            onCancel: function() {
                                self.is_new_task_displayed = false;
                            }
                        });
                    });
                }

            } else {
                var href = $("#add-task-link").attr("href");
                if (href) {
                    self.setHash(href);
                }
            }
        },

        showEditTaskForm: function(task, $link) {
            var $list = $("#t-tasks-wrapper"),
                is_list_view = ( $list.length && $list.hasClass("is-detailed") ),
                task_id = task.task_id;

            if (is_list_view) {

                if (!self.is_new_task_displayed) {
                    self.is_new_task_displayed = true;

                    $.get("?module=tasks&action=edit", {
                        is_dialog: true,
                        n: task_id
                    }, function(response) {
                        new Dialog({
                            html: response,
                            type: "edit",
                            task: task,
                            onCancel: function() {
                                self.initPrettyPrint();
                                self.is_new_task_displayed = false;
                            }
                        });
                    });
                }

            } else {
                var href = $link.attr("href");
                if (href) {
                    self.setHash(href);
                }
            }
        },

        initPrioritySlider: function($wrapper, active_index) {
            active_index = (active_index) ? active_index : 0;

            var $slider = $wrapper.find(".t-priority-slider"),
                $nameWrapper = $wrapper.find(".t-priority-text"),
                $input = $wrapper.find(".t-input"),
                active_class = "is-active",
                animate_class = "is-animated",
                active_color_class = "",
                priorities = $.tasks.options.priorities,
                priorities_length = Object.keys(priorities).length,
                period = (100 / (priorities_length - 1) );

            // DYNAMIC VARS
            var ornaments = [],
                $activeOrnament = false,
                active_ornament_index,
                start_slider_point,
                is_mouse_sliding = false;

            // Init slider
            $slider.slider({
                start: function(event, ui) {
                    $(ui.handle).addClass(animate_class);
                    is_mouse_sliding = true;
                },
                stop: function(event, ui) {
                    //$(ui.handle).removeClass(animate_class);
                    var data = {
                        name: $activeOrnament.data("name").toLowerCase(),
                        value: $activeOrnament.data("value")
                    };
                    $slider.trigger("onStopSliding", data);
                },
                slide: function(event, ui) {
                    setSlider( $(ui.handle), ui.value);
                    return false;
                },
                change: function(event, ui) {
                    if (!is_mouse_sliding) {
                        setSlider($(ui.handle), ui.value);
                    }
                    is_mouse_sliding = false;
                }
            });

            // Render Ornament
            renderOrnament();

            // Set Start Point
            $slider.slider("value", start_slider_point);

            function renderOrnament() {
                $.each(priorities, function(value, name) {
                    var left = ( parseInt(value) + 1 ) * period,
                        is_active = (value == active_index);

                    var $span = $("<span />")
                        .addClass("t-ornament")
                        .css("left", left + "%")
                        .attr("data-value", value)
                        .attr("data-name", name);

                    if (is_active) {
                        $span.data("selected", "true");
                        $span.addClass(active_class);
                        start_slider_point = left;
                        $activeOrnament = $span;
                    }

                    ornaments.push($span);

                    // Render
                    $slider.append($span);
                });
            }

            function setSlider($point, value) {
                // Left
                if (value <= period/2) {
                    active_ornament_index = 0;
                    // Right
                } else if (100 - (period/2) <= value) {
                    active_ornament_index = priorities_length - 1;

                    // Center
                } else {
                    active_ornament_index = ( (value % period) > (period/2) ) ? Math.ceil(value/period) : Math.floor(value/period);
                }

                if (active_color_class) {
                    $point.removeClass(active_color_class);
                    $nameWrapper.removeClass(active_color_class);
                }
                active_color_class = "color-" + (active_ornament_index + 1);

                // Render Ornament
                if ($activeOrnament) {
                    $activeOrnament.removeClass(active_class);
                }
                $.each(ornaments, function() {
                    var $ornament = $(this),
                        is_active = ( $ornament.data("value") == active_ornament_index - 1 );

                    if (is_active) {
                        $activeOrnament = $ornament;
                        return false
                    }
                });

                $activeOrnament.addClass(active_class);

                // Render Point
                $point
                    .addClass(active_color_class)
                    .css({
                        left: (active_ornament_index * period) + "%"
                    });

                // Render text
                $nameWrapper
                    .addClass(active_color_class)
                    .text($activeOrnament.data("name"));

                // Set data
                $input.val($activeOrnament.data("value"));
            }
        },

        initCollapsibleSidebar: function() {
            $('#wa-app > .sidebar .heading').filter(function() {
                return $(this).find('.darr').length;
            }).click(function() {
                // Collapse on click
                var $block = $(this).closest('.block').toggleClass('collapsed');
                var id = $block.attr('id');
                if (id) {
                    storage.set('tasks/collapse/'+id, $block.hasClass('collapsed') ? 1 : '');
                    //Update Sidebar scroll position
                    $(window).trigger("scroll");
                }
            }).each(function() {
                // Restore collapsed status on sidebar init
                var $block = $(this).closest('.block');
                var id = $block.attr('id');
                if (id && storage.get('tasks/collapse/'+id)) {
                    $block.addClass('collapsed');
                }
            });
        },

        reloadSidebar: function(callback) {
            //$('#add-task-link .icon16').attr('class', 'icon16 loading');
            $.post('?sidebar=1', function(r) {
                $('#wa-app > .sidebar').html(r);
                self.initSidebar();
                self.highlightSidebar();
                callback && callback();

                $(window).trigger("scroll");

            });
        },

        highlightMyList: function ($sidebar) {
            if (!$sidebar) {
                $sidebar = $('#wa-app > .sidebar');
            }
            var hash = self.cleanHash(location.hash),
                parsed = this.parseTasksHash(hash),
                $li = null;
            if (parsed.list_id > 0) {
                $li = $sidebar.find('.t-view-list > li[data-id="' + parsed.list_id + '"]');
                if ($li.length) {
                    $sidebar.find('.selected').removeClass('selected');
                    $li.addClass('selected');
                    return true;
                }
            }
        },

        updateCountOfMyList: function (list_id, count) {
            var $sidebar = $('#wa-app > .sidebar'),
                $li = $sidebar.find('.t-view-list > li[data-id="' + list_id + '"]');
            if ($li.length) {
                $li.find('.count').text(count);
                return true;
            }
        },

        /** Add .selected css class to li with <a> whose href attribute matches current hash.
         * If no such <a> found, then the first partial match is highlighted.
         * Hashes are compared after this.cleanHash() applied to them. */
        highlightSidebar: function (sidebar) {
            if (!sidebar) {
                sidebar = $('#wa-app > .sidebar');
            }

            // first, try select my list item
            if (this.highlightMyList(sidebar)) {
                return;
            }

            var currentHash = cleanFromListParams(self.cleanHash(location.hash));
            var $prev_selected = sidebar.find('.selected');

            // Shortcut if correct item is already selected
            if ($prev_selected.first().find('a').attr('href') == currentHash) {
                return;
            }

            var $match = false;
            var $partialMatch = false;
            var partialMatchLength = 2;

            sidebar.find('li a').each(function(k, v) {
                v = $(v);
                if (!v.attr('href')) {
                    return;
                }
                var h = self.cleanHash(v.attr('href'));

                // Perfect match?
                if (h == currentHash) {
                    if (isHighlightable(v)) {
                        $match = v;
                        return false;
                    } else {
                        return;
                    }
                }

                // Partial match? (e.g. for urls that differ in paging only)
                if (h.length > partialMatchLength && currentHash.substr(0, h.length) === h) {
                    if (isHighlightable(v)) {
                        $partialMatch = v;
                        partialMatchLength = h.length;
                    }
                }
            });

            $match = $match || $partialMatch;
            if ($match) {
                var p = $match.parent();
                while (p.length > 0 && p[0].tagName.toLowerCase() != 'li') {
                    p = p.parent();
                }

                if (p.length > 0) {
                    $prev_selected.removeClass('selected');
                    p.addClass('selected');
                }
            }

            function isHighlightable(v) {
                return v.closest('ul.dropdown,.show-on-hover').length <= 0;
            }

            function cleanFromListParams(hash) {
                var m = hash.match(/^#\/tasks\/.*hash=(.*)$/);
                if (m) {
                    return '#/tasks/'+m[1];
                } else {
                    return hash;
                }
            }
        },

        showLoading: function($form, options) {

            if ($form) {
                return showLoadingForm($form, options);
            } else {
                return showLoadingGlobal();
            }

            function showLoadingForm($form, options) {
                options = $.extend({
                    clear_validation: true,
                    no_double_submit: true,
                    loading: true
                }, options || {});

                if (options.no_double_submit || options.loading) {
                    var $submits = $form.find(':submit');
                    options.no_double_submit && $submits.prop({
                        disabled: true,
                        enable_back: true
                    });
                    options.loading && $submits.filter(':visible').last().parent().append(
                        '<i class="icon16 loading remove_later"></i>'
                    );
                }
                if (options.clear_validation) {
                    $form.find('.errormsg').remove();
                    $form.find('.error').removeClass('error');
                }

                return $form;
            }

            function showLoadingGlobal() {
                var $menu_wrapper = $('#content .t-header-wrapper .t-menu-wrapper');

                if ($menu_wrapper.length && $menu_wrapper.find('.loading').length <= 0) {
                    var active_class = "is-filters-shown",
                        is_filters_shown = $menu_wrapper.hasClass(active_class),
                        $preview = $menu_wrapper.find(".t-preview-wrapper"),
                        $filters = $menu_wrapper.find(".t-filters-wrapper"),
                        $loading = $('<div class="t-menu-item is-loading"><i class="icon16 loading"></i></div>');

                    if (is_filters_shown) {
                        $filters.append($loading);
                    } else {
                        $preview.append($loading)
                    }

                } else {
                    var $h1 = $('#content h1').first();
                    if ($h1.length) {
                        $h1.append('<i class="icon16 loading"></i>');
                    } else {
                        $('#content').html($('#content').data('loading-string')+'<i class="icon16 loading"></i>');
                    }
                }
            }
        },

        hideLoading: function($form) {
            $form.find(':submit').filter(function() {
                return this.enable_back;
            }).prop({
                disabled: false,
                enable_back: false
            });
            $form.find('.loading.remove_later').remove();
            return $form;
        },

        setTitle: function(title) {
            if (title instanceof jQuery) {
                var $content = title;
                var $h1 = $content.find("h1:first");
                title = '';
                if ($h1.length && $h1.closest('.t-tasks-wrapper:not(.t-single-task-wrapper)').length == 0) {
                    if ($h1.children().length) {
                        if ($h1.find('.title').length) {
                            title = $h1.find('.title').text();
                        } else {
                            title = $h1.contents()[0].textContent ? $h1.contents()[0].textContent : $h1.contents()[0].innerText;
                        }
                    } else {
                        title = $h1.text();
                    }
                } else {
                    title = $('#wa-app > .sidebar .selected a').text();
                }
            }

            document.title = (title ? title+' — ' : '') + self.options.accountName;
        },

        load: function (url, callback) {
            $ && this.showLoading();
            var load_protector = self.load_protector = Math.random();

            // Using plain XMLHttpRequest instead of jQuery wrapper
            // saves couple hundred ms on initial page load because
            // this way we don't have to wait for DOMContentLoaded event
            // (or even jquery lib) to start our initial request.
            // This is also the main reason tasks.js is not bundled and minified
            // with everything else.
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            request.onload = function() {
                ensureJquery(function() {
                    if (request.status >= 200 && request.status < 400) {
                        if (load_protector === self.load_protector) {
                            $(function() {
                                var $content = $("#content").empty();
                                var $div = $('<div></div>').html(request.responseText);
                                self.setTitle($div);
                                $content.append($div[0].childNodes);
                                try {
                                    callback && callback.call(this);
                                } catch (e) {
                                    window.console && console.log('Error in $.tasks.load() callback', e);
                                }
                                $(window).trigger($.Event('wa_loaded'));
                            });
                        }
                    } else {
                        $(document).trigger('ajaxError', [request, {}]);
                    }
                });
            };

            request.onerror = function() {
                ensureJquery(function() {
                    $(document).trigger('ajaxError', [request, {}]);
                });
            };

            request.send();

            function ensureJquery(fn) {
                if (window.jQuery) {
                    $ = window.jQuery;
                    fn();
                } else {
                    document.addEventListener('DOMContentLoaded', function() {
                        $ = window.jQuery;
                        fn();
                    });
                }
            }
        }
    };
})();
