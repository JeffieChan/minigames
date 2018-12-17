class CommonUtils {
	public constructor() {
	}

	public static createDragonBones(skeleton_json:string, texture_json:string, texture_png:string, armature_name:string):dragonBones.EgretArmatureDisplay
	{
		var dragonbonesData = RES.getRes(skeleton_json);
     	var textureData = RES.getRes(texture_json);
        var texture = RES.getRes(texture_png);
        var dragonbonesFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
       	dragonbonesFactory.parseDragonBonesData(dragonbonesData);  
		dragonbonesFactory.parseTextureAtlasData(textureData, texture);
		let armatureDisplay: dragonBones.EgretArmatureDisplay = dragonbonesFactory.buildArmatureDisplay(armature_name);
		return armatureDisplay
	}
	
	public static SetColor(image: egret.DisplayObject, color: number) {
		// 将16进制颜色分割成rgb值
		let spliceColor = (color) => {
			let result = {r: -1, g: -1, b: -1};
			result.b = color % 256;
			result.g = Math.floor((color / 256)) % 256;
			result.r = Math.floor((color / 256) / 256);
			return result;
		}
		let result = spliceColor(color);
		let colorMatrix = [
			1, 0, 0, 0, 0,
			0, 1, 0, 0, 0,
			0, 0, 1, 0, 0,
			0, 0, 0, 1, 0
		];
		colorMatrix[0] = result.r / 255;
		colorMatrix[6] = result.g / 255;
		colorMatrix[12] = result.b / 255;
		let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

		image.filters = [colorFilter];
	}

	/**
     * 替换插槽
     * @param slotName 插槽名称 原材料
     * @param textureName 图片名  xxx_png
     * @param 偏移量
     */
    public static setNewSlot(armatureDisplay:dragonBones.EgretArmatureDisplay, slotName:string, textureName:string ,offsetX:number=0, offsetY:number=0){
        var slot:dragonBones.Slot = armatureDisplay.armature.getSlot(slotName);
        var b:egret.Bitmap = new egret.Bitmap();
        b.texture = RES.getRes(textureName);
        b.x = slot.display.x;
        b.y = slot.display.y;
        b.anchorOffsetX = b.width/2 + offsetX;
        b.anchorOffsetY = b.height/2 + offsetY;
        slot.setDisplay(b);
    }
	
	public static GetRandomPositive():number
	{
		return (Math.floor(Math.random() * 2) == 0) ? 1 : -1
	}

	public static GetRandomScope(minScope:number, maxScope:number):number
	{
		return Math.random() * (maxScope - minScope) + minScope
	}

	public static performDelay2(callback:Function, delay_time:number, callbackThisObject:Object):egret.Timer
	{
		let timer = new egret.Timer(delay_time, 1);
		timer.addEventListener(egret.TimerEvent.TIMER, function():void{
			if(callback)
			{
				callback.apply(callbackThisObject);
			}
		}.bind(this), this)
		timer.start()
		return timer
	}

	public static performDelay(callback:Function, timeout:number, callbackThisObject:Object):void
	{
		setTimeout(function() {
			if(callback)
			{
				callback.apply(callbackThisObject)
			}
		}, timeout);
	}

	public static Add_Btn_Click(btn:egret.DisplayObject, callback:Function, callbackThisObject:Object):void
	{
		btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(event:egret.Event){
			if(callback)
			{
				callback.apply(callbackThisObject)
			}
		}, callbackThisObject)
	}
}