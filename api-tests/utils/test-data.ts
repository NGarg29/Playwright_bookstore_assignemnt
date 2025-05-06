import dotenv from 'dotenv';
dotenv.config();

export const testData = {
    existing_email_id: process.env.EMAIL_ID || '',
    password: process.env.PASSWORD || '',
    book_name: 'xyz',
    book_author: 'abc',
    book_published_year: 2020,
    book_summary: 'This is book Summary',
}

export const valid_book_data = {
  "name": testData.book_name,
  "author": testData.book_author,
  "published_year": testData.book_published_year,
  "book_summary": testData.book_summary
}

export const invalid_book_data = {
  "name": testData.book_name,
  "author": testData.book_author
}

export function createBookData(): string {
  const timestamp = Date.now();
  return `book${timestamp}`;
}

  