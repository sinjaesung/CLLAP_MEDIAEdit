package com.clllap.admin.entity;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
public class Admin implements UserDetails {
    private int admin_id;
    private String admin_email;
    private String admin_password;
    private String admin_role;
    private String admin_status;
    private String admin_login_date;
    private String admin_create_date;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(admin_role));
        return authorities;
    }

    @Override
    public String getPassword() {
        return admin_password;
    }

    @Override
    public String getUsername() {
        return String.valueOf(admin_id);
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
