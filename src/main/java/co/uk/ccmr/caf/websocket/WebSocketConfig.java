package co.uk.ccmr.caf.websocket;
 
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
 

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	    System.out.println("WebSocketConfig.registerWebSocketHandlers");
	    registry.addHandler(new GcWebSocketHandler(), "/gc");
	}

}
