package com.clllap.admin.config;

import com.clllap.admin.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler{

	private String defaultUrl = "/dashboard";
	
	@Autowired
	private AdminMapper adminMapper;
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		
		SimpleGrantedAuthority authroAuthority = (SimpleGrantedAuthority) ((List<GrantedAuthority>)authentication.getAuthorities()).get(0);
		
		System.out.println("CustomAuthenticationSuccessHandler 37line : " + authentication.getName());

		try {
			Map<String,Object> paramMap = new HashMap();
			paramMap.put("admin_id", authentication.getName());
			adminMapper.loginDate(authentication.getName());
		}catch (Exception e) {
			e.printStackTrace();
		}

		HttpSession session = request.getSession();
		
		session.setAttribute("login", true);
		session.setAttribute("admin_id", authentication.getName());
		session.setMaxInactiveInterval(3600 * 24);
		
		response.setStatus(200);
//		response.getWriter().print(defaultUrl);
//		response.getWriter().flush();
		
		response.sendRedirect(request.getContextPath() + defaultUrl);		
	}

	public void setDefaultUrl(String defaultUrl) {
		this.defaultUrl = defaultUrl;
	}

	
}
