package com.example.springboot.service;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(fluent = true)
public class MessageSourceAwareException extends RuntimeException {

	private static final long serialVersionUID = -3118137820578157500L;
	
	private Object[] args;

	public MessageSourceAwareException(String message, Object... args) {
		super(message);
		this.args = args;
	}

	public MessageSourceAwareException(String message, Throwable cause, Object... args) {
		super(message, cause);
		this.args = args;
	}

}
