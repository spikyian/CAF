var learnnn = 0;

/**
 * Put a module into learn mode and save the module.
 * Only 1 module is allowed in learn mode at a time.
 */
function learn(nn) {
	if (learnnn != 0) {
		console.log("multiple modules in learn mode.");
		alert("Error - multiple modules in learn mode.");
	}
	learnnn = nn;
	var req = {direction:'tx', message:':S0FC0N53'+number2hex4(learnnn)+';'};
	gcSend(req);
}

/**
 * Take the module out of learn mode.
 */
function unlearn() {
	var req = {direction:'tx', message:':S0FC0N54'+number2hex4(learnnn)+';'};
	gcSend(req);
	learnnn = 0;
}

/**
 * convert the protocol number into string.
 */
function cbusProtocol(p) {
	switch(p) {
    case 1:
    	return "CAN";
    case 2:
    	return "ETH";
    default:
    	return "unknown";
    }
}

/**
 * convert the manufacturer type into a string.
 */
function cbusManufacturer(manu) {
	switch(manu) {
    case 165:
    	return "MERG";
    case 70:
    	return "ROCRAIL";
    case 80:
    	return "SPECTRUM";
    default:
    	return "unknown";
    }
}

/**
 * Test to see if the opc is an event type.
 */
function isEvent(opc) {
	if (opc < OPC_ACON) return false;
	if ((opc & 150) != 144) return false;
	return true;
}

/**
 * Test to see if the event opc is a short event.
 */
function isShort(opc) {
	if ((opc & 8) == 8) return true;
	return false;
}

/**
 * Test to see if the event is an ON event as opposed to an OFF event.
 */
function isOn(opc) {
	if ((opc & 1) == 1) return false;
	return true;
}

/**
 * Convert an OPC number to a string.
 */
