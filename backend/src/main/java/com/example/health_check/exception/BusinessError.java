package com.example.health_check.exception;
import org.springframework.http.HttpStatus;

public enum BusinessError {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found."),
    URL_NOT_FOUND(HttpStatus.NOT_FOUND, "URL not found."),
    EMAIL_ALREADY_REGISTERED(HttpStatus.CONFLICT, "Email already registered."),
    URL_ALREADY_REGISTERED(HttpStatus.CONFLICT, "URL already registered."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid or expired token."),
    GENERIC_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error.");

    private final HttpStatus status;
    private final String message;

    BusinessError(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
