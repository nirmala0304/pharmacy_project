package com.pharmacy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ResponseEntity<Map<String, Object>> body(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message != null ? message : "Something went wrong.");
        body.put("error",   message != null ? message : "Something went wrong.");
        body.put("status",  status.value());
        return ResponseEntity.status(status).body(body);
    }

    /** Entity not found (e.g. .orElseThrow()) -> 404 */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        return body(HttpStatus.NOT_FOUND, "The requested resource was not found.");
    }

    /** Access-denied -> 403 */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return body(HttpStatus.FORBIDDEN, "Access denied.");
    }

    /** File too large -> 413 */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleMaxUpload(MaxUploadSizeExceededException ex) {
        return body(HttpStatus.PAYLOAD_TOO_LARGE, "The uploaded file is too large.");
    }

    /** File read/write failures -> 500 with safe message */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<Map<String, Object>> handleIOException(IOException ex) {
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "File processing failed. Please try again.");
    }

    /**
     * RuntimeExceptions raised intentionally by services carry a user-facing message.
     * "not found" / "access denied" messages get mapped to 404/403; everything else is 400.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "Something went wrong.";
        String lower = msg.toLowerCase();

        if (lower.contains("access denied")) {
            return body(HttpStatus.FORBIDDEN, msg);
        }
        if (lower.contains("not found")) {
            return body(HttpStatus.NOT_FOUND, msg);
        }
        return body(HttpStatus.BAD_REQUEST, msg);
    }

    /** Catch-all safety net - never leak stack traces to the client */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred. Please try again later.");
    }
}
