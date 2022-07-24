package com.clllap.admin.entity;

import lombok.Data;

@Data
public class Users {

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
    private String user_login_date;
    private String user_create_date;
    private String user_update_date;
    private String user_profile;
    private String user_join_check;

    private int user_login_count;

}
