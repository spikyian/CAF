package co.uk.ccmr.caf.websocket;

public class GcMessage {
	private String message;
	private Direction direction;
	
	public GcMessage(String m) {
		message = m;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Direction getDirection() {
		return direction;
	}

	public void setDirection(Direction direction) {
		this.direction = direction;
	}
}
