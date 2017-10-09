# ajax-upload-image.mobile
移动端异步上传图片demo

### demo预览

![上传图片](https://github.com/OldGuys/ajax-upload-image.mobile/raw/master/demo_upload.png)

![图片操作](https://github.com/OldGuys/ajax-upload-image.mobile/raw/master/demo_scan.png)



### 如何使用？

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
3. 配置参数
```js
{
	inputName: "img",//input名，用于构造表单提交数据
	onlyShow: !1, //是否只查看
	uploadBtn: ".J_UploadBtn",//图片上传按钮
	fileInput: ".J_FileInput",//图片inputfile
	prevClass: "preview",//所有上传成功并显示的图片都会添加此类（可统计当前已上传图片张数）
	uploaderUrl: "",//图片上传url地址
	deleteUrl: "",//删除图片url地址
	limitSize: 5, //图片大小限制 5M
	limitNum: 5, //图片数量限制
	beforeComplete: function() {},//图片上传前回调函数
	afterComplete: function() {}//图片上传完成回调函数
}
```
