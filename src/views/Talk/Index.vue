<script>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import server from '../../js/server.js';

export default {
	setup() {
		const router = useRouter();

		//  talk/index?promptId=1
		//接收传参
		const talkId = router.currentRoute.value.query.talkId;
		const promptId = router.currentRoute.value.query.promptId;


		//查询Prompt
		//this.onLoadPrompt(promptId);

		return {
			//当前对话的ID
			talkId: talkId,
			promptId: promptId,
			//助手数据
			promptModel: null,
			//跳转页面
			onOpenPage(_pageUrl) {
				router.push(_pageUrl);
			}
		}
	},
	data() {
		return {
			loginUser: null,
			//消息队列
			messageList: [],
			//发送消息的内容
			txtSendContent: "",
			markdownContent: '# Hello, Vue Markdown!'
		}
	},
	created() {
		this.loginUser = JSON.parse(localStorage.getItem("LoginUser"))



		if (this.talkId > 0) {
			console.log("talkId", this.talkId)
			//API加载会话信息和历史消息记录
			this.LoadTalkModel(this.talkId);

		} else {
			this.LoadData()
			//根据传入的PromptId查询详情
			this.onLoadPrompt(this.promptId)
		}
	},
	computed: {
		htmlContent() {
			return marked(this.markdownContent);
		}
	},
	methods: {
		LoadData() {
			let _that = this

			setTimeout(function () {

				_that.messageList.push({
					"MessageId": 1,
					"UserId": 0,
					"MessageContent": "Hi，我是智慧健康AI助手～\n请将你的问题发给我，我来帮你看看吧"
				})

			}, 500)
		},
		LoadTalkModel() {

			//{ TalkModel:{}, PromptModel:{}, MessageList:[] }
			server.send({
				url: "/sys/llm/talk",
				data: { talkId: this.talkId },
				success: function (res) {
					if (res != null) {
						_that.talkModel = res.data.TalkModel
						_that.promptModel = res.data.PromptModel

						//第二种：处理消息结构
						for (var i = 0; i < res.data.MessageList.length; i++) {
							let message = res.data.MessageList[i]
							_that.messageList.push({
								"MessageId": message.Id,
								"UserId": message.Role == "user" ? res.data.TalkModel.UserId : 0,
								"MessageContent": message.Content
							})
						}
					}
				}
			})
		},
		onLoadPrompt() {
			var _that = this


			//根据PromptId查询详情
			server.send({
				url: "/",
				data: { promptId: this.promptId },
				success: function () {
					_that.promptModel = res.data
				}
			})
		},
		//发送消息
		onSendMessage() {
			let _that = this
			let _txtSendContent = this.txtSendContent

			if (_txtSendContent == null || _txtSendContent.length == 0) {
				server.toast("请输入消息内容")
				return;
			}

			//插入消息
			this.messageList.push({
				"MessageId": 2,
				"UserId": this.loginUser.Id,
				"MessageContent": _txtSendContent
			})

			//清空数据
			_that.txtSendContent = ""

			//更改滚动条
			setTimeout(function () {
				var divMessageList = document.getElementById("divMessageList")
				divMessageList.scrollTop = 100000
			}, 10)

			//调用接口请求大模型
			server.send({
				"url": "/sys/llm/kimi",
				loading: true,
				data: {
					promptId: this.promptId,
					talkId: this.talkId,
					content: _txtSendContent
				},
				success(res) {
					if (res.code == 200 && res.data != null) {
						_that.talkId = res.data.TalkId;
						_that.messageList.push(res.data.MessageList)

						// _that.messageList.push(res.data)

						//更改滚动条
						setTimeout(function () {
							var divMessageList = document.getElementById("divMessageList")
							divMessageList.scrollTop = 100000
						}, 10)


					} else {
						server.toast(res.msg, 2)
					}
				}
			})


		}
	}
}
</script>

<template>
	<div class="zhiwei_flex">
		<!-- 助手工具栏 -->

		<div v-if="promptModel != null" style="padding:20px">

			<div style="width:250px; background-color: #fff; border-radius: 5px; box-shadow: 5px 5px 10px #ccc;">

				<div style="padding: 10px; display: flex; justify-content: flex-start; border-bottom: solid 1px #eee;">

					<img style="width:30px; height: 30px;" :src="promptModel.PromptIcon" />

					<div style=" flex:1; padding:0px 10px; line-height: 30px;">

						<div>{{ promptModel.PromptName }}</div>

					</div>

					<div style="padding-top:5px; line-height: 25px; color:#999">

						<el-icon>

							<Tools />

						</el-icon>

					</div>

				</div>

				<div style="padding:10px;">

					<div class="auto_hidden hidden_3" style=" color: #777; font-size:14px; word-break: break-all;">{{
			promptModel.PromptDesc }}</div>

				</div>

			</div>

		</div>

		<div class="main">

			<!-- 消息内容 -->

			<div id="divMessageList" style="flex:1; width:800px; margin: auto; overflow-y: auto;">

				<div v-for="(model, index) in messageList">



					<div v-if="model.UserId == 0" class="zhiwei_flex" style="padding:20px 0px">

						<!-- <img style="width: 60px; height:60px"
							src="https://statics.moonshot.cn/kimi-chat/static/01.0245bc9d.png" /> -->
						<img style="width: 50px; height:50px; margin-right: 10px" src="/images/icons/logo.png" />
						<div style="padding: 20px; border-radius: 3px; background-color: #fff; white-space: pre-wrap;">
							{{ model.MessageContent }}
						</div>

						<div style="min-width:100px"></div>

					</div>



					<div v-if="model.UserId > 0" style="padding:20px; display: flex; justify-content: flex-end;">

						<div style="min-width:100px"></div>

						<div style="padding: 20px; border-radius: 3px; background-color: #fff; white-space: pre-wrap;">

							{{ model.MessageContent }}

						</div>

						<img style="width: 60px; height:60px"
							src="https://statics.moonshot.cn/kimi-chat/static/01.0245bc9d.png" />

					</div>



				</div>

			</div>

			<!-- 输入区 -->

			<div class="zhiwei_flex" style="padding:10px 20px; width:800px; margin: auto;">

				<el-input v-model="txtSendContent" style="flex:1" placeholder="请输入您想问的问题"
					@keyup.enter="onSendMessage" />

				<el-button v-if="txtSendContent.length > 0" type="danger" style="height:50px; width: 150px"
					@click="onSendMessage">发送</el-button>

				<el-button v-else type="danger" disabled style="height:50px; width: 150px">发送</el-button>

			</div>

		</div>

	</div>
</template>


<style>
.main {
	padding: 15px 20px 0px 20px;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 75px);
}
</style>