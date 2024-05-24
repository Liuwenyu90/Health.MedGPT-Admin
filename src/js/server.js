import axios from 'axios';
import sysConfig from '/src/config/sysConfig.js';
import {layer} from 'vue3-layer';

export default {

    _getHeader() {
        var _loginUser = this.getCache("LoginUser");
        var _loginToken = "";
        if (_loginUser != null && new Date(_loginUser.ExpireDate) > new Date()) {
            _loginToken = _loginUser.LoginToken;
        }
        var headers = {
            "Content-Type": "multipart/form-data",
            "loginToken": _loginToken
        };
        return headers;
    },
    //发送请求，默认有遮罩
    send: function (request, shade) {
        var _loadIndex = 0;
        if (request.loading === true) {
            _loadIndex = layer.load(0, {
                shade: shade === false ? 0 : 0.1,
                zIndex: layer.zIndex
            });
        }
        var _url = request.host != null ? request.host : sysConfig.apiHost;
        var _method = request.method != null ? request.method : "post";
        if (_url.lastIndexOf("/") == _url.length - 1) {
            if (request.url.indexOf("/") == 0) {
                _url += request.url.substring("1")
            } else {
                _url += request.url;
            }
        } else {
            if (request.url.indexOf("/") == 0) {
                _url += request.url
            } else {
                _url += "/" + request.url;
            }
        }

        axios.request({
            "url": _url,
            "method": _method,
            "headers": this._getHeader(),
            "data": request.data
        })
            .then(response => {
                if (_loadIndex > 0) {
                    layer.close(_loadIndex)
                }

                if (response.data != null && response.data.code == 901 && response.data.data == "logout") {
                    //执行退出操作
                    console.log("登录超时")

                    localStorage.removeItem("LoginUser");
                    window.parent.location.href = "/login";
                    return;
                }
                if (typeof (request.complete) == "function") {
                    request.complete(response.data)
                }

                // 处理响应数据  
                if (typeof (request.success) == "function") {
                    request.success(response.data)
                }
            })
            .catch(error => {
                if (_loadIndex > 0) {
                    layer.close(_loadIndex)
                }

                if (typeof (request.complete) == "function") {
                    request.complete(error)
                }

                // 处理响应数据
                if (typeof (request.fail) == "function") {
                    request.fail(error)
                }
            });

    },

	//提示
	toast: function (content, icon, options) {
		icon = icon != null ? icon : 0;
		layer.msg(content, {
			icon: icon,
			zIndex: layer.zIndex,
			shade: 0.5,
			shadeClose: options != null && options.close === false ? false : true,
		});
	},
	//提示
	alert: function (content, options, callback) {
		var index = layer.alert(content, {
			icon: options != null && options.icon != null ? options.icon : 0,
			area: options != null && options.width != null ? options.width : "auto",
			zIndex: layer.zIndex
		}, function () {
			layer.close(index);
			if (callback != null) {
				callback();
			}
		});
	},
	//确认框
	confirm: function (content, options, successFunc, errorFunc) {
		var index = layer.confirm(content, {
			title: options != null && options.title != null ? options.title : "提示",
			icon: options != null && options.icon != null ? options.icon : 3,
			btn: options != null && options.btn != null ? options.btn : ['确定', '取消'],
			area: options != null && options.area != null ? options.area : "auto",
			zIndex: layer.zIndex
		}, function () {
			layer.close(index);
			if (successFunc != null) {
				successFunc();
			}
		}, function () {
			if (errorFunc != null) {
				errorFunc();
			}
		});
	},
	//打开页面弹框
	dialog: function (name, url, width, height, callback) {
		if (width == null) {
			width = "100%";
		}
		if (height == null) {
			height = "100%";
		}

		layer.open({
			type: 2,
			title: name,
			shadeClose: false,
			shade: 0.3,
			maxmin: false,
			area: [width, height],
			content: url,
			zIndex: layer.zIndex,
			success: function (layero) {
				layer.setTop(layero);
			},
			end: function () {
				if (callback != null) {
					callback();
				}
			}
		});
	},

	//获取缓存数据
	getCache: function (key) {
		var value = localStorage.getItem(key);
		if (value != null) {
			try {
				return JSON.parse(value);
			} catch (e) {
				return value;
			}
		}
		return null;
	},
	//设置缓存数据
	setCache: function (key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	//移除缓存
	removeCache: function (key) {
		localStorage.removeItem(key);
	},
	//清除全部缓存
	clearCache: function () {
		localStorage.clear();
	},
}