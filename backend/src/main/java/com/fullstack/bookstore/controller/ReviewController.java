package com.fullstack.bookstore.controller;

import com.fullstack.bookstore.entity.Review;
import com.fullstack.bookstore.models.ReviewRequest;
import com.fullstack.bookstore.service.ReviewService;
import com.fullstack.bookstore.utils.JWTExtraction;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value="Authorization") String token, @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User email is missing!");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestHeader(value="Authorization") String token, @RequestParam("bookId") Long bookId) throws Exception {
        String userEmail = JWTExtraction.payloadJWTExtraction(token, "\"sub\"");
        if (userEmail == null) {
            throw new Exception("User email is missing!");
        }
        return reviewService.userReviewListed(userEmail, bookId);
    }
}
