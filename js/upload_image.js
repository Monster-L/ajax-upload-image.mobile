/**
 * 图片上传js
 * @param $parent	放置图片父元素
 * @param options	个性配置对象
 * @returns {imageUploader}
 */
function ImageUploader($parent, options) {
	var imageUploader = function($parent, options) {
		var n = this;
		n.config = $.extend({}, {
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
			}, options),
			n.file = null,
			n.$controller = $parent,
			n.$uploadBtn = $parent.find(n.config.uploadBtn),
			n.$fileInput = $parent.find(n.config.fileInput),
			n.$uploadBtn.css({
				overflow: "hidden"
			}),
			n.$uploadBtn.on("click", function() {
				n.$fileInput.focus();
			})
		return n.uploadImage();//默认进入uploadImage
	};

	$.extend(imageUploader.prototype, {

		uploadImage: function() {

			var context = this;

			/**
			 * @param  {image dataurl}
			 */
			function upload(result) {
				//图片大小控制
				if (result.length / 1024 / 1400 >= context.config.limitSize) {
					context.$fileInput.val("");
					alert("上传文件太大");
					return;
				}

				var img = $("<img>"),
					time = (new Date).getTime();

				var content = "";
				context.$uploadBtn.addClass("loading");

				$.ajax({
					type: "post",
					url: context.config.uploaderUrl,
					data: {
						photo: result
					},
					dataType: "json",
					cache: !1,
					success: function(data) {
						/**
						 * 图片上传服务器后返回图片url地址，之后操作通过访问url进行
						 */
						var picUrl = data.picUrl;

						console.log(picUrl);
						img[0].onload = function() {
							var imageName = "img_" + time;
							var index = $("img.preview").length;
							context.$uploadBtn.before(img.addClass("small").addClass(context.config.prevClass).addClass(imageName));
							context.$uploadBtn.before('<input type="hidden" name="' + context.config.inputName + '[' + index + ']" class="' + imageName + '" value="' + picUrl + '">')
							img.attr('data-url', picUrl);
							img.on("click", function() {
								_wrapperShow(this.dataset['url'], imageName);
							});
							context.$uploadBtn.removeClass("loading");
							context.config.afterComplete.call(context);
						};
						img[0].src = picUrl;
					},
					error: function() {

					},
					complete: function() {

					}
				})

			}

			context.$fileInput.on("change", function(e) {
				//限制上传图片数量
				if (context.$uploadBtn.siblings("." + context.config.prevClass).length >= context.config.limitNum) {
					context.$fileInput.val("");
					alert("最多可上传: " + i.config.limitNum + "张")
					return;
				}
				context.config.beforeComplete.call(context);
				var n = context.file = e.target.files[0];
				if (context.file) {
					var reader = new FileReader;
					reader.onloadend = function(e) {
						//iOS设备 需进行旋转
						if (_isIos()) {
							_canvasResize(e.target.result, upload);
						} else {
							upload(e.target.result);
						}
					}
					reader.readAsDataURL(context.file);
				}
			});
		}

	})

	/**
	 * 将图片绘制在父容器中
	 * @param  {绘制图片父容器}
	 * @param  {[图片url地址]}
	 * @return {[type]}
	 */
	function _drawOnCanvas($parent, picUrl) {
		var dataURL = picUrl,
			canvas = $('<canvas/>')[0],
			ctx = canvas.getContext('2d'),
			img = new Image();
		$parent.addClass('g-img-loading');
		img.onload = function() {
			var width = img.width,
				height = img.height,
				needWidth = 320,
				screenWidth = window.screen.availWidth;
			//根据所需宽度对图片进行缩放
			if (width > screenWidth) {
				canvas.width = screenWidth;
				canvas.height = height * (screenWidth / width);
			} else {
				canvas.width = width;
				canvas.height = height;
			}

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			/*var base64 = canvas.toDataURL('image/jpeg', 0.5);
			$('#j_thumb').val(base64.substr(22));*/
			//添加到父元素
			$parent.append(canvas);
		};

		$(img).one("load", function() {
			$parent.removeClass("g-img-loading");
		});

		img.src = dataURL;
	}

	/**
	 * 图片预览操作
	 * @param  {图片url}
	 * @param  {当前操作图片名称}
	 * @return {[type]}
	 */
	function _wrapperShow(picUrl, imageName) {
		//新建遮罩层
		var wrap = new Wrapper({
			zIndex: 200,
			overflow: "hidden",
			opacity: 0.8
		});
		var $slider = $("#J_ImageSlider").length > 0 ? $("#J_ImageSlider") : function() {
			return $("body").append($('<div id="J_ImageSlider"></div>')),
				$("#J_ImageSlider")
		}();
		$slider.html("");
		var l = $('<div class="' + imageName + '"/>');
		l.css({
				paddingTop: "5%",
				height: "90%",
				width: "100%",
				textAlign: "center",
				position: "absolute",
				top: "0px",
				left: "0px",
				zIndex: "600"
			}),
			_drawOnCanvas(l, picUrl);
		//操作按钮
		l.append('<p><a href="#" class="J_Image_Del" data-cname="' + imageName + '">删除</a><a href="#" class="J_Slider_Close" data-cname="' + imageName + '">关闭</a></p>'),
			l.find("p").css({
				position: "absolute",
				bottom: 0,
				width: "100%"
			}).find("a").css({
				color: "#ccc",
				display: "inline-block",
				width: "35%",
				boxShadow: "0 0 5px #000",
				border: "1px solid #444",
				padding: "5px 0",
				background: "#000"
			}),
			l.css({
				width: "100%",
				textAlign: "center"
			})
		$slider.append(l);
		//显示遮罩层
		wrap.show(function() {

			$(".J_Slider_Close").on("click", function() {
				$slider.remove();
				wrap.close();
			});

			$(".J_Image_Del").on("click", function() {
				var imageName = $(this).data("cname");
				$("." + imageName).remove();
				$slider.remove();
				wrap.close();
			});

		});

	}

	/**
	 * 用于将dataurl 转换为 blob 上传图片所需
	 * @param  {img dataurl}
	 * @return {[type]}
	 */
	function _dataURLtoBlob(dataurl) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	}

	/**
	 * 检测是否为ios系统
	 */
	function _isIos() {
		var e = navigator.userAgent;
		return e.match(/(iPad).*OS\s([\d_]+)/) || e.match(/(iPod)(.*OS\s([\d_]+))?/) || e.match(/(iPhone\sOS)\s([\d_]+)/)
	}

	/**
	 * 旋转图片
	 * @param  {img}
	 * @param  {direction}
	 * @param  {canvas}
	 * @return {[type]}
	 */
	function _rotateImg(img, direction, canvas) {
		//最小与最大旋转方向，图片旋转4次后回到原方向    
		var min_step = 0;
		var max_step = 3;
		//var img = document.getElementById(pid);    
		if (img == null) return;
		//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
		var height = img.height;
		var width = img.width;
		//var step = img.getAttribute('step');    
		var step = 2;
		if (step == null) {
			step = min_step;
		}
		if (direction == 'right') {
			step++;
			//旋转到原位置，即超过最大值    
			step > max_step && (step = min_step);
		} else {
			step--;
			step < min_step && (step = max_step);
		}

		//旋转角度以弧度值为参数    
		var degree = step * 90 * Math.PI / 180;
		var ctx = canvas.getContext('2d');
		switch (step) {
			case 0:
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0);
				break;
			case 1:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, 0, -height);
				break;
			case 2:
				canvas.width = width;
				canvas.height = height;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, -height);
				break;
			case 3:
				canvas.width = height;
				canvas.height = width;
				ctx.rotate(degree);
				ctx.drawImage(img, -width, 0);
				break;
		}
	}

	/**
	 * @param  {dataurl}
	 * @param  {upload function}
	 * @return {[type]}
	 */
	function _canvasResize(result, upload) {
		var image = new Image()
		base64 = null;
		image.src = result;
		image.onload = function() {
			var Orientation = "";

			EXIF.getData(this, function() {
				Orientation = EXIF.getTag(this, 'Orientation');
			});
			var expectWidth = this.naturalWidth;
			var expectHeight = this.naturalHeight;

			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = expectWidth;
			canvas.height = expectHeight;
			ctx.drawImage(this, 0, 0, expectWidth, expectHeight);

			//等于1不需要旋转
			if (Orientation != "" && Orientation != 1) {
				switch (Orientation) {
					case 6: //需要顺时针（向左）90度旋转  
						_rotateImg(this, 'left', canvas);
						break;
					case 8: //需要逆时针（向右）90度旋转  
						_rotateImg(this, 'right', canvas);
						break;
					case 3: //需要180度旋转  
						_rotateImg(this, 'right', canvas); //转两次  
						_rotateImg(this, 'right', canvas);
						break;
				}
			}
			base64 = canvas.toDataURL("image/png", 0.8);
			upload(base64);
		}
	}

	return new imageUploader($parent, options);
};