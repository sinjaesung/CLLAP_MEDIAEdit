package com.clllap.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Links {
    private int link_id;
    private int user_id;
    private String link_fb;
    private String link_insta;
    private String link_kakao;
    private String link_twitter;
    private String link_etc;

    private int link_fb_active;
    private int link_insta_active;
    private int link_kakao_active;
    private int link_twitter_active;
    private String link_etc_active;
}
