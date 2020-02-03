package co.uk.ccmr.caf.comms;

import java.io.IOException;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;

import co.uk.ccmr.caf.DriverInfo;
import co.uk.ccmr.caf.Globals;
import co.uk.ccmr.caf.comms.DriverInformation;
import co.uk.ccmr.caf.websocket.GcWebSocketHandler;
import co.uk.ccmr.cbus.CbusReceiveListener;
import co.uk.ccmr.cbus.driver.CbusDriverException;
import co.uk.ccmr.cbus.sniffer.CbusEvent;

@RestController
public class CommsController {
	private static String currentName;
	private static String currentState = "Disconnected";
	private static DriverInfo current = null;
	
	/**
	 * Get information about the communications.
	 * Get the information about the current connection and also about
	 * potentially usable ports.
	 * 
	 * @return
	 */
	@RequestMapping(value="/comms", method=RequestMethod.GET)
	public CommsInfo comms() {
		CommsInfo ci = new CommsInfo();
		// go through all the drivers
		for (DriverInfo di : Globals.drivers) {
			DriverInformation dinfo = new DriverInformation(di.type);
			ci.getDrivers().add(dinfo);
			String [] pn = di.getDriver().getPortNames();
					
			for (String port : pn) {
				dinfo.getPorts().add(port);
			}
			if (dinfo.getType().equals("TCP")) {
				dinfo.getPorts().add("localhost:55000");
				dinfo.getPorts().add("remotehost:55000");
			} else {
				dinfo.getPorts().add("COM9");
			}
		}
		ci.setName(currentName);
		ci.setState(currentState);
		ci.setType(null);
		return ci;
	}
	
	/**
	 * Connect to a particular port name using the requested driver type.
	 * 
	 * @param 
	 */
	@RequestMapping(value="/comms/{type}/{name}", method=RequestMethod.PUT)
	public String connect(@PathVariable("type") String driverType, @PathVariable("name") String portName) {
		System.out.println("connect request for "+driverType+"-"+portName);
		/* Disconnect and close any current connection */
		if (current != null) {
			current.getDriver().close();
			current = null;
		}
		// Now try connecting to the new port
		currentName = portName;
		// find the driver
		for (DriverInfo di : Globals.drivers) {
			if (di.getType().equals(driverType)) {
				// found it
				current = di;
			}
		}
		if (current == null) return "No driver";
		
		try {
			current.getDriver().connect(portName);
			System.out.println("Connected to "+portName);
			currentState = "Connected";
		} catch (CbusDriverException e) {
			System.out.println("Failed to connect to "+portName);
			currentState = "Failed to connect - "+e.getMessage();
			current = null;
			return currentState;
		}
		// set up the listener which gets called when we receive a CBUS message from the CbusDriver
		current.getDriver().addListener(new CbusReceiveListener() {

			@Override
			public void receiveMessage(CbusEvent ce) {
				System.out.println("CommsController RX Event:"+ce);
				// convert it to a GCMessage
				String message = "{\"direction\":\"rx\",\"message\":\""+ce+"\"}";
				
				// now send it to the WebSocket
				WebSocketMessage<?> wsm = new TextMessage(message);
				try {
					System.out.println("CommsController sending to WebSocket");
					GcWebSocketHandler.send(wsm);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			/**
			 * We have a GC text string which will need to be delivered to all of the 
			 * connected WebSockets.
			 */
			@Override
			public void receiveString(String input) {
				// We don't use this at the moment
			}});
		return currentState;
	}
	
	/**
	 * Disconnect from the current connection.

	 */
	@RequestMapping(value="/comms", method=RequestMethod.DELETE)
	public void disconnect() {
		/* Disconnect and close any current connection */
		if (current != null) {
			current.getDriver().close();
			current = null;
		}
		// Now try connecting to the new port
		currentName = null;
		currentState = "Disconnected";
	}
	
	/**
	 * 
	 * @return
	 */
	public static DriverInfo getCurrent() {
		return current;
	}
	/**
	 * 
	 * @return
	 */
	public static String getCurrentName() {
		return currentName;
	}
	/**
	 * 
	 * @return
	 */
	public static String getCurrentState() {
		return currentState;
	}
	
}