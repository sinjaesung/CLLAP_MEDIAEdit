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
public class MediaAndMusic {

	// 고유 id
	private Long id;
	
	// 동영상 시작
	private String mamStart;
	
	// 동영상 끝��
	private String mamEnd;
	
	// 등록일 및 갱신일
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
