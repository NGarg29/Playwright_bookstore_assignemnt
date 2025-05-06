import { test, expect } from '@playwright/test';
import { loginWithNewUser, getBooks, createBook, deleteBook, updateBook } from '../utils/api-client';
import { invalid_book_data, testData, valid_book_data } from '../utils/test-data';
let token;
let book_ids: number[] = [];

async function getBookIds(token) {
    const getBookRes = await getBooks(token);
    const books = await getBookRes.json();
    book_ids = books.map((book: any) => book.id);
    console.log('Book IDs:', book_ids);
    return book_ids;
}

test.describe('Test Book Management - Positive Scenarios', () => {
    test.beforeAll(async() => {
        token = await loginWithNewUser(false);
    });

    test('Create Book - Positive', async () => {
        const createRes = await createBook(token, valid_book_data);
        expect(createRes.status()).toBe(200);
        const createdBook = await createRes.json();
        console.log(createdBook);
        expect(createdBook.name).toBe(testData.book_name);
        expect(createdBook.author).toBe(testData.book_author);
        expect(createdBook.published_year).toBe(testData.book_published_year);
        expect(createdBook.book_summary).toBe(testData.book_summary);
    });

    test('Update Book - Positive', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1];
        const updateRes = await updateBook(token, lastBookId);
        expect(updateRes.status()).toBe(200);
        const createdBook = await updateRes.json();
        console.log(createdBook);
        expect(createdBook.name).toBe(testData.book_name + 'updated');
    });

    test('Update Book - Negative', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1] + 1;
        const updateRes = await updateBook(token, lastBookId);
        expect(updateRes.status()).toBe(404);
        const createdBook = await updateRes.json();
        console.log(createdBook);
        expect(createdBook.detail).toBe("Book not found");
    });

    test('Delete Book - Positive', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1];
        const deleteRes = await deleteBook(token, lastBookId);
        expect(deleteRes.status()).toBe(200);
        const deletedResJson = await deleteRes.json();
        console.log(deletedResJson);
        expect(deletedResJson.message).toBe("Book deleted successfully");
    });

    test('Delete Book - Negative', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1] + 1;
        const deleteRes = await deleteBook(token, lastBookId);
        expect(deleteRes.status()).toBe(404);
        const deletedResJson = await deleteRes.json();
        console.log(deletedResJson);
        expect(deletedResJson.detail).toBe("Book not found");
    });

    test('Get book by id - Positive', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1];
        const getBookById = await getBooks(token, lastBookId);
        expect(getBookById.status()).toBe(200);
        const getBookResJson = await getBookById.json();
        console.log(getBookResJson);
        expect(getBookResJson.id).toEqual(lastBookId);
    });

    test('Get book by id - Negative', async () => {
        book_ids = await getBookIds(token);
        const lastBookId = book_ids[book_ids.length - 1] + 5;
        const getBookById = await getBooks(token, lastBookId);
        expect(getBookById.status()).toBe(404);
        const getBookResJson = await getBookById.json();
        console.log(getBookResJson);
        expect(getBookResJson.detail).toBe("Book not found");
    });

    test('Get all Books - Positive', async () => {
        const getBooksRes = await getBooks(token);
        expect(getBooksRes.status()).toBe(200);
    });

    test('Create Book - Negative', async () => {
        const createRes = await createBook(token, invalid_book_data);
        expect(createRes.status()).toBe(500);
    });
});
