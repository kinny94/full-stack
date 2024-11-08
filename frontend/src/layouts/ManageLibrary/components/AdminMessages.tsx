import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import Message from "../../../models/Message";
import {Spinner} from "../../utils/Spinner";
import {Pagination} from "../../utils/Pagination";
import {AdminMessage} from "./AdminMessage";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesPerPage, setMessagesPerPage] = useState<number>(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        "Content-Type": "application/json",
                    }
                };
                const messagesResponse = await fetch(url, requestOptions);
                if (!messagesResponse.ok) {
                    throw new Error("Could not fetch books");
                }
                const messagesResponseJson = await messagesResponse.json();
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setErrorMessage(error.message);
        });
        window.scrollTo(0, 0);
    }, [authState, currentPage]);

    if (isLoadingMessages) {
        return (
            <Spinner/>
        )
    }

    if (errorMessage) {
        return (
            <div className="container-m5">
                <p>{errorMessage}</p>
            </div>
        )
    }

    const paginate = (page: number, size: number) => setCurrentPage(page);

    return (
        <div className="mt-3">
            {
                messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {
                        messages.map(message => (
                            <AdminMessage message={message} key={message.id} />
                        ))
                    }
                </> :
                <>
                    <h5>No pending Q/A</h5>
                </>
            }
            {
                totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            }
        </div>
    );
}