function cbusOpc(opc) {
	switch(opc) {
	
	case OPC_ACK: return "ACK";	// General ack
	case OPC_NAK: return "NAK";	// General nak
	case OPC_HLT: return "HLT";	// Bus Halt
	case OPC_BON: return "BON";	// Bus on
	case OPC_TOF: return "TOF";	// Track off
	case OPC_TON: return "TON";	// Track on
	case OPC_ESTOP: return "ESTOP";	// Track stopped
	case OPC_ARST: return "ARST";	// System reset
	case OPC_RTOF: return "RTOF";	// Request track off
	case OPC_RTON: return "RTON";	// Request track on
	case OPC_RESTP: return "RESTP";	// Request emergency stop all
	case OPC_RSTAT: return "RSTAT";	// Request node status
	case OPC_QNN: return "QNN";	// Query nodes
// 
	case OPC_RQNP: return "RQNP";	// Read node parameters
	case OPC_RQMN: return "RQMN";	// Request name of module type
// 
// Packets with 1 data byte
// 
	case OPC_KLOC: return "KLOC";	// Release engine by handle
	case OPC_QLOC: return "QLOC";	// Query engine by handle
	case OPC_DKEEP: return "DKEEP";	// Keep alive for cab
// 
	case OPC_DBG1: return "DBG1";	// Debug message with 1 status byte
	case OPC_EXTC: return "EXTC";	// Extended opcode
// 
// Packets with 2 data bytes
// 
	case OPC_RLOC: return "RLOC";	// Request session for loco
	case OPC_QCON: return "QCON";	// Query consist
	case OPC_SNN: return "SNN";	// Set node number
	case OPC_ALOC: return "ALOC";	// Allocate loco (used to allocate to a shuttle in cancmd)
// 
	case OPC_STMOD: return "STMOD";	// Set Throttle mode
	case OPC_PCON: return "PCON";	// Consist loco
	case OPC_KCON: return "KCON";	// De-consist loco
	case OPC_DSPD: return "DSPD";	// Loco speed/dir
	case OPC_DFLG: return "DFLG";	// Set engine flags
	case OPC_DFNON: return "DFNON";	// Loco function on
	case OPC_DFNOF: return "DFNOF";	// Loco function off
	case OPC_SSTAT: return "SSTAT";	// Service mode status
	case OPC_NNRSM: return "NNRSM";	// Reset to manufacturer's defaults
// 
	case OPC_RQNN: return "RQNN";	// Request Node number in setup mode
	case OPC_NNREL: return "NNREL";	// Node number release
	case OPC_NNACK: return "NNACK";	// Node number acknowledge
	case OPC_NNLRN: return "NNLRN";	// Set learn mode
	case OPC_NNULN: return "NNULN";	// Release learn mode
	case OPC_NNCLR: return "NNCLR";	// Clear all events
	case OPC_NNEVN: return "NNEVN";	// Read available event slots
	case OPC_NERD: return "NERD";	// Read all stored events
	case OPC_RQEVN: return "RQEVN";	// Read number of stored events
	case OPC_WRACK: return "WRACK";	// Write acknowledge
	case OPC_RQDAT: return "RQDAT";	// Request node data event
	case OPC_RQDDS: return "RQDDS";	// Request short data frame
	case OPC_BOOT: return "BOOT";	// Put node into boot mode
	case OPC_ENUM: return "ENUM";	// Force can_id self enumeration
	case OPC_NNRST: return "NNRST";	// Reset node (as in restart)
	case OPC_EXTC1: return "EXTC1";	// Extended opcode with 1 data byte
// 
// Packets with 3 data bytes
// 
	case OPC_DFUN: return "DFUN";	// Set engine functions
	case OPC_GLOC: return "GLOC";	// Get loco (with support for steal/share)
	case OPC_ERR: return "ERR";	// Command station error
	case OPC_CMDERR: return "CMDERR";	// Errors from nodes during config
// 
	case OPC_EVNLF: return "EVNLF";	// Event slots left response
	case OPC_NVRD: return "NVRD";	// Request read of node variable
	case OPC_NENRD: return "NENRD";	// Request read stored event by index
	case OPC_RQNPN: return "RQNPN";	// Request read module parameters
	case OPC_NUMEV: return "NUMEV";	// Number of events stored response
	case OPC_CANID: return "CANID";	// Set canid
	case OPC_EXTC2: return "EXTC2";	// Extended opcode with 2 data bytes
// 
// Packets with 4 data bytes
// 
	case OPC_RDCC3: return "RDCC3";	// 3 byte DCC packet
	case OPC_WCVO: return "WCVO";	// Write CV byte Ops mode by handle
	case OPC_WCVB: return "WCVB";	// Write CV bit Ops mode by handle
	case OPC_QCVS: return "QCVS";	// Read CV
	case OPC_PCVS: return "PCVS";	// Report CV
	case OPC_CABSIG: return "CABSIG";	// Cab signalling
// 
	case OPC_ACON: return "ACON";	// on event
	case OPC_ACOF: return "ACOF";	// off event
	case OPC_AREQ: return "AREQ";	// Accessory Request event
	case OPC_ARON: return "ARON";	// Accessory response event on
	case OPC_AROF: return "AROF";	// Accessory response event off
	case OPC_EVULN: return "EVULN";	// Unlearn event
	case OPC_NVSET: return "NVSET";	// Set a node variable
	case OPC_NVANS: return "NVANS";	// Node variable value response
	case OPC_ASON: return "ASON";	// Short event on
	case OPC_ASOF: return "ASOF";	// Short event off
	case OPC_ASRQ: return "ASRQ";	// Short Request event
	case OPC_PARAN: return "PARAN";	// Single node parameter response
	case OPC_REVAL: return "REVAL";	// Request read of event variable
	case OPC_ARSON: return "ARSON";	// Accessory short response on event
	case OPC_ARSOF: return "ARSOF";	// Accessory short response off event
	case OPC_EXTC3: return "EXTC3";	// Extended opcode with 3 data bytes
// 
// Packets with 5 data bytes
// 
	case OPC_RDCC4: return "RDCC4";	// 4 byte DCC packet
	case OPC_WCVS: return "WCVS";	// Write CV service mode
// 
	case OPC_ACON1: return "ACON1";	// On event with one data byte
	case OPC_ACOF1: return "ACOF1";	// Off event with one data byte
	case OPC_REQEV: return "REQEV";	// Read event variable in learn mode
	case OPC_ARON1: return "ARON1";	// Accessory on response (1 data byte)
	case OPC_AROF1: return "AROF1";	// Accessory off response (1 data byte)
	case OPC_NEVAL: return "NEVAL";	// Event variable by index read response
	case OPC_PNN: return "PNN";	// Response to QNN
	case OPC_ASON1: return "ASON1";	// Accessory short on with 1 data byte
	case OPC_ASOF1: return "ASOF1";	// Accessory short off with 1 data byte
	case OPC_ARSON1: return "ARSON1";	// Short response event on with one data byte
	case OPC_ARSOF1: return "ARSOF1";	// Short response event off with one data byte
	case OPC_EXTC4: return "EXTC4";	// Extended opcode with 4 data bytes
// 
// Packets with 6 data bytes
// 
	case OPC_RDCC5: return "RDCC5";	// 5 byte DCC packet
	case OPC_WCVOA: return "WCVOA";	// Write CV ops mode by address
	case OPC_FCLK: return "FCLK";	// Fast clock
// 
	case OPC_ACON2: return "ACON2";	// On event with two data bytes
	case OPC_ACOF2: return "ACOF2";	// Off event with two data bytes
	case OPC_EVLRN: return "EVLRN";	// Teach event
	case OPC_EVANS: return "EVANS";	// Event variable read response in learn mode
	case OPC_ARON2: return "ARON2";	// Accessory on response
	case OPC_AROF2: return "AROF2";	// Accessory off response
	case OPC_ASON2: return "ASON2";	// Accessory short on with 2 data bytes
	case OPC_ASOF2: return "ASOF2";	// Accessory short off with 2 data bytes
	case OPC_ARSON2: return "ARSON2";	// Short response event on with two data bytes
	case OPC_ARSOF2: return "ARSOF2";	// Short response event off with two data bytes
	case OPC_EXTC5: return "EXTC5";	// Extended opcode with 5 data bytes
// 
// Packets with 7 data bytes
// 
	case OPC_RDCC6: return "RDCC6";	// 6 byte DCC packets
	case OPC_PLOC: return "PLOC";	// Loco session report
	case OPC_NAME: return "NAME";	// Module name response
	case OPC_STAT: return "STAT";	// Command station status report
	case OPC_PARAMS: return "PARAMS";	// Node parameters response
// 
	case OPC_ACON3: return "ACON3";	// On event with 3 data bytes
	case OPC_ACOF3: return "ACOF3";	// Off event with 3 data bytes
	case OPC_ENRSP: return "ENRSP";	// Read node events response
	case OPC_ARON3: return "ARON3";	// Accessory on response
	case OPC_AROF3: return "AROF3";	// Accessory off response
	case OPC_EVLRNI: return "EVLRNI";	// Teach event using event indexing
	case OPC_ACDAT: return "ACDAT";	// Accessory data event: 5 bytes of node data (eg: RFID)
	case OPC_ARDAT: return "ARDAT";	// Accessory data response
	case OPC_ASON3: return "ASON3";	// Accessory short on with 3 data bytes
	case OPC_ASOF3: return "ASOF3";	// Accessory short off with 3 data bytes
	case OPC_DDES: return "DDES";	// Short data frame aka device data event (device id plus 5 data bytes)
	case OPC_DDRS: return "DDRS";	// Short data frame response aka device data response
	case OPC_DDWS: return "DDWS";	// Device Data Write Short
	case OPC_ARSON3: return "ARSON3";	// Short response event on with 3 data bytes
	case OPC_ARSOF3: return "ARSOF3";	// Short response event off with 3 data bytes
	case OPC_EXTC6: return "EXTC6";	// Extended opcode with 6 data byes
	
	default:
    	return "unknown";
	}
}

