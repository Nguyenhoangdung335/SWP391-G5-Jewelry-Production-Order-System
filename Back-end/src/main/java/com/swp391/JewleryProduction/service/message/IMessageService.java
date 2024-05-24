package com.swp391.JewleryProduction.services.message;

import com.swp391.JewleryProduction.dto.MessageDTO;

import java.util.List;

public interface IMessageService {
    List<MessageDTO> findAllMessages();
}
