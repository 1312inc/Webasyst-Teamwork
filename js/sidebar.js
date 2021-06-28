var TasksSidebar = (function ($) {

    var ElasticBlock = ( function() {

        ElasticBlock = function(options) {
            var that = this;

            // DOM
            that.$window = $(window);
            that.$wrapper = options["$wrapper"];
            that.$block = options["$block"];
            that.$content = options["$content"];

            // VARS
            that.top_fix_class = "fixed-to-top";
            that.bottom_fix_class = "fixed-to-bottom";

            // DYNAMIC VARS
            that.debug = false;

            // INIT
            that.initClass();
        };

        ElasticBlock.prototype.log = function( string ) {
            var that = this;
            if (that.debug) {
                console.log( string );
            }
        };

        ElasticBlock.prototype.initClass = function() {
            var that = this;

            // Class names
            var top_fix_class = that.top_fix_class,
                bottom_fix_class = that.bottom_fix_class;

            // DOM
            var $window = that.$window,
                $wrapper = that.$wrapper,
                $block = that.$block;

            // VARS
            var display_width = Math.floor( $window.width() ),
                display_height = Math.floor( $window.height() ),
                block_top = $block.offset().top,
                wrapper_margin_top = 0,
                set_force = true;

            // DYNAMIC VARS
            var is_top_set = false,
                is_fixed_to_bottom = false,
                is_fixed_to_top = false,
                is_fixed_top_set = false,
                scroll_value = 0,
                content_height,
                block_width;

            $window
                .on("scroll", setScrollWatcher)
                .on("resize", setResizeWatcher);

            function setScrollWatcher() {
                if ($.contains(document, $block[0])) {
                    onScroll();
                } else {
                    unsetScrollWatcher();
                }
            }

            function setResizeWatcher() {
                if ($.contains(document, $block[0])) {
                    onResize();
                } else {
                    unsetResizeWatcher();
                }
            }

            function unsetScrollWatcher() {
                $window.off("scroll", setScrollWatcher);
            }

            function unsetResizeWatcher() {
                $window.off("scroll", setResizeWatcher);
            }

            function setTop( top ) {
                that.log("Manual top scroll position");

                $block
                    .css("top", top)
                    .width(block_width)
                    .removeClass(top_fix_class)
                    .removeClass(bottom_fix_class);

                is_top_set = true;
                is_fixed_to_top = is_fixed_to_bottom = is_fixed_top_set = false;
            }

            function setFixTop( top ) {
                that.log("Fixed to top scroll position");

                $block
                    .removeAttr("style")
                    .width(block_width)
                    .removeClass(bottom_fix_class)
                    .addClass(top_fix_class);

                if (top) {
                    is_fixed_top_set = true;
                    $block.css("top", top);
                }

                is_top_set = is_fixed_to_bottom = false;
                is_fixed_to_top = true;
            }

            function setFixBottom() {
                that.log("Fixed to bottom scroll position");

                $block
                    .removeAttr("style")
                    .width(block_width)
                    .removeClass(top_fix_class)
                    .addClass(bottom_fix_class);

                is_top_set = is_fixed_to_top = is_fixed_top_set = false;
                is_fixed_to_bottom = true;
            }

            function setDefault() {
                that.log("Default scroll position");

                $block
                    .removeAttr("style")
                    .removeClass(bottom_fix_class)
                    .removeClass(top_fix_class);

                is_top_set = is_fixed_to_top = is_fixed_to_bottom = is_fixed_top_set = false;
            }

            function onScroll() {
                var content_height = Math.floor( that.$content.outerHeight() ),
                    block_height = Math.floor( $block.outerHeight() ),
                    wrapper_height = Math.floor( $wrapper.height() ),
                    scroll_top = $window.scrollTop(),
                    dynamic_block_top = Math.floor( $block.offset().top ),
                    direction = ( scroll_value > scroll_top ) ? 1 : -1,
                    delta = scroll_top - block_top,
                    min_width = 760;

                block_width = $block.width();

                var active_scroll = ( !set_force && wrapper_height > display_height && display_width >= min_width && !(content_height && content_height < block_height));

                if (!active_scroll) {
                    if (set_force) {
                        setForceTop(scroll_top, block_height);
                    } else {
                        setDefault();
                    }
                } else {

                    var is_display_longer_block = ( display_height > block_height + wrapper_margin_top ),
                        is_above_block = (scroll_top <= block_top),
                        my_case = parseInt(dynamic_block_top + block_height - scroll_top - display_height),
                        is_middle_of_block = ( my_case > 0 ),
                        is_bottom_of_block = ( my_case <= 0 );

                    // If the height of the slider is smaller than the display, it's simple
                    if (is_display_longer_block) {

                        if (delta + wrapper_margin_top > 0) {
                            if (is_top_set || is_fixed_to_bottom || !is_fixed_to_top) {
                                setFixTop( wrapper_margin_top );
                            }
                        } else {
                            if (is_top_set || is_fixed_to_top || is_fixed_to_bottom || is_fixed_top_set) {
                                setDefault();
                            }
                        }

                        // If the height is larger than the screen
                    } else {

                        // If less than the original position to turn off
                        if (is_above_block) {
                            // that.log( 0 );
                            if (is_top_set || is_fixed_to_bottom || is_fixed_to_top) {
                                if (is_fixed_top_set) {
                                    var use_default = (dynamic_block_top <= block_top);
                                    if (use_default) {
                                        setDefault();
                                    }
                                } else {
                                    setDefault();
                                }
                            }

                            // If the above start after scrolling fix up
                        } else if (is_middle_of_block) {

                            if (direction > 0) {
                                var set_fix_top = (dynamic_block_top >= (wrapper_margin_top + scroll_top) );
                                if (set_fix_top && ( is_top_set || !is_fixed_to_top || is_fixed_to_bottom ) ) {
                                    if (wrapper_margin_top) {
                                        setFixTop( wrapper_margin_top );
                                    } else {
                                        setFixTop();
                                    }
                                }
                            } else {
                                if (!is_top_set || is_fixed_to_top || is_fixed_to_bottom) {
                                    setTop( dynamic_block_top - block_top );
                                }
                            }

                            // If the lower end
                        } else if (is_bottom_of_block) {
                            // If the direction of scrolling up
                            if (direction > 0) {
                                if (!is_top_set || is_fixed_to_top || is_fixed_to_bottom) {
                                    setTop( dynamic_block_top - block_top );
                                }

                                // If the direction of scrolling down
                            } else {
                                if (is_top_set || is_fixed_to_top || !is_fixed_to_bottom) {
                                    setFixBottom();
                                }
                            }
                            // In all other cases
                        } else {
                            if (!is_top_set || is_fixed_to_top || is_fixed_to_bottom) {
                                setTop( dynamic_block_top - block_top );
                            }
                        }

                    }
                }

                // Save New Data
                scroll_value = scroll_top;
            }

            function setForceTop(scroll_top, block_height) {
                var wrapper_height = Math.floor( $wrapper.height() ),
                    wrapper_top = Math.floor( $wrapper.offset().top ),
                    space_after = wrapper_height + wrapper_top - display_height - scroll_top,
                    hidden_block_part = block_height - display_height;

                set_force = false;

                var use_force = ( wrapper_height > block_height && scroll_top > block_top);

                if (use_force) {
                    if (hidden_block_part < space_after) {
                        setFixTop( wrapper_margin_top );
                    } else {
                        setFixBottom();
                    }
                }
            }

            function onResize() {
                display_width = Math.floor( $window.width() );
                display_height = Math.floor( $window.height() );
                setDefault();
                $window.trigger("scroll");
            }
        };

        return ElasticBlock;

    })();

    //

    TasksSidebar = function (options) {
        var that = this;

        // DOM
        that.$wrapper = options["$wrapper"];

        // VARS

        // DYNAMIC VARS

        // INIT
        /* version 2 tweak start */
        // that.initElasticBlock();
        /* version 2 tweak end */
        that.initClass();
    };

    TasksSidebar.prototype.initClass = function () {
        var that = this,
            $search_input = that.$wrapper.find("#t-search-input"),
            $search_submit = that.$wrapper.find(".js-search-submit");

        // Global search box
        $search_input.on('keyup', function(e) {
            if ((e.which == 10 || e.which == 13)) {
                that.showSearchContent( $(this).val() );
                return false;
            }
        });

        // Search on icon click
        $search_submit.on('click', function() {
            that.showSearchContent( $search_input.val() );
        });

        that.initSidebarTagsAutocomplete();
        that.initCollapsible();
    };

    TasksSidebar.prototype.initSidebarTagsAutocomplete =  function() {
        var that = this,
            $wrapper = that.$wrapper;

        $wrapper.find('#js-t-sidebar-tags-autocomplete').autocomplete({
            source: '?module=tags&action=autocomplete',
            minLength: 1,
            delay: 300,
            select: function (event, ui) {
                $.wa.setHash('tasks/tag/'+ui.item.label);
                return false;
            }
        });
    };

    TasksSidebar.prototype.initElasticBlock = function() {
        var that = this;

        // Init elastic block
        $(document).ready( function() {
            new ElasticBlock({
                $wrapper: $("#wa-app"),
                $block: $("#t-sidebar"),
                $content: $("#content")
            });

            var $window = $(window);
            if ( $window.scrollTop() > 0 ) {
                $window.trigger("scroll");
            }
        });
    };

    TasksSidebar.prototype.showSearchContent = function( value ) {
        var that = this;

        that.$wrapper.find(".selected").removeClass("selected");

        var new_hash;
        $(window).one("wa_loaded", function() {
            if ($.tasks.cleanHash() != new_hash) {
                return; // too late
            }
            var new_value = $('<div>').text(value).html(),
                $tasks = $(".t-task-outer-container");

            $tasks.find(".t-task-name-wrapper").replaceText(value, "<span class=\"highlighted\">" + new_value + "</span>");
            $tasks.find(".t-description-wrapper").replaceText(value, "<span class=\"highlighted\">" + new_value + "</span>");
            $tasks.find(".t-comment-content").replaceText(value, "<span class=\"highlighted\">" + new_value + "</span>");
        });
        
        if (value.charAt(0) === '#') {
            new_hash = $.tasks.cleanHash('#/tasks/tag/' + encodeURIComponent(value.replace(/#/g, '')) + '/');
        } else {
            var hash = $.tasks.cleanHash();
            var collection_hash = 'search/' + encodeURIComponent(value.replace(/&/g, ''));
            if (hash.indexOf('&hash=search/') < 0) {
                new_hash = $.tasks.cleanHash('#/tasks/' + collection_hash);
            } else {
                new_hash = $.tasks.cleanHash(hash.replace(/&hash=search\/.*/, '&hash=' + collection_hash));
            }
        }
        $.wa.setHash(new_hash);
    };

    TasksSidebar.prototype.initCollapsible = function () {
        var that = this,
            $collapsibles = that.$wrapper.find('.collapsible');

        var storage = {
            get: function (k) {
                if (window.localStorage) {
                    return window.localStorage.getItem(k);
                } else {
                    return undefined;
                }
            },
            set: function (k, v) {
                window.localStorage && window.localStorage.setItem(k, v);
            },
            del: function (k) {
                window.localStorage && window.localStorage.removeItem(k);
            }
        };

        var buildKey = function (type) {
            return 'collapsible-' + type;
        };

        $.each($collapsibles, function (i, el) {
            var $toggler = $(el).find('.heading > span'),
                $content = $(el).find('.collapsible__content'),
                key = buildKey($(el).data('type'));

            if (storage.get(key)) {
                $content.hide();
                $toggler.addClass('collapsed');
            }

            if ($toggler) {
                $toggler.on('click', function (e) {
                    e.preventDefault();
                    $toggler.toggleClass('collapsed');
                    $content.slideToggle(300);
                    if (storage.get(key)) {
                        storage.del(key);
                    } else {
                        storage.set(key, '1');
                    }
                });
            }
        });

    }

    return TasksSidebar;

})(jQuery);