/**
 * convert the module type into a string name.
 */
function cbusModuleType (mt) {
	switch (mt) {
	
	case MTYP_SLIM: return "SLIM";	// default for SLiM nodes
	case MTYP_CANACC4: return "CANACC4";	// Solenoid point driver
	case MTYP_CANACC5: return "CANACC5";	// Motorised point driver
	case MTYP_CANACC8: return "CANACC8";	// 8 digital outputs
	case MTYP_CANACE3: return "CANACE3";	// Control panel switch/button encoder
	case MTYP_CANACE8C: return "CANACE8C";	// 8 digital inputs
	case MTYP_CANLED: return "CANLED";	// 64 led driver
	case MTYP_CANLED64: return "CANLED64";	// 64 led driver (multi leds per event)
	case MTYP_CANACC4_2: return "CANACC4_2";	// 12v version of CANACC4
	case MTYP_CANCAB: return "CANCAB";	// CANCAB hand throttle
	case MTYP_CANCMD: return "CANCMD";	// CANCMD command station
	case MTYP_CANSERVO: return "CANSERVO";	// 8 servo driver (on canacc8 or similar hardware)
	case MTYP_CANBC: return "CANBC";	// BC1a command station
	case MTYP_CANRPI: return "CANRPI";	// RPI and RFID interface
	case MTYP_CANTTCA: return "CANTTCA";	// Turntable controller (turntable end)
	case MTYP_CANTTCB: return "CANTTCB";	// Turntable controller (control panel end)
	case MTYP_CANHS: return "CANHS";	// Handset controller for old BC1a type handsets
	case MTYP_CANTOTI: return "CANTOTI";	// Track occupancy detector
	case MTYP_CAN8I8O: return "CAN8I8O";	// 8 inputs 8 outputs
	case MTYP_CANSERVO8C: return "CANSERVO8C";	// Canservo with servo position feedback
	case MTYP_CANRFID: return "CANRFID";	// RFID input
	case MTYP_CANTC4: return "CANTC4";	// 
	case MTYP_CANACE16C: return "CANACE16C";	// 16 inputs
	case MTYP_CANIO8: return "CANIO8";	// 8 way I/O
	case MTYP_CANSNDX: return "CANSNDX";	// ??
	case MTYP_CANEther: return "CANEther";	// Ethernet interface
	case MTYP_CANSIG64: return "CANSIG64";	// Multiple aspect signalling for CANLED module
	case MTYP_CANSIG8: return "CANSIG8";	// Multiple aspect signalling for CANACC8 module
	case MTYP_CANCOND8C: return "CANCOND8C";	// Conditional event generation
	case MTYP_CANPAN: return "CANPAN";	// Control panel 32/32
	case MTYP_CANACE3C: return "CANACE3C";	// Newer version of CANACE3 firmware
	case MTYP_CANPanel: return "CANPanel";	// Control panel 64/64
	case MTYP_CANMIO: return "CANMIO";	// Multiple I/O
	case MTYP_CANACE8MIO: return "CANACE8MIO";	// Multiple IO module emulating ACE8C
	case MTYP_CANSOL: return "CANSOL";	// Solenoid driver module
	case MTYP_CANBIP: return "CANBIP";	// Bipolar IO module with additional 8 I/O pins
	case MTYP_CANCDU: return "CANCDU";	// Solenoid driver module with additional 6 I/O pins
	case MTYP_CANACC4CDU: return "CANACC4CDU";	// CANACC4 firmware ported to CANCDU
	case MTYP_CANWiBase: return "CANWiBase";	// CAN to MiWi base station
	case MTYP_WiCAB: return "WiCAB";	// Wireless cab using MiWi protocol
	case MTYP_CANWiFi: return "CANWiFi";	// CAN to WiFi connection with Withrottle to CBUS protocol conversion
	case MTYP_CANFTT: return "CANFTT";	// Turntable controller configured using FLiM
	case MTYP_CANHNDST: return "CANHNDST";	// Handset (alternative to CANCAB)
	case MTYP_CANTCHNDST: return "CANTCHNDST";	// Touchscreen handset
	case MTYP_CANRFID8: return "CANRFID8";	// multi-channel RFID reader
	case MTYP_CANmchRFID: return "CANmchRFID";	// either a 2ch or 8ch RFID reader
	case MTYP_CANPiWi: return "CANPiWi";	// a Raspberry Pi based module for WiFi
	case MTYP_CAN4DC: return "CAN4DC";	// DC train controller
	case MTYP_CANELEV: return "CANELEV";	// Nelevator controller
	case MTYP_CANSCAN: return "CANSCAN";	// 128 switch inputs
	case MTYP_CANMIO_SVO: return "CANMIO_SVO";	// 16MHz 25k80 version of CANSERVO8c
	case MTYP_CANMIO_INP: return "CANMIO_INP";	// 16MHz 25k80 version of CANACE8MIO
	case MTYP_CANMIO_OUT: return "CANMIO_OUT";	// 16MHz 25k80 version of CANACC8
	case MTYP_CANBIP_OUT: return "CANBIP_OUT";	// 16MHz 25k80 version of CANACC5
	case MTYP_CANASTOP: return "CANASTOP";	// DCC stop generator
	case MTYP_CANCSB: return "CANCSB";	// CANCMD with on board 3A booster
	case MTYP_CANMAGOT: return "CANMAGOT";	// Magnet on Track detector
	case MTYP_CANACE16CMIO: return "CANACE16CMIO";	// 16 input equivaent to CANACE8C
	case MTYP_CANPiNODE: return "CANPiNODE";	// CBUS module based on Raspberry Pi
	case MTYP_CANDISP: return "CANDISP";	// 25K80 version of CANLED64 (IHart and MB)
	case MTYP_CANCOMPUTE: return "CANCOMPUTE";	// Event processing engine
// 
	case MTYP_CAN_SW: return "CAN_SW";	// Software nodes
	case MTYP_EMPTY: return "EMPTY";	// Empty module, bootloader only
	case MTYP_CANUSB: return "CANUSB";	// USB interface
	
	
	default: return "unknown";
	}
}


