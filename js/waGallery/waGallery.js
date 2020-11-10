/**
 * Webasyst Plugin for preview images
 * @author GolubevMark
 * @version 0.0.1
 * */

var waGallery = ( function($) {

    waGallery = function($links, options) {
        var that = this;

        if (!options) {
            options = {};
        }

        // SETTINGS
        that.settings = $.extend({
            start_time: 300,
            animate_time: 0,
            close_time: 0,
            zoom: 0,
            width: 600
        }, options);

        // DOM
        that.$links = $links;
        that.$body = $("body");

        // VARS
        that.storage = {
            animated: "is-animated",
            shown: "is-shown",
            invisible: "is-invisible",
            active: "is-active",
            body_active_class: "wa-gallery-is-shown"
        };

        // DYNAMIC VARS
        that.links = [];
        that.active_link_index = false;
        that.slider = {};
        that.$close = false;

        // INIT
        that.initGallery();
    };

    waGallery.prototype.initGallery = function() {
        var that = this;

        if (that.$links.length) {
            // If images exist
            that.bindEvents();
        }
    };

    waGallery.prototype.bindEvents = function() {
        var that = this;

        that.$links.each( function(index) {
            var $link = $(this);

            $link
                .on("click", function() {
                    that.showPreview( index );
                    return false;
                })
                .on("mouseenter", function() {
                    that.showPreview( index );
                    return false;
                })
                .on("mouseleave", function() {
                    var is_rendered = that.links[index].is_active;
                    if (!is_rendered) {
                        that.unsetActive();
                    }
                    return false;
                });

            // Generate Links Array
            that.links.push({
                // Static
                $link: $link,
                full_image_src: $link.attr("href"),
                preview_image_src: $link.find("img").attr("src"),
                linkArea: {
                    top: false,
                    left: false,
                    width: false,
                    height: false
                },
                // Dynamic
                $preview: false,
                is_active: false,
                timer: 0
            });
        });

        $(window).on("wa_dispatched", function() {
            that.destroy();
        });
    };

    waGallery.prototype.showPreview = function( index ) {
        var that = this,
            link = that.links[index],
            $preview =  $('<div class="wa-gallery-preview"></div>'),
            previewItems = that.getPreviewItems(index),
            invisible_class = that.storage.invisible,
            zoom = that.settings['zoom'],
            width = that.settings['width'],
            start_time = that.settings['start_time'];

        // set Area
        var $link = link.$link;
        link.linkArea = {
            top: $link.offset().top,
            left: $link.offset().left,
            width: $link.outerWidth(),
            height: $link.outerHeight()
        };

        that.setActive(index);

        // Start Timeout
        link.timer = setTimeout( function() {

            // Set preview size
            $preview
                .css({
                    width: link.linkArea.width,
                    height: link.linkArea.height,
                    top: link.linkArea.top,
                    left: link.linkArea.left
                })
                .addClass(invisible_class)
                .html(previewItems);

            // Render Preview
            that.$body.append($preview);

            // Save data
            link.$preview = $preview;
            link.is_active = true;

            setTimeout( function() {

                var previewArea = {
                    width: link.linkArea.width,
                    height: link.linkArea.height,
                    top: link.linkArea.top,
                    left: link.linkArea.left
                };

                if (zoom) {
                    previewArea = that.offsetCorrection({
                        width: parseInt(link.linkArea.width * zoom),
                        height: parseInt(link.linkArea.height * zoom),
                        top: link.linkArea.top - parseInt(link.linkArea.height * (zoom - 1) / 2),
                        left: link.linkArea.left - parseInt(link.linkArea.width * (zoom - 1) / 2)
                    });
                }
                if (width) {
                    previewArea = that.offsetCorrection({
                        width: width,
                        height: width,
                        top: link.linkArea.top - parseInt( (width - link.linkArea.width)/2 ),
                        left: link.linkArea.left - parseInt( (width - link.linkArea.width)/2 )
                    });
                }

                // Animation + new bind events
                $preview
                    .removeClass(invisible_class)
                    .css(previewArea)
                    .on("mouseleave", function() {

                        //
                        clearTimeout( link.timer );

                        link.timer = setTimeout( function() {
                            that.hidePreview( link );
                        }, that.settings['close_time']);

                    })
                    .on("mousemove", function(event) {
                        onMouseMove(event, $(this), link.linkArea, previewArea);
                    })
                    .on("click", function() {
                        that.showFullImage( index );
                        return false;
                    });

            }, 0);

            var onMouseMove = function(event, $preview, linkArea, previewArea) {
                var previewOffset = $preview.offset(),
                    delta = {
                        left: event.pageX - previewOffset.left,
                        top: event.pageY - previewOffset.top
                    },
                    zoom = 2,
                    padding = {
                        left: parseInt( (previewArea.width - linkArea.width) / zoom ),
                        top: parseInt( (previewArea.height - linkArea.height) / zoom )
                    };

                var horizontal_close = (delta.left < padding.left || delta.left > ( previewArea.width - padding.left) ),
                    vertical_close = (delta.top < padding.top || delta.top > ( previewArea.height - padding.top) );

                if (horizontal_close || vertical_close) {
                    $preview.trigger("mouseleave");
                }
            };

        }, start_time);
    };

    waGallery.prototype.hidePreview = function( link ) {
        var that = this,
            $preview = link.$preview,
            linkArea = link.linkArea,
            time = that.settings['animate_time'];

        var is_animated_hide = true;
        if ( is_animated_hide && !time ) {
            time = 333;
        }

        if ($preview.length) {
            $preview
                .css({
                    width: linkArea.width,
                    height: linkArea.height,
                    top: linkArea.top,
                    left: linkArea.left,
                    zIndex: "auto"
                })
                .addClass(that.storage.invisible);

            // Set data
            link.$preview = false;
            link.is_active = false;

            // Render
            setTimeout( function() {
                // Remove DOM
                $preview.remove();

            }, time);

        }

    };

    waGallery.prototype.showFullImage = function( index ) {
        var that = this,
            link = that.links[index],
            $preview = link.$preview,
            body_active_class = that.storage.body_active_class,
            animate_class = that.storage.animated,
            is_shown_class = that.storage.shown;

        if (!$preview.length) {
            return false;
        }

        $preview.addClass(animate_class);

        // BODY
        that.$body.addClass(body_active_class);

        // bind Off events
        $preview
            .off("mouseleave")
            .off("mousemove")
            .off("click")
            .addClass(is_shown_class)
            .css({
                top: 0 + $(window)['scrollTop'](),
                left: 0,
                width: "100%",
                height: "100%"
            });

        that.renderControls( index );

        that.addImage();
    };

    waGallery.prototype.unsetActive = function() {
        var that = this,
            index = that.active_link_index;

        if (index || index === 0) {
            var active_link = that.links[index],
                $preview = active_link['$preview'],
                is_preview_render = ($preview.length);

            if (is_preview_render) {
                that.hidePreview(active_link);
            }

            clearTimeout(active_link['timer']);
        }
    };

    waGallery.prototype.setActive = function( index ) {
        var that = this;

        that.unsetActive();

        that.active_link_index = index;
    };

    waGallery.prototype.getPreviewItems = function( index ) {
        var that = this,
            html = "";

        $.each(that.links, function(i, link) {
            var $link = link.$link,
                image_src = link.preview_image_src,
                active_class = (i == index) ? that.storage['active'] : "";

            html += '<div class="wa-gallery-item ' + active_class + '" data-href="' + $link.attr("href") + '" style="background-image: url(' + image_src + ')"><img src="' + image_src + '" alt ="" /></div>';
        });

        return html;
    };

    waGallery.prototype.renderControls = function( index ) {
        var that = this,
            link = that.links[index],
            $preview = link.$preview,
            show_slider = ( that.links.length > 1 ),
            body_active_class = that.storage.body_active_class;

        // Render close button
        var $topControlWrapper = $('<div class="wa-gallery-controls top"></div>'),
            $bottomControlWrapper = $('<div class="wa-gallery-controls bottom"></div>'),
            $close = $('<a href="javascript:void(0);" class="wa-gallery-close"></a>'),
            $download = $('<a href="javascript:void(0);" class="wa-gallery-download"></a>'),
            $rightArrow = $('<a href="javascript:void(0);" class="wa-gallery-arrow right"></a>'),
            $leftArrow = $('<a href="javascript:void(0);" class="wa-gallery-arrow left"></a>');

        $topControlWrapper.append($download);
        $topControlWrapper.append($close);
        $preview.append($topControlWrapper);

        if ( show_slider ) {
            $bottomControlWrapper.append($leftArrow);
            $bottomControlWrapper.append($rightArrow);
            $preview.append($bottomControlWrapper);
        }

        // INIT
        that.initSlider( index );

        // BIND EVENTS
        $close.on("click", function() {
            that.$body.removeClass(body_active_class);
            that.hidePreview( link );
            return false;
        });

        $download.on("click", function() {
            var href = that.slider.$activeSlide.data("href");
            if (href) {
                location.href = href;
            }
        });

        if (show_slider) {
            $leftArrow.on("click", function() {
                that.changeSlide( false );
                return false;
            });
            $rightArrow.on("click", function() {
                that.changeSlide( true );
                return false;
            });
        }

        var initKeyBinds = function(event) {
            var is_escape = (event.keyCode == 27),
                is_left = (event.keyCode == 37),
                is_right = (event.keyCode == 39);

            if (is_escape) {
                $close.trigger("click");
                $(document).off("keyup", initKeyBinds);
            }

            if (show_slider) {
                if (is_left) {
                    $leftArrow.trigger("click");
                }
                if (is_right) {
                    $rightArrow.trigger("click");
                }
            }
        };

        var closeFullPreview = function() {
            $close.trigger("click");
            $(document).off("mousewheel DOMMouseScroll", closeFullPreview);
        };

        var onDrop = function(event) {
            var files = event.originalEvent.dataTransfer.files;
            if (files.length) {
                $close.trigger("click");
                $(document).off("drop", onDrop);
            }
        };

        $(document)
            .on("keyup", initKeyBinds)
            .on("drop", onDrop)
            .on("mousewheel DOMMouseScroll", closeFullPreview);

        // Save data
        that.$close = $close;
    };

    waGallery.prototype.initSlider = function( index ) {
        var that = this,
            link = that.links[index],
            $slides = link.$preview.find(".wa-gallery-item");

        that.slider = {
            is_lock: false,
            current_slide: index,
            slide_count: that.links.length - 1,
            $slides: $slides,
            $activeSlide: $slides.eq(index)
        }
    };

    waGallery.prototype.changeSlide = function( is_next ) {
        var that = this,
            slider = that.slider,
            $current_slide = slider.$activeSlide,
            active_class = that.storage.active,
            animate_time = 333,
            $new_slide;

        if (slider.is_lock) {
            return false;
        }

        slider.is_lock = true;
        
        if (is_next) {
            
            if (slider.current_slide < slider.slide_count ) {
                $new_slide = slider.$slides.eq(slider.current_slide + 1);
                slider.current_slide++;
            } else {
                $new_slide = slider.$slides.first();
                slider.current_slide = 0;
            }
            
        } else {

            if (slider.current_slide >= 1 ) {
                $new_slide = slider.$slides.eq(slider.current_slide - 1);
                slider.current_slide--;
            } else {
                $new_slide = slider.$slides.last();
                slider.current_slide = slider.slide_count;
            }

        }

        // Render
        $current_slide.css("opacity", 0);
        $new_slide.css("opacity", 1);

        slider.timer = setTimeout( function() {
            $current_slide.removeClass(active_class);
            $new_slide.addClass(active_class);

            slider.is_lock = false;
        }, animate_time);

        // Save data
        slider.$activeSlide = $new_slide;

        that.addImage();
    };

    waGallery.prototype.offsetCorrection = function(previewArea) {
        var that = this,
            $document = $(document),
            displayArea = {
                width: $document.width(),
                height: $document.height()
            },
            padding = 10;

        var is_top_problem = ( previewArea.top - padding < 0 ),
            is_bottom_problem = ( previewArea.top + previewArea.height + padding > displayArea.height ),
            is_left_problem = ( previewArea.left - padding < 0 ),
            is_right_problem = ( previewArea.left + previewArea.width + padding > displayArea.width );

        if (is_top_problem) {
            previewArea.top = padding;
        }

        if (is_left_problem) {
            previewArea.left = padding;
        }

        if (is_bottom_problem) {
            previewArea.top -= Math.abs( previewArea.top + previewArea.height - displayArea.height ) + padding;
        }

        if (is_right_problem) {
            previewArea.left -= Math.abs( previewArea.left + previewArea.width - displayArea.width ) + padding;
        }

        return previewArea;
    };

    waGallery.prototype.addImage = function() {
        var that = this,
            $fullImage = $("<img class=\"full-image\" />"),
            $activeSlide = that.slider.$activeSlide,
            full_image_src = $activeSlide.data("href");

        if ($activeSlide.find("img.full-image").length) {
            return false;
        }

        $activeSlide.html("").append($fullImage);

        $fullImage
            .one("load", function() {
                if ($(document).find($activeSlide).length) {
                    $activeSlide
                        .css("background-image", "url(" + full_image_src + ")");
                }
            })
            .on("click", function() {
                var $closeButton = that.$close;
                if ($closeButton.length) {
                    $closeButton.trigger("click");
                }
            })
            .attr("src", full_image_src);
    };

    waGallery.prototype.destroy = function() {
        var that = this;

        $.each(that.links, function(i, link) {
            if (link.is_active) {
                that.hidePreview( link );
            }
        });

        that.showPreview = function() {

        };

        $(".wa-gallery-preview").remove();
    };

    return waGallery;

})(jQuery);