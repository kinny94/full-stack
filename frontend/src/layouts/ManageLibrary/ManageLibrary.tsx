import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import {Navigate, redirect} from "react-router-dom";

export const ManageLibrary = () => {
    const { authState } = useOktaAuth();

    const [changeQuantityOfBooksClicked, setChangeQuantityOfBooksClicked] = useState(false);
    const [messageClick, setMessageClick] = useState(false);

    function addBook() {
        setChangeQuantityOfBooksClicked(false);
        setChangeQuantityOfBooksClicked(false);
        setMessageClick(false);
    }

    function changeQuantityOfBooksClickedFunction() {
        setChangeQuantityOfBooksClicked(true);
    }

    function messageClickFunction() {
        setMessageClick(true);
    }

    if (authState?.accessToken?.claims.userType === undefined) {
        console.log("Navigated to home since admin check failed!")
        return <Navigate to="/home" />;
    }

    return (
        <div className="container">
            <div className="mt-5">
                <h3>Manage Library</h3>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                            className="nav-link active"
                            id="nav-add-book-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-add-book"
                            type="button"
                            role="tab"
                            aria-controls="nav-add-book"
                            aria-selected="false"
                            onClick={addBook}
                        >
                            Add new book
                        </button>
                        <button
                            className="nav-link"
                            id="nav-quantity-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-quantity"
                            type="button"
                            role="tab"
                            aria-controls="nav-quantity"
                            aria-selected="true"
                            onClick={changeQuantityOfBooksClickedFunction}
                        >
                            Change Quantity
                        </button>
                        <button
                            className="nav-link"
                            id="nav-messages-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-messages"
                            type="button"
                            role="tab"
                            aria-controls="nav-messages"
                            aria-selected="false"
                            onClick={messageClickFunction}
                        >
                            Messages
                        </button>
                    </div>
                </nav>

                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel"
                         aria-labelledby="nav-add-book-tab">
                        Add new book
                    </div>
                    <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                        {changeQuantityOfBooksClicked ? <>Change Quantity Of Books</> : <></>}
                    </div>
                    <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                        {messageClick ? <>Admin Messages</> : <></>}
                    </div>
                </div>
            </div>
        </div>
    );
}