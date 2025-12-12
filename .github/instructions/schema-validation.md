# Schema Validation Instruction

Apply-To: `tests/**/*.spec.ts`

Purpose
-------
This instruction describes exactly how to add schema validation assertions to API tests in this repository. It is narrow in scope: only modify test files (spec files) and only insert schema validation assertions for requests that return a response body. This instruction is intentionally prescriptive to avoid ambiguity when generating or patching tests.

Rules (must follow)
-------------------
- Scope: Apply only to files matching the glob `tests/**/*.spec.ts`.
- Target requests: Add schema validation for requests that return a response body (typically GET, POST, PUT). Do NOT add schema validation for DELETE requests.
- Skip: If a request already has a `shouldMatchSchema(...)` assertion for the same response, skip it.
- Placement: Insert the schema assertion immediately after the API request completes and before any other assertions that inspect the response body. This ensures schema errors are reported early and logs are attached.
- Use `async/await`: All inserted assertions must use the `await expect(...).shouldMatchSchema(dir, file)` pattern.
- File naming convention for schemas: `response-schemas/<resource>/<METHOD>_<resource>.json` or follow the existing naming patterns in the repo. Example: `response-schemas/booking/POST_booking.json`.
- Schema generation flag: If the caller requests generation of a new schema (see prompt param `generateIfMissing`), ensure the instruction indicates where to create the schema file and the naming convention. Creating the schema file itself is optional in automated runs — the default automated patch should insert the assertion only and leave schema generation as a separate step unless explicitly requested.

Matcher details
---------------
- Matcher: `shouldMatchSchema(dirName: string, fileName: string)`
  - `dirName` = the folder inside `response-schemas/` (e.g., `booking`)
  - `fileName` = the base name of the schema file without `.json` (e.g., `POST_booking`)
- Usage example:
  - `await expect(response).shouldMatchSchema('booking', 'POST_booking');`
- Implementation notes:
  - The custom matcher will validate the response body against the specified JSON Schema using the project's `schema-validator` helper. If the schema does not exist and `generateIfMissing` is true, the generator should be invoked (if available) to create a starter schema file. If no generator is available, the operator must create the schema manually.

Where to insert code
--------------------
- Insert the `await expect(...).shouldMatchSchema(...)` line immediately after the call that returns the parsed response object. Example:

```ts
const response = await api.path('booking').getRequest(200);
await expect(response).shouldMatchSchema('booking', 'GET_booking');
// other assertions after schema validation
```

Examples (copy-paste-ready)
---------------------------
- GET example:
```ts
const response = await api.path('booking/123').getRequest(200);
await expect(response).shouldMatchSchema('booking', 'GET_booking');
```

- POST example:
```ts
const response = await api.path('booking').body(payload).postRequest(200);
await expect(response).shouldMatchSchema('booking', 'POST_booking');
```

- PUT example:
```ts
const response = await api.path('booking/123').body(payload).putRequest(200);
await expect(response).shouldMatchSchema('booking', 'PUT_booking');
```

Edge cases & notes
------------------
- If a request returns a wrapper object rather than the resource (e.g., `{ data: {...} }`), adjust `shouldMatchSchema` to point to the correct schema and/or the relevant nested object. In such cases prefer normalizing the response in the test before asserting (e.g., `const body = response.data || response; await expect(body).shouldMatchSchema(...);`).
- If multiple requests happen in the same test, add schema assertions for each response you need to validate.
- If the schema file needs to be generated, do that in a follow-up PR so the schema can be reviewed.

Formatting rules
----------------
- Use `await` with `shouldMatchSchema`.
- Keep the schema assertion as a standalone statement on its own line.
- Use the project's existing naming convention for schema filenames.

Approval & automation
---------------------
- The instruction file is authoritative for automated prompts that add schema validations. Any automatic changes should present a patch or PR for human review before committing, unless explicitly allowed.

Contact
-------
If you need the generator implemented or want me to also create starter schema files, ask for `generate-schemas` and specify the scope (single file, folder, or whole repo).