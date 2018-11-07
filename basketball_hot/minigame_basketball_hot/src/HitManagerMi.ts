class HitManagerMi {

	private mainPanel:MainScenePanel
	private _isOnFloor:boolean = false;
	private _hitType:HitType = HitType.None
	public constructor(_mainPanel:MainScenePanel) {
		this.mainPanel = _mainPanel
	}

	public IsOnFloor():boolean
	{
		return this._isOnFloor;
	}

	public GetHitType():HitType
	{
		return this._hitType
	}

	public _getLastHitType():HitType
	{
		return this.mainPanel.GetPlayerBall().getLastHitType()
	}

	public CheckHit():boolean
	{
		this._hitType = HitType.None
		if(this.CheckHitFloor())
		{
			this._hitType = HitType.Floor
			return true
		}

		if(this.CheckHitRightLine())
		{
			this._hitType = HitType.Right_Line
			return true;
		}

		if(this.CheckLeftLine())
		{
			this._hitType = HitType.Left_Line
			return true;
		}

		if(this.CheckHitBoard())
		{
			return true;
		}
		return false;
	}

	private HandleBallHit(localBallHitPoint:egret.Point, hitType:HitType)
	{
		let restition = HitConst.getHitRestitution(hitType)
		let friction = HitConst.getHitFriction(hitType)
		let speed_vec = new egret.Point(this.mainPanel.basketball_speed_x, this.mainPanel.basketball_speed_y);

		let global_ball_center_point = this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height / 2);
		let global_hit_point = this.mainPanel.m_basket_ball.localToGlobal(localBallHitPoint.x, localBallHitPoint.y)
		let hit_vec = new egret.Point(global_hit_point.x - global_ball_center_point.x, global_hit_point.y - global_ball_center_point.y)
		hit_vec.normalize(1)
		let dot_vallue = (speed_vec.x * hit_vec.x + speed_vec.y * hit_vec.y)
		let dot_vec = new egret.Point(dot_vallue * hit_vec.x, dot_vallue * hit_vec.y)
		let vertical_vec:egret.Point = new egret.Point(speed_vec.x - dot_vec.x, speed_vec.y - dot_vec.y)

		let restitution_dot_vec = new egret.Point(restition * dot_vec.x, restition * dot_vec.y);
		let friction_vec = new egret.Point(friction * vertical_vec.x, friction * vertical_vec.y);

		let target_speed = new egret.Point(restitution_dot_vec.x + friction_vec.x, restitution_dot_vec.y + friction_vec.y)


		if(hitType != HitType.Floor){
			if(Math.abs(target_speed.x) < 1 * HitConst.Factor){  //这类调整一下速度，避免x速度太小，不能移动
				let rate = 1
				if(target_speed.x != 0){
					rate = target_speed.x / Math.abs(target_speed.x)
				}
				target_speed.x = 1 * HitConst.Factor * rate
			}

			if(target_speed.y < 0 && Math.abs(target_speed.y) < HitConst.Gravity){
				let target_y = -1 * HitConst.Gravity - 2 * HitConst.Factor
				target_speed.y = target_y
			}
		}
		

		this.mainPanel.basketball_speed_x = target_speed.x
		this.mainPanel.basketball_speed_y = target_speed.y
	}

	private CheckHitFloor():boolean
	{
		let curr_y = this.mainPanel.m_basket_ball.y;
		if(curr_y >= this.mainPanel.m_floor.y - this.mainPanel.m_basket_ball.height)
		{
			this._hitType = HitType.Floor
			if(this._isOnFloor)  //一直在地面上
			{
				return true;
			}
			
			this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height), HitType.Floor);

			//掉到地上，解决x速度太快的问题。
			this.mainPanel.basketball_speed_x = Math.max(this.mainPanel.basketball_speed_x, -1 * HitConst.Max_Speed_X)
			this.mainPanel.basketball_speed_x = Math.min(this.mainPanel.basketball_speed_x, HitConst.Max_Speed_X)
			//处理反弹
			if(Math.abs(this.mainPanel.basketball_speed_y) <= 0.3 * HitConst.Factor)
			{
				this.mainPanel.basketball_speed_y = 0;
				this._isOnFloor = true
			}

			if(this.mainPanel.HasThisRoundTouch() && !this.mainPanel.HasGoal()){
				if(this.mainPanel.IsFaceLeft()){
					this.mainPanel.basketball_speed_x = HitConst.Max_Speed_X * -1;
				} else {
					this.mainPanel.basketball_speed_x = HitConst.Max_Speed_X;
				}
			}

			//而且又进球掉到地板上x速度太慢而停下来的问题，这里给一个小的速度
			if(this.mainPanel.HasGoal() && Math.abs(this.mainPanel.basketball_speed_x) < 2 * HitConst.Factor){
				this.mainPanel.basketball_speed_x = 2 * HitConst.Factor * this.mainPanel.basketball_speed_x / Math.abs(this.mainPanel.basketball_speed_x)
			}
			
			return true;
		}
		this._isOnFloor = false;
		
		return false;
	}

	private CheckHitRightLine():boolean
	{
		let global_ball_left_top_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(0, 0, global_ball_left_top_point);

		let global_ball_right_down_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.width, global_ball_right_down_point);

		let global_ball_center_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.width / 2, global_ball_center_point);

		let right_line_right_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_right_line.x + this.mainPanel.m_right_line.width, this.mainPanel.m_right_line.y, right_line_right_point);

		let right_line_left_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_right_line.x, this.mainPanel.m_right_line.y, right_line_left_point);

		if(!this.mainPanel.IsFaceLeft())  //对称
		{
			HitConst.SwapPoint(right_line_right_point, right_line_right_point)
		}

		//is right ok
		if(global_ball_left_top_point.x > right_line_right_point.x)
		{
			return false;
		}
		//is left ok
		if(global_ball_right_down_point.x < right_line_left_point.x)
		{
			return false;
		}

		//is top ok
		if(global_ball_right_down_point.y < right_line_left_point.y)
		{
			return false;
		}

		//is down ok
		if(global_ball_left_top_point.y > right_line_left_point.y)
		{
			return false;
		}

		//去除x,y都满足。但是组合起来就不满足的情况

		let delta_y = global_ball_center_point.y - right_line_left_point.y
		let top_line_cirle_width = Math.sqrt(Math.pow(this.mainPanel.m_basket_ball.width / 2, 2) - Math.pow(delta_y, 2))
		if(global_ball_center_point.x > right_line_right_point.x){
			if(global_ball_center_point.x - right_line_right_point.x > top_line_cirle_width){
				return false
			}
		} else if(global_ball_center_point.x < right_line_left_point.x){
			if(right_line_left_point.x - global_ball_center_point.x > top_line_cirle_width){
				return false
			}
		}

		if(this._getLastHitType() == HitType.Right_Line){
			return true
		}

		let is_top = global_ball_center_point.y < right_line_right_point.y
		if(is_top){
			this.SetCurrentHitNeedCheck(true)  //上部分需要二次确认
		}

		//以下必定相交
		if(global_ball_center_point.x > right_line_right_point.x){
			
			let global_hit_point = new egret.Point(global_ball_center_point.x - top_line_cirle_width, right_line_left_point.y)
			let local_hit_point = new egret.Point()
			this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)
			this.HandleBallHit(local_hit_point, HitType.Right_Line)

			return true;
		}

		if(global_ball_center_point.x < right_line_left_point.x){
			let global_hit_point = new egret.Point(global_ball_center_point.x + top_line_cirle_width, right_line_left_point.y)
			let local_hit_point = new egret.Point()
			this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)
			this.HandleBallHit(local_hit_point, HitType.Right_Line)
			return true;
		}

		//中间碰撞了
		this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height), HitType.Right_Line)
		return true;
	}

	private CheckLeftLine():boolean
	{
		let global_ball_left_top_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(0, 0, global_ball_left_top_point);

		let global_ball_right_down_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.width, global_ball_right_down_point);

		let global_ball_center_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.width / 2, global_ball_center_point);

		let left_line_right_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_left_line.x + this.mainPanel.m_left_line.width, this.mainPanel.m_left_line.y, left_line_right_point);

		let left_line_left_point:egret.Point = new egret.Point();
		this.mainPanel.m_right_line.parent.localToGlobal(this.mainPanel.m_left_line.x, this.mainPanel.m_left_line.y, left_line_left_point);

		if(!this.mainPanel.IsFaceLeft())  //对称
		{
			HitConst.SwapPoint(left_line_right_point, left_line_left_point)
		}

		//is right ok
		if(global_ball_left_top_point.x > left_line_right_point.x)
		{
			return false;
		}
		//is left ok
		if(global_ball_right_down_point.x < left_line_left_point.x)
		{
			return false;
		}

		//is top ok
		if(global_ball_right_down_point.y < left_line_left_point.y)
		{
			return false;
		}

		//is down ok
		if(global_ball_left_top_point.y > left_line_left_point.y)
		{
			return false;
		}

		//去除x,y都满足。但是组合起来就不满足的情况

		let delta_y = global_ball_center_point.y - left_line_left_point.y
		let top_line_cirle_width = Math.sqrt(Math.pow(this.mainPanel.m_basket_ball.width / 2, 2) - Math.pow(delta_y, 2))
		if(global_ball_center_point.x > left_line_right_point.x){
			if(global_ball_center_point.x - left_line_right_point.x > top_line_cirle_width){
				return false
			}
		} else if(global_ball_center_point.x < left_line_left_point.x){
			if(left_line_left_point.x - global_ball_center_point.x > top_line_cirle_width){
				return false
			}
		}

		if(this._getLastHitType() == HitType.Left_Line){
			return true
		}

		//以下必定相交
		if(this.mainPanel.IsFaceLeft()){
			if(global_ball_center_point.x > left_line_right_point.x){

				if(this._getLastHitType() == HitType.Left_Line){
					return true
				}

				let global_hit_point = new egret.Point(global_ball_center_point.x - top_line_cirle_width, left_line_right_point.y)
				let local_hit_point = new egret.Point()
				this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)
				this.HandleBallHit(local_hit_point, HitType.Left_Line)
				return true;
			}
		} else { 
			if(global_ball_center_point.x < left_line_left_point.x){

				if(this._getLastHitType() == HitType.Left_Line){
					return true
				}

				let global_hit_point = new egret.Point(global_ball_center_point.x + top_line_cirle_width, left_line_right_point.y)
				let local_hit_point = new egret.Point()
				this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)
				this.HandleBallHit(local_hit_point, HitType.Left_Line)
				return true;
			}
		}

		//不打算处理在左边和中间的情况，因为这不可能发生，就算发生了也不正常，让篮框的挡板去碰撞。

		return false;
	}

	private CheckHitBoard():boolean
	{
		let global_ball_left_top_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(0, 0, global_ball_left_top_point);

		let global_ball_right_down_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.width, global_ball_right_down_point);

		let global_ball_center_point:egret.Point = new egret.Point();
		this.mainPanel.m_basket_ball.localToGlobal(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.width / 2, global_ball_center_point);

		let board_left_top_point:egret.Point = new egret.Point();
		this.mainPanel.m_board_scope.parent.localToGlobal(this.mainPanel.m_board_scope.x, this.mainPanel.m_board_scope.y, board_left_top_point);

		let board_right_down_point:egret.Point = new egret.Point();
		this.mainPanel.m_board_scope.parent.localToGlobal(this.mainPanel.m_board_scope.x + this.mainPanel.m_board_scope.width, this.mainPanel.m_board_scope.y + this.mainPanel.m_board_scope.height, board_right_down_point);

		if(!this.mainPanel.IsFaceLeft())
		{
			HitConst.SwapPointXY(board_left_top_point, board_right_down_point)
		}
		//is right ok
		if(global_ball_left_top_point.x > board_right_down_point.x)
		{
			return false;
		}
		//is left ok
		if(global_ball_right_down_point.x < board_left_top_point.x)
		{
			return false;
		}

		//is top ok
		if(global_ball_right_down_point.y < board_left_top_point.y)
		{
			return false;
		}

		//is down ok
		if(global_ball_left_top_point.y > board_right_down_point.y)
		{
			return false;
		}

		//去除x,y都满足。但是组合起来就不满足的情况
		if(global_ball_center_point.y > board_right_down_point.y)  //在下方
		{
			let delta_y = global_ball_center_point.y - board_right_down_point.y
			let down_line_cirle_width = Math.sqrt(Math.pow(this.mainPanel.m_basket_ball.width / 2, 2) - Math.pow(delta_y, 2))
			if(global_ball_center_point.x > board_right_down_point.x){
				if(global_ball_center_point.x - board_right_down_point.x > down_line_cirle_width){
					return false
				}
			} else if(global_ball_center_point.x < board_left_top_point.x){
				if(board_left_top_point.x - global_ball_center_point.x > down_line_cirle_width){
					return false
				}
			}
		}
		else if(global_ball_center_point.y < board_left_top_point.y) //在上方
		{
			let delta_y = global_ball_center_point.y - board_left_top_point.y
			let top_line_cirle_width = Math.sqrt(Math.pow(this.mainPanel.m_basket_ball.width / 2, 2) - Math.pow(delta_y, 2))
			if(global_ball_center_point.x > board_right_down_point.x){
				if(global_ball_center_point.x - board_right_down_point.x > top_line_cirle_width){
					return false
				}
			} else if(global_ball_center_point.x < board_left_top_point.x){
				if(board_left_top_point.x - global_ball_center_point.x > top_line_cirle_width){
					return false
				}
			}
		}
		
		//以下都满足碰撞

		let is_top = global_ball_center_point.y < board_left_top_point.y
		let is_down = global_ball_center_point.y > board_right_down_point.y
		//左右两边的碰撞
		if(global_ball_center_point.x < board_left_top_point.x || global_ball_center_point.x > board_right_down_point.x){
			if(this._getLastHitType() == HitType.Board){
				this._hitType = HitType.Board
				return true
			}
			let is_right = global_ball_center_point.x > board_right_down_point.x
			if(is_top || is_down){  //上下
				let delta_y = 0
				let target_y = 0
				if(is_top){
					delta_y = global_ball_center_point.y - board_left_top_point.y
					target_y = board_left_top_point.y
				}else{
					delta_y = global_ball_center_point.y - board_right_down_point.y
					target_y = board_right_down_point.y
				}
				
				let line_circle_width =  Math.sqrt(Math.pow(this.mainPanel.m_basket_ball.width / 2, 2) - Math.pow(delta_y, 2))
				let global_hit_point = new egret.Point(global_ball_center_point.x + line_circle_width, target_y)
				if(is_right){
					global_hit_point.x = global_ball_center_point.x - line_circle_width
				}
				let local_hit_point = new egret.Point()
				this.mainPanel.m_basket_ball.globalToLocal(global_hit_point.x, global_hit_point.y, local_hit_point)
				this.HandleBallHit(local_hit_point, HitType.Board)
				if(is_top){
					this.SetCurrentHitNeedCheck(true)  //上部分需要二次确认
				}
			} else{//中间
				if(is_right){
					this.HandleBallHit(new egret.Point(0, this.mainPanel.m_basket_ball.height / 2), HitType.Board)
				}else{
					this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width, this.mainPanel.m_basket_ball.height / 2), HitType.Board)
				}
			}
			this._hitType = HitType.Board
		} else { //上下
			if(is_top){
				if(this._getLastHitType() == HitType.Board_Top){
					this._hitType = HitType.Board_Top
					return true
				}
				this._hitType = HitType.Board_Top
				this.SetCurrentHitNeedCheck(true) //上部分需要二次确认
				this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width / 2, this.mainPanel.m_basket_ball.height), HitType.Board_Top)
			} else if(is_down){
				if(this._getLastHitType() == HitType.Board_Top){
					this._hitType = HitType.Board_Top
					return true
				}
				this._hitType = HitType.Board_Top
				this.HandleBallHit(new egret.Point(this.mainPanel.m_basket_ball.width / 2, 0), HitType.Board_Top)
			} else {
				//解决切换回合篮板互换位置的瞬间，刚好球在篮板的新位置上，这里忽略碰撞
				return false
			}
		}

		
		return true;
	}

	private _isCurrentHitNeedCheck:boolean = false;
	//在篮板前沿的上沿和篮筐挡板上沿需要进行二次确认，以免篮球停留在这两个位置
	public SetCurrentHitNeedCheck(need_check:boolean):void
	{
		this._isCurrentHitNeedCheck = need_check
	}

	public IsCurrentHitNeedCheck():boolean
	{
		return this._isCurrentHitNeedCheck
	}
}