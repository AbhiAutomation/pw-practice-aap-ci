# Playwright API Testing Framework - Copilot Instructions

## Project Overview

This is a **Playwright-based API testing framework** designed for testing REST APIs with enterprise-grade features including:

- **Custom matchers** for enhanced assertions with logging
- **Schema validation** using AJV
- **Fluent API builder pattern** for readable test code
- **Automatic logging** for debugging failed tests
- **Authentication handling** with token management
- **Per-test isolation** using Playwright fixtures

### Key Technologies

- **Playwright** - Cross-browser automation & API testing
- **TypeScript** - Type-safe test code
- **AJV** - JSON Schema validation
- **Dotenv** - Environment configuration management
- **Custom Fixtures** - Dependency injection & test isolation

---

## Project Structure

```
pw-api-testing/
├── .github/
│   └── instructions/
│       └── copilot-instructions.md (this file)
├── tests/
│   ├── api-tests/
│   │   ├── fixture.ts (custom fixtures)
│   │   ├── smokeTest.spec.ts (smoke test examples)
│   │   ├── example.spec.ts (example tests)
│   │   └── smokeDemo.spec.ts (demo tests)
│   └── ui-tests/
│       └── smokeUITest.spec.ts (UI test examples)
├── utils/
│   ├── request-handler.ts (RequestHandler class - fluent API)
│   ├── logger.ts (APILogger class - request/response logging)
│   ├── custom-expect.ts (custom matchers - shouldEqual, shouldMatchSchema)
│   ├── fixtures.ts (test fixtures with logger injection)
│   ├── schema-validator.ts (schema validation using AJV)
│   └── data-generator.ts (test data generation)
├── response-schemas/
│   └── (JSON Schema files for validation)
├── request-objects/
│   └── POST-booking.json (request payload examples)
├── helpers/
│   └── createToken.ts (authentication token generation)
├── playwright.config.ts (Playwright configuration)
├── api-test.config.ts (API test configuration & environment)
└── package.json (dependencies)
```

---

## Core Patterns & Architecture

### 1. RequestHandler Class (Fluent API Builder Pattern)

**File:** `utils/request-handler.ts`

The `RequestHandler` class provides a fluent API for building and executing HTTP requests:

```typescript
// Example: Fluent API chaining
const response = await api
  .url('https://restful-booker.herokuapp.com')
  .path('booking')
  .headers({ 'Content-Type': 'application/json' })
  .body({ firstname: 'John', lastname: 'Doe', totalprice: 100 })
  .postRequest(200); // validates status code, logs request/response
```

**Key Methods:**

- `.url(baseUrl: string)` - Override base URL for this request
- `.path(endpoint: string)` - Set API path (e.g., `/booking`, `/booking/123`)
- `.headers(headers: object)` - Set HTTP headers
- `.body(data: object)` - Set request body (for POST/PUT)
- `.params(params: object)` - Set query parameters
- `.getRequest(expectedStatus: number)` - Execute GET request
- `.postRequest(expectedStatus: number)` - Execute POST request
- `.putRequest(expectedStatus: number)` - Execute PUT request
- `.deleteRequest(expectedStatus: number)` - Execute DELETE request
- `.clearAuth()` - Remove authentication token from request

**Benefits:**

- Readable, chainable syntax
- Automatic logging of all requests/responses
- Built-in HTTP status validation
- Centralized request handling

---

### 2. APILogger Class (CCTV Pattern for Debugging)

**File:** `utils/logger.ts`

The `APILogger` captures request and response details for debugging failed tests:

```typescript
// Methods:
logger.logRequest(method, url, headers, body);
logger.logResponse(statusCode, body);
const logs = logger.getRecentLogs(); // formatted string
```

**Output Format:**

```
=== REQUEST DETAIL ===
{
  "method": "POST",
  "url": "https://restful-booker.herokuapp.com/booking",
  "headers": { "Content-Type": "application/json" },
  "body": { "firstname": "John", ... }
}

=== RESPONSE DETAIL ===
{
  "statusCode": 200,
  "body": { "bookingid": 123, "booking": { ... } }
}
```

**Integration:** The logger is automatically injected into RequestHandler via fixtures and attached to failed assertions.

---

### 3. Custom Expect Matchers

**File:** `utils/custom-expect.ts`

Custom assertions that extend Playwright's `expect()` with additional matchers:

