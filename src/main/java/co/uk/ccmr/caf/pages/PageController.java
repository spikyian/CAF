package co.uk.ccmr.caf.pages;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PageController {
	/** We treat the home page as special as it doesn't need the page prefix.
	 * 
	 * @return
	 */
	@RequestMapping(value = "/index", method = RequestMethod.GET)
	public String index() {
		return "index";
	}
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String index2() {
		return "index";
	}
	
	/** other generic page requests we just pass through to thymeleaf.
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/page/*", method = RequestMethod.GET)
	public String page(HttpServletRequest request) {
		System.out.println("PAGE REQUEST URI="+request.getRequestURI());
		// strip the leading "/page/" and use this as the view page name which thymeleaf translates into a file name
		return request.getRequestURI().substring("/page/".length());
	}
	
	/** module page requests we need to analyse the given parameters
	 * and work out the best template or file to use.
	 *
	 */
	
	@RequestMapping(
			value = "/nvedit.js", 
			params={"mu", "nn", "mt","v"}, 
			method = RequestMethod.GET,
			produces = "text/javascript"
	)
	public void getNvEditor(
			HttpServletRequest request, 
			HttpServletResponse response,
			@RequestParam("mu") String mu,
			@RequestParam("nn") int nn,
			@RequestParam("mt") String mt,
			@RequestParam("v") String v
			) {
		System.out.println("NV EDITOR REQUEST with params URI="+request.getRequestURI()+" mu="+mu+" nn="+nn+" mt="+mt+" v="+v);
		
		/* We first of all try the fully qualified name nV_<ModuleTypeName>_<major><minor>BETA<beta>.js */
		String myPath = "/module/nV."+mt+"."+v+".js";
	    Resource resouce = new ClassPathResource(myPath);
	    InputStream is;
	    try {
	    	try {
	    		is = resouce.getInputStream();
	    	} catch (FileNotFoundException e1) {
	    		System.out.println("File not found:"+myPath);
	    		/* Now try nV_<ModuleTypeName>_<major><minor>.js */
	    		int i=0;
	    		while (!Character.isDigit(v.charAt(i))) {
	    			i++;
	    		}
	    		while (Character.isDigit(v.charAt(i))) {
	    			i++;
	    		}
	    		// i should be at the first non digit
	    		
	    		/*
	    		 * Phase 1 - try to find a JS file for the module
	    		 */
	    		String vv = v.substring(0,i+1);
	    		myPath = "/module/nV."+mt+"."+vv+".js"; // 
	    		resouce = new ClassPathResource(myPath);
	    	
	    		try {
	    			is = resouce.getInputStream();
	    		} catch (FileNotFoundException e2) {
	    			System.out.println("File not found:"+myPath);
	    			/* Now try nV_<ModuleTypeName>_<major>.js */
	    			vv = v.substring(0,i);
	    			myPath = "/module/nV."+mt+"."+vv+".js"; // 
	    			resouce = new ClassPathResource(myPath);
	    			try {
	    				is = resouce.getInputStream();
	    			} catch (FileNotFoundException e3) {
	    				System.out.println("File not found:"+myPath);
			    	
	    				/* Now try <ModuleTypeName>.js */
	    				myPath = "/module/nV."+mt+".js"; // 
	    				resouce = new ClassPathResource(myPath);
	    				try {
	    					is = resouce.getInputStream();
	    				} catch (FileNotFoundException e4) {
	    					System.out.println("File not found:"+myPath);
	    					
	    					/*
	    		    		 * Phase 2 - try to find a XML file for the module
	    		    		 */
	    					vv = v.substring(0,i+1);
	    					myPath = "/module/"+mt+"."+vv+".xml"; // 
	    		    		resouce = new ClassPathResource(myPath);
	    		    	
	    		    		try {
	    		    			is = resouce.getInputStream();
	    		    		} catch (FileNotFoundException e5) {
	    		    			System.out.println("File not found:"+myPath);
	    		    			/* Now try nV_<ModuleTypeName>_<major>.xml */
	    		    			vv = v.substring(0,i);
	    		    			myPath = "/module/"+mt+"."+vv+".xml"; // 
	    		    			resouce = new ClassPathResource(myPath);
	    		    			try {
	    		    				is = resouce.getInputStream();
	    		    			} catch (FileNotFoundException e6) {
	    		    				System.out.println("File not found:"+myPath);
	    				    	
	    		    				/* Now try <ModuleTypeName>.xml */
	    		    				myPath = "/module/"+mt+".xml"; // 
	    		    				resouce = new ClassPathResource(myPath);
	    		    				try {
	    		    					is = resouce.getInputStream();
	    		    				} catch (FileNotFoundException e7) {
	    		    					System.out.println("File not found:"+myPath);
				    	
	    		    					/*
	    		    					 * Phase 3 - return with the generic editor
	    		    					 */
	    		    					/* Now try generic.js */
	    		    					myPath = "/module/genericNvEditor.js"; 
	    		    					resouce = new ClassPathResource(myPath);
	    		    					try {
	    		    						is = resouce.getInputStream();
	    		    					} catch (FileNotFoundException ex) {
	    		    						System.out.println("ERROR File not found:"+myPath);
	    		    						throw new RuntimeException("IOError reading file", ex);
	    		    					}
	    		    					System.out.println("Using "+myPath);
	    		    				    response.setContentType("text/javascript");
	    		    				    try {
	    		    				    	System.out.println("Returning Generic JavaScript");
	    		    				        IOUtils.copy(is, response.getOutputStream());
	    		    				        response.flushBuffer();
	    		    				    } catch (IOException ex) {
	    		    				        // log error
	    		    				    	is.close();
	    		    				        throw new RuntimeException("IOError writing file to output stream", ex);
	    		    				    }
	    		    				    is.close();
	    		    				    return;
	    		    				}
	    		    			}
	    		    		}
	    		    		// We found an xml file
	    		    		System.out.println("Using "+myPath);
	    		    	    response.setContentType("text/xml");
	    		    	    try {
	    		    	    	System.out.println("Returning XML");
	    		    	        IOUtils.copy(is, response.getOutputStream());
	    		    	        response.flushBuffer();
	    		    	    } catch (IOException ex) {
	    		    	        // log error
	    		    	    	is.close();
	    		    	        throw new RuntimeException("IOError writing file to output stream", ex);
	    		    	    }
	    		    	    is.close();
	    		    		return;
	    		    		
	    				}
	    			}
	    		}
	    	}
	    } catch (IOException e) {
	    	System.out.println("Error reading input file:"+myPath);
	    	throw new RuntimeException("IOError reading file", e);
	    }
	    System.out.println("Using "+myPath);
	    response.setContentType("text/javascript");
	    try {
	    	System.out.println("Returning JavaScript");
	        IOUtils.copy(is, response.getOutputStream());
	        response.flushBuffer();
	    } catch (IOException ex) {
	        // log error
	    	try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	        throw new RuntimeException("IOError writing file to output stream", ex);
	        
	    }
	    try {
			is.close();
		} catch (IOException e) {
			// swallow any errors
			e.printStackTrace();
		}
	}
	
	/** module page requests we need to analyse the given parameters
	 * and work out the best template or file to use.
	 *
	 */
	
	@RequestMapping(
			value = "/evedit.js", 
			params={"mu", "nn", "mt","v"}, 
			method = RequestMethod.GET,
			produces = "text/javascript"
	)
	public void getEvEditor(
			HttpServletRequest request, 
			HttpServletResponse response,
			@RequestParam("mu") String mu,
			@RequestParam("nn") int nn,
			@RequestParam("mt") String mt,
			@RequestParam("v") String v
			) {
		System.out.println("EV EDITOR REQUEST with params URI="+request.getRequestURI()+" mu="+mu+" nn="+nn+" mt="+mt+" v="+v);
		
		/* We first of all try the fully qualified name eV_<ModuleTypeName>_<major><minor>BETA<beta>.js */
	    String myPath = "/module/eV_"+mt+"_"+v+".js";
	    Resource resouce = new ClassPathResource(myPath);
	    InputStream is;
	    try {
	    	try {
	    		is = resouce.getInputStream();
	    	} catch (FileNotFoundException e1) {
	    		System.out.println("File not found:"+myPath);
	    		/* Now try eV_<ModuleTypeName>_<major><minor>.js */
	    		int i=0;
	    		while (!Character.isDigit(v.charAt(i))) {
	    			i++;
	    		}
	    		while (Character.isDigit(v.charAt(i))) {
	    			i++;
	    		}
	    		// i should be at the first non digit
	    		String vv = v.substring(0,i+1);
	    		myPath = "/module/eV_"+mt+"_"+vv+".js"; // 
	    		resouce = new ClassPathResource(myPath);
	    	
	    		try {
	    			is = resouce.getInputStream();
	    		} catch (FileNotFoundException e2) {
	    			System.out.println("File not found:"+myPath);
	    			/* Now try <ModuleTypeName>_<major>.js */
	    			vv = v.substring(0,i);
	    			myPath = "/module/eV_"+mt+"_"+vv+".js"; // 
	    			resouce = new ClassPathResource(myPath);
	    			try {
	    				is = resouce.getInputStream();
	    			} catch (FileNotFoundException e3) {
	    				System.out.println("File not found:"+myPath);
			    	
	    				/* Now try <ModuleTypeName>.js */
	    				myPath = "/module/eV_"+mt+".js"; // 
	    				resouce = new ClassPathResource(myPath);
	    				try {
	    					is = resouce.getInputStream();
	    				} catch (FileNotFoundException e4) {
	    					System.out.println("File not found:"+myPath);
				    	
	    					/* Now try generic.js */
	    					myPath = "/module/genericEvEditor.js"; 
	    					resouce = new ClassPathResource(myPath);
	    					try {
	    						is = resouce.getInputStream();
	    					} catch (FileNotFoundException ex) {
	    						System.out.println("ERROR File not found:"+myPath);
	    						throw new RuntimeException("IOError reading file", ex);
	    					}
	    				}
	    			}
	    		}
	    	}
	    } catch (IOException e) {
	    	System.out.println("Error reading input file:"+myPath);
	    	throw new RuntimeException("IOError reading file", e);
	    }
	    System.out.println("Using "+myPath);
	    response.setContentType("text/javascript");
	    try {
	    	System.out.println("Returning JavaScript");
	        IOUtils.copy(is, response.getOutputStream());
	        response.flushBuffer();
	    } catch (IOException ex) {
	        // log error
	        throw new RuntimeException("IOError writing file to output stream", ex);
	    }
	}
}