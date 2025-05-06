import { request } from '@playwright/test';
import { testData } from './test-data';

export async function loginWithNewUser(new_user: boolean) {
  const password = testData.password;
  let email_id: string;
  if(new_user) {
    email_id = "test_" + Date.now() + "@gmail.com";
    await signupUser(email_id, password);
  } else {
    email_id = testData.existing_email_id;
  }
  const context = await request.newContext();
  const rawData = {
    "email": email_id,
    "password": password
  }
  try {
    const res = await context.post('/login', {
      data: rawData
    });
    const body = await res.json();
    return body.access_token;
  } catch(err) {
    throw new Error(`Login failed for user ${email_id}: ${err}`);
  }
}

export async function signupUser(email: string, password: string) {
    const context = await request.newContext();
    const res = await context.post('/signup', {
      data: { email, password }
    });
    const body = await res.json();
    if (body.message === 'User created successfully') {
      console.log('new user is registered with email_id: ', email);
      return res;
    } else {
      throw new Error(`Signup failed: ${body.detail || JSON.stringify(body)}`);
    }
}

export async function getBooks(token: string, bookId?: number) {
  const context = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  if(bookId) {
    return await context.get(`/books/${bookId}`);
  } else {
    return await context.get('/books/');
  }
}

export async function createBook(token: string, newBook: object) {
  const context = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return await context.post('/books/', {
    data: newBook
  });
}

export async function updateBook(token: string, bookId: number) {
  const updatedBook = {
    "name": testData.book_name + 'updated',
    "author": testData.book_author,
    "published_year": testData.book_published_year,
    "book_summary": testData.book_summary
};
  const context = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return await context.put(`/books/${bookId}`, {
    data: updatedBook
  });
}

export async function deleteBook(token: string, bookId: number) {
  const context = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return await context.delete(`/books/${bookId}`);
}
