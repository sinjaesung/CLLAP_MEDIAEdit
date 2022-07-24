package com.clllap.admin.config;


import com.clllap.admin.entity.Admin;
import com.clllap.admin.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider{

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private AdminServiceImpl adminService;
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		
		Admin user = (Admin) adminService.loadUserByUsername(authentication.getName());
		System.out.println("authentication provider 28line : " + user);
		System.out.println("authentication provider 29line : " + authentication.getCredentials().toString());

		if (!passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
			throw new BadCredentialsException("비밀번호가 일치하지 않습니다");
		}if(user.getAdmin_status() == "1") {
			throw new BadCredentialsException("비활성 상태입니다.");
		}
		
		return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
	}

	@Override
	public boolean supports(Class<?> authentication) {
		// TODO Auto-generated method stub
		return true;
	}
}