#### `shouldEqual(expected)`
Compares values and automatically attaches API logs on failure:

```typescript
expect(response.booking.firstname).shouldEqual('John');
// On failure: shows expected value + received value + recent API logs
```

#### `shouldMatchSchema(dirName, fileName)`
Validates response against a JSON Schema and attaches logs on failure:

```typescript
await expect(response).shouldMatchSchema('booking', 'POST_booking');
// Validates response against response-schemas/booking/POST_booking.json
```

**Usage:**

```typescript
import { expect } from '../utils/custom-expect';

test('validate response', async ({ api }) => {
  const response = await api.path('booking').getRequest(200);
  
  // Custom matcher - includes logs on failure
  await expect(response).shouldMatchSchema('booking', 'GET_booking');
  
  // Standard Playwright matcher
  expect(response.bookingid).toBeTruthy();
});
```

---

### 4. Test Fixtures (Dependency Injection)

**File:** `tests/api-tests/fixture.ts` and `utils/fixtures.ts`

Fixtures provide per-test setup and dependency injection:

```typescript
type MyFixture = {
  helloworld: string;
  greatday: string;
};

type WorkerFixture = {
  cupOfCoffe: string;
};

export const test = base.extend<MyFixture, WorkerFixture>({
  helloworld: async ({}, use) => {
    const value = "Hello World";
    await use(value);
    // cleanup if needed
  },
  
  greatday: async ({ helloworld }, use) => {
    // Depends on helloworld fixture
    const value = helloworld + '. What a great day!';
    await use(value);
  },
  
  cupOfCoffe: [async ({}, use, workerInfo) => {
    // Worker-scoped: one instance per Playwright worker
    const cup = `Cup #${workerInfo.workerIndex}`;
    await use(cup);
  }, { scope: 'worker' }]
});
```

**Key Fixture in `utils/fixtures.ts`:**

```typescript
// Main test fixture that provides api (RequestHandler + Logger)
export const test = base.extend<TestFixtures>({
  api: async ({ page }, use) => {
    const logger = new APILogger();
    const requestHandler = new RequestHandler(
      page.context().request,
      config.apiUrl,
      logger,
      authToken
    );
    setCustomExpectLogger(logger); // inject logger into custom expect
    await use(requestHandler);
  }
});
```

---

### 5. Schema Validation

**File:** `utils/schema-validator.ts`

Validates API responses against JSON Schema files:

```typescript
// Schema files location: response-schemas/<dirName>/<fileName>.json
validateSchema('booking', 'GET_booking', responseBody);
// Validates against: response-schemas/booking/GET_booking.json
```

**Example Schema:**

```json
{
  "type": "object",
  "properties": {
    "bookingid": { "type": "number" },
    "booking": {
      "type": "object",
      "properties": {
        "firstname": { "type": "string" },
        "lastname": { "type": "string" },
        "totalprice": { "type": "number" },
        "depositpaid": { "type": "boolean" },
        "bookingdates": {
          "type": "object",
          "properties": {
            "checkin": { "type": "string", "format": "date" },
            "checkout": { "type": "string", "format": "date" }
          }
        }
      },
      "required": ["firstname", "lastname"]
    }
  },
  "required": ["bookingid", "booking"]
}
```

---

## Coding Standards & Patterns

### Authentication Pattern

Tokens are automatically created and managed:

```typescript
// Token is automatically included in all requests
const response = await api.path('booking/123').getRequest(200);

