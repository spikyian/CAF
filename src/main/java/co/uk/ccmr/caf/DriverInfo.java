package co.uk.ccmr.caf;

import co.uk.ccmr.cbus.driver.CbusDriver;

public class DriverInfo {
	public String type;
	public CbusDriver driver;
	public DriverInfo(String t, CbusDriver d) {
		type = t;
		driver = d;
	}
	public String getType() {
		return type;
	}
	public CbusDriver getDriver() {
		return driver;
	}
}
