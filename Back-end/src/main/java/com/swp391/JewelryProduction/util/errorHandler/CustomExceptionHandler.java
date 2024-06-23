package com.swp391.JewelryProduction.util.errorHandler;

import com.swp391.JewelryProduction.util.Response;
import com.swp391.JewelryProduction.util.exceptions.MissingContextVariableException;
import com.swp391.JewelryProduction.util.exceptions.ObjectExistsException;
import com.swp391.JewelryProduction.util.exceptions.ObjectNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;

@Slf4j
@ControllerAdvice
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {
    private final View error;

    public CustomExceptionHandler(View error) {
        this.error = error;
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        List<String> errors = new ArrayList<String>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.add(error.getField() + ": " + error.getDefaultMessage());
        }
        for (ObjectError error : ex.getBindingResult().getGlobalErrors()) {
            errors.add(error.getObjectName() + ": " + error.getDefaultMessage());
        }
        errors.forEach(log::error);

        ApiError apiError =
                new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), errors);
        return handleExceptionInternal(
                ex, apiError, headers, apiError.getStatus(), request);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request
    ) {
        String error = ex.getParameterName() + " parameter is missing";

        log.error(error);
        ApiError apiError =
                new ApiError(HttpStatus.BAD_REQUEST, ex.getLocalizedMessage(), List.of(error));
        return new ResponseEntity<Object>(
                apiError, new HttpHeaders(), apiError.getStatus());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Response> handleConstraintViolation(
            ConstraintViolationException ex, WebRequest request) {
        Map<String, Object> errors = new HashMap<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.put(violation.getRootBeanClass().getName() + " " +
                    violation.getPropertyPath(), violation.getMessage());
        }
        errors.forEach((key, value) -> log.error(key + "\t:\t" + value));

        return Response.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(ex.getLocalizedMessage())
                .responseList(errors)
                .buildEntity(new HttpHeaders());
    }

    @ExceptionHandler({ MethodArgumentTypeMismatchException.class })
    public ResponseEntity<Response> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        String error =
                ex.getName() + " should be of type " + Objects.requireNonNull(ex.getRequiredType()).getName();

        log.error(error);

        return Response.builder()
                 .status(HttpStatus.BAD_REQUEST)
                 .message(ex.getLocalizedMessage())
                 .response("Type Mismatch Exception", error)
                 .buildEntity(new HttpHeaders());
    }

    @ExceptionHandler( {ObjectNotFoundException.class} )
    public ResponseEntity<Response> handleObjectNotFoundException(
            ObjectNotFoundException ex, WebRequest request
    ) {
        String errorMsg = ex.getLocalizedMessage();
        if (errorMsg == null || errorMsg.isEmpty())
            errorMsg = "Object not found";

        log.error(errorMsg);

        return Response.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(errorMsg)
                .response("Error", ex.getClass().getCanonicalName())
                .response("Cause", ex.getCause())
                .buildEntity();
    }

    @ExceptionHandler( {ObjectExistsException.class} )
    public ResponseEntity<Response> handleObjectExistsException (
            ObjectExistsException ex, WebRequest request
    ) {
        String errorMsg = ex.getLocalizedMessage();
        if (errorMsg == null || errorMsg.isEmpty())
            errorMsg = "Object already exists";

        log.error(errorMsg);

        return Response.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(errorMsg)
                .response("Error", ex.getClass().getCanonicalName())
                .response("Cause", ex.getCause())
                .buildEntity();
    }

    @ExceptionHandler( {MissingContextVariableException.class} )
    public ResponseEntity<Response> handleMissingContextVariableException (
            MissingContextVariableException ex, WebRequest request
    ) {
        String errorMsg = ex.getLocalizedMessage();
        if (errorMsg == null || errorMsg.isEmpty())
            errorMsg = "Variable does not exist";

        log.error(errorMsg);

        return Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message("MissingContextVariableException is throw")
                .response("Error", errorMsg)
                .buildEntity();
    }

    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Response> handleAll(Exception ex, WebRequest request) {

        log.error("Internal Server Error: " + ex.getLocalizedMessage());

        return Response.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(ex.getLocalizedMessage())
                .response("Error", ex.getClass().getCanonicalName())
                .response("Cause", ex.getCause())
                .buildEntity(new HttpHeaders());
    }
}
