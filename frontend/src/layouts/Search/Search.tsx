import {useEffect, useState} from "react";
import BookModel from "../../models/Book";
import {Spinner} from "../utils/Spinner";
import {SearchBook} from "./components/SearchBook";

export const Search = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = "http://localhost:8080/api/books";
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
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search..."  aria-label="Search" />
                                <button className="btn btn-outline-success">Search</button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Category
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <a className="dropdown-item" href="#">All</a>
                                        <a className="dropdown-item" href="#">Front End</a>
                                        <a className="dropdown-item" href="#">Backend</a>
                                        <a className="dropdown-item" href="#">Data</a>
                                        <a className="dropdown-item" href="#">Dev Ops</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h5>Number of results: (22)</h5>
                    </div>
                    <p>
                        1 to 5 of 22 items:
                    </p>
                    {
                        books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}