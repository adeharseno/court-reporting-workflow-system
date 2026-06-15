# Court Reporting Workflow Manager

## Product Requirements Document (PRD)

### Version

1.0

### Objective

Build a simplified workflow management system for a court reporting agency to manage transcription jobs, reporter assignments, editor reviews, status tracking, and payment calculations.

---

# Problem Statement

Court reporting agencies receive audio recordings that need to be transcribed and reviewed before delivery.

The agency needs a system to:

* Create and manage transcription jobs
* Assign reporters to jobs
* Assign editors to review transcripts
* Track job progress
* Calculate payments for reporters and editors

---

# Scope

The system will support:

1. Job Management
2. Reporter Assignment
3. Editor Assignment
4. Workflow Tracking
5. Payment Calculation
6. Dashboard Monitoring

---

# Core Entities

## Job

Represents a transcription request.

### Fields

| Field            | Type              |
| ---------------- | ----------------- |
| id               | number            |
| case_name        | string            |
| duration_minutes | number            |
| location         | string            |
| location_type    | physical / remote |
| status           | enum              |
| reporter_id      | nullable          |
| editor_id        | nullable          |

### Initial Status

```text
NEW
```

---

## Reporter

Represents a court reporter responsible for transcription.

### Fields

| Field           | Type    |
| --------------- | ------- |
| id              | number  |
| name            | string  |
| location        | string  |
| availability    | boolean |
| rate_per_minute | number  |

---

## Editor

Represents a transcript reviewer.

### Fields

| Field    | Type   |
| -------- | ------ |
| id       | number |
| name     | string |
| flat_fee | number |

---

# Workflow

A job follows the workflow below:

```text
NEW
 ↓
ASSIGNED
 ↓
TRANSCRIBED
 ↓
REVIEWED
 ↓
COMPLETED
```

### Rules

Only valid transitions are allowed.

Allowed examples:

```text
NEW → ASSIGNED
ASSIGNED → TRANSCRIBED
TRANSCRIBED → REVIEWED
REVIEWED → COMPLETED
```

Invalid examples:

```text
NEW → COMPLETED
ASSIGNED → REVIEWED
```

---

# Reporter Assignment

A reporter can be assigned to a job.

### Assignment Rules

#### Physical Jobs

For jobs with location type `physical`:

* Prefer reporters in the same location
* Reporter must be available

#### Remote Jobs

For jobs with location type `remote`:

* Any available reporter can be assigned

### Result

Once a reporter is assigned, the job status becomes:

```text
ASSIGNED
```

---

# Editor Assignment

Editors review completed transcripts.

### Rules

* Editor can be assigned after a reporter has been assigned
* Review is performed after transcription is completed
* Once review is finished, status becomes:

```text
REVIEWED
```

---

# Payment Rules

## Reporter Payment

Reporter earnings are calculated based on audio duration.

Formula:

```text
duration_minutes × rate_per_minute
```

Example:

```text
120 × 2,000 IDR
=
240,000 IDR
```

---

## Editor Payment

Editors receive a fixed fee per job.

Example:

```text
50,000 IDR
```

---

## Total Payout

Formula:

```text
reporter_payment + editor_payment
```

Example:

```text
240,000 + 50,000
=
290,000 IDR
```

---

# API Requirements

## Create Job

```http
POST /api/jobs
```

Create a new transcription job.

---

## List Jobs

```http
GET /api/jobs
```

Retrieve all jobs.

---

## Assign Reporter

```http
POST /api/jobs/:id/assign-reporter
```

Assign a reporter to a job.

---

## Assign Editor

```http
POST /api/jobs/:id/assign-editor
```

Assign an editor to a job.

---

## Update Status

```http
PATCH /api/jobs/:id/status
```

Update the workflow status.

---

## Calculate Payment

```http
GET /api/jobs/:id/payment
```

Return reporter payment, editor payment, and total payout.

---

# User Interface Requirements

## Dashboard

Display a list of jobs containing:

* Case Name
* Duration
* Location
* Status
* Assigned Reporter
* Assigned Editor

### Actions

* Create Job
* Assign Reporter
* Assign Editor
* Update Status
* View Payment Summary

---

## Create Job Form

Fields:

* Case Name
* Duration (minutes)
* Location
* Location Type

---

## Job Detail View

Display:

### Job Information

* Case Name
* Duration
* Location
* Status

### Assignment Information

* Reporter
* Editor

### Payment Summary

* Reporter Earnings
* Editor Earnings
* Total Payout

---

# Technical Requirements

### Backend

* Node.js
* TypeScript
* REST API

### Database

* PostgreSQL (preferred)
* SQLite (acceptable)

### Frontend

* React
* TypeScript

---

# Out of Scope

The following features are not included in this version:

* Authentication & Authorization
* File Upload
* Email Notifications
* Real Payment Processing
* Automatic Speech-to-Text Transcription
