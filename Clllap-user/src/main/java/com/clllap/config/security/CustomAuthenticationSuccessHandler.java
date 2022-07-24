package com.clllap.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private String defaultUrl = "user/login-success";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        System.out.println("CustomAuthenticationSuccessHandler 37line : " + authentication.getName());

        HttpSession session = request.getSession();

        session.setAttribute("login", true);
        session.setAttribute("user_id", authentication.getName());
        session.setMaxInactiveInterval(60 * 60 * 24);

        response.setStatus(200);
//		response.getWriter().print(defaultUrl);
//		response.getWriter().flush();

        response.sendRedirect(defaultUrl);
    }

    public void setDefaultUrl(String defaultUrl) {
        this.defaultUrl = defaultUrl;
    }


}
