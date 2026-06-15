# Database Design

## Entity Relationship Overview

Core entities:

* Job
* Reporter
* Editor

---

## Job

Represents a transcription request.

Fields:

| Field           | Type         | Notes                        |
| --------------- | ------------ | ---------------------------- |
| id              | Int (auto)   | Primary key                  |
| caseName        | String       |                              |
| durationMinutes | Int          |                              |
| location        | String       |                              |
| locationType    | Enum         | `physical` or `remote`       |
| status          | Enum         | See Status Enum below        |
| reporterId      | Int?         | Foreign key to Reporter      |
| editorId        | Int?         | Foreign key to Editor        |
| createdAt       | DateTime     | Auto-set on creation         |
| updatedAt       | DateTime     | Auto-set on every update     |

Relationships:

* belongs to Reporter (nullable)
* belongs to Editor (nullable)

---

## Reporter

Represents a court reporter responsible for transcription.

Fields:

| Field         | Type       | Notes                   |
| ------------- | ---------- | ----------------------- |
| id            | Int (auto) | Primary key             |
| name          | String     |                         |
| location      | String     | For location matching   |
| availability  | Boolean    | Default `true`          |
| ratePerMinute | Int        | Stored in IDR           |

Relationships:

* has many Jobs

---

## Editor

Represents a transcript reviewer.

Fields:

| Field   | Type       | Notes             |
| ------- | ---------- | ----------------- |
| id      | Int (auto) | Primary key       |
| name    | String     |                   |
| flatFee | Int        | Per-job, in IDR   |

Relationships:

* has many Jobs

---

## LocationType Enum

Available types:

* physical
* remote

Reason:

Drives assignment logic — physical jobs prefer reporters in the same location; remote jobs can be assigned to any available reporter.

---

## Status Enum

Available states:

* NEW
* ASSIGNED
* TRANSCRIBED
* REVIEWED
* COMPLETED

Reason:

Enums prevent invalid status values and simplify workflow validation.

---

## Payment Formula

Reporter Payment

```
payment = durationMinutes × ratePerMinute
```

Example:

```
90 × 2,000 = 180,000 IDR
```

Editor Payment

```
payment = flatFee
```

Example:

```
50,000 IDR
```

Total Payout

```
total = reporterPayment + editorPayment
```

Example:

```
180,000 + 50,000 = 230,000 IDR
```

---

## Future Improvements

* Audit logs
* Status history tracking
* File uploads
* Multi-review workflow
* User authentication
