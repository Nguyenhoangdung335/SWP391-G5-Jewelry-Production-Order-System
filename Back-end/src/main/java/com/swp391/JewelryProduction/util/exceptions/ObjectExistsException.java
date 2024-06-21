package com.swp391.JewelryProduction.util.exceptions;

public class ObjectExistsException extends RuntimeException{
    public ObjectExistsException(){
        super("User not found");
    }
    public ObjectExistsException(String message){
        super(message);
    }
    public ObjectExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}