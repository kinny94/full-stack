import {useEffect, useState} from "react";
import BookModel from "../../models/Book";
import {Spinner} from "../utils/Spinner";
import {ReviewStar} from "../utils/ReviewStar";
import {CheckoutAndReview} from "./CheckoutAndReview";
import Review from "../../models/Review";
import {Reviews} from "./Reviews";
import {useOktaAuth} from "@okta/okta-react";
import ReviewRequest from "../../models/ReviewRequest";

export const Checkout = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setLoadingCurrentLoansCount] = useState(true);

    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckout, setIsLoadingBookCheckout] = useState(true);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API_SERVER_URL}/books/${bookId}`;
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
            const reviewUrl: string = `${process.env.REACT_APP_API_SERVER_URL}/reviews/search/findByBookId?bookId=${bookId}`;
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
                    reviewDescription: responseData[key].reviewDescription,
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
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API_SERVER_URL}/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    }
                };
                const userReviews = await fetch(url, requestOptions);
                if (!userReviews.ok) {
                    throw new Error("Could not fetch books");
                }
                const userReviewJson = await userReviews.json();
                setIsReviewLeft(userReviewJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setError(error.message);
        });
    }, [authState])

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API_SERVER_URL}/books/secure/loans/count`;
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
                const url = `${process.env.REACT_APP_API_SERVER_URL}/books/secure/checkout/user?bookId=${bookId}`;
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

    if (loading || loadingReviews ||  isLoadingCurrentLoansCount || isLoadingBookCheckout || isLoadingUserReview) {
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
        const url = `${process.env.REACT_APP_API_SERVER_URL}/books/secure/checkout?bookId=${book?.id}`;
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

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequest = new ReviewRequest(starInput, bookId, reviewDescription);
        const url = `${process.env.REACT_APP_API_SERVER_URL}/reviews/secure`;
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewRequest),
        }
        const reviewResponse = await fetch(url, requestOptions);
        if (!reviewResponse.ok) {
            throw new Error("Could not post review");
        }
        setIsReviewLeft(true);
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
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
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
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <Reviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    )
}