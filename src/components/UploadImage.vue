<script setup lang="ts">
import server from '../js/server.js';
import {
    ref,
    defineProps,
    defineEmits,
    watch,
    onMounted
} from 'vue';
import * as icon from '@element-plus/icons-vue'
import type {
    UploadProps
} from 'element-plus'

//请求头
const headers = ref(null);

//文件列表
const fileList = ref([]);

//组件入参
const props = defineProps({
    param: {
        type: String,
        default: null
    },
    files: {
        type: String,
        default: ""
    },
    max: {
        type: Number,
        default: 1
    },
    //文件限制大小（kb）
    size: {
        type: Number,
        default: 1024
    },
    //预览图尺寸的宽度
    width: {
        type: Number,
        default: 150
    },
    //预览图尺寸的高度
    height: {
        type: Number,
        default: 150
    },
    //移动
    move: {
        type: Boolean,
        default: true
    },
    //删除
    del: {
        type: Boolean,
        default: true
    },
});

//监听事件
const emits = defineEmits(["change", "update:files"])


//初始化请求头
onMounted(() => {
    var _loginUser = server.getCache("LoginUser");
    var _loginToken = "";
    if (_loginUser != null && new Date(_loginUser.ExpireDate) > new Date()) {
        _loginToken = _loginUser.LoginToken;
    }
    headers.value = {
        "loginToken": _loginToken,
        "Authorization": "Bearer " + _loginToken
    };
})

//监听文件列表
watch(() => props.files, (newValue, oldValue) => {
    if (newValue != null && newValue != "") {
        fileList.value = newValue.split(',')
    } else {
        fileList.value = [];
    }
}, {
    immediate: true,
    deep: true
});

//上传相册前校验
const onBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (file.size > 1024 * props.size && props.size > 0) {
        server.toast("文件不能大于" + (props.size > 1024 * 1024 ? Math.floor(props.size / (1024 * 1024) * 100) /
            100 + "GB" : props.size > 1024 ? Math.floor(props.size / 1024 * 100) / 100 + "MB" : props
                .size + "KB"));
        return false;
    }
}

//上传成功
const onUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    // var isComplete = true;
    // for (var i = 0; i < fileList.value.length; i++) {
    // 	if (fileList[i].status != "success") {
    // 		isComplete = false;
    // 	}
    // }

    var _fileList = fileList.value;
    if (props.max > 1) {
        _fileList.push(response.data.FilePath);
    } else {
        _fileList = [response.data.FilePath];
    }

    fileList.value = _fileList;

    _callback();
}

//左右移动文件
const onMoveFile = function (index, type) {
    var item = fileList.value[index];

    if (type == "left") {
        if (index == 0) {
            //移到最后
            fileList.value.splice(index, 1)
            fileList.value.push(item);
        } else {
            //移到左侧
            fileList.value.splice(index, 1)
            fileList.value.splice(index - 1, 0, item)
        }
    } else {
        if (index == fileList.value.length - 1) {
            //移到最前
            fileList.value.splice(index, 1)
            fileList.value.splice(0, 0, item);
        } else {
            //移到右侧
            fileList.value.splice(index, 1)
            fileList.value.splice(index + 1, 0, item)
        }
    }
    _callback();
};

//打开预览
const onPreView = function (item) {
    window.open(server.FileHost() + item)
}

//删除文件
const onDeleteFile = function (index, e) {
    fileList.value.splice(index, 1)
    _callback();

    if (e) {
        e.stopPropagation()
    }
};

//回调通知
const _callback = function () {
    var _fileList = fileList.value;
    if (props.max > 1 && _fileList.length > props.max) {
        _fileList = _fileList.slice(0, props.max)
    }

    emits("change", _fileList.join(','), props.param)
    emits("update:files", _fileList.join(','))
}
</script>

<template>
    <div>
        <div style="display: flex; justify-content: flex-start;">
            <el-upload name="file" class="upload-demo" ref="upload" :action="server.FileHost() + 'sys/file/upload'"
                :headers="headers" :multiple="max - fileList.length > 1" :show-file-list="false"
                accept=".jpg,.png,.gif,.jpeg" :before-upload="onBeforeUpload" :on-success="onUploadSuccess"
                :disabled="max > 1 && fileList.length >= max">
                <el-button type="primary" :icon="icon.Upload">选择图片
                    <span v-if="max > 1">( {{ fileList.length }} / {{ max }} )</span>
                </el-button>
            </el-upload>
        </div>

        <div v-if="fileList != null && fileList.length > 0" class="zhiwei_albums"
            style="margin-top:5px; user-select:none">
            <div v-for="(item, index) in fileList" class="albums_item"
                onmouseenter="this.childNodes[1].style.display='flex'"
                onmouseleave="this.childNodes[1].style.display='none'">

                <img :src="server.FileHost() + item" :style="{ 'width': width + 'px', 'height': height + 'px' }" />

                <div class="zhiwei_flex albums_tools" style="display:none">

                    <div class="albums_tools_mask"></div>

                    <div class="albums_tools_main">

                        <div v-if="fileList.length > 1" class="tool_item">

                            <el-icon style="padding:5px; background-color: #fff; cursor: pointer; border-radius:100%;"
                                title="左移" v-on:click="onMoveFile(index, 'left')">

                                <icon.ArrowLeftBold />

                            </el-icon>

                        </div>



                        <div class="tool_item">

                            <el-icon style="padding:5px; background-color: #fff; cursor: pointer; border-radius:100%;"
                                title="预览" v-on:click="onPreView(item)">

                                <icon.Search />

                            </el-icon>

                        </div>



                        <div class="tool_item">

                            <div class="tool_item" style="margin-top:3px">

                                <el-icon
                                    style="padding:5px; background-color: #fff; cursor: pointer; border-radius:100%;"
                                    title="删除" @click="onDeleteFile(index)">

                                    <icon.DeleteFilled />

                                </el-icon>

                            </div>

                        </div>



                        <div v-if="fileList.length > 1" class="tool_item">

                            <el-icon style="padding:5px; background-color: #fff; cursor: pointer; border-radius:100%;"
                                title="右移" v-on:click="onMoveFile(index, 'right')">

                                <icon.ArrowRightBold />

                            </el-icon>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>

<style>
.zhiwei_albums {
    display: flex;
    flex-wrap: wrap;
}

.zhiwei_albums .albums_item {
    border: solid 1px #eee;
    margin-right: 10px;
    background-color: #fff;
    border-radius: 2px;
    position: relative
}

.albums_tools {
    position: absolute;
    z-index: 1;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

.albums_tools .albums_tools_mask {
    position: absolute;
    z-index: 1;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: #ffffff;
    opacity: 0.5;
    text-align: center
}

.albums_tools .albums_tools_main {
    position: absolute;
    z-index: 2;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
}

.albums_tools .albums_tools_main .tool_item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.albums_tools .albums_tools_main .tool_item_btn {
    background-color: #666;
    color: #fff;
    width: 25px;
    height: 25px;
    line-height: 25px;
    font-size: 15px;
    border-radius: 100%;
    text-align: center;
    cursor: pointer
}
</style>