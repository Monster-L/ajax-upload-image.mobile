/**
 * 创建遮罩层js
 */
function Wrapper(t) {
            var i = document.body.scrollHeight > window.screen.availHeight ? document.body.scrollHeight + "px" : window.screen.availHeight + "px";
            this.config = $.extend({}, {
                zIndex: 100,
                opacity: .5,
                width: "100%",
                height: i,
                top: 0,
                background: "#000"
            }, t || {}),
            this.$wrapper = $("#J_wrapper").length > 0 ? $("#J_wrapper") : function() {
                return $("body").append($('<div id="J_wrapper"></div>')),
                $("#J_wrapper")
            }
            (),
            $.extend(Wrapper.prototype, {
                show: function(t) {
                    var i = this;
                    return $("body").css("overflow", "hidden"),
                    i.$wrapper.css({
                        position: "absolute",
                        opacity: i.config.opacity,
                        background: i.config.background,
                        zIndex: i.config.zIndex,
                        top: i.config.top,
                        width: i.config.width,
                        height: i.config.height
                    }),
                    $.isFunction(t) && t.call(i),
                    i.$wrapper
                },
                close: function() {
                    this.$wrapper.remove(),
                    $("body").css("overflow", "auto")
                }
            })
        }