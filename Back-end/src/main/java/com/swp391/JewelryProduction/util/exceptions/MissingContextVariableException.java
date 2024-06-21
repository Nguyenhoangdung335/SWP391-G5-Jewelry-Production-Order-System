package com.swp391.JewelryProduction.util.exceptions;

public class MissingContextVariableException extends RuntimeException{
    public MissingContextVariableException () {
        super();
    }

    public MissingContextVariableException (String message) {
        super(message);
    }

    public MissingContextVariableException (String message, Throwable cause) {
        super(message, cause);
    }
}
