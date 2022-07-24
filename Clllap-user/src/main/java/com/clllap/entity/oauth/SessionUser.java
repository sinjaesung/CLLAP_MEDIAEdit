package com.clllap.entity.oauth;

import java.io.Serializable;

public class SessionUser implements Serializable {
    private String user_name;
    private String user_email;
    private String user_picture;

    public SessionUser(SocialUsers user) {
        this.user_name = user.getUser_name();
        this.user_email = user.getUser_email();
    }

    public SessionUser() {
    }

    public String getName() {
        return user_name;
    }

    public void setName(String name) {
        this.user_name = name;
    }

    public String getEmail() {
        return user_email;
    }

    public void setEmail(String email) {
        this.user_email = email;
    }

    public String getPicture() {
        return user_picture;
    }

    public void setPicture(String picture) {
        this.user_picture = picture;
    }
}