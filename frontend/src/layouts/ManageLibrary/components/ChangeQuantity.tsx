import React, {useEffect, useState} from "react";
import BookModel from "../../../models/Book";

export const ChangeQuantity: React.FC<{book: BookModel}> = (props, key) => {

    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const fetchBooksInStore = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        };
        fetchBooksInStore();
    }, []);

    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {
                            props.book.img ?
                                <img src={props.book.img} width="123" height="196" alt="book"/> :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')} width="123"
                                     height="196" alt="book"/>
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {
                            props.book.img ?
                                <img src={props.book.img} width="123" height="196" alt="book"/> :
                                <img src={require('../../../Images/BooksImages/book-luv2code-1000.png')} width="123"
                                     height="196" alt="book"/>
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className="card-text">{props.book.description}</p>
                    </div>
                </div>
                <div className="mt-3 col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Books remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className="mt-3 col-md-1">
                    <div className="d-flex justify-content-start">
                        <button className="m-1 btn btn-md btn-danger">Delete</button>
                    </div>
                </div>
                <button className="m1 btn btn-md main-color text-white">Add Quantity</button>
                <button className="m1 btn btn-md btn-warning">Decrease Quantity</button>
            </div>
        </div>
    );

}