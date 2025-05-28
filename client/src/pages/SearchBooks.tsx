// client/src/pages/SearchBooks.tsx

import React, { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

interface SearchBook {
  bookId: string;
  authors?: string[];
  description?: string;
  title?: string;
  image?: string;
  link?: string;
}

const SearchBooks: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchedBooks, setSearchedBooks] = useState<SearchBook[]>([]);
  const [savedBookIds, setSavedBookIds] = useState<string[]>(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);

  // Handle the search form submission
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchInput
        )}`
      );
      const { items } = await response.json();

      const books: SearchBook[] = items.map((item: any) => ({
        bookId: item.id,
        authors: item.volumeInfo.authors || ['No author to display'],
        description: item.volumeInfo.description || 'No description available',
        title: item.volumeInfo.title,
        image: item.volumeInfo.imageLinks?.thumbnail || '',
        link: item.volumeInfo.infoLink,
      }));

      setSearchedBooks(books);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle saving a book to the database
  const handleSaveBook = async (bookToSave: SearchBook) => {
    const token = Auth.loggedIn() ? localStorage.getItem('id_token') : null;
    if (!token) return;

    try {
      await saveBook({
        variables: { input: bookToSave }
      });

      // Update local storage and state
      saveBookIds([...savedBookIds, bookToSave.bookId]);
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search for Books</h2>

      {/* Search Form */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter book title"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Results */}
      <div>
        {searchedBooks.map((book) => (
          <div key={book.bookId} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
            <h3>{book.title}</h3>
            <p><strong>Authors:</strong> {book.authors?.join(', ')}</p>
            <p>{book.description}</p>
            {book.image && <img src={book.image} alt={`Cover for ${book.title}`} />}
            <p>
              <a href={book.link} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            </p>
            {Auth.loggedIn() && (
              <button
                disabled={savedBookIds.includes(book.bookId)}
                onClick={() => handleSaveBook(book)}
              >
                {savedBookIds.includes(book.bookId) ? 'Book Already Saved' : 'Save This Book!'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
