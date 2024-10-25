package com.fullstack.bookstore.responseModels;

import com.fullstack.bookstore.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoans {

    private Book book;
    private int daysLeft;

    public ShelfCurrentLoans(Book book, int daysLeft) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
}
