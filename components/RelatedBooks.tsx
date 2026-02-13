import { Book } from "@/data/mockData";
import BookCard from "./BookCard";

interface RelatedBooksProps {
    books: Book[];
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
    if (books.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">
            <h2 className="section-title" style={{ paddingLeft: '3rem' }}>你可能还喜欢</h2>
            <div className="book-grid">
                {books.map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>
    );
}