// 
// MERG Module types
// 
const MTYP_SLIM=0;	// default for SLiM nodes
const MTYP_CANACC4=1;	// Solenoid point driver
const MTYP_CANACC5=2;	// Motorised point driver
const MTYP_CANACC8=3;	// 8 digital outputs
const MTYP_CANACE3=4;	// Control panel switch/button encoder
const MTYP_CANACE8C=5;	// 8 digital inputs
const MTYP_CANLED=6;	// 64 led driver
const MTYP_CANLED64=7;	// 64 led driver (multi leds per event)
const MTYP_CANACC4_2=8;	// 12v version of CANACC4
const MTYP_CANCAB=9;	// CANCAB hand throttle
const MTYP_CANCMD=10;	// CANCMD command station
const MTYP_CANSERVO=11;	// 8 servo driver (on canacc8 or similar hardware)
const MTYP_CANBC=12;	// BC1a command station
const MTYP_CANRPI=13;	// RPI and RFID interface
const MTYP_CANTTCA=14;	// Turntable controller (turntable end)
const MTYP_CANTTCB=15;	// Turntable controller (control panel end)
const MTYP_CANHS=16;	// Handset controller for old BC1a type handsets
const MTYP_CANTOTI=17;	// Track occupancy detector
const MTYP_CAN8I8O=18;	// 8 inputs 8 outputs
const MTYP_CANSERVO8C=19;	// Canservo with servo position feedback
const MTYP_CANRFID=20;	// RFID input
const MTYP_CANTC4=21;	// 
const MTYP_CANACE16C=22;	// 16 inputs
const MTYP_CANIO8=23;	// 8 way I/O
const MTYP_CANSNDX=24;	// ??
const MTYP_CANEther=25;	// Ethernet interface
const MTYP_CANSIG64=26;	// Multiple aspect signalling for CANLED module
const MTYP_CANSIG8=27;	// Multiple aspect signalling for CANACC8 module
const MTYP_CANCOND8C=28;	// Conditional event generation
const MTYP_CANPAN=29;	// Control panel 32/32
const MTYP_CANACE3C=30;	// Newer version of CANACE3 firmware
const MTYP_CANPanel=31;	// Control panel 64/64
const MTYP_CANMIO=32;	// Multiple I/O
const MTYP_CANACE8MIO=33;	// Multiple IO module emulating ACE8C
const MTYP_CANSOL=34;	// Solenoid driver module
const MTYP_CANBIP=35;	// Bipolar IO module with additional 8 I/O pins
const MTYP_CANCDU=36;	// Solenoid driver module with additional 6 I/O pins
const MTYP_CANACC4CDU=37;	// CANACC4 firmware ported to CANCDU
const MTYP_CANWiBase=38;	// CAN to MiWi base station
const MTYP_WiCAB=39;	// Wireless cab using MiWi protocol
const MTYP_CANWiFi=40;	// CAN to WiFi connection with Withrottle to CBUS protocol conversion
const MTYP_CANFTT=41;	// Turntable controller configured using FLiM
const MTYP_CANHNDST=42;	// Handset (alternative to CANCAB)
const MTYP_CANTCHNDST=43;	// Touchscreen handset
const MTYP_CANRFID8=44;	// multi-channel RFID reader
const MTYP_CANmchRFID=45;	// either a 2ch or 8ch RFID reader
const MTYP_CANPiWi=46;	// a Raspberry Pi based module for WiFi
const MTYP_CAN4DC=47;	// DC train controller
const MTYP_CANELEV=48;	// Nelevator controller
const MTYP_CANSCAN=49;	// 128 switch inputs
const MTYP_CANMIO_SVO=50;	// 16MHz 25k80 version of CANSERVO8c
const MTYP_CANMIO_INP=51;	// 16MHz 25k80 version of CANACE8MIO
const MTYP_CANMIO_OUT=52;	// 16MHz 25k80 version of CANACC8
const MTYP_CANBIP_OUT=53;	// 16MHz 25k80 version of CANACC5
const MTYP_CANASTOP=54;	// DCC stop generator
const MTYP_CANCSB=55;	// CANCMD with on board 3A booster
const MTYP_CANMAGOT=56;	// Magnet on Track detector
const MTYP_CANACE16CMIO=57;	// 16 input equivaent to CANACE8C
const MTYP_CANPiNODE=58;	// CBUS module based on Raspberry Pi
const MTYP_CANDISP=59;	// 25K80 version of CANLED64 (IHart and MB)
const MTYP_CANCOMPUTE=60;	// Event processing engine
// 
const MTYP_CAN_SW=255;	// Software nodes
const MTYP_EMPTY=254;	// Empty module, bootloader only
const MTYP_CANUSB=253;	// USB interface
// 
// Rocrail Module types
// 
const MTYP_CANGC1=1;	// RS232 PC interface
const MTYP_CANGC2=2;	// 16 I/O
const MTYP_CANGC3=3;	// Command station (derived from cancmd)
const MTYP_CANGC4=4;	// 8 channel RFID reader
const MTYP_CANGC5=5;	// Cab for fixed panels (derived from cancab)
const MTYP_CANGC6=6;	// 4 channel servo controller
const MTYP_CANGC7=7;	// Fast clock module
const MTYP_CANGC1e=11;	// CAN<->Ethernet interface
// 
// Spectrum Engineering Animated Modeller module types
// 
const MTYP_AMCTRLR=1;	// Animation controller (firmware derived from cancmd)
const MTYP_DUALCAB=2;	// Dual cab based on cancab
// 
// 
// CBUS opcodes list
// 
// Packets with no data bytes
// 
const OPC_ACK=0;	// General ack
const OPC_NAK=1;	// General nak
const OPC_HLT=2;	// Bus Halt
const OPC_BON=3;	// Bus on
const OPC_TOF=4;	// Track off
const OPC_TON=5;	// Track on
const OPC_ESTOP=6;	// Track stopped
const OPC_ARST=7;	// System reset
const OPC_RTOF=8;	// Request track off
const OPC_RTON=9;	// Request track on
const OPC_RESTP=10;	// Request emergency stop all
const OPC_RSTAT=12;	// Request node status
const OPC_QNN=13;	// Query nodes
// 
const OPC_RQNP=16;	// Read node parameters
const OPC_RQMN=17;	// Request name of module type
// 
// Packets with 1 data byte
// 
const OPC_KLOC=33;	// Release engine by handle
const OPC_QLOC=34;	// Query engine by handle
const OPC_DKEEP=35;	// Keep alive for cab
// 
const OPC_DBG1=48;	// Debug message with 1 status byte
const OPC_EXTC=63;	// Extended opcode
// 
// Packets with 2 data bytes
// 
const OPC_RLOC=64;	// Request session for loco
const OPC_QCON=65;	// Query consist
const OPC_SNN=66;	// Set node number
const OPC_ALOC=67;	// Allocate loco (used to allocate to a shuttle in cancmd)
// 
const OPC_STMOD=68;	// Set Throttle mode
const OPC_PCON=69;	// Consist loco
const OPC_KCON=70;	// De-consist loco
const OPC_DSPD=71;	// Loco speed/dir
const OPC_DFLG=72;	// Set engine flags
const OPC_DFNON=73;	// Loco function on
const OPC_DFNOF=74;	// Loco function off
const OPC_SSTAT=76;	// Service mode status
const OPC_NNRSM=79;	// Reset to manufacturer's defaults
// 
const OPC_RQNN=80;	// Request Node number in setup mode
const OPC_NNREL=81;	// Node number release
const OPC_NNACK=82;	// Node number acknowledge
const OPC_NNLRN=83;	// Set learn mode
const OPC_NNULN=84;	// Release learn mode
const OPC_NNCLR=85;	// Clear all events
const OPC_NNEVN=86;	// Read available event slots
const OPC_NERD=87;	// Read all stored events
const OPC_RQEVN=88;	// Read number of stored events
const OPC_WRACK=89;	// Write acknowledge
const OPC_RQDAT=90;	// Request node data event
const OPC_RQDDS=91;	// Request short data frame
const OPC_BOOT=92;	// Put node into boot mode
const OPC_ENUM=93;	// Force can_id self enumeration
const OPC_NNRST=94;	// Reset node (as in restart)
const OPC_EXTC1=95;	// Extended opcode with 1 data byte
// 
// Packets with 3 data bytes
// 
const OPC_DFUN=96;	// Set engine functions
const OPC_GLOC=97;	// Get loco (with support for steal/share)
const OPC_ERR=99;	// Command station error
const OPC_CMDERR=100;	// Errors from nodes during config
// 
const OPC_EVNLF=112;	// Event slots left response
const OPC_NVRD=113;	// Request read of node variable
const OPC_NENRD=114;	// Request read stored event by index
const OPC_RQNPN=115;	// Request read module parameters
const OPC_NUMEV=116;	// Number of events stored response
const OPC_CANID=117;	// Set canid
const OPC_EXTC2=127;	// Extended opcode with 2 data bytes
// 
// Packets with 4 data bytes
// 
const OPC_RDCC3=128;	// 3 byte DCC packet
const OPC_WCVO=130;	// Write CV byte Ops mode by handle
const OPC_WCVB=131;	// Write CV bit Ops mode by handle
const OPC_QCVS=132;	// Read CV
const OPC_PCVS=133;	// Report CV
const OPC_CABSIG=134;	// Cab signalling
// 
const OPC_ACON=144;	// on event
const OPC_ACOF=145;	// off event
const OPC_AREQ=146;	// Accessory Request event
const OPC_ARON=147;	// Accessory response event on
const OPC_AROF=148;	// Accessory response event off
const OPC_EVULN=149;	// Unlearn event
const OPC_NVSET=150;	// Set a node variable
const OPC_NVANS=151;	// Node variable value response
const OPC_ASON=152;	// Short event on
const OPC_ASOF=153;	// Short event off
const OPC_ASRQ=154;	// Short Request event
const OPC_PARAN=155;	// Single node parameter response
const OPC_REVAL=156;	// Request read of event variable
const OPC_ARSON=157;	// Accessory short response on event
const OPC_ARSOF=158;	// Accessory short response off event
const OPC_EXTC3=159;	// Extended opcode with 3 data bytes
// 
// Packets with 5 data bytes
// 
const OPC_RDCC4=160;	// 4 byte DCC packet
const OPC_WCVS=162;	// Write CV service mode
// 
const OPC_ACON1=176;	// On event with one data byte
const OPC_ACOF1=177;	// Off event with one data byte
const OPC_REQEV=178;	// Read event variable in learn mode
const OPC_ARON1=179;	// Accessory on response (1 data byte)
const OPC_AROF1=180;	// Accessory off response (1 data byte)
const OPC_NEVAL=181;	// Event variable by index read response
const OPC_PNN=182;	// Response to QNN
const OPC_ASON1=184;	// Accessory short on with 1 data byte
const OPC_ASOF1=185;	// Accessory short off with 1 data byte
const OPC_ARSON1=189;	// Short response event on with one data byte
const OPC_ARSOF1=190;	// Short response event off with one data byte
const OPC_EXTC4=191;	// Extended opcode with 4 data bytes
// 
// Packets with 6 data bytes
// 
const OPC_RDCC5=192;	// 5 byte DCC packet
const OPC_WCVOA=193;	// Write CV ops mode by address
const OPC_FCLK=207;	// Fast clock
// 
const OPC_ACON2=208;	// On event with two data bytes
const OPC_ACOF2=209;	// Off event with two data bytes
const OPC_EVLRN=210;	// Teach event
const OPC_EVANS=211;	// Event variable read response in learn mode
const OPC_ARON2=212;	// Accessory on response
const OPC_AROF2=213;	// Accessory off response
const OPC_ASON2=216;	// Accessory short on with 2 data bytes
const OPC_ASOF2=217;	// Accessory short off with 2 data bytes
const OPC_ARSON2=221;	// Short response event on with two data bytes
const OPC_ARSOF2=222;	// Short response event off with two data bytes
const OPC_EXTC5=223;	// Extended opcode with 5 data bytes
// 
// Packets with 7 data bytes
// 
const OPC_RDCC6=224;	// 6 byte DCC packets
const OPC_PLOC=225;	// Loco session report
const OPC_NAME=226;	// Module name response
const OPC_STAT=227;	// Command station status report
const OPC_PARAMS=239;	// Node parameters response
// 
const OPC_ACON3=240;	// On event with 3 data bytes
const OPC_ACOF3=241;	// Off event with 3 data bytes
const OPC_ENRSP=242;	// Read node events response
const OPC_ARON3=243;	// Accessory on response
const OPC_AROF3=244;	// Accessory off response
const OPC_EVLRNI=245;	// Teach event using event indexing
const OPC_ACDAT=246;	// Accessory data event: 5 bytes of node data (eg: RFID)
const OPC_ARDAT=247;	// Accessory data response
const OPC_ASON3=248;	// Accessory short on with 3 data bytes
const OPC_ASOF3=249;	// Accessory short off with 3 data bytes
const OPC_DDES=250;	// Short data frame aka device data event (device id plus 5 data bytes)
const OPC_DDRS=251;	// Short data frame response aka device data response
const OPC_DDWS=252;	// Device Data Write Short
const OPC_ARSON3=253;	// Short response event on with 3 data bytes
const OPC_ARSOF3=254;	// Short response event off with 3 data bytes
const OPC_EXTC6=255;	// Extended opcode with 6 data byes
// 
// 
// Modes for STMOD
// 
const TMOD_SPD_MASK=3;	// 
const TMOD_SPD_128=0;	// 
const TMOD_SPD_14=1;	// 
const TMOD_SPD_28I=2;	// 
const TMOD_SPD_28=3;	// 
// 
// Error codes for OPC_ERR
// 
const ERR_LOCO_STACK_FULL=1;	// 
const ERR_LOCO_ADDR_TAKEN=2;	// 
const ERR_SESSION_NOT_PRESENT=3;	// 
const ERR_CONSIST_EMPTY=4;	// 
const ERR_LOCO_NOT_FOUND=5;	// 
const ERR_CMD_RX_BUF_OFLOW=6;	// 
const ERR_INVALID_REQUEST=7;	// 
const ERR_SESSION_CANCELLED=8;	// 
// 
// Status codes for OPC_SSTAT
// 
const SSTAT_NO_ACK=1;	// 
const SSTAT_OVLD=2;	// 
const SSTAT_WR_ACK=3;	// 
const SSTAT_BUSY=4;	// 
const SSTAT_CV_ERROR=5;	// 
// 
// Error codes for OPC_CMDERR
// 
const CMDERR_INV_CMD=1;	// 
const CMDERR_NOT_LRN=2;	// 
const CMDERR_NOT_SETUP=3;	// 
const CMDERR_TOO_MANY_EVENTS=4;	// 
const CMDERR_NO_EV=5;	// 
const CMDERR_INV_EV_IDX=6;	// 
const CMDERR_INVALID_EVENT=7;	// 
const CMDERR_INV_EN_IDX=8;	// now reserved
const CMDERR_INV_PARAM_IDX=9;	// 
const CMDERR_INV_NV_IDX=10;	// 
const CMDERR_INV_EV_VALUE=11;	// 
const CMDERR_INV_NV_VALUE=12;	// 
// 
// Aspect codes for OPC_CABSIG
// 
// First aspect byte
// 
const SASP_DANGER=0;	// 
const SASP_CAUTION=1;	// 
const SASP_PRELIM_CAUTION=2;	// 
const SASP_PROCEED=3;	// 
const SASP_CALLON=4;	// Set bit 2 for call-on - main aspect will usually be at danger
const SASP_THEATRE=8;	// Set bit 3 to 0 for upper nibble is feather lcoation, set 1 for upper nibble is theatre code
// 
// Aspect codes for OPC_CABSIG
// 
// 
// Second Aspect byte
// 
const SASP_LIT=0;	// Set bit 0 to indicate lit
const SASP_LUNAR=1;	// Set bit 1 for lunar indication
// 
// Remaining bits in second aspect byte yet to be defined - use for other signalling systems;	    ;	// 
// 
// 
// Parameter index numbers (readable by OPC_RQNPN, returned in OPC_PARAN)
// Index numbers count from 1, subtract 1 for offset into parameter block
// Note that RQNPN with index 0 returns the parameter count
// 
const PAR_MANU=1;	// Manufacturer id
const PAR_MINVER=2;	// Minor version letter
const PAR_MTYP=3;	// Module type code
const PAR_EVTNUM=4;	// Number of events supported
const PAR_EVNUM=5;	// Event variables per event
const PAR_NVNUM=6;	// Number of Node variables
const PAR_MAJVER=7;	// Major version number
const PAR_FLAGS=8;	// Node flags
const PAR_CPUID=9;	// Processor type
const PAR_BUSTYPE=10;	// Bus type
const PAR_LOAD=11;	// load address, 4 bytes
const PAR_CPUMID=15;	// CPU manufacturer's id as read from the chip config space, 4 bytes (note - read from cpu at runtime, so not included in checksum)
const PAR_CPUMAN=19;	//  CPU manufacturer code
const PAR_BETA=20;	// Beta revision (numeric), or 0 if release
// 
// Offsets to other values stored at the top of the parameter block.
// These are not returned by opcode PARAN, but are present in the hex
// file for FCU.
// 
const PAR_COUNT=24;	// Number of parameters implemented
const PAR_NAME=26;	// 4 byte Address of Module type name, up to 8 characters null terminated
const PAR_CKSUM=30;	// Checksum word at end of parameters
// 
// Flags in PAR_FLAGS
// 
const PF_NOEVENTS=0;	// 
const PF_CONSUMER=1;	// 
const PF_PRODUCER=2;	// 
const PF_COMBI=3;	// 
const PF_FLiM=4;	// 
const PF_BOOT=8;	// 
const PF_COE=16;	// Module can consume its own events
// 
// BUS type that module is connected to
// 
const PB_CAN=1;	// 
const PB_ETH=2;	// 
const PB_MIWI=3;	// 
// 
// Processor manufacturer codes
// 
const CPUM_MICROCHIP=1;	// 
const CPUM_ATMEL=2;	// 
const CPUM_ARM=3;	// 
// 
// Microchip Processor type codes (identifies to FCU for bootload compatiblity)
// 
const P18F2480=1;	// 
const P18F4480=2;	// 
const P18F2580=3;	// 
const P18F4580=4;	// 
const P18F2585=5;	// 
const P18F4585=6;	// 
const P18F2680=7;	// 
const P18F4680=8;	// 
const P18F2682=9;	// 
const P18F4682=10;	// 
const P18F2685=11;	// 
const P18F4685=12;	// 
// 
const P18F25K80=13;	// 
const P18F45K80=14;	// 
const P18F26K80=15;	// 
const P18F46K80=16;	// 
const P18F65K80=17;	// 
const P18F66K80=18;	// 
// 
const P32MX534F064=30;	// 
const P32MX564F064=31;	// 
const P32MX564F128=32;	// 
const P32MX575F256=33;	// 
const P32MX575F512=34;	// 
const P32MX764F128=35;	// 
const P32MX775F256=36;	// 
const P32MX775F512=37;	// 
const P32MX795F512=38;	// 
// 
// ARM Processor type codes (identifies to FCU for bootload compatiblity)
// 
const ARM1176JZF_S=1;	// As used in Raspberry Pi
const ARMCortex_A7=2;	// As Used in Raspberry Pi 2
const ARMCortex_A53=3;	// As used in Raspberry Pi 3