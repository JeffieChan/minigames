class HitConst {
	public static floor_restitution = -0.7; //地面反弹系数，反弹会改变方向，所以要改成负数
	public static floor_friction = 1.0; //地面摩擦系数

	public static basket_right_line_restitution = -0.7; //篮筐前沿反弹系数
	public static basket_right_line_friction = 1.0 //篮筐前沿摩擦系数

	public static basket_left_line_restitution = -0.7; //篮筐后沿反弹系数
	public static basket_left_line_friction = 1.0 //篮筐后沿摩擦系数 

	public static basket_board_restitution = -0.7; //篮框后方挡板反弹系数
	public static basket_board_friction = 1.0 //篮框后方挡板摩擦系数 

	public static Max_Speed_X:number = 4; //x方向的速度
	public static Frame_Speed_X:number = 0.05

	public static PUSH_DOWN_IMPLUSE_Y:number = -20


	public static getHitRestitution(hitType:HitType):number
	{
		if(hitType == HitType.Floor)
		{
			return HitConst.floor_restitution
		}

		if(hitType == HitType.Right_Line)
		{
			return HitConst.basket_right_line_restitution
		}

		if(hitType == HitType.Left_Line)
		{
			return HitConst.basket_left_line_restitution
		}

		if(hitType == HitType.Board)
		{
			return HitConst.basket_board_restitution
		}

		return 1
	}

	public static getHitFriction(hitType:HitType):number
	{
		if(hitType == HitType.Floor)
		{
			return HitConst.floor_friction
		}

		if(hitType == HitType.Right_Line)
		{
			return HitConst.basket_right_line_friction
		}

		if(hitType == HitType.Left_Line)
		{
			return HitConst.basket_left_line_friction
		}

		if(hitType == HitType.Board)
		{
			return HitConst.basket_board_friction
		}

		return 1.0
	}
	
	public static SwapPoint(point1:egret.Point, point2:egret.Point):void
	{
		let temp_point_x = point1.x;
		let temp_point_y = point1.y;
		point1.x = point2.x;
		point1.y = point2.y
		point2.x = temp_point_x
		point2.y = temp_point_y;
	}

	public static SwapPointXY(left_top_point:egret.Point, right_down:egret.Point):void
	{
		let left_x = right_down.x;
		let left_y = left_top_point.y;
		let right_x = left_top_point.x;
		let right_y = right_down.y

		left_top_point.x = left_x
		left_top_point.y = left_y

		right_down.x = right_x
		right_down.y = right_y
	}
}


enum HitType {
	Floor,
	Right_Line, //篮筐前沿
	Left_Line, //篮筐后沿
	Board, //后方的篮板
	None
}