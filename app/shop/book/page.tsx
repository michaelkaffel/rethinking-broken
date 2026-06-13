import type { Metadata } from 'next';
import BookContent from '@/components/BookContent';

export const metadata: Metadata = {
    title: 'Book',
    description:     'Rethinking Broken in paperback ($19.99) or hardcover ($28.99) by Owl. Ships anywhere in the US.',
    openGraph: {
        title: 'Book — Rethinking Broken',
        description: 'Paperback $19.99 · Hardcover $28.99. Ships US-wide.',
        url: '/shop/book',
    },
}

const BookPage = () => <BookContent />

export default BookPage;