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
                    request.complete(response.data)
                }

                // 处理响应数据
                if (typeof (request.fail) == "function") {
                    request.fail(error)
                }
            });

    },
}