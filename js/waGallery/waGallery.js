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
            width: 600,
            max_scale: 5,
            wheel_scale_step: 0.1
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
        that.$activeImage = $();
        that.transformation = that.getDefaultTransformation();
        that.prev_position = {
            x: null,
            y: null
        };

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
            that.destroyImageInteraction();
            $(document).off(".waGalleryFullPreview");
            that.$body.removeClass(that.storage.body_active_class);

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
            $zoomIn = $('<a href="javascript:void(0);" class="wa-gallery-zoom-in"><i class="fas fa-search-plus"></i></a>'),
            $zoomOut = $('<a href="javascript:void(0);" class="wa-gallery-zoom-out"><i class="fas fa-search-minus"></i></a>'),
            $close = $('<a href="javascript:void(0);" class="wa-gallery-close"></a>'),
            $download = $('<a href="javascript:void(0);" class="wa-gallery-download"></a>'),
            $rightArrow = $('<a href="javascript:void(0);" class="wa-gallery-arrow right"></a>'),
            $leftArrow = $('<a href="javascript:void(0);" class="wa-gallery-arrow left"></a>');

        $topControlWrapper.append($zoomOut);
        $topControlWrapper.append($zoomIn);
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

        $zoomIn.on("click", function(event) {
            event.preventDefault();

            if (!that.$activeImage.length) {
                return;
            }

            that.startZoom();

            var prev_scale = that.transformation.scale,
                rect = that.$activeImage[0].getBoundingClientRect();

            that.transformation.scale += 1;
            that.transformation.scale = Math.min(that.transformation.scale, that.settings.max_scale);

            that.updateTransformWithOrigin({
                x: (rect.left + rect.right) / 2,
                y: (rect.top + rect.bottom) / 2,
                prev_scale: prev_scale
            });
        });

        $zoomOut.on("click", function(event) {
            event.preventDefault();

            if (!that.$activeImage.length) {
                return;
            }

            that.startZoom();
            that.transformation.scale -= 1;
            that.transformation.scale = Math.max(that.transformation.scale, 1);
            that.updateTransform();
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

        var onDrop = function(event) {
            var files = event.originalEvent.dataTransfer.files;
            if (files.length) {
                $close.trigger("click");
            }
        };

        $(document)
            .off(".waGalleryFullPreview")
            .on("keyup.waGalleryFullPreview", initKeyBinds)
            .on("drop.waGalleryFullPreview", onDrop);

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

    waGallery.prototype.getDefaultTransformation = function() {
        return {
            originX: 0,
            originY: 0,
            translateX: 0,
            translateY: 0,
            scale: 1
        };
    };

    waGallery.prototype.setActiveImage = function($image) {
        var that = this;

        that.destroyImageInteraction();
        that.$activeImage = $image;
        that.clearPosition();
        that.resizeActiveImage();
        that.initImageInteraction();
    };

    waGallery.prototype.destroyImageInteraction = function() {
        var that = this,
            active_index = that.active_link_index,
            active_link = (active_index || active_index === 0) ? that.links[active_index] : null;

        if (active_link && active_link.$preview) {
            active_link.$preview.off(".waGalleryZoom");
        }

        $(document).off(".waGalleryZoom");

        if (that.$activeImage.length) {
            that.$activeImage
                .off(".waGalleryZoom");
            that.clearPosition();
        }

        that.$activeImage = $();
    };

    waGallery.prototype.initImageInteraction = function() {
        var that = this,
            active_index = that.active_link_index,
            active_link = (active_index || active_index === 0) ? that.links[active_index] : null;

        if (!active_link || !active_link.$preview || !that.$activeImage.length) {
            return;
        }

        active_link.$preview.on("wheel.waGalleryZoom", function(event) {
            if (!event.ctrlKey) {
                return;
            }

            event.preventDefault();
            that.startZoom();

            var prev_scale = that.transformation.scale,
                delta = event.originalEvent.deltaY;

            if (delta < 0) {
                that.transformation.scale += that.settings.wheel_scale_step;
                that.transformation.scale = Math.min(that.transformation.scale, that.settings.max_scale);
            } else {
                that.transformation.scale -= that.settings.wheel_scale_step;
                that.transformation.scale = Math.max(that.transformation.scale, 1);
            }

            that.updateTransformWithOrigin($.extend({}, that.getCoords(event), {
                prev_scale: prev_scale
            }));
        });

        that.$activeImage
            .on("dragstart.waGalleryZoom", function() {
                return false;
            })
            .on("mousedown.waGalleryZoom touchstart.waGalleryZoom", function(event) {
                if (that.transformation.scale === 1) {
                    return false;
                }

                event.preventDefault();
                that.prev_position = {
                    x: null,
                    y: null
                };

                var previous_position = that.getCoords(event);

                that.$activeImage.addClass("is-dragging");

                $(document)
                    .on("mousemove.waGalleryZoom touchmove.waGalleryZoom", function(move_event) {
                        var coords = that.getCoords(move_event),
                            originX = (that.prev_position.x === null) ? previous_position.x - coords.x : coords.x - that.prev_position.x,
                            originY = (that.prev_position.y === null) ? previous_position.y - coords.y : coords.y - that.prev_position.y;

                        that.transformation.translateX += originX;
                        that.transformation.translateY += originY;
                        that.updateTransform();

                        that.prev_position.x = coords.x;
                        that.prev_position.y = coords.y;
                    })
                    .one("mouseup.waGalleryZoom touchend.waGalleryZoom touchcancel.waGalleryZoom", function(end_event) {
                        if (end_event) {
                            end_event.preventDefault();
                        }

                        that.$activeImage.removeClass("is-dragging");
                        $(document).off("mousemove.waGalleryZoom touchmove.waGalleryZoom");
                    });
            });
    };

    waGallery.prototype.resizeActiveImage = function() {
        if (!this.$activeImage.length) {
            return;
        }

        this.$activeImage.css({
            maxHeight: ($(window).height() - 74) + "px",
            maxWidth: "100vw"
        });
    };

    waGallery.prototype.updateTransform = function() {
        if (!this.$activeImage.length) {
            return;
        }

        if (this.transformation.scale === 1) {
            this.finishZoom();
            this.clearPosition();
        } else {
            this.$activeImage.addClass("is-zoomed");
        }

        var transformation = this.transformation;
        this.$activeImage[0].style.transform = "matrix(" + transformation.scale + ", 0, 0, " + transformation.scale + ", " + transformation.translateX + ", " + transformation.translateY + ")";
    };

    waGallery.prototype.updateTransformWithOrigin = function(data) {
        if (!this.$activeImage.length) {
            return;
        }

        var image = this.$activeImage[0],
            rect = image.getBoundingClientRect(),
            originX = data.x - rect.left,
            originY = data.y - rect.top,
            newOriginX = originX / data.prev_scale,
            newOriginY = originY / data.prev_scale,
            translate = this.getTranslate(data.prev_scale);

        image.style.transformOrigin = newOriginX + "px " + newOriginY + "px";

        this.transformation.translateX = translate({
            pos: originX,
            prevPos: this.transformation.originX,
            translate: this.transformation.translateX
        });
        this.transformation.translateY = translate({
            pos: originY,
            prevPos: this.transformation.originY,
            translate: this.transformation.translateY
        });

        this.transformation.originX = newOriginX;
        this.transformation.originY = newOriginY;

        this.updateTransform();
    };

    waGallery.prototype.getTranslate = function(scale) {
        var that = this,
            value_in_range = function(value) {
                return value <= that.settings.max_scale && value >= 1;
            };

        return function(data) {
            return (value_in_range(scale) && data.pos !== data.prevPos) ?
                data.translate + (data.pos - data.prevPos * scale) * (1 - 1 / scale) :
                data.translate;
        };
    };

    waGallery.prototype.clearPosition = function() {
        this.transformation = this.getDefaultTransformation();
        this.prev_position = {
            x: null,
            y: null
        };

        if (this.$activeImage.length) {
            this.$activeImage[0].style.transformOrigin = "50% 50%";
            this.$activeImage[0].style.transform = "";
            this.$activeImage.removeClass("is-zoomed is-dragging");
        }
    };

    waGallery.prototype.getCoords = function(event) {
        var original_event = event.originalEvent || event;

        if (original_event.touches && original_event.touches.length) {
            original_event = original_event.touches[0];
        }

        return {
            x: original_event.clientX,
            y: original_event.clientY
        };
    };

    waGallery.prototype.startZoom = function() {
        if (this.$activeImage.length) {
            this.$activeImage.addClass("is-zoomed");
        }
    };

    waGallery.prototype.finishZoom = function() {
        var that = this;

        if (!that.$activeImage.length) {
            return;
        }

        setTimeout(function() {
            that.$activeImage.removeClass("is-zoomed is-dragging");
        });
    };

    waGallery.prototype.addImage = function() {
        var that = this,
            $fullImage = $("<img class=\"full-image\" />"),
            $activeSlide = that.slider.$activeSlide,
            full_image_src = $activeSlide.data("href");

        if ($activeSlide.find("img.full-image").length) {
            that.setActiveImage($activeSlide.find("img.full-image"));
            return false;
        }

        $activeSlide.css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        $activeSlide.html("").append($fullImage);
        that.setActiveImage($fullImage);

        $fullImage.css({
            position: "relative",
            top: "auto",
            left: "auto",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            opacity: 1,
            userSelect: "none",
            transformOrigin: "50% 50%"
        });

        $fullImage
            .one("load", function() {
                if ($(document).find($activeSlide).length) {
                    $activeSlide.css("background-image", "none");
                }
            })
            .attr("src", full_image_src);
    };

    waGallery.prototype.destroy = function() {
        var that = this;


        that.destroyImageInteraction();
        $(document).off(".waGalleryFullPreview");
        that.$body.removeClass(that.storage.body_active_class);
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
