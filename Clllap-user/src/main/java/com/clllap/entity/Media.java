package com.clllap.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Media {

    private int media_id;
    private int user_id;
    private int link_id;
    private String media_title;
    private String media_profile;
    private String media_type;  // 미디어 타입 - video, gif..
    private String media_location; // 게시물 등록시 추가 위치
    private String media_source_path;//미디어 s3 소스 위치
    private int media_recommend_count;  // 추천 수
    private String adapt_effect;//적용 이펙트(클라이언트단 재생시)
    private String user_nickname;
    
    private String media_description;
}
