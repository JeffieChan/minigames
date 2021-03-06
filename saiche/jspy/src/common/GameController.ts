class GameController {

	private _mainScenePanel:ui.MainScenePanel
	private static _instance:GameController

	private _timer:egret.Timer
	public serverModel:ServerModel = new ServerModel()

	public is_game_over:boolean = false
	public offline_score:number = 0
	private _gameLogicComponent:GameLogicComponent
	private _commonUIComponent:CommonUIComponent

	public is_win:boolean = false
	public is_fail:boolean = false

	private _has_play_end_time_sound:boolean = false
	public constructor() {
	}

	public static get instance():GameController
	{
		if(!GameController._instance)
		{
			GameController._instance = new GameController()
		}
		return GameController._instance
	}

	public SetMainScenePanel(mainPanel:ui.MainScenePanel):void
	{
		this._mainScenePanel = mainPanel
	}
	
	public GetMainScenePanel():ui.MainScenePanel
	{
		return this._mainScenePanel
	}

	public StartGame():void
	{
		this._mainScenePanel.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
		this._startTimer()
	}
	
	private _onEnterFrame():void
	{
		this._mainScenePanel.GetCommonUIComponent().OnEnterFrame()
		this._mainScenePanel.GetGameLogicComponent().OnEnterFrame()
	}

	private _startTimer():void
	{
		var timer:egret.Timer = new egret.Timer(1000, Const.GAME_TIME);
		//注册事件侦听器
		timer.addEventListener(egret.TimerEvent.TIMER,this._on_timer_tick,this);
		//开始计时
		timer.start()
		this._timer = timer
	}

	private _on_timer_tick():void
	{
		this.serverModel.left_time -= 1
		this.serverModel.left_time = Math.max(this.serverModel.left_time, 0)
		this._mainScenePanel.UpdateTime()
		this._mainScenePanel.GetGameLogicComponent().onTimer()
		if(this.serverModel.left_time <= 0){
			this.OnClientOver()
			if(!GameNet.isConnected()){
				GamePlatform.onFinished()
			}
		}
		if(this.serverModel.left_time <= 5){
			if(this._has_play_end_time_sound)
			{
				return
			}
			if(this.serverModel.left_time == 0){
				this._has_play_end_time_sound = true
				SoundManager.getInstance().playSound("last_one_second_mp3")
			}else{
				SoundManager.getInstance().playSound("dead_line_tips_mp3")
			}
		}
	}

	private _clearGame():void
	{
		this._clearTimer()
		this._mainScenePanel.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this)
	}

	private _clearTimer():void
	{
		if(this._timer)
		{
			this._timer.stop();
			this._timer = null
		}
	}

	private _real_over():void
	{
		GamePlatform.onCalculating()
		CommonUtils.performDelay(function(){
			GamePlatform.onFinished()
		}.bind(this), 2 * 1000, this)
	}

	public GameOver():void
	{
		if(this.is_game_over){
			return
		}
		this.is_game_over = true
		this._clearGame()
		let __this= this
		this._mainScenePanel.PlayResultAnimation(function(){
			__this._real_over()
		})
	}

	private _is_client_over = false
	public OnClientOver():void
	{
		this._is_client_over = true
		this._clearGame()
	}

	private _has_finished = false
	public OnDisConnected():void
	{
		if(this._is_client_over)
		{
			if(!this._has_finished)
			{
				this._has_finished = true
				GamePlatform.onFinished()
			}
		}
	}
}