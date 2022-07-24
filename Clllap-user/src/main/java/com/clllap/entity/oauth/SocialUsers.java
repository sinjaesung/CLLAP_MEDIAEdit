package com.clllap.entity.oauth;

import lombok.Builder;
import lombok.Data;

import java.nio.file.FileStore;

@Data
public class SocialUsers {
    private int user_id;
    private String user_name;
    private String user_email;
    private String user_picture;

    private Role role;

    public SocialUsers() {

    }

    @Builder
    public SocialUsers(String name, String email, String picture) {
        this.user_name = name;
        this.user_email = email;
        this.user_picture = picture;
    }


    public SocialUsers update(String name, String picture) {
        this.user_name = name;
        this.user_picture = picture;
        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }

}
