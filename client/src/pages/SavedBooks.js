// client/src/pages/SavedBooks.tsx
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
const SavedBooks = () => {
    // 3) Tell useQuery what shape to expect
    const { loading, data } = useQuery(GET_ME);
    const [removeBook] = useMutation(REMOVE_BOOK);
    // Provide a default so data?.me isn’t undefined
    const userData = data?.me || { _id: '', username: '', email: '', bookCount: 0, savedBooks: [] };
    if (loading) {
        return <h2>LOADING...</h2>;
    }
    // 4) Type your handler parameter explicitly
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? localStorage.getItem('id_token') : null;
        if (!token)
            return;
        try {
            await removeBook({ variables: { bookId } });
            removeBookId(bookId);
        }
        catch (err) {
            console.error(err);
        }
    };
    return (<div>
      <h2>
        {userData.username
            ? `Viewing ${userData.username}'s saved books:`
            : 'You have no saved books!'}
      </h2>
      <div>
        {userData.savedBooks.map((book) => (<div key={book.bookId} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
            <h3>{book.title}</h3>
            <p><strong>Authors:</strong> {book.authors?.join(', ')}</p>
            <p>{book.description}</p>
            {book.image && <img src={book.image} alt={`Cover for ${book.title}`} style={{ maxWidth: '150px' }}/>}
            <p>
              <a href={book.link} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            </p>
            <button onClick={() => handleDeleteBook(book.bookId)}>
              Remove this Book!
            </button>
          </div>))}
      </div>
    </div>);
};
export default SavedBooks;
