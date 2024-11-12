import {useEffect, useState} from "react";
import BookModel from "../../../models/Book";
import {Spinner} from "../../utils/Spinner";
import {Pagination} from "../../utils/Pagination";
import {ChangeQuantity} from "./ChangeQuantity";

export const ChangeBooksQuantities = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [bookDelete, setBookDelete] = useState<boolean>(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API_SERVER_URL}/books?page=${currentPage - 1}&size=${booksPerPage}`;
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error("Could not fetch books.");
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;

            setTotalBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

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
    }, [currentPage, bookDelete]);

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalBooks ? booksPerPage * currentPage : totalBooks;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const deleteBook = (id: number) => setBookDelete(!bookDelete);

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
        <div className="container mt-5">
            {
                totalBooks > 0 ?
                    <>
                        <div className="mt-3">
                            <h3>Number of results: ({ totalBooks })</h3>
                        </div>
                        <p>
                            {indexOfFirstBook + 1} to { lastItem } of {totalBooks} items:
                        </p>
                        {
                            books.map(book => (
                                <ChangeQuantity book={book} key={book.id} deleteBook={deleteBook} />
                            ))
                        }
                    </>:
                    <h5>Add a book before changing quantity</h5>
            }
            {
                totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
            }
        </div>
    );
}