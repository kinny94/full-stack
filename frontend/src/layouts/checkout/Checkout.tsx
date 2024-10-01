import {useEffect, useState} from "react";
import BookModel from "../../models/Book";
import {Spinner} from "../utils/Spinner";
import {ReviewStar} from "../utils/ReviewStar";
import {CheckoutAndReview} from "./CheckoutAndReview";
import Review from "../../models/Review";
import {Reviews} from "./Reviews";
import {useOktaAuth} from "@okta/okta-react";

export const Checkout = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(true);

    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setLoadingCurrentLoansCount] = useState(true);

    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState(true);

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
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBooksReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error("Could not fetch reviews.");
            }

            const responseJsonReviews = await responseReviews.json();
            const responseData = responseJsonReviews._embedded.reviews;
            const loadedReviews: Review[] = [];
            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].description,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round))
                setReviews(loadedReviews);
                setLoadingReviews(false);
            }
        }
        fetchBooksReviews().catch((error: any) => {
            setLoadingReviews(false);
            setError(error.message);
        });
    }, []);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/loans/count`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error("Could not fetch loans");
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setLoadingCurrentLoansCount(false);
            setError(error.message);
        });
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUSerCheckoutBooks = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/books/secure/checkout/user?bookId=${bookId}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                }
                const bookCheckedOut = await fetch(url, requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error("Could not fetch checked out book");
                }

                const bookCheckedOutJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutJson);
            }
            setIsLoadingBookCheckout(false);
        }
        fetchUSerCheckoutBooks().catch((error: any) => {
            setIsLoadingBookCheckout(false);
            setError(error.message);
        })
    }, [authState]);

    if (loading || loadingReviews ||  isLoadingCurrentLoansCount || isLoadingBookCheckout) {
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

    async function checkoutBook() {
        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            }
        }
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error("Could not fetch checkout");
        }
        setIsCheckedOut(true);
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
                            <ReviewStar rating={totalStars} size={32} />
                        </div>
                    </div>

                    <CheckoutAndReview
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut}
                        checkoutBook={checkoutBook}
                    />
                </div>
                <hr />
                <Reviews reviews={reviews} bookId={book?.id} mobile={false} />
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
                        <ReviewStar rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReview
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut}
                    checkoutBook={checkoutBook}
                />
                <hr />
                <Reviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    )
}