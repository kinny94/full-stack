package com.fullstack.bookstore.controller;

import com.fullstack.bookstore.entity.Message;
import com.fullstack.bookstore.service.MessageService;
import com.fullstack.bookstore.utils.JWTExtraction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization") String token,  @RequestBody Message messageRequest) {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        messageService.postMessage(messageRequest, userEmail);
    }
}
