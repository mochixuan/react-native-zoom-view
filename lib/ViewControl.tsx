import React,{Component} from 'react'
import {
    StyleSheet,
    View,
    ViewStyle,
    Animated,
    PanResponder,
    PanResponderInstance,
    LayoutChangeEvent,
} from "react-native";

import * as typings from './ViewControl.type'

export default class ViewControl extends Component<typings.PropsDefine,typings.StateDefine> {

    static defaultProps: typings.PropsDefine = new typings.Props()
    public state: typings.StateDefine = new typings.State()

    private lastPositionX: number = null
    private positionX = 0
    private animatedPositionX = new Animated.Value(0)

    private lastPositionY: number = null
    private positionY = 0
    private animatedPositionY = new Animated.Value(0)

    private scale = 1
    private animatedScale = new Animated.Value(1)
    private zoomLastDistance: number = null
    private zoomCurrentDistance = 0

    private imagePanResponder: PanResponderInstance

    private lastTouchStartTime: number

    private horizontalWholeOuterCounter = 0

    private horizontalWholeCounter = 0
    private verticalWholeCounter = 0

    private centerDiffX = 0
    private centerDiffY = 0

    private longPressTimeout: any

    private lastClickTime = 0

    private doubleClickX = 0
    private doubleClickY = 0

    private preClickX = -1;
    private preClickY = -1;

    private isDoubleClickScale = false

    changeTouchState(isBeWillingTouch:boolean) {
        this.setState({
            isBeWillingTouch: isBeWillingTouch
        })
    }

