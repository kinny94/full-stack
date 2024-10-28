package com.fullstack.bookstore.service;

import com.fullstack.bookstore.dao.BookRepository;
import com.fullstack.bookstore.dao.CheckoutRepository;
import com.fullstack.bookstore.entity.Book;
import com.fullstack.bookstore.entity.Checkout;
import com.fullstack.bookstore.responseModels.ShelfCurrentLoans;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (book.isEmpty() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("Book does not exist!");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                book.get().getId()
        );
        checkoutRepository.save(checkout);
        return book.get();
    }

    public Boolean checkoutBookByUserEmail(String userEmail, Long bookId) {
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        return checkout != null;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoans> currentLoansList(String userEmail) throws Exception {
        List<ShelfCurrentLoans> shelfCurrentLoans = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookList = new ArrayList<>();

        for (Checkout item : checkoutList) {
            bookList.add(item.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookList);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book book: books) {
            Optional<Checkout> checkout = checkoutList.stream().filter(x -> x.getBookId().equals(book.getId())).findFirst();
            if (checkout.isPresent()) {
                Date checkoutDate = sdf.parse(checkout.get().getReturnDate());
                Date parsedCheckoutDate = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long differenceInTime = time.convert(parsedCheckoutDate.getTime() - checkoutDate.getTime(), TimeUnit.MILLISECONDS);
                shelfCurrentLoans.add(new ShelfCurrentLoans(book, (int) differenceInTime));
            }
        }
        return shelfCurrentLoans;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (!book.isPresent() || validateCheckout == null) {
            throw new Exception("Book does not exist or not checkout out by the user!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());
        checkoutRepository.deleteById(validateCheckout.getId());
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if (validateCheckout == null) {
            throw new Exception("Book does not exist or not checkout out by the user!");
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
