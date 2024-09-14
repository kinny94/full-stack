import {useEffect, useState} from "react";
import BookModel from "../../models/Book";
import {Spinner} from "../utils/Spinner";
import {ReviewStar} from "../utils/ReviewStar";
import {CheckoutAndReview} from "./CheckoutAndReview";

export const Checkout = () => {

    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`;
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error("Could not fetch books.");
            }

            const responseJson = await response.json();
            const book: BookModel= {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(book);
            setLoading(false);
        };
        fetchBook().catch((error: any) => {
            setLoading(false);
            setError(error.message );
        });
    }, []);

    if (loading) {
        return (
            <Spinner />
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <p>{error}</p>
            </div>
        )
    }

    return(
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} width="226" height="349" alt="book"/> :
                            <img src={require("./../../Images/BooksImages/book-luv2code-1000.png")} width="226"
                                 height="349" alt="book"/>
                        }
                    </div>

                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <ReviewStar rating={4} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReview book={book} mobile={false} />
                </div>
            </div>

            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} width="226" height="349" alt="book"/> :
                        <img src={require("./../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349"
                             alt="book"/>
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <ReviewStar rating={4} size={32} />
                    </div>
                </div>
                <CheckoutAndReview book={book} mobile={true} />
                <hr />
            </div>
        </div>
    )
}