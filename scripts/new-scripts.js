
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

var _get = function get(_x, _x2, _x3) {
    var _again = true;
    _function: while (_again) {
        var object = _x,
            property = _x2,
            receiver = _x3;
        desc = parent = getter = undefined;
        _again = false;
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);
            if (parent === null) {
                return undefined;
            } else {
                _x = parent;
                _x2 = property;
                _x3 = receiver;
                _again = true;
                continue _function;
            }
        } else if ('value' in desc) {
            return desc.value;
        } else {
            var getter = desc.get;
            if (getter === undefined) {
                return undefined;
            }
            return getter.call(receiver);
        }
    }
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var SnapPointsMasonryGallery = (function (_MasonryGallery) {
    _inherits(SnapPointsMasonryGallery, _MasonryGallery);

    function SnapPointsMasonryGallery(options) {
        _classCallCheck(this, SnapPointsMasonryGallery);

        // Calling super instantiates a MasonryGallery in the context of 'this' that we can extend
        _get(Object.getPrototypeOf(SnapPointsMasonryGallery.prototype), 'constructor', this).call(this, options);

        // Set snap point styles on the document body
        this.setSnapPointsStyles(document.body);
    }

    // Enable -webkit-scroll-snap properties on a target element

    _createClass(SnapPointsMasonryGallery, [{
        key: 'setSnapPointsStyles',
        value: function setSnapPointsStyles(element) {
            element.style.webkitScrollSnapType = 'mandatory';
            element.style.webkitScrollSnapPointsY = 'repeat(' + this._baseGridYPercentage + 'vh)';
        }
    }]);

    return SnapPointsMasonryGallery;
})(MasonryGallery);

