package com.fullstack.bookstore.dao;

import com.fullstack.bookstore.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
