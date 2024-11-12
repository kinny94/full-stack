import {useOktaAuth} from "@okta/okta-react";
import {useEffect, useState} from "react";
import Message from "../../../models/Message";
import {Spinner} from "../../utils/Spinner";
import {Pagination} from "../../utils/Pagination";
import {AdminMessage} from "./AdminMessage";
// @ts-ignore
import AdminMessageRequest from "./../../../models/AdminMessageRequest";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesPerPage, setMessagesPerPage] = useState<number>(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [buttonSubmit, setButtonSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState?.isAuthenticated) {
                const url = `${process.env.REACT_APP_API_SERVER_URL}/messages/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
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
    }, [authState, currentPage, buttonSubmit]);

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

    async function submitResponseToQuestion(id: number, response: string) {
        const url = `${process.env.REACT_APP_API_SERVER_URL}/messages/secure/admin/message`;
        if (authState && authState?.isAuthenticated && id !=null && response !== '') {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageAdminRequestModel),
            };
            const messageAdminRequestionResponse = await fetch(url, requestOptions);
            if (!messageAdminRequestionResponse.ok) {
                throw new Error("Could not post new message");
            }
            setButtonSubmit(!buttonSubmit);
        }
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
                            <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
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