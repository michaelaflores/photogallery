
'use strict';

var _createClass = (function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var Main = (function () {
    function Main() {
        _classCallCheck(this, Main);
    }

    // When DOMContentLoaded is fired, run Main's initialize method

    _createClass(Main, null, [{
        key: 'initialize',
        value: function initialize() {

            // Create a new instance of the MasonryGallery
            this.masonryGallery = new ForceEnhancedMasonryGallery({
                imagesData: imagesData,
                baseGridX: 4,
                baseGridY: 3,
                gridRepeatCount: 4
            });

            // Create a new instance of the OverlayGallery
            this.overlayGallery = new OverlayGallery({
                imagesData: imagesData
            });

            // Get a reference for the site content
            this.siteContent = document.querySelector('.site-content');

            // Append the masonry gallery element to the DOM
            this.siteContent.appendChild(this.masonryGallery.el);

            // Append the overlay gallery element to the DOM
            document.body.appendChild(this.overlayGallery.el);

            // Bind some page-wide events
            this._bindEvents();

            // Append the 'initialized' class to the documentElement to remove the 'unsupported' text
            document.documentElement.classList.add('initialized');
        }

        // Bind events between the masonryGallery and overlayGallery
    }, {
        key: '_bindEvents',
        value: function _bindEvents() {
            // When the masonryGallery element triggers the custom 'image-selected' event, handle it
            this.masonryGallery.el.addEventListener('image-selected', this.overlayGallery.openGalleryOnEvent.bind(this.overlayGallery));
            // When the overlayGallery element is clicked, we want to remove its overlay
            this.overlayGallery.el.addEventListener('click', this.overlayGallery.closeGallery.bind(this.overlayGallery));
            // When the masonryGallery throws a 'saved-image' event, propogate that to the overlayGallery
            this.masonryGallery.el.addEventListener('image-liked', this.overlayGallery.setImageLikedFromEvent.bind(this.overlayGallery));
        }
    }]);

    return Main;
})();

document.addEventListener('DOMContentLoaded', Main.initialize.bind(Main));
