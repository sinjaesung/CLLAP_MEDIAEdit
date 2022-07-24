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
public class MediaImage {
	
	// 고유 id
	private Long id;
		
	// 이미지 파일명
	private String filename;
	
	// 이미지 원본 파일명
	private String originname;
	
	// 이미지 확장자
	private String type;
	
	// 등록일 및 갱신일
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
