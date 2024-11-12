import {useOktaAuth} from "@okta/okta-react";
import {useState} from "react";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => {

    const { authState } = useOktaAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [copies, setCopies] = useState(0);
    const [category, setCategory] = useState('Category');
    const [selectedImage, setSelectedImage] = useState<any | null>(null);

    const [displayWarning, setDisplayWarning] = useState(false);
    const [displaySuccess, setDisplaySuccess] = useState(false);

    function categoryField(value: string) {
        setCategory(value);
    }

    async function base64ConversionForImages(e: any) {
        if (e.target.files[0]) {
            getBase64(e.target.files[0]);
        }
    }

    function getBase64(file: any) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            setSelectedImage(reader.result);
        }
        reader.onerror = (e) => {console.log('Error: ', error)}
    }

    async function submitNewBook() {
        const url = `${process.env.REACT_APP_API_SERVER_URL}/admin/secure/add/book`;
        if (authState?.isAuthenticated && title != '' && description != '' && author != '' && category != '' &&copies > 0) {
            const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
            book.img = selectedImage;
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book)
            };

            const submitNewBookResponse = await fetch(url, requestOptions);
            if (!submitNewBookResponse.ok) {
                throw new Error("Could not post submit new book");
            }

            setTitle('');
            setDescription('');
            setAuthor('');
            setCopies(0);
            setSelectedImage(null);
            setCategory('Category');
            setDisplayWarning(false);
            setDisplaySuccess(true);
        } else {
            setDisplayWarning(true);
            setDisplaySuccess(false);
        }
    }

    return (
        <div className="container mt-5 mb-5">
            {
                displaySuccess &&
                <div className="alert alert-success" role="alert">
                    Book added successfully
                </div>
            }

            {
                displayWarning &&
                <div className="alert alert-danger" role="alert">
                    All fields must be filled out
                </div>
            }

            <div className="card">
                <div className="card-header">
                    Add a new book
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="row">
                            <div className="col=md-6 mb-3">
                                <label className="form-label">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="author"
                                    required
                                    value={author}
                                    onChange={e => setAuthor(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Category</label>
                                <button
                                    className="form-control btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {category}
                                </button>
                                <ul id="addNewBookId" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a onClick={() => categoryField('FE')} className="dropdown-item">Front end</a>
                                    </li>
                                    <li><a onClick={() => categoryField('BE')} className="dropdown-item">Back end</a>
                                    </li>
                                    <li><a onClick={() => categoryField('Data')} className="dropdown-item">Data</a>
                                    </li>
                                    <li><a onClick={() => categoryField('DevOps')} className="dropdown-item">DevOps</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                onChange={e => setDescription(e.target.value)}
                                value={description}>
                            </textarea>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Copies</label>
                            <input
                                type="number"
                                className="form-control"
                                name="copies"
                                value={copies}
                                required
                                onChange={e => setCopies(Number(e.target.value))}
                            />
                        </div>
                        <input type="file" onChange={e => base64ConversionForImages(e)} />
                        <div>
                            <button type="button" className="btn btn-primary mt-3" onClick={submitNewBook}>
                                Add Book
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}