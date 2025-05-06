## API Test Automation Framework (FastAPI + Playwright)

This is an API test automation framework built using Playwright for a FastAPI-based backend. It covers authentication, protected resource access, validations, and robust reporting (Allure + HTML reports).

## Features

- **Authentication Flow**: Dynamic login with an option to sign up new users automatically before tests.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations using a valid JWT token.
- **Validations & Assertions**: Validate HTTP status codes, response payloads, specific book data, and error handling scenarios.
- **Configurable Environments**: Centralized configuration for switching between different environments (dev, staging, prod).
- **Rich Reporting**: Integrated Allure and HTML reports for clear and shareable results.

## Folder Structure

api-tests/
│
├── tests/
│   └── test.spec.ts        # Main test file for CRUD operations on books
│
├── utils/
│   ├── api-client.ts        # API helper functions
│   └── test-data.ts         # Data generators (emails, books)
│
└── env.ts                   # Configurable environment file
├── playwright.config.ts     # Playwright global setup
├── package.json
├── README.md

## Testing Strategy

### Login Flow

- Before any test runs, we perform a login.
- If the `new_user` flag is set to `false`, it logging in with existing email & password defined in .env file.
- If the `new_user` flag is set to `true`, it:
  - Signs up a new user with a unique email.
  - Logs in using those credentials.
  - Extracts and stores the token for authorization.
- This token is then used for all subsequent API calls to secured endpoints.

### Book Management Test Coverage

Each test follows a flow using the token generated above. The following test cases are covered with positive & negative scenarios:

- **Create Book**
- **Update Book**
- **Delete Book**
- **Get Book by ID**
- **Get All Books**

Tests validate:

- HTTP status codes
- Payload structure & values
- Functional correctness (e.g., book content matches what was created)
- Error messages for negative scenarios

Book IDs are stored dynamically after creation to be reused in dependent test cases (e.g., update or delete the last created book).

## Parallel Test Execution

The test suite is designed with **parallelism in mind**:

- Each test runs in isolation using its own test data.
- Supports Playwright’s built-in parallel execution across workers.
- Token and resource IDs are maintained per test file or per test block to avoid collisions.

This makes the framework scalable and CI-friendly.

## Test Design Principles

- Reusable API utilities in `utils/api-client.ts` for all http operations.
- .env file to handle different environments, browsers or secrets. 
- Test Data is managed centerally through `utils/test-data.ts` file.
- Robust error handling in login/signup functions to ensure tests don't run with invalid or missing tokens.
- Test 

### Reporting

- Playwright HTML Report is generated after every test run. Also, to open the report, use:
    `npx playwright show-report`

- Allure reports is integrated for better visualization & test analytics.
    `npx allure generate ./allure-results --clean -o ./allure-report`
    `npx allure open ./allure-report`

- Console logs print API responses for additional debugging support.

### Challenges Faced & Solutions

**Issue:** Each `createBook` call returned a new book with a unique ID.

**Fix:**
- Stored book IDs in a variable within the test scope.
- Used the latest created book's ID for update, delete, and get-by-ID tests.


