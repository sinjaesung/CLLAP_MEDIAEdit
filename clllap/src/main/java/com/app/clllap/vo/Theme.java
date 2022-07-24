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
public class Theme {

	// 테마 제목
	private String title;
	
	// 테마 이미지 경로
	private String themeImageUrl;
	
	// 등록일
	private LocalDateTime createdAt;
}
