"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var typings = require("./ViewControl.type");
var ViewControl = /** @class */ (function (_super) {
    __extends(ViewControl, _super);
    function ViewControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = new typings.State();
        _this.lastPositionX = null;
        _this.positionX = 0;
        _this.animatedPositionX = new react_native_1.Animated.Value(0);
        _this.lastPositionY = null;
        _this.positionY = 0;
        _this.animatedPositionY = new react_native_1.Animated.Value(0);
        _this.scale = 1;
        _this.animatedScale = new react_native_1.Animated.Value(1);
        _this.zoomLastDistance = null;
        _this.zoomCurrentDistance = 0;
        _this.horizontalWholeOuterCounter = 0;
        _this.horizontalWholeCounter = 0;
        _this.verticalWholeCounter = 0;
        _this.centerDiffX = 0;
        _this.centerDiffY = 0;
        _this.lastClickTime = 0;
        _this.doubleClickX = 0;
        _this.doubleClickY = 0;
        _this.preClickX = -1;
        _this.preClickY = -1;
        _this.isDoubleClickScale = false;
        return _this;
    }
    ViewControl.prototype.changeTouchState = function (isBeWillingTouch) {
        this.setState({
            isBeWillingTouch: isBeWillingTouch
        });
    };
    ViewControl.prototype.componentWillMount = function () {
        var _this = this;
        this.imagePanResponder = react_native_1.PanResponder.create({
            onStartShouldSetPanResponder: function (_evt, _gestureState) {
                _this.lastPositionX = null;
                _this.lastPositionY = null;
                _this.zoomLastDistance = null;
                _this.horizontalWholeCounter = 0;
                _this.verticalWholeCounter = 0;
                _this.lastTouchStartTime = new Date().getTime();
                _this.isDoubleClickScale = false;
                if (_evt.nativeEvent.changedTouches.length > 1) {
                    _this.centerDiffX = (_evt.nativeEvent.changedTouches[0].pageX + _evt.nativeEvent.changedTouches[1].pageX) / 2 - _this.props.cropWidth / 2;
                    _this.centerDiffY = (_evt.nativeEvent.changedTouches[0].pageY + _evt.nativeEvent.changedTouches[1].pageY) / 2 - _this.props.cropHeight / 2;
                }
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                }
                _this.longPressTimeout = setTimeout(function () {
                    _this.props.onLongPress();
                }, _this.props.longPressTime);
                if (_evt.nativeEvent.changedTouches.length <= 1) {
                    var timedistance = new Date().getTime() - _this.lastClickTime;
                    if (_this.preClickX == -1) {
                        _this.preClickX = _evt.nativeEvent.changedTouches[0].pageX;
                        _this.preClickY = _evt.nativeEvent.changedTouches[0].pageY;
                    }
                    if (timedistance < 300 && timedistance > 80) {
                        _this.lastClickTime = 0;
                        _this.props.onDoubleClick();
                        clearTimeout(_this.longPressTimeout);
                        _this.doubleClickX = _evt.nativeEvent.changedTouches[0].pageX;
                        _this.doubleClickY = _evt.nativeEvent.changedTouches[0].pageY;
                        var doubleDistance = Math.sqrt(Math.pow(_this.preClickX - _evt.nativeEvent.changedTouches[0].pageX, 2) +
                            Math.pow(_this.preClickY - _evt.nativeEvent.changedTouches[0].pageY, 2));
                        _this.preClickX = -1;
                        _this.preClickY = -1;
                        if (doubleDistance < 80) {
                            _this.isDoubleClickScale = true;
                            if (_this.scale > 1 || _this.scale < 1) {
                                _this.scale = 1;
                                _this.positionX = 0;
                                _this.positionY = 0;
                            }
                            else {
                                var beforeScale = _this.scale;
                                _this.scale = 2;
                                var diffScale = _this.scale - beforeScale;
                                _this.positionX = (_this.props.cropWidth / 2 - _this.doubleClickX) * diffScale / _this.scale;
                                _this.positionY = (_this.props.cropHeight / 2 - _this.doubleClickY) * diffScale / _this.scale;
                            }
                            react_native_1.Animated.parallel([
                                react_native_1.Animated.timing(_this.animatedScale, {
                                    toValue: _this.scale,
                                    duration: 100,
                                }),
                                react_native_1.Animated.timing(_this.animatedPositionX, {
                                    toValue: _this.positionX,
                                    duration: 100,
                                }),
                                react_native_1.Animated.timing(_this.animatedPositionY, {
                                    toValue: _this.positionY,
                                    duration: 100,
                                })
                            ]).start();
                        }
                    }
                    else {
                        _this.lastClickTime = new Date().getTime();
                    }
                }
                return false;
            },
            onMoveShouldSetPanResponder: function (_evt, _gestureState) {
                if (_evt.nativeEvent.changedTouches.length > 1) {
                    _this.changeTouchState(true);
                }
                return _this.state.isBeWillingTouch;
            },
            onPanResponderTerminationRequest: function (_evt, _gestureState) {
                return false;
            },
            onPanResponderMove: function (_evt, _gestureState) {
                if (_evt.nativeEvent.changedTouches.length <= 1) {
                    var diffX = _gestureState.dx - _this.lastPositionX;
                    if (_this.lastPositionX === null) {
                        diffX = 0;
                    }
                    var diffY = _gestureState.dy - _this.lastPositionY;
                    if (_this.lastPositionY === null) {
                        diffY = 0;
                    }
                    _this.lastPositionX = _gestureState.dx;
                    _this.lastPositionY = _gestureState.dy;
                    _this.horizontalWholeCounter += diffX;
                    _this.verticalWholeCounter += diffY;
                    if (Math.abs(_this.horizontalWholeCounter) > 5 || Math.abs(_this.verticalWholeCounter) > 5) {
                        clearTimeout(_this.longPressTimeout);
                    }
                    if (_this.props.panToMove) {
                        if (_this.props.imageWidth * _this.scale > _this.props.cropWidth) {
                            if (_this.horizontalWholeOuterCounter > 0) {
                                if (diffX < 0) {
                                    if (_this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                        _this.changeTouchState(false);
                                        _this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        _this.changeTouchState(true);
                                        diffX += _this.horizontalWholeOuterCounter;
                                        _this.horizontalWholeOuterCounter = 0;
                                        _this.props.horizontalOuterRangeOffset(0);
                                    }
                                }
                                else {
                                    _this.changeTouchState(false);
                                    _this.horizontalWholeOuterCounter += diffX;
                                }
                            }
                            else if (_this.horizontalWholeOuterCounter < 0) {
                                if (diffX > 0) {
                                    if (Math.abs(_this.horizontalWholeOuterCounter) > diffX) {
                                        _this.changeTouchState(false);
                                        _this.horizontalWholeOuterCounter += diffX;
                                        diffX = 0;
                                    }
                                    else {
                                        _this.changeTouchState(true);
                                        diffX += _this.horizontalWholeOuterCounter;
                                        _this.horizontalWholeOuterCounter = 0;
                                        _this.props.horizontalOuterRangeOffset(0);
                                    }
                                }
                                else {
                                    _this.changeTouchState(false);
                                    _this.horizontalWholeOuterCounter += diffX;
                                }
                            }
                            else {
                                if (diffX != 0 && diffX != _this.horizontalWholeCounter) {
                                    _this.changeTouchState(true);
                                }
                            }
                            _this.positionX += diffX / _this.scale;
                            var horizontalMax = (_this.props.imageWidth * _this.scale - _this.props.cropWidth) / 2 / _this.scale;
                            if (_this.positionX < -horizontalMax) {
                                _this.positionX = -horizontalMax;
                                _this.horizontalWholeOuterCounter += -1 / 1e10;
                            }
                            else if (_this.positionX > horizontalMax) {
                                _this.positionX = horizontalMax;
                                _this.horizontalWholeOuterCounter += 1 / 1e10;
                            }
                            _this.animatedPositionX.setValue(_this.positionX);
                        }
                        else {
                            _this.horizontalWholeOuterCounter += diffX;
                            _this.changeTouchState(false);
                        }
                        if (_this.horizontalWholeOuterCounter > _this.props.maxOverflow) {
                            _this.horizontalWholeOuterCounter = _this.props.maxOverflow;
                        }
                        else if (_this.horizontalWholeOuterCounter < -_this.props.maxOverflow) {
                            _this.horizontalWholeOuterCounter = -_this.props.maxOverflow;
                        }
                        if (_this.horizontalWholeOuterCounter !== 0) {
                            _this.props.horizontalOuterRangeOffset(_this.horizontalWholeOuterCounter);
                        }
                        if (_this.props.imageHeight * _this.scale > _this.props.cropHeight) {
                            _this.positionY += diffY / _this.scale;
                            _this.animatedPositionY.setValue(_this.positionY);
                        }
                    }
                }
                else {
                    if (_this.longPressTimeout) {
                        clearTimeout(_this.longPressTimeout);
                    }
                    if (_this.props.pinchToZoom) {
                        var minX = void 0;
                        var maxX = void 0;
                        if (_evt.nativeEvent.changedTouches[0].locationX > _evt.nativeEvent.changedTouches[1].locationX) {
                            minX = _evt.nativeEvent.changedTouches[1].pageX;
                            maxX = _evt.nativeEvent.changedTouches[0].pageX;
                        }
                        else {
                            minX = _evt.nativeEvent.changedTouches[0].pageX;
                            maxX = _evt.nativeEvent.changedTouches[1].pageX;
                        }
                        var minY = void 0;
                        var maxY = void 0;
                        if (_evt.nativeEvent.changedTouches[0].locationY > _evt.nativeEvent.changedTouches[1].locationY) {
                            minY = _evt.nativeEvent.changedTouches[1].pageY;
                            maxY = _evt.nativeEvent.changedTouches[0].pageY;
                        }
                        else {
                            minY = _evt.nativeEvent.changedTouches[0].pageY;
                            maxY = _evt.nativeEvent.changedTouches[1].pageY;
                        }
                        var widthDistance = maxX - minX;
                        var heightDistance = maxY - minY;
                        var diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance);
                        _this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1));
                        if (_this.zoomLastDistance !== null) {
                            var distanceDiff = (_this.zoomCurrentDistance - _this.zoomLastDistance) / 200;
                            var zoom = _this.scale + distanceDiff;
                            if (zoom < 0.6) {
                                zoom = 0.6;
                            }
                            if (zoom > 10) {
                                zoom = 10;
                            }
                            var beforeScale = _this.scale;
                            _this.scale = zoom;
                            _this.animatedScale.setValue(_this.scale);
                            var diffScale = _this.scale - beforeScale;
                            _this.positionX -= _this.centerDiffX * diffScale / _this.scale;
                            _this.positionY -= _this.centerDiffY * diffScale / _this.scale;
                            _this.animatedPositionX.setValue(_this.positionX);
                            _this.animatedPositionY.setValue(_this.positionY);
                        }
                        _this.zoomLastDistance = _this.zoomCurrentDistance;
                    }
                }
            },
            onPanResponderRelease: function (_evt, _gestureState) {
                if (_this.isDoubleClickScale) {
                    return;
                }
                if (_this.scale < 1) {
                    _this.scale = 1;
                    react_native_1.Animated.timing(_this.animatedScale, {
                        toValue: _this.scale,
                        duration: 100,
                    }).start();
                }
                if (_this.props.imageWidth * _this.scale <= _this.props.cropWidth) {
                    _this.positionX = 0;
                    react_native_1.Animated.timing(_this.animatedPositionX, {
                        toValue: _this.positionX,
                        duration: 100,
                    }).start();
                }
                if (_this.props.imageHeight * _this.scale <= _this.props.cropHeight) {
                    _this.positionY = 0;
                    react_native_1.Animated.timing(_this.animatedPositionY, {
                        toValue: _this.positionY,
                        duration: 100,
                    }).start();
                }
                if (_this.props.imageHeight * _this.scale > _this.props.cropHeight) {
                    var verticalMax = (_this.props.imageHeight * _this.scale - _this.props.cropHeight) / 2 / _this.scale;
                    if (_this.positionY < -verticalMax) {
                        _this.positionY = -verticalMax;
                    }
                    else if (_this.positionY > verticalMax) {
                        _this.positionY = verticalMax;
                    }
                    react_native_1.Animated.timing(_this.animatedPositionY, {
                        toValue: _this.positionY,
                        duration: 100,
                    }).start();
                }
                if (_this.scale === 1) {
                    _this.positionX = 0;
                    _this.positionY = 0;
                    react_native_1.Animated.timing(_this.animatedPositionX, {
                        toValue: _this.positionX,
                        duration: 100,
                    }).start();
                    react_native_1.Animated.timing(_this.animatedPositionY, {
                        toValue: _this.positionY,
                        duration: 100,
                    }).start();
                }
                _this.horizontalWholeOuterCounter = 0;
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                }
                var stayTime = new Date().getTime() - _this.lastTouchStartTime;
                var moveDistance = Math.sqrt(_gestureState.dx * _gestureState.dx + _gestureState.dy * _gestureState.dy);
                if (_evt.nativeEvent.changedTouches.length === 1 && stayTime < _this.props.leaveStayTime && moveDistance < _this.props.leaveDistance) {
                    _this.props.onClick();
                }
                else {
                    _this.props.responderRelease(_gestureState.vx, _this.scale);
                }
            },
            onPanResponderTerminate: function (_evt, _gestureState) {
                if (_this.longPressTimeout) {
                    clearTimeout(_this.longPressTimeout);
                }
            }
        });
    };
    ViewControl.prototype.render = function () {
        var animateConf = {
            transform: [{
                    scale: this.animatedScale
                }, {
                    translateX: this.animatedPositionX
                }, {
                    translateY: this.animatedPositionY
                }]
        };
        return (<react_native_1.View style={[styles.container, {
                width: this.props.cropWidth,
                height: this.props.cropHeight,
            }]} {...this.imagePanResponder.panHandlers}>
                <react_native_1.Animated.View style={animateConf}>
                    <react_native_1.View style={{
            width: this.props.imageWidth,
            height: this.props.imageHeight,
        }}>
                        {this.props.children}
                    </react_native_1.View>
                </react_native_1.Animated.View>
            </react_native_1.View>);
    };
    ViewControl.defaultProps = new typings.Props();
    return ViewControl;
}(react_1.Component));
exports.default = ViewControl;
var styles = react_native_1.StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
});
