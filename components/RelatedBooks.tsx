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
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                你可能还喜欢
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
                {books.map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </section>
    );
}
