package com.fullstack.bookstore.controller;

import com.fullstack.bookstore.models.AddBookRequest;
import com.fullstack.bookstore.service.AdminService;
import com.fullstack.bookstore.utils.JWTExtraction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value="Authorization") String token, @RequestBody AddBookRequest addBookRequest) throws Exception {
        String admin = JWTExtraction.payloadJWTExtraction(token, "\"userType\"");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Admin access only!");
        }
        adminService.postBook(addBookRequest);
    }
}
