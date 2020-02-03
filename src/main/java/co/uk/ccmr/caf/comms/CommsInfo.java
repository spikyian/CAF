package co.uk.ccmr.caf.comms;

import java.util.ArrayList;
import java.util.List;

public class CommsInfo {
	private String type;
	private String name;
	private String state;
	private List<DriverInformation> drivers;
	
	public CommsInfo() {
		type = "";
		name = "";
		state = "";
		drivers = new ArrayList<DriverInformation>();
	}
	
	public String getType() {
		return type;
	}
	public String getName() {
		return name;
	}
	public String getState() {
		return state;
	}
	public List<DriverInformation> getDrivers() {
		return drivers;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setState(String state) {
		this.state = state;
	}
	
	
}
