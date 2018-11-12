class Const {
	public constructor() {
	}

	public static MIN_RESOLUTION = 720;//640;
	public static MIN_WIDTH = 1280;//1136;
	public static MIN_HEIGHT = 720;//640;

	public static HEARTBEAT_DUR = 6000;

	public static GAME_TIME = 60;

	public static SERVER_URL = '192.168.20.232:50002';

	public static EVENT = {
		ON_STAGE_RESIZE: 'onStageResize',
		ON_WINDOW_OPEN: 'onWindowOpen',
		ON_WINDOW_CLOSED: 'onWindowClosed'		
	};
}