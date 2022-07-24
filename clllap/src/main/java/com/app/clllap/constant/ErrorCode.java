package com.app.clllap.constant;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	OK(0, ErrorCategory.NORMAL, "Ok"),

	// 4xx
	BAD_REQUEST(10001, ErrorCategory.CLIENT_SIDE, "Bad request"),
	VALIDATION_ERROR(10002, ErrorCategory.CLIENT_SIDE, "Validation error"),
	NOT_FOUND(10003, ErrorCategory.CLIENT_SIDE, "Requested resource is not found"),

	// 5xx
	INTERNAL_ERROR(20000, ErrorCategory.SERVER_SIDE, "Internal error"),
	DATA_ACCESS_ERROR(20002, ErrorCategory.SERVER_SIDE, "Data access error");

	private final Integer code; // error code
	private final ErrorCategory errorCategory; // error category
	private final String message; // error message

	public String getMessage(Throwable e) {
		return this.getMessage(this.getMessage() + " - " + e.getMessage());
	}
	public String getMessage(String message) {
		return message != null ? message : this.getMessage();
	}

	// client side error?
	public boolean isClientSideError() {
		return this.getErrorCategory() == ErrorCategory.CLIENT_SIDE;
	}

	// server side error?
	public boolean isServerSideError() {
		return this.getErrorCategory() == ErrorCategory.SERVER_SIDE;
	}

	@Override
	public String toString() {
		return String.format("%s (%d)", this.name(), this.getCode());
	} 

	public enum ErrorCategory {
		NORMAL, CLIENT_SIDE, SERVER_SIDE
	}
}
