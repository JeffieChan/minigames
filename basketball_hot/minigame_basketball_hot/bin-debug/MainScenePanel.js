var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var MainScenePanel = (function (_super) {
    __extends(MainScenePanel, _super);
    function MainScenePanel() {
        var _this = _super.call(this) || this;
        _this._isUsingMi = true;
        _this._auto_enter_next_round = false;
        _this._is_first_round = true;
        _this._hasTouchBegin = false;
        _this._hasThisRoundTouch = false;
        _this._is_face_left = true;
        _this._has_goal = false;
        _this.serverModel = new ServerModel();
        _this._is_game_over = false;
        _this.skinName = "MainScene";
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this._onAddToStage, _this);
        return _this;
    }
    MainScenePanel.prototype._onAddToStage = function (event) {
        var timer = new egret.Timer(1000, this.serverModel.MAX_TIME);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER, this._on_timer_tick, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this._on_timer_compelete, this);
        //开始计时
        timer.start();
        this._timer = timer;
        this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
        this.m_container.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
        var __this = this;
        this.btn_debug.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (event) {
            var debugPanel = new DebugPanel();
            __this.addChild(debugPanel);
            event.stopPropagation();
        }.bind(this), this);
        this._initGame();
        this.serverModel.left_time = this.serverModel.MAX_TIME;
        this.UpdateScore();
    };
    MainScenePanel.prototype._on_timer_tick = function () {
        this.serverModel.left_time -= 1;
        this.UpdateScore();
    };
    MainScenePanel.prototype._on_timer_compelete = function () {
        console.log("game is over");
        this._is_game_over = true;
    };
    MainScenePanel.prototype.HasTouchBegin = function () {
        return this._hasTouchBegin;
    };
    MainScenePanel.prototype.GetHitManagerMi = function () {
        return this._hitManager;
    };
    MainScenePanel.prototype.HasThisRoundTouch = function () {
        return this._hasThisRoundTouch;
    };
    MainScenePanel.prototype._initGame = function () {
        this._hitManager = new HitManager(this);
        this._playerBall = new PlayerBall(this.m_basket_ball, this);
        this._left_basket_container_x = this.m_basket_container_back.x;
        this._left_basket_container_y = this.m_basket_container_back.y;
        this._right_basket_container_x = this.stage.stageWidth;
        this._right_basket_container_y = this._left_basket_container_y;
        this._nextRound();
        this.UpdateScore();
    };
    MainScenePanel.prototype.IsFaceLeft = function () {
        return this._is_face_left;
    };
    MainScenePanel.prototype.HasGoal = function () {
        return this._has_goal;
    };
    MainScenePanel.prototype.SetGoal = function (has_global) {
        this._has_goal = has_global;
        if (has_global) {
            this.AddScore(2);
        }
    };
    MainScenePanel.prototype.AddScore = function (score) {
        this.serverModel.my_score += score;
        this.UpdateScore();
    };
    MainScenePanel.prototype.AutoEnterNextRound = function () {
        this._auto_enter_next_round = true;
    };
    MainScenePanel.prototype.IsInAutoEnterNextRound = function () {
        return this._auto_enter_next_round;
    };
    MainScenePanel.prototype.GetPlayerBall = function () {
        return this._playerBall;
    };
    MainScenePanel.prototype._nextRound = function () {
        this.SetGoal(false);
        this._is_face_left = Math.floor(Math.random() * 2) == 0;
        // this._is_face_left = !this._is_face_left
        if (this._is_first_round) {
            this._is_face_left = true;
        }
        this._hasThisRoundTouch = false;
        if (this._is_face_left) {
            this.m_basket_container_pre.x = this._left_basket_container_x;
            this.m_basket_container_pre.y = this._left_basket_container_y;
            this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX);
            this.m_basket_container_back.x = this._left_basket_container_x;
            this.m_basket_container_back.y = this._left_basket_container_y;
            this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX);
        }
        else {
            this.m_basket_container_pre.x = this._right_basket_container_x;
            this.m_basket_container_pre.y = this._right_basket_container_y;
            this.m_basket_container_pre.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
            this.m_basket_container_back.x = this._right_basket_container_x;
            this.m_basket_container_back.y = this._right_basket_container_y;
            this.m_basket_container_back.scaleX = Math.abs(this.m_basket_container_back.scaleX) * -1;
        }
        this.validateNow();
        if (this._is_first_round) {
            var random_ball_x = this.stage.stageWidth / 2 - this.m_basket_ball.width / 2;
            var random_ball_y = this.m_floor.y - 200;
            this.m_basket_ball.x = random_ball_x;
            this.m_basket_ball.y = random_ball_y;
        }
        this._is_first_round = false;
        this._hitManager.EnterNextRound();
        this._playerBall.EnterNextRound();
    };
    MainScenePanel.prototype._onEnterFrame = function (event) {
        if (this._is_game_over) {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrame, this);
            this.m_basket_ball.visible = false;
            return;
        }
        if (this._auto_enter_next_round) {
            this._nextRound();
            this._auto_enter_next_round = false;
        }
        this._playerBall.Update();
    };
    MainScenePanel.prototype._onTouchBegin = function (event) {
        if (!this._hasTouchBegin) {
            this._hasTouchBegin = true;
        }
        this._hasThisRoundTouch = true;
        if (this.m_basket_ball.y <= this.m_top.y) {
            return;
        }
        this._playerBall.OnPushDown();
    };
    MainScenePanel.prototype.UpdateScore = function () {
        this.label_score_me.text = this.serverModel.my_score.toString();
        this.label_score_other.text = this.serverModel.other_score.toString();
        this.label_left_time.text = this.serverModel.left_time.toString();
        var percent = this.serverModel.left_time / this.serverModel.MAX_TIME;
        var down_height = percent * this.img_time_progress.height;
        this.img_time_progress.mask = new egret.Rectangle(0, this.img_time_progress.height - down_height, this.img_time_progress.width, down_height);
    };
    return MainScenePanel;
}(eui.Component));
__reflect(MainScenePanel.prototype, "MainScenePanel");
//# sourceMappingURL=MainScenePanel.js.map