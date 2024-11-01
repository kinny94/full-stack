package com.fullstack.bookstore.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "History")
@Data
public class History {

     public History(
             String userEmail,
             String checkoutData,
             String returnedData,
             String title,
             String author,
             String description,
             String img) {
         this.userEmail = userEmail;
         this.checkoutDate = checkoutData;
         this.returnedDate = returnedData;
         this.title = title;
         this.author = author;
         this.description = description;
     }

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     @Column(name = "id")
     private Long id;

     @Column(name = "user_email")
     private String userEmail;

     @Column(name = "checkout_date")
     private String checkoutDate;

     @Column(name = "returned_date")
     private String returnedDate;

     @Column(name = "title")
     private String title;

     @Column(name = "author")
     private String author;

     @Column(name = "description")
     private String description;

     @Column(name = "img")
    private String img;
}


