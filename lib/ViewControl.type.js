"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Props = /** @class */ (function () {
    function Props() {
        this.onClick = function () {
        };
        this.onLongPress = function () {
        };
        this.panToMove = true;
        this.pinchToZoom = true;
        this.cropWidth = 100;
        this.cropHeight = 100;
        this.imageWidth = 100;
        this.imageHeight = 100;
        this.source = '';
        this.longPressTime = 800;
        this.leaveStayTime = 100;
        this.leaveDistance = 10;
        this.maxOverflow = 100;
        this.horizontalOuterRangeOffset = function () {
        };
        this.responderRelease = function () {
        };
        this.onDoubleClick = function () {
        };
    }
    return Props;
}());
exports.Props = Props;
var State = /** @class */ (function () {
    function State() {
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.isBeWillingTouch = true;
    }
    return State;
}());
exports.State = State;
