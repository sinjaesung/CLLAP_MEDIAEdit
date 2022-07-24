package com.clllap.admin.config;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler{

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		String returnUrl = "/login";
		
		String returnUrlParam = request.getParameter("returnUrl");
		if (returnUrlParam != null)
			returnUrl = returnUrlParam;
		
		String errMsg = "";
		if (exception instanceof UsernameNotFoundException) {
			errMsg = "userID";
		} else if (exception instanceof BadCredentialsException) {
			errMsg = "password";
		}
		
		returnUrl += "?errMsg=" + errMsg;

//		response.sendRedirect(returnUrl);
		
		response.setStatus(409);
		response.getWriter().print(errMsg);
		response.getWriter().flush();
	}

	
	
}