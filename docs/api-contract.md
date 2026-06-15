# API Contract

## Base URL

```
/api/v1
```

---

# Reporters

## List Reporters

GET /reporters

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "location": "Jakarta",
      "availability": true,
      "ratePerMinute": 2000
    }
  ]
}
```

---

## Create Reporter

POST /reporters

### Request

```json
{
  "name": "Alice Johnson",
  "location": "Jakarta",
  "ratePerMinute": 2000
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "location": "Jakarta",
    "availability": true,
    "ratePerMinute": 2000
  }
}
```

`availability` defaults to `true` if omitted.

---

## Get Reporter

GET /reporters/:id

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "location": "Jakarta",
    "availability": true,
    "ratePerMinute": 2000
  }
}
```

---

# Editors

## List Editors

GET /editors

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Bob Smith",
      "flatFee": 50000
    }
  ]
}
```

---

## Create Editor

POST /editors

### Request

```json
{
  "name": "Bob Smith",
  "flatFee": 50000
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bob Smith",
    "flatFee": 50000
  }
}
```

---

## Get Editor

GET /editors/:id

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bob Smith",
    "flatFee": 50000
  }
}
```

---

# Jobs

## Create Job

POST /jobs

### Request

```json
{
  "caseName": "State vs Johnson",
  "durationMinutes": 90,
  "location": "Jakarta Court",
  "locationType": "physical"
}
```

`locationType` must be `"physical"` or `"remote"`.

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "caseName": "State vs Johnson",
    "durationMinutes": 90,
    "location": "Jakarta Court",
    "locationType": "physical",
    "status": "NEW",
    "reporterId": null,
    "editorId": null,
    "createdAt": "2026-06-15T10:00:00Z",
    "updatedAt": "2026-06-15T10:00:00Z"
  }
}
```

---

## List Jobs

GET /jobs?page=1&limit=20

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "caseName": "State vs Johnson",
      "durationMinutes": 90,
      "location": "Jakarta Court",
      "locationType": "physical",
      "status": "ASSIGNED",
      "reporterId": 1,
      "editorId": null,
      "createdAt": "2026-06-15T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

## Get Job

GET /jobs/:id

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "caseName": "State vs Johnson",
    "durationMinutes": 90,
    "location": "Jakarta Court",
    "locationType": "physical",
    "status": "ASSIGNED",
    "reporterId": 1,
    "editorId": null,
    "createdAt": "2026-06-15T10:00:00Z",
    "updatedAt": "2026-06-15T10:30:00Z"
  }
}
```

---

## Assign Reporter

POST /jobs/:id/assign-reporter

### Request

```json
{
  "reporterId": 1
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "ASSIGNED",
    "reporterId": 1
  }
}
```

### Rules

* For `locationType: "physical"`: reporter must be in the same location and available
* For `locationType: "remote"`: any available reporter can be assigned
* Sets job status to `ASSIGNED`

---

## Assign Editor

POST /jobs/:id/assign-editor

### Request

```json
{
  "editorId": 1
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "editorId": 1
  }
}
```

### Rules

* A reporter must be assigned before an editor can be assigned
* Review takes place after transcription is complete

---

## Update Status

PATCH /jobs/:id/status

### Request

```json
{
  "status": "TRANSCRIBED"
}
```

### Valid Transitions

Only sequential transitions are allowed:

```
NEW → ASSIGNED → TRANSCRIBED → REVIEWED → COMPLETED
```

Invalid transitions (e.g. `NEW → COMPLETED`, `ASSIGNED → REVIEWED`) return a `422 Unprocessable Entity` error.

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "TRANSCRIBED",
    "updatedAt": "2026-06-15T14:00:00Z"
  }
}
```

---

# Payments

## Calculate Payment

GET /jobs/:id/payment

### Response

```json
{
  "success": true,
  "data": {
    "reporterPayment": 180000,
    "editorPayment": 50000,
    "totalPayout": 230000
  }
}
```

---

# Error Response

```json
{
  "success": false,
  "message": "Job not found",
  "errors": null
}
```

### HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 404 | Resource not found |
| 422 | Unprocessable entity (e.g. invalid status transition, assignment rule violation) |
| 500 | Internal server error |
