import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import Message from "../../../models/Message";
import {Spinner} from "../../utils/Spinner";
import message from "../../../models/Message";
import {Pagination} from "../../utils/Pagination";

export const MessagesComponent = () => {

    const { authState } = useOktaAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesPerPage, setMessagesPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState<number>(0);


    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API_SERVER_URL}/messages/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    }
                };
                const messages = await fetch(url, requestOptions);
                if (!messages) {
                    throw new Error("Could not fetch messages");
                }
                const messageResponseJson = await messages.json();
                setMessages(messageResponseJson._embedded.messages);
                setTotalPage(messageResponseJson.page.totalPages);
            }
            setIsLoading(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoading(false);
            setError(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage]);

    if (isLoading) {
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

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {
                messages.length > 0 ?
                    <>
                        <h5>Current Q/A</h5>
                        {messages.map(message => (
                            <div key={message.id}>
                                <div className="card mt-2 shadow p-3 bg-body rounded">
                                    <h5>Case #{message.id}: {message.title}</h5>
                                    <h6>{message.userEmail}</h6>
                                    <p>{message.question}</p>
                                    <hr />
                                    <div>
                                        <h5>Response:  </h5>
                                        {
                                            message.response && message.adminEmail ?
                                                <>
                                                    <h6>{message.adminEmail} (admin)</h6>
                                                    <p>{message.response}</p>
                                                </>
                                                :
                                                <p>Pending response from admin. Please be patient</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>:
                    <h5>All questions you submit will be shown here</h5>
            }
            {totalPage > 1 && <Pagination currentPage={currentPage} totalPages={totalPage} paginate={paginate} />}
        </div>
    );
}