package com.app.clllap.dto;

import com.app.clllap.constant.ErrorCode;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@EqualsAndHashCode(callSuper = true)
public class APIDataResponse <T> extends APIErrorResponse {

	private T data; // 응답 결과 데이터
	
	public APIDataResponse (T data) {
		super(true, ErrorCode.OK.getCode(), ErrorCode.OK.getMessage());
        this.data = data;
	}
	
	public static <T> APIDataResponse<T> of(T data) {
		return new APIDataResponse<>(data);
	}
}
