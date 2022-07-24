package com.clllap.config.security;

import com.clllap.service.PrincipalOAuth2UserService;
import com.clllap.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.firewall.DefaultHttpFirewall;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.header.writers.frameoptions.WhiteListedAllowFromStrategy;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled=true, prePostEnabled=true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private AuthenticationSuccessHandler successHandler;
    private AuthenticationProvider provider;
    private CustomAuthenticationFailureHandler failureHandler;
    private UserServiceImpl userService;

    @Autowired
    PrincipalOAuth2UserService principalOauth2UserService;

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public SecurityConfig(CustomAuthenticationProvider authenticationProvider,
                          CustomAuthenticationSuccessHandler authenticationSuccessHandler,
                          CustomAuthenticationFailureHandler authenticationFailureHandler,
                          UserServiceImpl userService) {
        this.provider = authenticationProvider;
        this.successHandler = authenticationSuccessHandler;
        this.failureHandler = authenticationFailureHandler;
        this.userService = userService;
    }

    @SuppressWarnings("deprecation")
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
                    .csrf().disable()
                    .cors()
//			.configurationSource(corsConfigurationSource())
                .and()
                    .authorizeRequests()
                    .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                    .anyRequest().permitAll()
                .and()
                    .formLogin()
                    .loginProcessingUrl("/user-login")
                    .usernameParameter("user_email")
                    .passwordParameter("user_password")
                    .successHandler(successHandler)
                    .failureHandler(failureHandler)
                .and()
                    .logout()
                    .logoutUrl("/user-logout")
                    .logoutSuccessUrl("/")
                    .invalidateHttpSession(true)
                    .permitAll()
                .and()
                        .oauth2Login()
                        .defaultSuccessUrl("/user/social-success")
                        .userInfoEndpoint()
                        .userService(principalOauth2UserService);	// oauth2 로그인에 성공하면, 유저 데이터를 가지고 우리가 생성한
                 //customOAuth2UserService에서 처리를 하겠다. 그리고 "/login-success"로 이동하라.;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .authenticationProvider(provider);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.httpFirewall(defaultHttpFirewall());
//        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
    }


    @Bean
    public HttpFirewall defaultHttpFirewall() {
        return new DefaultHttpFirewall();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.addAllowedHeader("Access-Control-Request-Headers");
//        configuration.addAllowedHeader("Access-Control-Allow-Origin");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}