package co.uk.ccmr.caf.websocket;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import co.uk.ccmr.caf.comms.CommsController;
import co.uk.ccmr.cbus.sniffer.CbusEvent;

public class GcWebSocketHandler implements WebSocketHandler {
	private static Set<WebSocketSession> sessions;
	
	public GcWebSocketHandler() {
		sessions = new HashSet<WebSocketSession>();
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus arg1) throws Exception {
		System.out.println("WebSocket:after closed");
		sessions.remove(session);
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("WebSocket:after connected");
		sessions.add(session);
	}

	@Override
	public void handleMessage(WebSocketSession arg0, WebSocketMessage<?> message) throws Exception {
		System.out.println("WebSocket:handle message:"+message);
		// Send this message onto our CBUS connection
		String json = (String)message.getPayload();
		// cut the message from the JSON string
		int start = json.indexOf("message");
		start += "message".length() + 3;	// 3 for '":"'
		int end = json.indexOf('"', start);
		System.out.println("message="+message.getPayloadLength());
		System.out.println("json="+json);
		System.out.println("start="+start+" end="+end);
		String gc = json.substring(start,end);
		CbusEvent ce = new CbusEvent(gc);
		if (CommsController.getCurrent() != null) {
			CommsController.getCurrent().getDriver().queueForTransmit(ce);
		}
		// echo received messages back to all sessions
		send(message);
	}

	@Override
	public void handleTransportError(WebSocketSession arg0, Throwable arg1) throws Exception {
		System.out.println("WebSocket:error");

	}

	@Override
	public boolean supportsPartialMessages() {
		System.out.println("WebSocket:partial");
		return false;
	}
	
	
	/**
	 * broadcast a received CBUS message to all websocket sessions.
	 * 
	 * Due to a bug in tomcat this needs to be synchronised so that the echo (see handleMessage())
	 * doesn't get processed whilst sending elsewhere or still doing the receive
	 * 
	 * @param msg
	 * @throws IOException
	 */
	public synchronized static void send(WebSocketMessage<?> msg) throws IOException {
		System.out.println("WebSocket:send message:"+msg);
		for (WebSocketSession session : sessions) {
			System.out.println(" on session");
			session.sendMessage(msg);
		}
	}

}
