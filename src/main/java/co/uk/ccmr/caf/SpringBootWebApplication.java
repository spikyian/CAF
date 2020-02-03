package co.uk.ccmr.caf;

import java.util.ArrayList;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import co.uk.ccmr.cbus.driver.CbusDriver;
import co.uk.ccmr.cbus.driver.tcp.TcpCbusDriver;
import co.uk.ccmr.cbus.util.OptionsImpl;

@SpringBootApplication
public class SpringBootWebApplication {

    public static void main(String[] args) {
    	Globals.drivers = new ArrayList<DriverInfo>();
    	
    	CbusDriver serial = null;
    	String clazz = OptionsImpl.getOptions(null, args).getDriver();
    	if (clazz == null) {
    		clazz = "co.uk.ccmr.cbus.driver.fazecastSerial.FazecastSerialCbusDriver";
    	}
		Class<CbusDriver> clz = null;
		try {
			clz = (Class<CbusDriver>) Class.forName(clazz);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			System.err.println("No class:"+clazz);
			System.exit(1);
		}
		if (clz == null) {
			System.err.println("No class:"+clazz);
			System.exit(1);
		}
		try {
			serial = clz.newInstance();
			serial.init(0, null, OptionsImpl.getOptions(null, args));
		} catch (InstantiationException e) {
			e.printStackTrace();
			System.err.println("Can't instantiate class:"+clazz);
			System.exit(1);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			System.err.println("Can't instantiate class:"+clazz);
			System.exit(1);
		}
		if (serial != null) {
			Globals.drivers.add(new DriverInfo("Serial", serial));
		}
		
		CbusDriver tcp = new TcpCbusDriver();
		tcp.init(0, null, OptionsImpl.getOptions(null, args));
		if (tcp != null) {
			Globals.drivers.add(new DriverInfo("TCP", tcp));
		}
		
        SpringApplication.run(SpringBootWebApplication.class, args);
    }
}