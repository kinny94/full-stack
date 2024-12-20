import {useEffect, useState} from "react";
import BookModel from "../../models/Book";
import {Spinner} from "../utils/Spinner";
import {SearchBook} from "./components/SearchBook";
import {Pagination} from "../utils/Pagination";

export const Search = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchUrl, setSearchUrl] = useState("");
    const [category, setCategory] = useState('Book Category')

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${process.env.REACT_APP_API_SERVER_URL}/books`;
            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }
            const response = await fetch(url);

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === "") {
            setSearchUrl("");
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        setCategory('Book Category');
    }

    const categoryField = (value: string) => {
        setCurrentPage(1)
        if (value.toLowerCase() === "fe" || value.toLowerCase() === "be" || value.toLowerCase() === "data" || value.toLowerCase() === "devops") {
            setCategory(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategory('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalBooks ? booksPerPage * currentPage : totalBooks;
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search..."
                                    aria-label="Search"
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>Search</button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {category}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li onClick={() => {categoryField('All')}}>
                                        <a className="dropdown-item" href="#">All</a>
                                    </li>
                                    <li onClick={() => {categoryField('FE')}}>
                                        <a className="dropdown-item" href="#">Front End</a>
                                    </li>
                                    <li onClick={() => {categoryField('BE')}}>
                                        <a className="dropdown-item" href="#">Backend</a>
                                    </li>
                                    <li onClick={() => {categoryField('Data')}}>
                                        <a className="dropdown-item" href="#">Data</a>
                                    </li>
                                    <li onClick={() => {categoryField('DevOps')}}>
                                        <a className="dropdown-item" href="#">Dev Ops</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {
                        totalBooks < 0 ?
                            <>
                                <div className="mt-3">
                                    <h5>Number of results: ({totalBooks})</h5>
                                </div>
                            </> :
                            <div className='m-5'>
                                <h3>Can't find what you are looking for?</h3>
                                <a type="button" className="btn main-color btn-md px-4 me-md fw-bold text-white" href="$#">Library Services</a>
                            </div>
                    }
                    <p>
                        {indexOfFirstBook + 1} to {lastItem} of {totalBooks} items:
                    </p>
                    {
                        books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))
                    }
                    {
                        totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }
                </div>
            </div>
        </div>
    )
}