<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import server from '../../js/server.js';
import util from '../../js/util.js';

export default {
    setup() {
        const router = useRouter();

        return {
            server,
            //跳转页面
            onOpenPage(_pageUrl) {
                router.push(_pageUrl);
            }
        }
    },
    data() {
        return {
            loginUser: null
        }
    },
    created() {
        this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))
    },
    methods: {

    }
}
</script>


<template>
    <div class="main">
        <div class="zhiwei_flex" style="padding: 15px 20px; background-color: #ffffff; border-radius: 5px;"
            @click="server.alert()">
            <img style="width: 45px; height: 45px" src="/public/images/icons/logo.png" />
            <div style="padding-left: 10px; min-width: 200px;">
                <div style="font-weight: 700;">张医生</div>
                <div style="margin-top:5px; font-size:14px; color:#a4a4a4">这是张医生的AI分身</div>
            </div>
            <div style="color:#a4a4a4; line-height:45px; font-size: 20px;">
                <el-icon>
                    <ArrowRight />
                </el-icon>
            </div>
        </div>
        <div style="flex:10; height:100px; background-color: #f3970c;">

        </div>
        <div style="background-color: #008000; height:100px">

        </div>
    </div>
</template>

<style>
.main {
    padding: 15px 20px;
    display: flex;
    flex-direction: column;
    background-color: #ff9999;
    height: calc(100vh - 90px);
}
</style>