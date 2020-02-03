package co.uk.ccmr.caf.comms;

import java.util.ArrayList;
import java.util.List;

public class DriverInformation {
	private String type;
	private List<String> ports;
		
	public DriverInformation(String t) {
		type = t;
		ports = new ArrayList<String>();
	}
		
	public String getType() {
		return type;
	}

	public List<String> getPorts() {
		return ports;
	}		
}
