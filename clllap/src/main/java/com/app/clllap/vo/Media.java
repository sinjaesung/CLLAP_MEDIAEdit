package com.app.clllap.vo;

import java.time.LocalDateTime;

import com.app.clllap.constant.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Media {

	// 고유 id
	private Long id;
	
	// 영상 제목
	private String title;
	
	// 영상 파일명
	private String filename;
	
	// 영상 원본 파일명
	private String originname;
	
	// 영상 확장자�
	private String type;
	
	// 영상 제작 완료 여부
	private Status status;
	
	// 등록일 및 갱신일
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
