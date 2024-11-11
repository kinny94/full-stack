class AddBookRequest {
    title: string;
    description: string;
    category: string;
    copies: number;
    img?: string;
    author: string;

    constructor(title:string ,author: string, description:string, copies: number, category: string) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.copies = copies;
        this.author = author;
    }
}

export default AddBookRequest;