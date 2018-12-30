class GameHeorizontalLineTrack extends BaseGameTrack{

	public constructor() {
		super()
		this.skinName = "TrakeHeorizontalLineSkin"
		this.trackType = TrackType.HeorizontalLine
	}

	public InitWithLastTrack(last_track:BaseGameTrack):void
	{
		if(last_track.trackType == TrackType.Arc){
			this.initWithLastArc(last_track)
		}else if(last_track.trackType == TrackType.ThreeArc){
			this.initWithThreeArcTrack(last_track)
		}
	}

	private initWithLastArc(last_track:BaseGameTrack):void
	{
		this.toDirection = last_track.toDirection
		if(last_track.fromDirection == TrackDirection.Top && last_track.toDirection == TrackDirection.Left){
			this.x = last_track.x - this.width
			this.y = last_track.y + (last_track.height - this.height)
			this.fromDirection = TrackDirection.Right
		}else if(last_track.fromDirection == TrackDirection.Top && last_track.toDirection == TrackDirection.Right){
			this.x = last_track.x + last_track.width
			this.y = last_track.y + (last_track.height - this.height)
			this.fromDirection = TrackDirection.Left
		}else if(last_track.fromDirection == TrackDirection.Down && last_track.toDirection == TrackDirection.Left){
			this.x = last_track.x - this.width
			this.y = last_track.y
			this.fromDirection = TrackDirection.Right
		}else if(last_track.fromDirection == TrackDirection.Down && last_track.toDirection == TrackDirection.Right){
			this.x = last_track.x + last_track.width
			this.y = last_track.y
			this.fromDirection = TrackDirection.Left
		}
	}

	public GetDeltaX():number
	{
		if(this.toDirection == TrackDirection.Left){
			return this.width * -1
		}else if(this.toDirection == TrackDirection.Right){
			return this.width
		}
		return 0
	}

	private initWithThreeArcTrack(last_track:BaseGameTrack):void
	{

	}
}