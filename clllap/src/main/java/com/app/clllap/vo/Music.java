package com.app.clllap.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Music {
	
	// 고유 id
	private Long id;

	// 제목
	private String title;
	
	// 장르
	private String genre;
	
	// �가수
	private String singer;
	
	// 이미지 경로
	private String musicImageUrl;
	
	// 등록일
	private LocalDateTime createdAt;
}
