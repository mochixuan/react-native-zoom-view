import {
    ViewProperties
} from 'react-native'

export interface PropsDefine extends ViewProperties {

    onClick?: ()=>void

    cropWidth: number

    cropHeight: number

    imageWidth: number

    imageHeight: number

    panToMove?: boolean

    pinchToZoom?: boolean

    leaveStayTime?: number

    leaveDistance?: number

    horizontalOuterRangeOffset?: (offsetX?: number)=>void

    onDragLeft?: ()=>void

    responderRelease?: (vx?: number, scale?: number)=>void

    maxOverflow?: number

    longPressTime?: number

    onLongPress?: ()=>void

    onDoubleClick?: ()=>void

    others?: any
}


export class Props implements PropsDefine {
    onClick = ()=> {
    }
    onLongPress = ()=> {
    }
    panToMove = true
    pinchToZoom = true
    cropWidth = 100
    cropHeight = 100
    imageWidth = 100
    imageHeight = 100
    source = ''
    longPressTime = 800
    leaveStayTime = 100
    leaveDistance = 10
    maxOverflow = 100
    horizontalOuterRangeOffset = ()=> {
    }
    responderRelease = ()=> {
    }
    onDoubleClick = ()=> {
    }
}

export interface StateDefine {

    centerX?: number

    centerY?: number

    isBeWillingTouch?:boolean
}

export class State implements StateDefine {
    centerX = 0.5
    centerY = 0.5
    isBeWillingTouch = true
}