package com.fullstack.bookstore.controller;

import com.fullstack.bookstore.entity.Book;
import com.fullstack.bookstore.responseModels.ShelfCurrentLoans;
import com.fullstack.bookstore.service.BookService;
import com.fullstack.bookstore.utils.JWTExtraction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentLoans")
    public List<ShelfCurrentLoans> currentLoans(@RequestHeader(value="Authorization") String token) throws Exception {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoansList(userEmail);
    }

    @GetMapping("/secure/checkout/user")
    public boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBookByUserEmail(userEmail, bookId);
    }

    @GetMapping("/secure/loans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);
    }
}