// Explicitly remove token for public endpoints
const response = await api.path('public-endpoint').clearAuth().getRequest(200);
```

**Token Creation:** Defined in `helpers/createToken.ts` and integrated via `api-test.config.ts`

---

### Test Structure Pattern

**Two imports required:**

```typescript
import { expect } from '../utils/custom-expect';  // custom matchers
import { test } from '../utils/fixtures';          // test fixture with api
```

**Test Body Pattern:**

```typescript
test('should create booking and verify response', async ({ api }) => {
  // 1. Setup: prepare request payload
  const requestBody = require('../../request-objects/POST-booking.json');
  
  // 2. Execute: make API request
  const response = await api
    .path('booking')
    .headers({ 'Content-Type': 'application/json' })
    .body(requestBody)
    .postRequest(200);
  
  // 3. Assert: validate response (presence, parity, semantics)
  expect(response).toHaveProperty('bookingid');
  expect(response.booking.firstname).toBe(requestBody.firstname);
  await expect(response).shouldMatchSchema('booking', 'POST_booking');
  
  // 4. Follow-up (optional): verify persistence
  const getResponse = await api
    .path(`booking/${response.bookingid}`)
    .getRequest(200);
  expect(getResponse.firstname).toBe(requestBody.firstname);
});
```

---

### Assertion Patterns

**Do NOT rely on schema validation alone.** Add business logic and semantic assertions:

```typescript
test('create booking validation', async ({ api }) => {
  const response = await api
    .path('booking')
    .body({ firstname: 'John', lastname: 'Doe', totalprice: 100, ... })
    .postRequest(200);
  
  // 1. Presence checks
  expect(response).toHaveProperty('bookingid');
  
  // 2. ID sanity checks
  expect(response.bookingid).toBeGreaterThan(0);
  
  // 3. Request/response parity (values match what was sent)
  expect(response.booking.firstname).toBe('John');
  expect(response.booking.lastname).toBe('Doe');
  
  // 4. Semantic checks (business logic)
  const checkin = new Date(response.booking.bookingdates.checkin);
  const checkout = new Date(response.booking.bookingdates.checkout);
  expect(checkout.getTime()).toBeGreaterThanOrEqual(checkin.getTime());
  
  // 5. Price sanity (not a typo/corruption)
  expect(response.booking.totalprice).toBeLessThan(1e12);
  
  // 6. Schema validation (data types already covered)
  await expect(response).shouldMatchSchema('booking', 'POST_booking');
});
```

---

### Request Objects Pattern

**Location:** `request-objects/` folder

Request payloads should be stored as JSON files for reusability and maintainability:

**File:** `request-objects/POST-booking.json`

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "totalprice": 100,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-01-01",
    "checkout": "2026-01-02"
  },
  "additionalneeds": "Breakfast"
}
```

**Hyperlink (for Copilot to reference):**

[POST-booking.json](../../request-objects/POST-booking.json)

**Usage Pattern:**

```typescript
test('create booking', async ({ api }) => {
  // 1. Import request object
  const requestBody = require('../../request-objects/POST-booking.json');
  
  // 2. Clone to create unique instance (prevent test pollution)
  const payload = structuredClone(requestBody);
  
  // 3. Customize if needed
  payload.firstname = 'Jane';
  
  // 4. Use in request
  const response = await api
    .path('booking')
    .body(payload)
    .postRequest(200);
  
  // 5. Assert
  expect(response.booking.firstname).toBe('Jane');
});
```

**Why structuredClone?** Each test must have its own object instance to prevent cross-test data pollution in parallel execution.

---

## Common Development Patterns

### When Creating New Tests

1. **Import required dependencies:**
   ```typescript
   import { expect } from '../utils/custom-expect';
   import { test } from '../utils/fixtures';
   ```

2. **Use the `api` fixture** - it's automatically injected with RequestHandler + Logger:
   ```typescript
   test('my test', async ({ api }) => { ... });
   ```

3. **Validate every response** - at minimum:
   - Presence of key fields
   - Schema validation
   - Business logic checks

4. **Single test can have sequence of API calls:**
   ```typescript
   // Create booking
   const createResponse = await api.path('booking').postRequest(200);
   
   // Get booking
   const getResponse = await api.path(`booking/${createResponse.bookingid}`).getRequest(200);
   
   // Delete booking
   await api.path(`booking/${createResponse.bookingid}`).deleteRequest(200);
   ```

### Important Naming & Assignment Rules

- **Use camelCase** for variable names and constants
- **Assign API response to a constant** if the response will be reused:
  ```typescript
  const bookingId = response.bookingid; // Good: assign if reused
  const response = await api.path('booking').postRequest(200); // Good: assign response
  ```
- **Do NOT assign response for DELETE requests** (body is empty, no assertions):
  ```typescript
  await api.path(`booking/${id}`).deleteRequest(200); // Good: don't assign
  ```

### Request Object Best Practices

1. **Save** request payloads to `request-objects/` folder as JSON
2. **Import** the request object into tests
3. **Clone** using `structuredClone()` to create unique instance per test
4. **Modify** the clone if test-specific values are needed
5. **Example:**
   ```typescript
   const payload = structuredClone(require('../../request-objects/POST-booking.json'));
   payload.firstname = 'TestName';
   const response = await api.path('booking').body(payload).postRequest(200);
   ```