    componentWillMount() {
        this.imagePanResponder = PanResponder.create({

            onStartShouldSetPanResponder:(_evt,_gestureState) => {

                this.lastPositionX = null
                this.lastPositionY = null
                this.zoomLastDistance = null
                this.horizontalWholeCounter = 0
                this.verticalWholeCounter = 0
                this.lastTouchStartTime = new Date().getTime()
                this.isDoubleClickScale = false

                if (_evt.nativeEvent.changedTouches.length > 1) {
                    this.centerDiffX = (_evt.nativeEvent.changedTouches[0].pageX + _evt.nativeEvent.changedTouches[1].pageX) / 2 - this.props.cropWidth / 2
                    this.centerDiffY = (_evt.nativeEvent.changedTouches[0].pageY + _evt.nativeEvent.changedTouches[1].pageY) / 2 - this.props.cropHeight / 2
                }

                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout)
                }

                this.longPressTimeout = setTimeout(() => {
                    this.props.onLongPress()
                }, this.props.longPressTime)

                if (_evt.nativeEvent.changedTouches.length <= 1) {

                    const timedistance = new Date().getTime() - this.lastClickTime;

                     if (this.preClickX == -1) {
                         this.preClickX = _evt.nativeEvent.changedTouches[0].pageX;
                         this.preClickY = _evt.nativeEvent.changedTouches[0].pageY;
                     }

                    if (timedistance < 300 && timedistance>80) {
                        this.lastClickTime = 0
                        this.props.onDoubleClick()

                        clearTimeout(this.longPressTimeout)

                        this.doubleClickX = _evt.nativeEvent.changedTouches[0].pageX
                        this.doubleClickY = _evt.nativeEvent.changedTouches[0].pageY

                        let doubleDistance = Math.sqrt(
                            Math.pow(this.preClickX-_evt.nativeEvent.changedTouches[0].pageX,2)+
                            Math.pow(this.preClickY-_evt.nativeEvent.changedTouches[0].pageY,2))

                        this.preClickX = -1;
                        this.preClickY = -1;

                        if (doubleDistance<80) {
                            this.isDoubleClickScale = true
                            if (this.scale > 1 || this.scale < 1) {
                                this.scale = 1
                                this.positionX = 0
                                this.positionY = 0
                            }
                            else {
                                const beforeScale = this.scale
                                this.scale = 2
                                const diffScale = this.scale - beforeScale
                                this.positionX = (this.props.cropWidth / 2 - this.doubleClickX) * diffScale / this.scale
                                this.positionY = (this.props.cropHeight / 2 - this.doubleClickY) * diffScale / this.scale
                            }
                            Animated.parallel([
                                Animated.timing(this.animatedScale, {
                                    toValue: this.scale,
                                    duration: 100,
                                }),
                                Animated.timing(this.animatedPositionX, {
                                    toValue: this.positionX,
                                    duration: 100,
                                }),
                                Animated.timing(this.animatedPositionY, {
                                    toValue: this.positionY,
                                    duration: 100,
                                })
                            ]).start()
                        }


                    } else {
                        this.lastClickTime = new Date().getTime()
                    }
                }
                return false;
            },

            onMoveShouldSetPanResponder: (_evt, _gestureState) => {
                if (_evt.nativeEvent.changedTouches.length > 1) {
                    this.changeTouchState(true)
                }
                return this.state.isBeWillingTouch;
            },

            onPanResponderTerminationRequest: (_evt, _gestureState) => {
                return false;
            },

            onPanResponderMove: (_evt, _gestureState) => {
                if (_evt.nativeEvent.changedTouches.length <= 1) {
                    let diffX = _gestureState.dx - this.lastPositionX
                    if (this.lastPositionX === null) {
                        diffX = 0
                    }
                    let diffY = _gestureState.dy - this.lastPositionY
                    if (this.lastPositionY === null) {
                        diffY = 0
                    }

                    this.lastPositionX = _gestureState.dx
                    this.lastPositionY = _gestureState.dy

                    this.horizontalWholeCounter += diffX
                    this.verticalWholeCounter += diffY

                    if (Math.abs(this.horizontalWholeCounter) > 5 || Math.abs(this.verticalWholeCounter) > 5) {
                        clearTimeout(this.longPressTimeout)
                    }

                    if (this.props.panToMove) {
                        if (this.props.imageWidth * this.scale > this.props.cropWidth) {
                            if (this.horizontalWholeOuterCounter > 0) {
                                if (diffX < 0) {
                                    if (this.horizontalWholeOuterCounter > Math.abs(diffX)) {
                                        this.changeTouchState(false)
                                        this.horizontalWholeOuterCounter += diffX
                                        diffX = 0
                                    } else {
                                        this.changeTouchState(true)
                                        diffX += this.horizontalWholeOuterCounter
                                        this.horizontalWholeOuterCounter = 0
                                        this.props.horizontalOuterRangeOffset(0)
                                    }
                                } else {
                                    this.changeTouchState(false)
                                    this.horizontalWholeOuterCounter += diffX
                                }

                            } else if (this.horizontalWholeOuterCounter < 0) {
                                if (diffX > 0) {
                                    if (Math.abs(this.horizontalWholeOuterCounter) > diffX) {
                                        this.changeTouchState(false)
                                        this.horizontalWholeOuterCounter += diffX
                                        diffX = 0
                                    } else {
                                        this.changeTouchState(true)
                                        diffX += this.horizontalWholeOuterCounter
                                        this.horizontalWholeOuterCounter = 0
                                        this.props.horizontalOuterRangeOffset(0)
                                    }
                                } else {
                                    this.changeTouchState(false)
                                    this.horizontalWholeOuterCounter += diffX
                                }
                            } else {
                                if (diffX != 0 && diffX!=this.horizontalWholeCounter) {
                                    this.changeTouchState(true)
                                }
                            }

                            this.positionX += diffX / this.scale

                            const horizontalMax = (this.props.imageWidth * this.scale - this.props.cropWidth) / 2 / this.scale
                            if (this.positionX < -horizontalMax) {
                                this.positionX = -horizontalMax

                                this.horizontalWholeOuterCounter += -1 / 1e10
                            } else if (this.positionX > horizontalMax) {
                                this.positionX = horizontalMax

                                this.horizontalWholeOuterCounter += 1 / 1e10
                            }
                            this.animatedPositionX.setValue(this.positionX)
                        } else {
                            this.horizontalWholeOuterCounter += diffX
                            this.changeTouchState(false)
                        }

                        if (this.horizontalWholeOuterCounter > this.props.maxOverflow) {
                            this.horizontalWholeOuterCounter = this.props.maxOverflow
                        } else if (this.horizontalWholeOuterCounter < -this.props.maxOverflow) {
                            this.horizontalWholeOuterCounter = -this.props.maxOverflow
                        }

                        if (this.horizontalWholeOuterCounter !== 0) {
                            this.props.horizontalOuterRangeOffset(this.horizontalWholeOuterCounter)
                        }

                        if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                            this.positionY += diffY / this.scale
                            this.animatedPositionY.setValue(this.positionY)
                        }
                    }
                } else {
                    if (this.longPressTimeout) {
                        clearTimeout(this.longPressTimeout)
                    }

                    if (this.props.pinchToZoom) {
                        let minX: number
                        let maxX: number
                        if (_evt.nativeEvent.changedTouches[0].locationX > _evt.nativeEvent.changedTouches[1].locationX) {
                            minX = _evt.nativeEvent.changedTouches[1].pageX
                            maxX = _evt.nativeEvent.changedTouches[0].pageX
                        } else {
                            minX = _evt.nativeEvent.changedTouches[0].pageX
                            maxX = _evt.nativeEvent.changedTouches[1].pageX
                        }

                        let minY: number
                        let maxY: number
                        if (_evt.nativeEvent.changedTouches[0].locationY > _evt.nativeEvent.changedTouches[1].locationY) {
                            minY = _evt.nativeEvent.changedTouches[1].pageY
                            maxY = _evt.nativeEvent.changedTouches[0].pageY
                        } else {
                            minY = _evt.nativeEvent.changedTouches[0].pageY
                            maxY = _evt.nativeEvent.changedTouches[1].pageY
                        }

                        const widthDistance = maxX - minX
                        const heightDistance = maxY - minY
                        const diagonalDistance = Math.sqrt(widthDistance * widthDistance + heightDistance * heightDistance)
                        this.zoomCurrentDistance = Number(diagonalDistance.toFixed(1))
                        if (this.zoomLastDistance !== null) {
                            let distanceDiff = (this.zoomCurrentDistance - this.zoomLastDistance) / 200
                            let zoom = this.scale + distanceDiff

                            if (zoom < 0.6) {
                                zoom = 0.6
                            }
                            if (zoom > 10) {
                                zoom = 10
                            }
                            const beforeScale = this.scale
                            this.scale = zoom
                            this.animatedScale.setValue(this.scale)
                            const diffScale = this.scale - beforeScale
                            this.positionX -= this.centerDiffX * diffScale / this.scale
                            this.positionY -= this.centerDiffY * diffScale / this.scale
                            this.animatedPositionX.setValue(this.positionX)
                            this.animatedPositionY.setValue(this.positionY)
                        }
                        this.zoomLastDistance = this.zoomCurrentDistance
                    }
                }
            },

