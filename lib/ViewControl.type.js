export class Props {
    constructor() {
        this.onClick = () => {
        };
        this.onLongPress = () => {
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
        this.horizontalOuterRangeOffset = () => {
        };
        this.responderRelease = () => {
        };
        this.onDoubleClick = () => {
        };
    }
}
export class State {
    constructor() {
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.isBeWillingTouch = true;
    }
}
//# sourceMappingURL=ViewControl.type.js.map