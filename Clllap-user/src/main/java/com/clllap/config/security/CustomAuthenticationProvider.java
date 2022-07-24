package com.clllap.config.security;

import com.clllap.entity.Users;
import com.clllap.mapper.UserMapper;
import com.clllap.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UserMapper userMapper;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Users user = (Users)userService.loadUserByUsername(authentication.getName());
        if (user==null) {
            System.out.println("CustomAuthenticationProvider 32line 유저가 없음");
            throw new BadCredentialsException("CustomAuthenticationProvider 34line 유저가 없음");
        }else if(!passwordEncoder.matches(authentication.getCredentials().toString(), user.getPassword())) {
            throw new BadCredentialsException("CustomAuthenticationProvider 34line 비밀번호가 일치하지 않습니다");
        }
        try {
//            userMapper.update_loginDate(user);
        } catch (Exception e) {
            e.toString();
        }
        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        // TODO Auto-generated method stub
        return true;
    }
}