<p align="center">
  <h1 align="center">EduCore — Backend API</h1>
  <p align="center">
    A production-grade, multi-tenant <strong>School Management SaaS</strong> backend engineered for the Kenyan education ecosystem.
    <br />
    <em>From ECDE to University — one unified digital infrastructure.</em>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/ORM-Drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" alt="Drizzle" />
  <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Queue-BullMQ-E8524A?style=for-the-badge" alt="BullMQ" />
  <img src="https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge" alt="License" />
</p>

---

## Table of Contents

- [Product Overview](#product-overview)
- [System Scope](#system-scope)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Multi-Tenant Architecture](#multi-tenant-architecture)
- [Backend Services](#backend-services)
  - [Identity Service](#identity-service)
  - [Student Registry Service](#student-registry-service)
  - [Finance Engine — M-Pesa Integration](#finance-engine--m-pesa-integration)
  - [CBC Academic Engine](#cbc-academic-engine)
  - [Higher Education Engine](#higher-education-engine)
  - [Exeat Workflow System](#exeat-workflow-system)
  - [Communication Gateway](#communication-gateway)
  - [Notification System](#notification-system)
  - [Security Module](#security-module)
  - [Library System](#library-system)
- [Government Integrations](#government-integrations)
- [Background Job Processing](#background-job-processing)
- [Event Driven Architecture](#event-driven-architecture)
- [Database Migrations](#database-migrations)
- [Object Storage](#object-storage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Scaling Strategy](#scaling-strategy)
- [Security](#security)
- [Legal & Compliance](#legal--compliance)
- [Implementation Roadmap](#implementation-roadmap)
- [License](#license)

---

## Product Overview

**EduCore** is a unified digital infrastructure for Kenyan learners — from ECDE to University — integrated with national identity systems like **Maisha Namba**.

### Vision

Deliver a single, sovereign platform that every Kenyan school can adopt to digitize operations, comply with government regulations, and give parents real-time visibility into their child's academic and financial records — even offline.

### Target Users

| Segment | Curriculum | Key Features |
|---|---|---|
| **K-12 Schools** | CBC (Competency Based Curriculum) | Performance levels, strand assessments, 70/30 weighting |
| **Universities** | Credit Hours | GPA transcripts, course registration, graduation clearance |
| **TVETs** | Hybrid | Competency tracking, industrial attachment management |

### Value Proposition

- **Instant fee reconciliation** via M-Pesa Daraja 3.0 — payments credit student ledgers in real-time.
- **CBC assessment automation** — strand/sub-strand grading with formative and summative weighting.
- **Offline accessibility** — parents query balances and results via USSD (`*483#`), no internet required.
- **Institutional sovereignty** — each school owns its data in a fully isolated database.

---

## System Scope

### Core Modules

| Module | Description |
|---|---|
| **Finance** | Fee management, M-Pesa STK Push, vote-head accounting, KRA eTIMS invoicing |
| **Academic (CBC)** | Strand-based assessments, performance levels, report cards |
| **Academic (Uni)** | Credit hours, GPA calculation, transcripts, graduation clearance |
| **Registry (KEMIS)** | Student lifecycle, transfers, Maisha Namba integration |
| **Boarding** | Exeat workflows, visitor OTP verification, dormitory management |
| **HR / Payroll** | Staff records, payroll processing, statutory deductions |
| **Communication** | SMS, USSD, email, push notification channels |
| **Library** | Inventory, borrowing lifecycle, overdue tracking |
| **Security** | Gate pass, visitor management, CCTV integration hooks |
| **Logistics** | Transport, procurement, asset tracking |

### Platform Features

- Multi-tenant database isolation (Database-per-Tenant)
- Phone OTP authentication
- USSD offline queries via Africa's Talking
- Real-time M-Pesa payment reconciliation
- Government data bridge (KEMIS, KRA eTIMS, SHA)

---

## System Architecture

EduCore follows a **Silo (Database-per-Tenant) architecture** to ensure **Institutional Sovereignty** and strict compliance with the **Kenya Data Protection Act 2019**.

A single Node.js API instance acts as a dynamic **tenant router** for multiple isolated PostgreSQL databases.

```
                    ┌─────────────────────────────┐
                    │        Client Request        │
                    │  greenhill.educore.co.ke/api  │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │        API Gateway           │
                    │   (Rate Limiting, CORS)      │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      Tenant Resolver         │
                    │  Subdomain / JWT / Header    │
                    └──────────────┬──────────────┘
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
               ┌──────────────┐   ┌──────────────┐
               │  Landlord DB │   │ AsyncLocal    │
               │  (Metadata)  │   │ Storage Ctx   │
               └──────┬───────┘   └──────┬────────┘
                      │                   │
                      ▼                   ▼
               ┌──────────────────────────────────┐
               │     Tenant Database Connection    │
               │         (via PgBouncer)           │
               └──────────────┬───────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │  Tenant DB   │    │  Tenant DB   │
          │ (GreenHill)  │    │  (Sunrise)   │
          └──────────────┘    └──────────────┘
```

### How Tenant Resolution Works

1. **Identity Resolution** — Incoming requests are inspected via subdomain or JWT claims to resolve the `tenantId`.
2. **AsyncLocalStorage Context** — The resolved `tenantId` and its specific PostgreSQL connection pool are stored in Node.js `AsyncLocalStorage`. Every database query within the request lifecycle is automatically scoped to the correct school — no manual parameter passing required.
3. **Connection Pooling** — **PgBouncer** is deployed in transaction mode to prevent connection starvation at scale. The backend pool size is optimized (~25 connections per pod) to balance availability with database efficiency.

Each school operates on its **own isolated PostgreSQL database**, ensuring:

- ✅ Strict tenant data isolation
- ✅ Independent backups and disaster recovery
- ✅ Performance stability during peak operations (e.g., exam results release)
- ✅ Regulatory compliance with the Kenya Data Protection Act 2019

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Runtime** | Node.js | Server-side JavaScript execution |
| **Language** | TypeScript | Type-safe development |
| **Framework** | Express / Fastify | HTTP request handling |
| **ORM** | Drizzle ORM | Lightweight, SQL-like control over multi-database migrations |
| **Database** | PostgreSQL | Primary data store (one per tenant) |
| **Connection Pool** | PgBouncer | Transaction-mode pooling to prevent connection starvation |
| **Cache** | Redis | Session store, rate limiting, pub/sub |
| **Queue System** | BullMQ | Async job processing (payments, SMS, reports) |
| **Object Storage** | AWS S3 / Cloudflare R2 | Documents, CBC evidence media, transcripts |
| **Authentication** | Phone OTP | Phone-first login for Kenyan users |
| **Messaging** | Africa's Talking | SMS, USSD gateway |
| **Payments** | Safaricom Daraja 3.0 | M-Pesa STK Push, C2B callbacks |
| **Tax Compliance** | KRA eTIMS API | Tax-compliant invoice generation |
| **Health Insurance** | SHA API | UHC eligibility verification |
| **Frontend** | Next.js 15+ | Administrative portals (separate repo) |
| **Mobile** | React Native (Expo) | Parent/student mobile apps (separate repo) |

---

## Multi-Tenant Architecture

EduCore uses a **Landlord Database** that stores tenant metadata and connection routing information.

### Landlord Database Schema

```sql
-- Landlord (Central) Database
CREATE TABLE schools (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    subdomain       VARCHAR(63) UNIQUE NOT NULL,
    database_url    TEXT NOT NULL,
    status          VARCHAR(20) DEFAULT 'active',
    plan            VARCHAR(20) DEFAULT 'standard',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE school_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id       UUID REFERENCES schools(id),
    mpesa_shortcode VARCHAR(20),
    mpesa_key       TEXT,
    mpesa_secret    TEXT,
    at_username     VARCHAR(100),    -- Africa's Talking
    at_api_key      TEXT,
    sha_enabled     BOOLEAN DEFAULT FALSE,
    etims_enabled   BOOLEAN DEFAULT FALSE
);
```

### Tenant Registry Example

| School | Subdomain | Database URL | Status |
|---|---|---|---|
| GreenHill School | `greenhill` | `postgres://tenant_greenhill` | Active |
| Sunrise Academy | `sunrise` | `postgres://tenant_sunrise` | Active |
| Mwangaza TVET | `mwangaza` | `postgres://tenant_mwangaza` | Provisioning |

### Tenant Resolution Sequence

```
1. User visits https://greenhill.educore.co.ke/api/students

2. Middleware extracts subdomain → "greenhill"

3. System queries landlord registry:
   SELECT database_url FROM schools WHERE subdomain = 'greenhill'

4. AsyncLocalStorage stores tenant context for request lifecycle

5. Connection pool is created/retrieved for tenant database

6. All subsequent queries automatically route to tenant_greenhill DB

7. Response returned — zero cross-tenant contamination
```

---

## Backend Services

### Identity Service

Handles authentication and authorization with a phone-first approach designed for Kenyan users.

**Features**
- Phone-first login with OTP verification
- Role-based access control (RBAC)
- JWT token management with refresh rotation
- Session management via Redis

**Roles**

| Role | Access Level |
|---|---|
| `SUPER_ADMIN` | Platform-wide (Landlord operations) |
| `ADMIN` | School-wide administrative access |
| `PRINCIPAL` | Academic and operational oversight |
| `TEACHER` | Class and assessment management |
| `ACCOUNTANT` | Finance module access |
| `PARENT` | Student records and fee balances |
| `STUDENT` | Personal academic records |
| `SECURITY` | Gate pass and visitor management |
| `LIBRARIAN` | Library module access |

**Endpoints**

```http
POST   /auth/request-otp          # Request OTP to phone number
POST   /auth/verify-otp           # Verify OTP and receive JWT
POST   /auth/refresh-token        # Rotate refresh token
POST   /auth/logout               # Invalidate session
GET    /auth/me                   # Get current user profile
```

---

### Student Registry Service

Manages the complete student lifecycle from admission to graduation or transfer.

**Functions**
- Student admission and enrollment
- Class and stream allocation
- Inter-school transfers (linked to KEMIS)
- Guardian linking and management
- Document management (birth cert, Maisha Namba)
- Student discharge and alumni tracking

**Endpoints**

```http
GET    /students                  # List students (paginated, filterable)
POST   /students                  # Admit new student
GET    /students/:id              # Get student profile
PATCH  /students/:id              # Update student record
DELETE /students/:id              # Soft-delete / discharge student
POST   /students/:id/transfer     # Initiate inter-school transfer
GET    /students/:id/guardians    # List linked guardians
POST   /students/:id/guardians    # Link guardian to student
POST   /students/:id/documents    # Upload student document
```

**Student DTO Example**

```typescript
interface CreateStudentDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;           // ISO 8601
  gender: 'male' | 'female';
  maishaNambaUPI?: string;       // National Unique Personal Identifier
  admissionNumber: string;
  classId: string;
  streamId?: string;
  boardingStatus: 'day' | 'boarding';
  guardian: {
    name: string;
    phone: string;               // E.164 format: +254XXXXXXXXX
    relationship: string;
  };
}
```

---

### Finance Engine — M-Pesa Integration

Handles school fee payments with real-time M-Pesa reconciliation via **Safaricom Daraja 3.0 API**.

**Capabilities**
- STK Push payment initiation
- Automatic callback reconciliation
- Vote-head accounting (tuition, boarding, activity, transport)
- Fee balance tracking per student
- Payment receipting
- Bulk fee structure configuration

**M-Pesa STK Push Flow**

```
┌──────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  Parent   │     │  EduCore API │     │ Safaricom     │     │   Tenant DB  │
│  (Phone)  │     │              │     │ Daraja 3.0    │     │              │
└─────┬────┘     └──────┬───────┘     └───────┬───────┘     └──────┬───────┘
      │                 │                      │                    │
      │  1. Pay Fees    │                      │                    │
      │────────────────▶│                      │                    │
      │                 │  2. generateToken()  │                    │
      │                 │─────────────────────▶│                    │
      │                 │  3. OAuth2 Token     │                    │
      │                 │◀─────────────────────│                    │
      │                 │  4. STK Push Request │                    │
      │                 │─────────────────────▶│                    │
      │  5. PIN Prompt  │                      │                    │
      │◀───────────────────────────────────────│                    │
      │  6. Enter PIN   │                      │                    │
      │────────────────────────────────────────▶                    │
      │                 │  7. Callback (POST)  │                    │
      │                 │◀─────────────────────│                    │
      │                 │  8. Parse BillRefNumber (Student ID)      │
      │                 │  9. Parse MpesaReceiptNumber              │
      │                 │  10. Credit Student Ledger                │
      │                 │──────────────────────────────────────────▶│
      │  11. SMS Receipt│                      │                    │
      │◀────────────────│                      │                    │
      └                 └                      └                    └
```

**Authentication Flow**

The backend implements a `generateToken` middleware that requests an OAuth2 access token from Safaricom using the school's unique Consumer Key/Secret (stored in the Landlord DB per tenant).

**Endpoints**

```http
POST   /payments/stk-push              # Initiate STK Push to parent phone
POST   /payments/mpesa-callback         # Safaricom callback URL (secured)
GET    /payments/student/:id            # Get student payment history
GET    /payments/student/:id/balance    # Get student fee balance
POST   /payments/fee-structure          # Configure fee structure
GET    /payments/reconciliation-report  # Generate reconciliation report
```

---

### CBC Academic Engine

Supports the **Competency Based Curriculum (CBC)** framework mandated by the Kenya Institute of Curriculum Development (KICD).

**Assessment Structure**

```
Total Grade Composition
├── Formative Assessment ────── 70%
│   ├── Classwork
│   ├── Projects
│   ├── Portfolios
│   └── Practical Tasks
│
└── Summative Assessment ────── 30%
    ├── End of Term Exams
    └── Standardized Tests
```

**Performance Levels**

| Level | Description | Indicator |
|---|---|---|
| **1** | Below Expectation | 🔴 Needs significant support |
| **2** | Approaching Expectation | 🟡 Developing understanding |
| **3** | Meeting Expectation | 🟢 On track |
| **4** | Exceeding Expectation | 🔵 Advanced mastery |

**Strand / Sub-Strand Assessment Model**

```typescript
interface CBCAssessment {
  studentId: string;
  subjectId: string;
  strand: string;              // e.g., "Number Operations"
  subStrand: string;           // e.g., "Whole Numbers"
  performanceLevel: 1 | 2 | 3 | 4;
  assessmentType: 'formative' | 'summative';
  rubricNotes?: string;
  evidenceUrl?: string;        // Link to CBC evidence media (S3/R2)
  assessedBy: string;          // Teacher ID
  assessedAt: string;          // ISO 8601
}
```

**Endpoints**

```http
POST   /assessments                    # Submit assessment
GET    /assessments/student/:id        # Get student assessments
GET    /assessments/class/:id          # Get class-wide assessments
GET    /assessments/report-card/:id    # Generate CBC report card
POST   /assessments/bulk               # Bulk assessment submission
```

---

### Higher Education Engine

Supports **credit-hour based** academic management for universities and TVETs.

**Features**
- Course registration with credit hour limits
- GPA and CGPA calculation (4.0 scale)
- Academic transcript generation
- Graduation clearance workflows
- Prerequisite enforcement
- Academic probation tracking

**Endpoints**

```http
POST   /courses/register               # Register for courses
GET    /transcripts/student/:id        # Generate academic transcript
POST   /graduation/clearance/:id       # Initiate graduation clearance
GET    /academic-standing/:id          # Check academic standing / GPA
```

---

### Exeat Workflow System

Multi-step digital approval system for boarding schools managing student gate passes.

**Approval Chain**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Student     │     │    Parent     │     │  Principal    │     │   Security   │
│   Request     │────▶│   Approval   │────▶│   Approval   │────▶│ Verification │
│              │     │   (SMS OTP)   │     │  (Dashboard)  │     │  (Gate Scan) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Features**
- Digital exeat request submission
- Parent approval via SMS OTP
- Principal review and authorization
- Security guard gate verification
- Automatic return tracking
- Visitor management with OTP-verified guest entry

**Endpoints**

```http
POST   /exeat/request                  # Submit exeat request
POST   /exeat/approve/:id             # Approve exeat (parent/principal)
POST   /exeat/verify/:id              # Security gate verification
GET    /exeat/status/:id              # Check exeat status
GET    /exeat/active                   # List all active exeats
POST   /visitors/register             # Register visitor (OTP issued)
POST   /visitors/verify/:id           # Verify visitor at gate
```

---

### Communication Gateway

Powered by **Africa's Talking** for SMS and USSD services.

**USSD Flow**

The backend handles HTTP POST requests from Africa's Talking for USSD strings (e.g., `*483#`). It queries the tenant's database to return a `text/plain` response for offline balance or result inquiries in under **10 seconds**.

```
Parent dials *483#
       │
       ▼
┌─────────────────┐
│  1. Welcome      │
│  Select Service  │
│  1. Fee Balance  │
│  2. Results      │
│  3. Attendance   │
└────────┬────────┘
         │ User selects "1"
         ▼
┌─────────────────┐
│  Enter Student   │
│  Admission No.   │
└────────┬────────┘
         │ User enters ID
         ▼
┌─────────────────┐
│  Fee Balance:    │
│  KES 12,500      │
│  Last Payment:   │
│  KES 5,000       │
│  (02/03/2026)    │
└─────────────────┘
```

**Endpoints**

```http
POST   /ussd/callback                  # Africa's Talking USSD callback
POST   /sms/send                       # Send single SMS
POST   /sms/bulk                       # Send bulk SMS
GET    /communication/logs             # Message delivery logs
```

---

### Notification System

Centralized messaging bus for all system events.

**Channels**

| Channel | Use Case | Provider |
|---|---|---|
| SMS | Fee reminders, results, exeat approvals | Africa's Talking |
| Email | Formal communications, reports | SMTP / SendGrid |
| Push | Real-time dashboard alerts | Firebase / OneSignal |
| USSD | Offline queries | Africa's Talking |

**Event-Driven Triggers**

| Event | SMS | Email | Push |
|---|---|---|---|
| `student.fee_paid` | ✅ Parent | ✅ School Accounts | ✅ Admin Dashboard |
| `assessment.submitted` | ✅ Parent | — | ✅ Teacher Dashboard |
| `exeat.approved` | ✅ Parent | — | ✅ Security |
| `payment.overdue` | ✅ Parent | ✅ Parent | ✅ Accountant |

---

### Security Module

Manages physical security operations at the school level.

**Features**
- Gate access logging
- Visitor registration and OTP verification
- CCTV integration hooks
- Incident reporting
- Emergency alert broadcasting

**Endpoints**

```http
POST   /security/gate-log              # Log gate entry/exit
GET    /security/gate-log/today        # Today's gate activity
POST   /security/incidents             # Report incident
GET    /security/incidents             # List incidents
```

---

### Library System

Manages the school library inventory and borrowing lifecycle.

**Features**
- Book inventory management
- ISBN scanning and cataloging
- Borrowing and return tracking
- Overdue notifications
- Reservation system
- Library card management

**Endpoints**

```http
GET    /library/books                   # Browse catalog
POST   /library/books                   # Add book to inventory
POST   /library/borrow                  # Borrow a book
POST   /library/return/:id             # Return a book
GET    /library/overdue                 # List overdue books
```

---

## Government Integrations

EduCore is designed for full compliance with Kenyan government systems.

### KRA eTIMS — Tax Compliance

The finance module uses the **KRA Enterprise API** to generate compliant tax invoices for fees and vendor payments.

| Mode | Description |
|---|---|
| **OSCU** (Online Sales Control Unit) | Real-time invoice generation |
| **VSCU** (Virtual Sales Control Unit) | Bulk invoice handling |

```http
POST   /etims/invoice                  # Generate eTIMS invoice
GET    /etims/invoice/:id              # Retrieve invoice status
POST   /etims/bulk-invoice             # Bulk invoice generation
```

### KEMIS — National Student Registry

Data models are mapped to **KEMIS standards** for government reporting.

- **Learner Identity**: Adopts **Maisha Namba** as a lifelong Unique Personal Identifier (UPI)
- **Learner Mobility**: Real-time tracking of inter-school transfers
- **Capitation Reporting**: Automated reports to the Ministry of Education

```http
POST   /kemis/sync                     # Sync student data with KEMIS
GET    /kemis/reports                   # Generate KEMIS compliance reports
POST   /kemis/transfer-notification    # Notify KEMIS of student transfer
```

### SHA — Social Health Authority

The sanitarium module integrates with the **SHA API** for medical cover verification.

Using the student's **Unique Personal Identifier (UPI)**, the backend performs real-time eligibility checks for **Universal Health Coverage (UHC)** benefits.

```http
GET    /sha/eligibility/:upi           # Check UHC eligibility
GET    /sha/benefits/:upi              # List available benefits
```

---

## Background Job Processing

**BullMQ + Redis** process asynchronous tasks to ensure API responsiveness during peak traffic.

### Job Queues

| Queue | Worker | Description |
|---|---|---|
| `payment-reconciliation` | `paymentWorker.ts` | Process M-Pesa callbacks, credit ledgers |
| `notification-dispatch` | `notificationWorker.ts` | Bulk SMS, email, push notifications |
| `report-generation` | `reportWorker.ts` | Generate report cards, transcripts, financial reports |
| `file-processing` | `fileWorker.ts` | Process uploaded documents, CBC evidence media |
| `kemis-sync` | `kemisSyncWorker.ts` | Sync data with government KEMIS registry |

### Worker Architecture

```
Redis (Queue Broker)
       │
       ├── payment-reconciliation-queue
       │         └── paymentWorker.ts
       │
       ├── notification-dispatch-queue
       │         └── notificationWorker.ts
       │
       ├── report-generation-queue
       │         └── reportWorker.ts
       │
       ├── file-processing-queue
       │         └── fileWorker.ts
       │
       └── kemis-sync-queue
                 └── kemisSyncWorker.ts
```

---

## Event Driven Architecture

System events trigger background processing across the platform.

### Core Events

| Event | Triggered By | Actions |
|---|---|---|
| `student.created` | Student admission | KEMIS sync, welcome SMS to parent |
| `student.transferred` | Inter-school transfer | KEMIS notification, record migration |
| `payment.received` | M-Pesa callback | Ledger update, receipt SMS, dashboard alert |
| `payment.overdue` | Scheduled cron job | Reminder SMS to parent, accountant alert |
| `assessment.submitted` | Teacher assessment entry | Parent notification, report card update |
| `exeat.approved` | Principal approval | Parent SMS, security gate notification |
| `exeat.returned` | Security scan | Update boarding records |

---

## Database Migrations

EduCore runs Drizzle ORM migrations **across all tenant databases** from a centralized migration runner.

### Migration Command

```bash
npm run migrate:all
```

### Migration Process

```
┌─────────────────┐
│   Landlord DB    │
│                  │
│  Fetch all       │
│  active tenants  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  For each tenant │
│                  │
│  1. Connect to   │
│     tenant DB    │
│  2. Apply Drizzle│
│     migrations   │
│  3. Update schema│
│     version      │
│  4. Log result   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Migration       │
│  Summary Report  │
│                  │
│  ✅ greenhill    │
│  ✅ sunrise      │
│  ❌ mwangaza    │
│     (retry once) │
└─────────────────┘
```

---

## Object Storage

Files are stored **outside the database** in cloud object storage for performance and scalability.

### Stored Assets

| Asset Type | Examples | Bucket |
|---|---|---|
| Student Documents | Birth certificates, Maisha Namba ID, passport photos | `educore-documents` |
| CBC Evidence Media | Project photos, portfolio PDFs, video evidence | `educore-cbc-media` |
| Academic Reports | Transcripts, report cards, bulk report exports | `educore-reports` |
| Financial Documents | Fee receipts, eTIMS invoices, audit reports | `educore-finance` |

### Supported Providers

- **AWS S3** — Primary storage
- **Cloudflare R2** — Cost-effective alternative with S3-compatible API

---

## Project Structure

```
src/
├── app.ts                             # Application entry point
│
├── modules/
│   ├── common/                        # Shared utilities and middleware
│   │   ├── constants/
│   │   │   └── role.constants.ts      # Role definitions (RBAC)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # JWT verification & OTP auth
│   │   │   ├── error.handler.ts       # Global error handling
│   │   │   └── role.middleware.ts      # Role-based access guard
│   │   └── utils/
│   │       ├── logger.ts              # Structured logging (Pino/Winston)
│   │       └── response.util.ts       # Standardized API response format
│   │
│   ├── communication/                 # SMS, USSD, notifications
│   │   ├── communication.controller.ts
│   │   ├── communication.routes.ts
│   │   └── communication.service.ts
│   │
│   ├── finance/                       # M-Pesa, fee management, eTIMS
│   │   ├── finance.controller.ts
│   │   ├── finance.routes.ts
│   │   └── finance.service.ts
│   │
│   ├── kemis/                         # Government KEMIS integration
│   │   ├── kemis.client.ts            # KEMIS API HTTP client
│   │   └── kemis.service.ts
│   │
│   ├── library/                       # Library management
│   │   ├── library.client.ts
│   │   └── library.service.ts
│   │
│   ├── results/                       # Academic results & reporting
│   │   └── reports/
│   │       ├── report.controller.ts
│   │       ├── report.routes.ts
│   │       └── report.service.ts
│   │
│   ├── security/                      # Gate pass, visitor mgmt
│   │   ├── security.controller.ts
│   │   ├── security.routes.ts
│   │   └── security.service.ts
│   │
│   ├── students/                      # Student registry lifecycle
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts
│   │   │   └── update-students.dto.ts
│   │   ├── types/
│   │   │   └── students.interface.ts
│   │   ├── student.controller.ts
│   │   ├── student.modules.ts
│   │   ├── student.repository.ts
│   │   ├── student.routes.ts
│   │   └── student.service.ts
│   │
│   └── teacher/                       # Teacher management
│       └── roles/
│           └── teacher.role.service.ts
│
├── infrastructure/                    # Cross-cutting infrastructure (planned)
│   ├── database/                      # Drizzle ORM setup, migrations
│   ├── redis/                         # Redis client configuration
│   └── queues/                        # BullMQ queue definitions
│
├── tenant/                            # Multi-tenant core (planned)
│   ├── tenantResolver.ts              # Subdomain / JWT tenant resolution
│   └── connectionManager.ts           # Dynamic connection pool management
│
└── workers/                           # Background job processors (planned)
    ├── paymentWorker.ts               # M-Pesa reconciliation worker
    ├── notificationWorker.ts          # SMS/Email/Push dispatch worker
    ├── reportWorker.ts                # Report generation worker
    ├── fileWorker.ts                  # File processing worker
    └── kemisSyncWorker.ts             # KEMIS data sync worker
```

> **Note:** Directories marked `(planned)` are part of the architectural blueprint and will be implemented in upcoming milestones. The `modules/` directory reflects the current codebase structure.

---

## Environment Variables

### Required Configuration

Create a `.env` file in the project root:

```bash
# ──────────────────────────────────────────────
# Server
# ──────────────────────────────────────────────
NODE_ENV=development
PORT=3000
API_BASE_URL=https://api.educore.co.ke

# ──────────────────────────────────────────────
# Landlord Database (Central Tenant Registry)
# ──────────────────────────────────────────────
LANDLORD_DATABASE_URL=postgres://user:password@localhost:5432/educore_landlord

# ──────────────────────────────────────────────
# Redis (Cache + Queue Broker)
# ──────────────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ──────────────────────────────────────────────
# M-Pesa Daraja 3.0 (Safaricom)
# ──────────────────────────────────────────────
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
MPESA_CALLBACK_URL=https://api.educore.co.ke/payments/mpesa-callback
MPESA_ENVIRONMENT=sandbox          # sandbox | production

# ──────────────────────────────────────────────
# Africa's Talking (SMS + USSD)
# ──────────────────────────────────────────────
AFRICAS_TALKING_API_KEY=
AFRICAS_TALKING_USERNAME=
AFRICAS_TALKING_SENDER_ID=

# ──────────────────────────────────────────────
# Object Storage (AWS S3 / Cloudflare R2)
# ──────────────────────────────────────────────
STORAGE_PROVIDER=s3                # s3 | r2
AWS_S3_BUCKET=educore-documents
AWS_REGION=af-south-1              # Cape Town region
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# ──────────────────────────────────────────────
# KRA eTIMS (Tax Compliance)
# ──────────────────────────────────────────────
ETIMS_API_URL=
ETIMS_API_KEY=
ETIMS_TIN=

# ──────────────────────────────────────────────
# SHA (Social Health Authority)
# ──────────────────────────────────────────────
SHA_API_URL=
SHA_API_KEY=

# ──────────────────────────────────────────────
# KEMIS (Government Student Registry)
# ──────────────────────────────────────────────
KEMIS_API_URL=
KEMIS_API_KEY=

# ──────────────────────────────────────────────
# JWT / Authentication
# ──────────────────────────────────────────────
JWT_SECRET=
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# ──────────────────────────────────────────────
# Logging
# ──────────────────────────────────────────────
LOG_LEVEL=debug                    # debug | info | warn | error
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 15.x
- **Redis** >= 7.x
- **PgBouncer** (recommended for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/CipherRax/CBC--School-Management-Sytem-API.git

# Navigate to project directory
cd CBC--School-Management-Sytem-API

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration values
```

### Running the Application

```bash
# Run development server (with hot reload)
npm run dev

# Run database migrations (all tenants)
npm run migrate:all

# Start background workers
npm run workers

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm run start
```

---

## API Reference

All endpoints are prefixed with the API version: `/api/v1`

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/request-otp` | Request OTP |
| `POST` | `/auth/verify-otp` | Verify OTP |
| `POST` | `/auth/refresh-token` | Refresh JWT |
| `POST` | `/auth/logout` | Logout |

### Students
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/students` | List students |
| `POST` | `/students` | Admit student |
| `GET` | `/students/:id` | Get student |
| `PATCH` | `/students/:id` | Update student |
| `DELETE` | `/students/:id` | Discharge student |

### Finance
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/payments/stk-push` | Initiate M-Pesa payment |
| `POST` | `/payments/mpesa-callback` | M-Pesa callback |
| `GET` | `/payments/student/:id` | Payment history |
| `GET` | `/payments/student/:id/balance` | Fee balance |

### Assessments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/assessments` | Submit assessment |
| `GET` | `/assessments/student/:id` | Student assessments |
| `GET` | `/assessments/report-card/:id` | Generate report card |

### Exeat
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/exeat/request` | Request exeat |
| `POST` | `/exeat/approve/:id` | Approve exeat |
| `POST` | `/exeat/verify/:id` | Gate verification |
| `GET` | `/exeat/status/:id` | Check status |

### Communication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ussd/callback` | USSD callback |
| `POST` | `/sms/send` | Send SMS |
| `POST` | `/sms/bulk` | Bulk SMS |

### Government
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/etims/invoice` | Generate eTIMS invoice |
| `POST` | `/kemis/sync` | Sync with KEMIS |
| `GET` | `/sha/eligibility/:upi` | Check SHA eligibility |

> 📖 **Full API documentation** will be available via **Swagger / OpenAPI** at `/api/docs` once the OpenAPI spec is implemented.

---

## Scaling Strategy

EduCore is designed for high tenant growth with horizontal scaling at every layer.

```
                        Load Balancer
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │ API Pod  │   │ API Pod  │   │ API Pod  │    Stateless
         │   #1     │   │   #2     │   │   #3     │    API Servers
         └────┬─────┘   └────┬─────┘   └────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌─────────┐   ┌─────────┐   ┌─────────┐
         │  Redis   │   │PgBouncer│   │   CDN    │
         │ Cluster  │   │  Pool   │   │  (R2)    │
         └─────────┘   └────┬────┘   └─────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌─────────┐  ┌─────────┐  ┌─────────┐
         │Tenant DB│  │Tenant DB│  │Tenant DB│     Per-Tenant
         │  #1     │  │  #2     │  │  #N     │     Isolation
         └─────────┘  └─────────┘  └─────────┘
```

### Scaling Layers

| Layer | Strategy |
|---|---|
| **API Servers** | Stateless horizontal scaling behind load balancer |
| **Databases** | One PostgreSQL instance per tenant; sharding by tenant |
| **Redis** | Cluster mode for cache and queue broker |
| **Workers** | Independent BullMQ worker pods, auto-scaled by queue depth |
| **Storage** | CDN-backed object storage (Cloudflare R2 / S3) |
| **Provisioning** | Automated database provisioning via "Landlord" API for new schools |

---

## Security

### Defense in Depth

| Layer | Mechanism |
|---|---|
| **Tenant Isolation** | Database-per-tenant — zero cross-tenant data leakage |
| **Authentication** | Phone OTP + JWT with refresh token rotation |
| **Authorization** | Role-based access control (RBAC) per module |
| **Data in Transit** | TLS 1.3 enforced on all endpoints |
| **Data at Rest** | AES-256 encrypted database volumes |
| **Audit Trail** | Tamper-proof logs: who, when, what for every data mutation |
| **Rate Limiting** | Per-tenant API rate limits to prevent abuse |
| **Input Validation** | DTO validation on all incoming payloads |
| **SQL Injection** | Parameterized queries via Drizzle ORM |
| **CORS** | Strict origin whitelisting per tenant subdomain |

### Audit Trail Schema

Every data mutation across all tenant databases is recorded:

```typescript
interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;              // e.g., "student", "payment"
  entityId: string;
  previousValue: object;       // Snapshot before mutation
  newValue: object;            // Snapshot after mutation
  ipAddress: string;
  userAgent: string;
  timestamp: string;           // ISO 8601
}
```

---

## Legal & Compliance

| Regulation | Compliance Measure |
|---|---|
| **Kenya Data Protection Act 2019** | Databases hosted in Nairobi Local Zones; data localization enforced |
| **KRA Tax Compliance** | eTIMS integration for all fee invoices and vendor payments |
| **KEMIS Reporting** | Student data mapped to Ministry of Education standards |
| **SHA (Social Health Authority)** | Real-time UHC eligibility checks via UPI |
| **Data Sovereignty** | Silo architecture ensures each school fully owns its data |
| **Audit Requirements** | Tamper-proof audit trail logs every "Who, When, and What" |

---

## Implementation Roadmap

### Phase 1 — Pilot 🚧

> Deploy for one school with core modules.

- [x] Project scaffolding and architecture design
- [ ] Multi-tenant infrastructure (Landlord DB, tenant resolver)
- [ ] Student Registry Service (CRUD, guardian linking)
- [ ] Identity Service (Phone OTP, JWT, RBAC)
- [ ] Finance Engine (M-Pesa STK Push, callbacks, ledger)
- [ ] CBC Academic Engine (assessments, report cards)
- [ ] Communication Gateway (SMS via Africa's Talking)
- [ ] Database migration runner (multi-tenant)

### Phase 2 — Scale 📈

> Automate provisioning for School #2 – #100.

- [ ] Automated database provisioning via Landlord API
- [ ] PgBouncer connection pooling at scale
- [ ] Exeat Workflow System
- [ ] Library Management Module
- [ ] Security Module (gate pass, visitor management)
- [ ] Background workers (BullMQ) for all async tasks
- [ ] USSD integration for offline queries

### Phase 3 — Government Integration 🏛️

> Full compliance with national systems.

- [ ] KRA eTIMS invoice generation
- [ ] KEMIS student data sync
- [ ] SHA health coverage verification
- [ ] Maisha Namba UPI adoption
- [ ] OpenAPI / Swagger documentation

### Phase 4 — Intelligence 🤖

> AI-powered insights and optimization.

- [ ] AI-based student performance analytics
- [ ] Predictive fee collection analysis
- [ ] Automated timetable optimization
- [ ] National education analytics dashboards
- [ ] Higher Education Engine (credit hours, GPA, transcripts)

---

## Contributing

This project is under active development. Contributions are welcome for open-source modules.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "feat: add your feature description"

# Push to branch
git push origin feature/your-feature-name

# Open a Pull Request
```

---

## License

**Proprietary Software** — All rights reserved.

Unauthorized copying, distribution, or modification of this software is strictly prohibited.

---

<p align="center">
  <strong>EduCore</strong> — Powering Kenyan Education, One School at a Time. 🇰🇪
</p>
