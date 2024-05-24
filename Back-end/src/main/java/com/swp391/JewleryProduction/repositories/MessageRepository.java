package com.swp391.JewleryProduction.repositories;

import com.swp391.JewleryProduction.pojos.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
}
