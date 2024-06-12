import server from './server.js';

export default {
    //更新登录账号信息
    ReLoadLoginUser() {
        server.send({
            "url": "/sys/account/detail",
            loading: false,
            success(res) {
                if (res.code == 200 && res.data != null) {
					server.setCache("LoginUser", res.data)
                }
            }
        })
    }
}