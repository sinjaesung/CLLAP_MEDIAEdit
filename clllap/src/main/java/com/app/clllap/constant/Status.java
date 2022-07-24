package com.app.clllap.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Status {

	// 회원 상태
	NORMAL(1), // 일반 사용자
	WITHDRAW(-1), // 탈퇴 처리 (그냥 테이블에서 지울수도 있음)
	
	// 영상 편집 상태
	COMPLETION(100), // 완료
	PROCEEDING(200); // 편집중
	
	private final Integer statusCode;
	
}
