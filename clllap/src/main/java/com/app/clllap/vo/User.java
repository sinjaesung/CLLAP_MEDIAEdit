package com.app.clllap.vo;

import java.time.LocalDateTime;

import com.app.clllap.constant.Auth;
import com.app.clllap.constant.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

	// 고유 id
	private Long id;
	
	// 로그인 이메일
	private String email;
	
	// 로그인 비밀번호
	private String password;

	// 별칭
	private String nickname;
	
	// 성별
	private String gender;
	
	// 전화번화
	private String phone;
	
	// 나이
	private Integer age;
	
	// 국가 및 지역
	private String country; 
	private String region;
	
	// 권한
	private Auth role;
	
	// 로그인 타입
	private String type;
	
	// 회원 상태
	private Status  status;
	
	// 프로필 이미지 URL
	private String profileImageUrl;
	
	// 계정 생성일 및 마지막 로그인일
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
