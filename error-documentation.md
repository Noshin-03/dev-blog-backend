# Error Classes Usage Patterns

## Class Hierarchy

```
AppError (abstract base)
├── NotFoundError(404)
├── ValidationError(400)
├── ConflictError(409)
├── UnauthorizedError(401)
├── ForbiddenError(403)
└── DatabaseError(500)
```


## `NotFoundError` — 404
```ts
// When a resource doesn't exist or is soft-deleted
throw new NotFoundError('User not found');
```
Response:
```json
{ 
  "status": "error", 
  "errors": [{ "message": "User not found" }] 
}
```


## `ValidationError` — 400
```ts
// Single message
throw new ValidationError('Invalid input');

// Multiple field errors (e.g. from Zod)
throw new ValidationError('Validation failed', [
  { message: 'Username too short', context: { field: 'username' } },
  { message: 'Invalid email', context: { field: 'email' } },
]);

```
Response:
```json
{
  "status": "error",
  "errors": [
    { "message": "Username too short", "context": { "field": "username" } },
    { "message": "Invalid email", "context": { "field": "email" } }
  ]
}
```


## `ConflictError` — 409
```ts
// When data conflicts with existing records
throw new ConflictError('Email already in use');

```
Response:
```json
{ 
  "status": "error", 
  "errors": [{ "message": "Email already in use" }] 
}
```


## `UnauthorizedError` — 401
```ts
// When user is not authenticated — ready for Issue #10
throw new UnauthorizedError('Token has expired');

```
Response:
```json
{ 
  "status": "error", 
  "errors": [{ "message": "Token has expired" }] 
}
```


## `ForbiddenError` — 403
```ts
// When authenticated user lacks permission — ready for Issue #10
throw new ForbiddenError('Admin access required');

```
Response:
```json
{ 
  "status": "error", 
  "errors": [{ "message": "Admin access required" }] 
}
```


## `DatabaseError` — 500
```ts
// Unexpected DB failure — real message never sent to client, only logged
throw new DatabaseError();

```
Response:
```json
{ 
  "status": "error", 
  "errors": [{ "message": "A database error occurred" }] 
}
```

## Quick reference

| Situation | Error to use |
|---|---|
| Resource doesn't exist | `NotFoundError` |
| Bad input format/length | `ValidationError` |
| Duplicate email/username | `ConflictError` |
| No token / token expired | `UnauthorizedError` |
| Wrong role/permission | `ForbiddenError` |
| Unexpected DB failure | `DatabaseError` |
