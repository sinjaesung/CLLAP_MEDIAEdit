package com.clllap.service;

import com.clllap.entity.Users;
import com.clllap.entity.oauth.OAuthAttributes;
import com.clllap.entity.oauth.SessionUser;
import com.clllap.entity.oauth.SocialUsers;
import com.clllap.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class PrincipalOAuth2UserService extends DefaultOAuth2UserService{
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private HttpSession httpSession;


    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("service Principal 14line userRequest : " + userRequest);
        System.out.println("service Principal 14line userRequest : " + userRequest.getAccessToken());
        System.out.println("service Principal 14line userRequest : " + super.loadUser(userRequest).getAttributes());
        OAuth2UserService oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        // 현재 진행중인 서비스를 구분하기 위해 문자열로 받음. oAuth2UserRequest.getClientRegistration().getRegistrationId()에 값이 들어있다. {registrationId='naver'} 이런식으로
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        System.out.println("service Oauth2 41line : " + registrationId);

        // OAuth2 로그인 시 키 값이 된다. 구글은 키 값이 "sub"이고, 네이버는 "response"이고, 카카오는 "id"이다. 각각 다르므로 이렇게 따로 변수로 받아서 넣어줘야함.
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
        System.out.println("service Oauth2 45line : " + userNameAttributeName);

        // OAuth2 로그인을 통해 가져온 OAuth2User의 attribute를 담아주는 of 메소드.
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());
        System.out.println("service Oauth2 49line : " + attributes.getEmail());
        System.out.println("service Oauth2 49line : " + attributes.getName());
        System.out.println("service Oauth2 49line : " + attributes.getNameAttributeKey());
        System.out.println("service Oauth2 49line : " + attributes.getAttributes().get("sub"));
        System.out.println("service Oauth2 49line : " + attributes.getAttributes().get("id"));

        try {
            SocialUsers social_user = userMapper.login_socialId(registrationId + "_" + attributes.getEmail());
            Users users = new Users();

            if(social_user == null) {
                users.setUser_email(registrationId + "_" + attributes.getEmail());
                users.setUser_name(attributes.getName());
                if(registrationId.equals("google")) {
                    users.setUser_social_key((String)attributes.getAttributes().get("sub"));
                    users.setUser_password(passwordEncoder.encode((String)attributes.getAttributes().get("sub")));
                }else {
                    users.setUser_social_key(String.valueOf(attributes.getAttributes().get("id")));
                    users.setUser_password(passwordEncoder.encode(String.valueOf(attributes.getAttributes().get("id"))));
                }
                userMapper.signup_socialUser(users);
            }else {
                users.setUser_email(social_user.getUser_email());
            }


            // social_id대신 user_id authentication getName 값 설정
            social_user = userMapper.login_socialId(users.getUser_email());

            Map<String,Object> att = new HashMap<>();
            att.put(String.valueOf(social_user.getUser_id()),String.valueOf(social_user.getUser_id()));
            attributes.setNameAttributeKey(String.valueOf(social_user.getUser_id()));
            attributes.setAttributes(att);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
                , attributes.getAttributes()
                , attributes.getNameAttributeKey());
    }
}
