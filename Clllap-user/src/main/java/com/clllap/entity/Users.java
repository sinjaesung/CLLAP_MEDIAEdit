package com.clllap.entity;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Users implements UserDetails {
    private int user_id;
    private String user_social_key;
    private String user_email;
    private String user_password;
    private String user_name;
    private String user_age;
    private String user_country;
    private String user_region;
    private String user_gender;
    private String user_nickname;
    private String user_phone;
    private String user_create_date;
    private String user_update_date;
    private String user_profile;
    private String user_join_check;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return user_password;
    }
    
    public String getNickname() {
    	return user_nickname;
    }

    @Override
    public String getUsername() {
        return String.valueOf(user_id);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
