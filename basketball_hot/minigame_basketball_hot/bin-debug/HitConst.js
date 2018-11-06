var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var HitConst = (function () {
    function HitConst() {
    }
    HitConst.getHitRestitution = function (hitType) {
        if (hitType == HitType.Floor) {
            return HitConst.floor_restitution;
        }
        if (hitType == HitType.Right_Line) {
            return HitConst.basket_right_line_restitution;
        }
        if (hitType == HitType.Left_Line) {
            return HitConst.basket_left_line_restitution;
        }
        if (hitType == HitType.Board) {
            return HitConst.basket_board_restitution;
        }
        return 1;
    };
    HitConst.getHitFriction = function (hitType) {
        if (hitType == HitType.Floor) {
            return HitConst.floor_friction;
        }
        if (hitType == HitType.Right_Line) {
            return HitConst.basket_right_line_friction;
        }
        if (hitType == HitType.Left_Line) {
            return HitConst.basket_left_line_friction;
        }
        if (hitType == HitType.Board) {
            return HitConst.basket_board_friction;
        }
        return 1.0;
    };
    HitConst.SwapPoint = function (point1, point2) {
        var temp_point_x = point1.x;
        var temp_point_y = point1.y;
        point1.x = point2.x;
        point1.y = point2.y;
        point2.x = temp_point_x;
        point2.y = temp_point_y;
    };
    HitConst.SwapPointXY = function (left_top_point, right_down) {
        var left_x = right_down.x;
        var left_y = left_top_point.y;
        var right_x = left_top_point.x;
        var right_y = right_down.y;
        left_top_point.x = left_x;
        left_top_point.y = left_y;
        right_down.x = right_x;
        right_down.y = right_y;
    };
    HitConst.floor_restitution = -0.7; //地面反弹系数，反弹会改变方向，所以要改成负数
    HitConst.floor_friction = 1.0; //地面摩擦系数
    HitConst.basket_right_line_restitution = -0.7; //篮筐前沿反弹系数
    HitConst.basket_right_line_friction = 1.0; //篮筐前沿摩擦系数
    HitConst.basket_left_line_restitution = -0.7; //篮筐后沿反弹系数
    HitConst.basket_left_line_friction = 1.0; //篮筐后沿摩擦系数 
    HitConst.basket_board_restitution = -0.7; //篮框后方挡板反弹系数
    HitConst.basket_board_friction = 1.0; //篮框后方挡板摩擦系数 
    HitConst.Max_Speed_X = 4; //x方向的速度
    HitConst.Frame_Speed_X = 0.05;
    HitConst.PUSH_DOWN_IMPLUSE_Y = -20;
    return HitConst;
}());
__reflect(HitConst.prototype, "HitConst");
var HitType;
(function (HitType) {
    HitType[HitType["Floor"] = 0] = "Floor";
    HitType[HitType["Right_Line"] = 1] = "Right_Line";
    HitType[HitType["Left_Line"] = 2] = "Left_Line";
    HitType[HitType["Board"] = 3] = "Board";
    HitType[HitType["None"] = 4] = "None";
})(HitType || (HitType = {}));
//# sourceMappingURL=HitConst.js.map