import {Book} from "./Book";
import {useEffect, useState} from "react";
import BookModel from "../../../models/Book";
import {Spinner} from "../../utils/Spinner";
import {Link} from "react-router-dom";

export const Carousel = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API_SERVER_URL}/books`;
            const url: string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Could not fetch books.");
            }

            const reponseJson = await response.json();
            const responseData = reponseJson._embedded.books;
            const loadedBooks: BookModel[] = [];

            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setLoading(false);
        };
        fetchBooks().catch((error: any) => {
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

    return (
        <div className="container mt-5" style={{height: 550}}>
            <div className="homepage-carousel-title">
                <h3>Find you next "I stayed up too late reading" book</h3>
            </div>
            <div id="carouselExampleControls" className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                 data-bs-interval="false">
                <div className="carousel-inner">

                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(0, 3).map(book => (
                                    <Book book={book} key={book.id} />
                                ))
                            }
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(3, 6).map(book => (
                                    <Book book={book} key={book.id} />
                                ))
                            }
                        </div>
                    </div>

                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(6, 9).map(book => (
                                    <Book book={book} key={book.id} />
                                ))
                            }
                        </div>
                    </div>
                </div>

                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
                        data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>

            </div>

            { /* Mobile */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <Book book={books[7]} key={books[7].id} />
                </div>

            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">View more</Link>
            </div>
        </div>
    )
}