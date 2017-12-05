# ~~react-native-zoom-view ~~

## 效果

![icon1.gif](http://upload-images.jianshu.io/upload_images/2646598-00e16d95fbbb5c0c.gif?imageMogr2/auto-orient/strip)

>- 实现图片放大缩小和完美兼容三方左右滑控件

## 安装 
>- yarn add react-native-zoom-view 
>- npm install react-native-zoom-view

## 单独实现缩放
``` html
import ViewControl from 'react-native-zoom-view'
const {width,height} = Dimensions.get('window')

<ViewControl
    cropWidth={width}     
    cropHeight={height}
    imageWidth={width}
    imageHeight={height}>
    <Image
	style={{
	    width:width,
	    height:height,
	    resizeMode: 'contain'
	}}
	source={{
	    uri:item
	}}/>
</ViewControl>

```
## 实现缩放和左右滑

``` html

实现缩放和左右滑
import Swiper from 'react-native-swiper'
import ViewControl from 'react-native-zoom-view'

renderSwiperItemView() {
const imgs = [
    'http://img1.ph.126.net/u1dVCkMgF8qSqqQLXlBFQg==/6631395420169075600.jpg',
    'http://img2.ph.126.net/PqPdn4nhTSXTlPfDE_igJg==/6631322852401020356.jpg',
    'http://img1.ph.126.net/Ta6-WaHwuYMSehnn6Xcmyg==/6631426206490316698.jpg',
    'http://img0.ph.126.net/bCkBoPHS4d32mUJPqBIYrQ==/6631803338979839988.jpg',
    'http://img2.ph.126.net/bkaOfRyDoyddXri0GjpWjA==/6630608169839463386.jpg',
];
return imgs.map((item,i)=>{
    return (
	<ViewControl
	    key={i}
	    cropWidth={width}
	    cropHeight={height}
	    imageWidth={width}
	    imageHeight={height}>
	    <Image
		style={{
		    width:width,
		    height:height,
		    resizeMode: 'contain'
		}}
		source={{
		    uri:item
		}}/>
	</ViewControl>
    )
})
}

render() {
return (
    <Swiper
	loop={false}
	showsPagination={false}>
	{this.renderSwiperItemView()}
    </Swiper>
);
}
    

```

## 文档

| Props | Type | Description | DefaultValue
| ------ | ----------- | ----------- | ----------- |
| **cropWidth(required)** | number | operating area width | 100 |
| **cropHeight(required)** | number | operating area height | 100 |
| **imageWidth(required)** | number | picture width | 100 |
| **imageHeight(required)** | number | picture height | 100 |
| onClick | ()=>void | onClick | ()=>{} |
| panToMove | boolean | allow to move picture with one finger | true |
| pinchToZoom | boolean | allow scale with two fingers | true |
| leaveStayTime | number | how many milliseconds after the finger presses to trigger `onClick` | 100 |
| leaveDistance | number | how many finger movement can also trigger `onClick`  | 10 |
| horizontalOuterRangeOffset | (offsetX?: number)=>void | horizontal beyond the distance, the parent to do picture switching, you can listen to this function. When this function is triggered, you can do the switch operation | ()=>{} |
| onDragLeft | ()=>void | trigger to switch to the left of the graph, the left sliding speed exceeds the threshold when triggered | ()=>{} |
| responderRelease | (vx: number)=>void | let go but do not cancel | ()=>{} |
| maxOverflow | number | maximum sliding threshold | 100 |
| longPressTime | number | long press threshold | 800 |
| onLongPress | ()=>void | on longPress | ()=> {} |

## Reference 
>- 图片放到缩小和属性名字都是来自react-native-image-zoom，只是修改了和添加了一些方法使其更加兼容左右滑。
>- [react-native-image-zoom](https://github.com/ascoders/react-native-image-zoom)
