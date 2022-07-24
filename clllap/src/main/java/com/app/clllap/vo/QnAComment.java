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
public class QnAComment {
	
	// 고유 id
	private Long id;
	
	// 문의 응답 제목
	private String title;
	
	// 문의 응답 내용
	private String content;
	
	// 등록일 및 갱신일
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