            onPanResponderRelease: (_evt, _gestureState) => {
                this.changeTouchState(true)

                if (this.isDoubleClickScale) {
                    return
                }

                if (this.scale < 1) {
                    this.scale = 1
                    Animated.timing(this.animatedScale, {
                        toValue: this.scale,
                        duration: 100,
                    }).start()
                }

                if (this.props.imageWidth * this.scale <= this.props.cropWidth) {
                    this.positionX = 0
                    Animated.timing(this.animatedPositionX, {
                        toValue: this.positionX,
                        duration: 100,
                    }).start()
                }

                if (this.props.imageHeight * this.scale <= this.props.cropHeight) {
                    this.positionY = 0
                    Animated.timing(this.animatedPositionY, {
                        toValue: this.positionY,
                        duration: 100,
                    }).start()
                }

                if (this.props.imageHeight * this.scale > this.props.cropHeight) {
                    const verticalMax = (this.props.imageHeight * this.scale - this.props.cropHeight) / 2 / this.scale
                    if (this.positionY < -verticalMax) {
                        this.positionY = -verticalMax
                    } else if (this.positionY > verticalMax) {
                        this.positionY = verticalMax
                    }
                    Animated.timing(this.animatedPositionY, {
                        toValue: this.positionY,
                        duration: 100,
                    }).start()
                }

                if (this.scale === 1) {
                    this.positionX = 0
                    this.positionY = 0
                    Animated.timing(this.animatedPositionX, {
                        toValue: this.positionX,
                        duration: 100,
                    }).start()
                    Animated.timing(this.animatedPositionY, {
                        toValue: this.positionY,
                        duration: 100,
                    }).start()
                }

                this.horizontalWholeOuterCounter = 0

                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout)
                }

                const stayTime = new Date().getTime() - this.lastTouchStartTime
                const moveDistance = Math.sqrt(_gestureState.dx * _gestureState.dx + _gestureState.dy * _gestureState.dy)
                if (_evt.nativeEvent.changedTouches.length === 1 && stayTime < this.props.leaveStayTime && moveDistance < this.props.leaveDistance) {
                    this.props.onClick()
                } else {
                    this.props.responderRelease(_gestureState.vx, this.scale)
                }
            },

            onPanResponderTerminate: (_evt, _gestureState) => {
                if (this.longPressTimeout) {
                    clearTimeout(this.longPressTimeout)
                }
            }
        })
    }

    render() {
        const animateConf = {
            transform:[{
                scale: this.animatedScale
            }, {
                translateX: this.animatedPositionX
            }, {
                translateY: this.animatedPositionY
            }]
        }
        return (
            <View style={[styles.container,{
                width:this.props.cropWidth,
                height:this.props.cropHeight,
            }]} {...this.imagePanResponder.panHandlers}>
                <Animated.View style={animateConf}>
                    <View
                          style={{
                              width: this.props.imageWidth,
                              height: this.props.imageHeight,
                          }}>
                        {this.props.children}
                    </View>
                </Animated.View>
            </View>
        )

    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'transparent',
    } as ViewStyle,

})
