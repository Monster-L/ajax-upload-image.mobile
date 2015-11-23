# ajax-upload-image.mobile
移动端异步上传图片demo

###如何使用？

1. demo/index.html中样例所示，引入如下js
```html
<script type="text/javascript" src="../lib/exif.js"></script>
<script type="text/javascript" src="../js/wrapper.js"></script>
<script type="text/javascript" src="../js/upload_image.js"></script>
```
> exif.js是一个开源的读取图像的原始数据的功能扩展js，用于处理ios设备拍照上传存在的图片旋转问题

> wrapper.js创建遮罩层简单js

> upload_image.js图片展示操作依赖wrapper.js

2. 创建imageUpload
```js
//当前已上传图片张数
var i = function(){
    	return $("img.preview").length;
    }
    
new ImageUploader($(".upload-area"),{
	    	uploaderUrl:uploaderUrl,
	    	inputName:"imgs",
	    	beforeComplete:function(){
	    		$('#submitBtn').attr('disabled',true);
	    	},
	    	afterComplete: function() {
	    		$('#submitBtn').attr('disabled',false);
	    		if(i() > 0){
	    			$(".J_Showmeonfileuploaded").hide()
	    		}
	    		if(5 === i()){
	    			$(".upload-btn").hide();
	    		}
	        }
    });
```