var ForceEnhancedMasonryGallery = (function (_SnapPointsMasonryGallery) {
    _inherits(ForceEnhancedMasonryGallery, _SnapPointsMasonryGallery);

    function ForceEnhancedMasonryGallery(options) {
        _classCallCheck(this, ForceEnhancedMasonryGallery);

        _get(Object.getPrototypeOf(ForceEnhancedMasonryGallery.prototype), 'constructor', this).call(this, options);

        // Get minimum and maximum force value
        this.minForce = MouseEvent.WEBKIT_FORCE_AT_MOUSE_DOWN;
        this.maxForce = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;

        // Save a bound animation frame function for animating
        this._boundOnAnimationFrame = this._onAnimationFrame.bind(this);

        // Boolean for whether force events are between WEBKIT_FORCE_AT_MOUSE_DOWN and WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN
        this._isWithinForceRange = false;

        // Boolean for whether the threshold for triggering animation complete has been hit
        this._didHitAnimationThreshold = false;

        // Threshold value for when we want animation to stop
        this._animationEndThreshold = 0.8;

        // Bind force events on itself when ready
        this.bindForceEvents();
    }

    _createClass(ForceEnhancedMasonryGallery, [{
        key: 'bindForceEvents',
        value: function bindForceEvents() {
            // Bind force events that will be used for enhancing the UI
            this.el.addEventListener('webkitmouseforcewillbegin', this);
            this.el.addEventListener('webkitmouseforcedown', this);
            this.el.addEventListener('webkitmouseforcechanged', this);
            this.el.addEventListener('webkitmouseforceup', this);
        }
    }, {
        key: 'handleEvent',
        value: function handleEvent(e) {
            // Handle force events here for clarity
            switch (e.type) {

                case 'webkitmouseforcewillbegin':

                    // Prevent default on webkitmouseforcewillbegin in order to prevent default features from the OS
                    e.preventDefault();

                    break;

                case 'webkitmouseforcedown':

                    // When a force down is found, set this._setWithinForceRange to be true and set up some CSS classes to make things animate cleanly
                    this._setWithinForceRange(true);

                    break;

                case 'webkitmouseforcechanged':

                    // If we already hit the threshold, stop this from continuing (per our UI requirements)
                    if (!this._isWithinForceRange || this._didHitAnimationThreshold) {
                        return;
                    }

                    // Get the target and force value
                    var target = e.target,
                        force = e.webkitForce;

                    // Get the progress of force between the min and max
                    var progress = (force - this.minForce) / (this.maxForce - this.minForce) / this._animationEndThreshold;

                    // Translate the elements we want to animate according to the progress
                    this._handleElementTransition(target, progress);

                    // If the force threshold is hit, we like the image
                    if (progress >= 1) {
                        this._didHitAnimationThreshold = true;
                        this._likeImage(target);
                    }

                    break;

                case 'webkitmouseforceup':

                    // Reset styles when force up occurs
                    var target = e.target,
                        imageContainer = this.getImageContainerFromUIElement(target);

                    // Reset the force status for the next set of events
                    this._setWithinForceRange(false);
                    this._didHitAnimationThreshold = false;

                    // Remove styles
                    imageContainer.classList.remove('threshold-hit');

                    // Waiting an animation frame will allow elements to CSS transition back into place after class changes are painted
                    window.requestAnimationFrame((function () {
                        this.removeAttribute('style');
                        this.nextSibling.removeAttribute('style');
                    }).bind(target));

                    break;

            }
        }
    }, {
        key: '_likeImage',
        value: function _likeImage(target) {
            var likedClassName = 'liked',
                thresholdClass = 'threshold-hit';

            // Get the image container and whether or not it is already liked
            var imageIndex = this.getElementImageIndex(target),
                targetWasLiked = target.classList.contains(likedClassName),
                imageContainer = this.getImageContainerFromUIElement(target);

            // Set a class for the threshold being hit, which will animate in our 'like' ui
            imageContainer.classList.add(thresholdClass);
            if (!targetWasLiked) {
                // If we are saving the item, this will trigger that it was liked and add a classname for that
                target.classList.add(likedClassName);
                this._triggerImageLikedEvent(target, true);
                return;
            }

            // Otherwise, we'll remove the liked class name and trigger an event that it was removed
            target.classList.remove(likedClassName);
            this._triggerImageLikedEvent(target, false);
        }

        // Trigger custom events for selecting a specific image
    }, {
        key: '_triggerImageLikedEvent',
        value: function _triggerImageLikedEvent(target, liked) {
            // If the target is one, throw a custom event that returns the image src index of the element
            var customEvent = new CustomEvent('image-liked', {
                detail: {
                    index: this.getElementImageIndex(target),
                    liked: liked
                }
            });

            // Dispatch the event on this.el
            this.el.dispatchEvent(customEvent);
        }
    }, {
        key: '_handleElementTransition',
        value: function _handleElementTransition(target, progress) {

            // The sibling of this element is the image next to it, that we'll add a tiny bit of scaling to
            var siblingImage = target.nextSibling;

            // Get some values for what the scale and blur values are as we apply force
            var scaleMultiplier = 0.08,
                scaleValue = 1 - progress * scaleMultiplier;

            // Save the animation properties in an instance variable, in order to have the newest values when requestAnimationFrame is ready to draw
            this._animationProps = {
                target: siblingImage,
                transform: 'scale(' + scaleValue + ') translateZ(0)'
            };

            // If an animation frame isn't active, create one for drawing these values
            if (!this._animationFrame) {
                this._animationFrame = requestAnimationFrame(this._boundOnAnimationFrame);
            }
        }
    }, {
        key: '_onAnimationFrame',
        value: function _onAnimationFrame() {
            // In case animation props DNE, return false
            if (!this._animationProps) {
                return;
            }

            // Apply animationProps values to the element
            this._animationProps.target.style.transform = this._animationProps.transform;

            // Set this._animationFrame to null so a new one will be set on the next force change event
            this._animationFrame = null;
        }
    }, {
        key: '_setWithinForceRange',
        value: function _setWithinForceRange(bool) {
            // Set a classname of 'force-active' to the documentElement in order to handle styles when force is active
            var target = document.documentElement,
                className = 'force-active';

            if (bool) {
                // Set a variable for preventing regular click since force is active
                this._isWithinForceRange = true;
                // Add the classname
                target.classList.add(className);
                return;
            }

            // Otherwise, remove the variable preventing click callbacks and remove the classname
            this._isWithinForceRange = false;
            target.classList.remove(className);
        }
    }]);

    return ForceEnhancedMasonryGallery;
})(SnapPointsMasonryGallery);
