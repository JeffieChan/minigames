class NetManager {
	private static _instance:NetManager = null

	private _mainScenePanel:ui.MainScenePanel
	private _serverModel:ServerModel = null
	private _waiting_join:boolean = false
	private is_connecting:boolean = false

	public constructor() {
		this._mainScenePanel = GameController.instance.GetMainScenePanel()
		this._serverModel = GameController.instance.serverModel
	}

	public static get instance():NetManager
	{
		if(!NetManager._instance)
		{
			NetManager._instance = new NetManager()
		}
		return NetManager._instance
	}

	private _real_join(body):void
	{
		GamePlatform.onStarted(function(){}.bind(this)); //onStarted
		if(body['player_list'])
		{
			let player_list:Array<Object> = body['player_list'] as Array<Object>
			if(player_list && player_list.length > 0)
			{
				for(let index = 0; index < player_list.length; index ++)
				{
					this._serverModel.AddRole(player_list[index])
				}
			}
			this._mainScenePanel.OnConnectServer()
		}

		GamePlatform.registerSurrenderCallback(function(){
			GameNet.reqSurrend()
		})
	}

	private onGameStartPush(msgId, body):void
	{
		if(!this._waiting_join){
			this._real_join(body)
			return	
		}
		let __this = this
		CommonUtils.performDelay(function(){
			__this._real_join(body)
		}.bind(this), 1 * 1000, this)
	}

	private onGameSecondPush(msgId, body):void
	{
		let left_time = body['second']
		if(Math.abs(left_time - this._serverModel.left_time) > 2){
			this._serverModel.left_time = left_time
		}
		this._serverModel.left_time = Math.max(this._serverModel.left_time, 0)
		this._mainScenePanel.UpdateTime()
	}

	private onGameScorePush(msgId, body):void
	{
		this._serverModel.UpdateRoleScore(body)
		this._mainScenePanel.UpdateScore()
	}

	private onGameStatusPush():void
	{
	}


	private onGameOverPush(msgId, body):void
	{
		let result = body['result']
		if(result != undefined){
			let winners_body = result['winners']
			if(winners_body != undefined){
				let winners:Array<Object> = winners_body as Array<Object>
				if(winners.length != 1){
					//平局
					// SoundManager.getInstance().playSound("game_result_draw_mp3")
				} else {
					if(winners[0] == GameController.instance.serverModel.myRole.openid){
						//胜利
						// SoundManager.getInstance().playSound("game_result_win_mp3")
						GameController.instance.is_win = true
					} else {
						//失败
						// SoundManager.getInstance().playSound("game_result_fail_mp3")
						GameController.instance.is_fail = true
					}
				}
			}
		}
		GameController.instance.GameOver()
	}

	private onGameReEnterPush(msgId, body):void
	{
		GameController.instance.offline_score = 0
		this._serverModel.ReEnterUpdateRoleInfo(body.player_list, body.score)
		this._mainScenePanel.UpdateScore()
	}

	private async reconnect()
	{
		await GameNet.connectServer()
		await GameNet.reqLogin(User.roomId)
		//断线重连 同步我的分数给服务器
		await GameNet.reqReEnter(GameController.instance.offline_score)
		this.is_connecting = false
		this._mainScenePanel.m_offline_tips.visible = false
	}

	
	private onDisconnected():void
	{
		this._mainScenePanel.m_offline_tips.visible = true
		if(GameController.instance.is_game_over){
			return
		}
		GameController.instance.OnDisConnected()
		GameNet.onDisconnected = this.onDisconnected.bind(this)
		if(this.is_connecting){
			let __this = this
			CommonUtils.performDelay(function(){
				if(this._is_game_over){
					return
				}
				if(GameNet.isConnected()){
					return
				}
				__this.is_connecting = true
				__this.reconnect()
			}.bind(this), 3 * 1000, this)
			return
		}
		this.is_connecting = true
		this.reconnect()
	}

	private onUpdateStatePush(msgId, body):void
	{
		if(GameController.instance.is_game_over){
			return
		}
		let id = body['id'] || body['openid']
		if(id == User.openId){
			return
		}
		let count = body['add']
	}	

	private onPropPush(msgId, body):void
	{
		let id = body['id'] || body['openid']
		if(id == User.openId){
			return
		}
		if(body['prop']){
			// if(body['prop'] == GamePropType.OtherStone){
			// 	GameController.instance.GetMainScenePanel().GetGameLogicComponent().OnReceiveOtherStone()
			// }
		}
	}

	public StartConnectServer():void
	{
		if(DEBUG && Config.debug){
			this._init_debug_role()
			this._mainScenePanel.OnConnectServer()
			return
		}
		let protocol = io.GameNet.GAME_PROTOCOL;
		GameNet.on(protocol.CMD_H5_GAME_START_PUSH, this.onGameStartPush.bind(this)); //游戏开始推送
		GameNet.on(protocol.CMD_H5_SECOND_PUSH, this.onGameSecondPush.bind(this)); //游戏时间推送
		GameNet.on(protocol.CMD_H5_GAME_STATUS_PUSH, this.onGameStatusPush.bind(this)); //游戏状态推送
		GameNet.on(protocol.CMD_H5_SCORE_PUSH, this.onGameScorePush.bind(this)); //游戏分数推送
		GameNet.on(protocol.CMD_H5_GAME_OVER_PUSH, this.onGameOverPush.bind(this)); //游戏结束推送
		GameNet.on(protocol.CMD_H5_REENTER_PUSH, this.onGameReEnterPush.bind(this)); //游戏重进推送

		GameNet.on(protocol.CMD_H5_PROP_PUSH, this.onPropPush.bind(this)); //得分推送
		GameNet.onDisconnected = this.onDisconnected.bind(this)

		GamePlatform.onInit(); //onInit
		this.run();
		this._waiting_join = true
		let __this = this
		CommonUtils.performDelay(function(){
			__this._waiting_join = false
		}.bind(this), 1 * 1000, this)
		GamePlatform.onWaiting(function(){}.bind(this)); //onWaiting
	}

	private _init_debug_role():void
	{
		this._serverModel.AddRole({openid:User.openId.toString(), nickname:"hehehe"})
		this._serverModel.AddRole({nickname:"hahaha"})
	}

	private async run() {
		await GameNet.connectServer();
		await GameNet.reqLogin(User.roomId);
		await GameNet.reqJoin();
	}
}