---

## Configuration

### Environment Setup

**File:** `api-test.config.ts`

```typescript
const env = process.env.TEST_ENV || 'prod'; // Default to 'prod'

const config = {
  apiUrl: 'https://restful-booker.herokuapp.com/',
  userName: 'admin',
  userPassword: 'password123'
};

// Override for QA environment
if (env === 'qa') {
  config.userName = 'admin';
  config.userPassword = 'password123';
}

// Override for PROD environment (use env vars)
if (env === 'prod') {
  config.userName = process.env.PROD_USERNAME;
  config.userPassword = process.env.PROD_PASSWORD;
}
```

**Usage in Terminal:**

```bash
# Run tests with QA environment
TEST_ENV=qa npx playwright test

# Run tests with PROD environment (requires .env file with PROD_USERNAME, PROD_PASSWORD)
TEST_ENV=prod npx playwright test
```

### Playwright Configuration

**File:** `playwright.config.ts`

- **Projects:** `api-testing`, `api-smoke-test`, `ui-testing`
- **Workers:** Set to 1 for API testing (to avoid rate limiting)
- **Reporter:** HTML report at `playwright-report/`

---

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific project
npx playwright test --project api-testing

# Run specific test file
npx playwright test smokeTest

# Run in headed mode (see browser/network)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Show HTML report
npx playwright show-report
```

---

## Test Template Example

Use this template when creating new tests:

```typescript
import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';

test.describe('Booking API - Create & Verify', () => {
  
  let bookingPayload: any;
  
  test.beforeAll(async () => {
    // Load request template once for all tests in this suite
    bookingPayload = require('../../request-objects/POST-booking.json');
  });

  test('should create a booking and validate response structure', async ({ api }) => {
    // 1. Setup
    const payload = structuredClone(bookingPayload);
    payload.firstname = 'TestUser';
    
    // 2. Execute
    const response = await api
      .path('booking')
      .headers({ 'Content-Type': 'application/json' })
      .body(payload)
      .postRequest(200);
    
    // 3. Assert - Presence
    expect(response).toHaveProperty('bookingid');
    expect(response).toHaveProperty('booking');
    
    // 4. Assert - Parity (values match request)
    expect(response.booking.firstname).toBe(payload.firstname);
    expect(response.booking.lastname).toBe(payload.lastname);
    expect(response.booking.totalprice).toBe(payload.totalprice);
    
    // 5. Assert - Semantics
    const checkin = new Date(response.booking.bookingdates.checkin);
    const checkout = new Date(response.booking.bookingdates.checkout);
    expect(checkout.getTime()).toBeGreaterThanOrEqual(checkin.getTime());
    
    // 6. Assert - Schema (data types)
    await expect(response).shouldMatchSchema('booking', 'POST_booking');
    
    // 7. Follow-up - Verify persistence
    const getResponse = await api
      .path(`booking/${response.bookingid}`)
      .getRequest(200);
    expect(getResponse.firstname).toBe(payload.firstname);
  });

  test('should handle validation errors gracefully', async ({ api }) => {
    // Test negative scenario
    const invalidPayload = {
      firstname: 'Test',
      lastname: 'User',
      totalprice: 'invalid' // Should fail
    };
    
    // API should reject invalid data
    await expect(api.path('booking').body(invalidPayload).postRequest(400))
      .rejects.toThrow();
  });
});
```

---

## Links & References

- [POST-booking.json](../../request-objects/POST-booking.json) - Example request payload
- [Request Handler](../../utils/request-handler.ts) - Fluent API implementation
- [Custom Expect](../../utils/custom-expect.ts) - Custom matchers
- [API Logger](../../utils/logger.ts) - Logging implementation
- [Schema Validator](../../utils/schema-validator.ts) - Schema validation
- [Test Fixtures](../../utils/fixtures.ts) - Fixture setup

---

## Summary

This framework provides:

✅ **Readable tests** via fluent API  
✅ **Debuggable failures** via automatic logging  
✅ **Reusable request payloads** via JSON request objects  
✅ **Type safety** via TypeScript  
✅ **Schema validation** via AJV  
✅ **Test isolation** via fixtures  
✅ **Parallel execution** via worker-scoped resources  
✅ **Enterprise patterns** (builder, DI, logging)  

When extending this framework, follow the patterns above to maintain consistency and readability.
