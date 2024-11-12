import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import History from "../../../models/Hisory";
import {Spinner} from "../../utils/Spinner";
import {Link} from "react-router-dom";
import {Pagination} from "../../utils/Pagination";

export const HistoryComponent = () => {

    const { authState } = useOktaAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error>();

    const [histories, setHistories] = useState<History[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API_SERVER_URL}/histories/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Could not fetch user history");
                }

                const historyResponseJson = await response.json();
                console.log(historyResponseJson);
                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);
            }
            setIsLoading(false);
        }

        fetchUserHistory().catch((error: any) => {
            setIsLoading(false);
            setError(error.message);
        });
    }, [authState, currentPage]);

    if (isLoading) {
        return (
            <Spinner />
        );
    }

    if (error) {
        return (
            <div className="container m-5">
                <p>{error.message}</p>
            </div>
        )
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="mt-2">
            {
                histories.length > 0 ?
                <>
                    <h5>Recent history:</h5>
                    {
                        histories.map(history => (
                            <div key={history.id}>
                                <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                    <div className="row g-0">
                                        <div className="col-md-2">
                                            <div className="d-none d-lg-block">
                                                {
                                                    history.img ?
                                                        <img src={history.img} width="123" height="196" alt="book"/> :
                                                        <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} width="123" height="196" alt="book"/>
                                                }
                                            </div>
                                            <div className="d-lg-none d-flex justify-content-center align-items-center">
                                                {
                                                    history.img ?
                                                        <img src={history.img} width="123" height="196" alt="book"/> :
                                                        <img src={require("./../../../Images/BooksImages/book-luv2code-1000.png")} width="123" height="196" alt="book"/>
                                                }
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {history.author}
                                                </h5>
                                                <h4>
                                                    {history.title}
                                                </h4>
                                                <p className="card-text">{history.description}</p>
                                                <hr />
                                                <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                                <p className="card-text">Returned on: {history.returnedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                            </div>
                        ))
                    }
                </> :
                <>
                    <h3 className="mt-4">Currently no history: </h3>
                    <Link className="btn btn-primary" to={`/search`}>Search for a new book</Link>
                </>
            }
            {
                totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </div>
    );
}