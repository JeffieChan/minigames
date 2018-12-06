class Const {
	public constructor() {
	}

	public static MIN_RESOLUTION = 720;//640;
	public static MIN_WIDTH = 720;//1136;
	public static MIN_HEIGHT = 1280;//640;

	public static HEARTBEAT_DUR = 6000;

	public static GAME_TIME = 90;

	public static DEBUG_SERVER_URL = 'ght-hall.badambiz.com:50003';
	public static RELEASE_SERVER_URL = 'ght-hall.badambiz.com:50003'
	
	public static EVENT = {
		ON_STAGE_RESIZE: 'onStageResize',
		ON_WINDOW_OPEN: 'onWindowOpen',
		ON_WINDOW_CLOSED: 'onWindowClosed'		
	};

	public static StageWidth = 0
	public static StageHeight = 0
}