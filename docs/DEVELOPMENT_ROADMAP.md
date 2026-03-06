# EduCore — Development Roadmap

> **Master build guide for the entire EduCore backend.**
> Two developers working in parallel sprints — from empty scaffolding to production-ready SaaS.

---

## How to Use This Document

1. **Each sprint has a clear goal**, a duration estimate, and tasks split between **Developer A** and **Developer B**.
2. Mark tasks `[x]` when completed, `[/]` when in-progress.
3. A sprint is considered **done** when both developers have completed their tasks AND the sprint's **Definition of Done** checklist is met.
4. Do NOT skip ahead to the next sprint until the current one passes its acceptance criteria.
5. Sprints that share a dependency have a **🔗 Sync Point** — both devs must be at that checkpoint before either continues.

---

## Developer Roles

| | Developer A — "Infrastructure & Data" | Developer B — "Services & Integrations" |
|---|---|---|
| **Focus** | Database, multi-tenancy, auth, core infra | Business modules, external APIs, communication |
| **Owns** | `infrastructure/`, `tenant/`, `common/`, `students/`, `results/`, `teacher/`, `security/` | `finance/`, `communication/`, `kemis/`, `library/`, `workers/`, `exeat/` (new module) |
| **Strength** | Database design, middleware, system architecture | API integrations, queues, business logic |

> **Rule:** Both devs work on Git feature branches and open PRs. No direct pushes to `main`.

---

## Current State — Baseline Audit

### ✅ Working (has real code)

| File | Status |
|---|---|
| `src/app.ts` | Express server, health check, 404, error handler |
| `src/modules/common/utils/logger.ts` | Console logger with levels |
| `src/modules/common/middleware/error.handler.ts` | AppError class + global handler |
| `src/modules/common/utils/response.util.ts` | `sendSuccess()` / `sendError()` helpers |

### ⬜ Empty Placeholders (0 bytes — need to be built)

```
src/modules/common/constants/role.contants.ts
src/modules/common/middleware/auth.middleware.ts
src/modules/common/middleware/role.middleware.ts
src/modules/communication/*
src/modules/finance/*
src/modules/kemis/*
src/modules/library/*
src/modules/results/reports/*
src/modules/security/*
src/modules/students/*  (all files: dto, types, controller, service, repository, routes, modules)
src/modules/teacher/*
```

### 🚫 Not Yet Created

```
src/infrastructure/database/      — Drizzle ORM setup, schemas, migrations
src/infrastructure/redis/         — Redis client
src/infrastructure/queues/        — BullMQ queue definitions
src/tenant/                       — Tenant resolver, connection manager
src/workers/                      — Background job processors
src/modules/auth/                 — Dedicated auth module (currently mixed into common/)
src/modules/exeat/                — Boarding exeat workflow
```

---

## Sprint 0 — Foundation & Shared Infra ⚡

> **Goal:** Set up the database, multi-tenant core, and shared infrastructure so BOTH developers can build on top of it.
>
> **Duration:** 1 week
>
> **Both developers work together on this sprint. Do not split yet.**

### Dev A + Dev B (Together)

- [ ] **Set up PostgreSQL locally** — install, create `educore_landlord` database
- [ ] **Install core dependencies**
  ```
  npm install drizzle-orm postgres pg dotenv zod
  npm install -D drizzle-kit @types/pg
  ```
- [ ] **Install Redis locally** — install, verify `redis-cli ping` returns PONG
  ```
  npm install ioredis
  ```
- [ ] **Install validation & auth deps**
  ```
  npm install zod jsonwebtoken bcryptjs
  npm install -D @types/jsonwebtoken @types/bcryptjs
  ```
- [ ] **Install queue deps**
  ```
  npm install bullmq
  ```
- [ ] **Agree on Git branching strategy**
  - `main` — protected, deployable
  - `develop` — integration branch
  - `feature/<module-name>` — individual work
  - PR reviews required before merge to `develop`

### Dev A — Infrastructure

- [ ] Create `src/infrastructure/database/drizzle.config.ts` — Drizzle ORM config
- [ ] Create `src/infrastructure/database/landlord.schema.ts` — Landlord DB schema (schools, school_configs tables)
- [ ] Create `src/infrastructure/database/landlord.client.ts` — Landlord DB connection
- [ ] Create `src/infrastructure/database/tenant.schema.ts` — Shared tenant schema (users, students, payments, etc.)
- [ ] Run first migration on Landlord DB
- [ ] Create `src/tenant/tenantResolver.ts` — Middleware: extract subdomain → query landlord → store in AsyncLocalStorage
- [ ] Create `src/tenant/connectionManager.ts` — Dynamic connection pool per tenant (Map<tenantId, Pool>)
- [ ] Create `src/tenant/tenantContext.ts` — AsyncLocalStorage wrapper (`getTenantDb()` helper)
- [ ] Write seed script: insert 1 test school into landlord DB

### Dev B — Shared Utilities

- [ ] Create `src/infrastructure/redis/redis.client.ts` — Redis connection singleton
- [ ] Create `src/infrastructure/queues/queue.config.ts` — BullMQ connection and base queue factory
- [ ] Fill `src/modules/common/constants/role.contants.ts` — enum/const for all roles
- [ ] Create `src/modules/common/middleware/validate.middleware.ts` — Zod validation middleware
- [ ] Create `src/modules/common/types/express.d.ts` — Extend Express Request with `tenantDb`, `user`, `tenantId`
- [ ] Set up `.env` file from `.env.example` with actual local values
- [ ] Add npm scripts to `package.json`:
  ```json
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "migrate:all": "tsx src/infrastructure/database/migrate-all.ts"
  ```

### 🔗 Sync Point

> Both devs must verify:
> - [ ] `npm run dev` starts without errors
> - [ ] Tenant resolver middleware works (hardcoded test tenant)
> - [ ] `getTenantDb()` returns correct database connection in a request
> - [ ] Redis client connects successfully
> - [ ] Merge both branches into `develop`

---

## Sprint 1 — Auth & Student Registry 🔐

> **Goal:** Users can log in (OTP) and perform CRUD on students within a tenant database.
>
> **Duration:** 1.5 weeks
>
> **First real feature sprint. Devs split into their lanes.**

### Dev A — Authentication System

- [ ] Create `src/modules/auth/` module folder:
  ```
  auth/
  ├── auth.controller.ts
  ├── auth.routes.ts
  ├── auth.service.ts
  └── otp.service.ts
  ```
- [ ] Fill `src/modules/common/middleware/auth.middleware.ts` — JWT verification middleware
- [ ] Fill `src/modules/common/middleware/role.middleware.ts` — Role guard (`requireRole('ADMIN', 'TEACHER')`)
- [ ] Implement `POST /api/v1/auth/request-otp` — generate OTP, store in Redis (TTL 5 min)
  - For now: log OTP to console (no SMS yet — Dev B will wire SMS in Sprint 3)
- [ ] Implement `POST /api/v1/auth/verify-otp` — verify OTP, issue JWT + refresh token
- [ ] Implement `POST /api/v1/auth/refresh-token` — rotate refresh token
- [ ] Implement `POST /api/v1/auth/logout` — invalidate session in Redis
- [ ] Implement `GET /api/v1/auth/me` — return current user profile
- [ ] Add `users` table to tenant schema (id, phone, name, role, created_at)
- [ ] Mount auth routes in `app.ts`
- [ ] Test: request OTP → verify → get JWT → access protected route → logout

### Dev B — Student Registry

- [ ] Add student-related tables to tenant schema:
  ```
  students (id, first_name, last_name, dob, gender, admission_number, maisha_namba_upi, class_id, stream_id, boarding_status, status, created_at, updated_at)
  guardians (id, name, phone, email, relationship)
  student_guardians (student_id, guardian_id)  — junction table
  classes (id, name, grade_level, stream)
  ```
- [ ] Fill `src/modules/students/types/students.interface.ts` — Student, Guardian, CreateStudentDto, UpdateStudentDto interfaces
- [ ] Fill `src/modules/students/dto/create-student.dto.ts` — Zod schema for student creation validation
- [ ] Fill `src/modules/students/dto/update-students.dto.ts` — Zod schema for student update validation
- [ ] Fill `src/modules/students/student.repository.ts` — Drizzle queries (CRUD + search/filter)
- [ ] Fill `src/modules/students/student.service.ts` — Business logic layer
- [ ] Fill `src/modules/students/student.controller.ts` — Request handlers
- [ ] Fill `src/modules/students/student.routes.ts` — Express router with auth + role middleware
- [ ] Fill `src/modules/students/student.modules.ts` — Module wiring / dependency setup
- [ ] Implement endpoints:
  - `GET    /api/v1/students` — paginated list with filters (class, stream, status)
  - `POST   /api/v1/students` — admit new student
  - `GET    /api/v1/students/:id` — get student profile
  - `PATCH  /api/v1/students/:id` — update student
  - `DELETE /api/v1/students/:id` — soft-delete (set status to 'discharged')
  - `POST   /api/v1/students/:id/guardians` — link guardian
  - `GET    /api/v1/students/:id/guardians` — list guardians
- [ ] Mount student routes in `app.ts`
- [ ] Test: create student → list → update → link guardian → soft-delete

### 🔗 Sync Point

> - [ ] Auth-protected student endpoints work end-to-end
> - [ ] Role middleware blocks unauthorized access (e.g., STUDENT can't delete)
> - [ ] Both modules run against the same tenant DB
> - [ ] Merge to `develop`

---

## Sprint 2 — Finance Engine & CBC Assessments 💰

> **Goal:** M-Pesa payments work. Teachers can submit CBC assessments.
>
> **Duration:** 2 weeks

### Dev A — CBC Academic Engine

- [ ] Create `src/modules/assessments/` module:
  ```
  assessments/
  ├── assessment.controller.ts
  ├── assessment.routes.ts
  ├── assessment.service.ts
  ├── assessment.repository.ts
  └── dto/
      ├── create-assessment.dto.ts
      └── report-card.dto.ts
  ```
- [ ] Add assessment tables to tenant schema:
  ```
  subjects (id, name, category, grade_levels)
  strands (id, subject_id, name)
  sub_strands (id, strand_id, name)
  assessments (id, student_id, subject_id, strand_id, sub_strand_id, performance_level, assessment_type, rubric_notes, evidence_url, assessed_by, assessed_at)
  ```
- [ ] Implement 70/30 formative/summative weighting logic
- [ ] Implement performance level mapping (1–4)
- [ ] Implement endpoints:
  - `POST   /api/v1/assessments` — submit assessment
  - `POST   /api/v1/assessments/bulk` — bulk submit
  - `GET    /api/v1/assessments/student/:id` — student assessments
  - `GET    /api/v1/assessments/class/:id` — class assessments
  - `GET    /api/v1/assessments/report-card/:id` — generate report card JSON
- [ ] Mount assessment routes in `app.ts`

### Dev B — Finance / M-Pesa Engine

- [ ] Install M-Pesa HTTP client dep: `npm install axios`
- [ ] Add finance tables to tenant schema:
  ```
  fee_structures (id, name, academic_year, term, vote_heads JSONB, total_amount)
  vote_heads (id, name, amount, fee_structure_id)
  payments (id, student_id, amount, mpesa_receipt, bill_ref, phone, transaction_date, status, created_at)
  student_ledger (id, student_id, fee_structure_id, total_fees, total_paid, balance)
  ```
- [ ] Fill `src/modules/finance/finance.service.ts`:
  - `generateToken()` — OAuth2 token from Daraja API
  - `initiateSTKPush()` — trigger payment on parent's phone
  - `handleCallback()` — parse callback, extract BillRefNumber + MpesaReceiptNumber
  - `reconcilePayment()` — credit student ledger
  - `getStudentBalance()` — calculate current balance
- [ ] Fill `src/modules/finance/finance.controller.ts`
- [ ] Fill `src/modules/finance/finance.routes.ts`
- [ ] Implement endpoints:
  - `POST   /api/v1/payments/stk-push` — initiate STK Push
  - `POST   /api/v1/payments/mpesa-callback` — Safaricom callback (no auth, IP whitelisted)
  - `GET    /api/v1/payments/student/:id` — payment history
  - `GET    /api/v1/payments/student/:id/balance` — fee balance
  - `POST   /api/v1/payments/fee-structure` — configure fee structure (ADMIN only)
- [ ] Test with Daraja Sandbox: initiate STK → receive callback → verify ledger updated
- [ ] Mount finance routes in `app.ts`

### 🔗 Sync Point

> - [ ] STK Push flow works end-to-end in Daraja sandbox
> - [ ] Assessment submission + report card generation works
> - [ ] Both modules use tenant-scoped DB queries
> - [ ] Merge to `develop`

---

## Sprint 3 — Communication, Reports & Workers 📡

> **Goal:** SMS/USSD works. Background workers handle async jobs. Teachers can generate report cards.
>
> **Duration:** 1.5 weeks

### Dev A — Results / Report Generation

- [ ] Fill `src/modules/results/reports/report.service.ts`:
  - Pull student assessments
  - Calculate weighted averages (70/30)
  - Map to performance levels
  - Build structured report card object
- [ ] Fill `src/modules/results/reports/report.controller.ts`
- [ ] Fill `src/modules/results/reports/report.routes.ts`
- [ ] Implement endpoints:
  - `GET  /api/v1/reports/student/:id` — individual report card
  - `GET  /api/v1/reports/class/:id` — class report
  - `POST /api/v1/reports/generate-bulk` — queue bulk report generation
- [ ] Mount report routes in `app.ts`

#### Dev A — Teacher Module

- [ ] Fill `src/modules/teacher/roles/teacher.role.service.ts` — assign subjects, handle class teacher role
- [ ] Create teacher CRUD if needed (or extend users table with teacher-specific fields)

### Dev B — Communication (Africa's Talking + USSD)

- [ ] Install Africa's Talking SDK: `npm install africastalking`
- [ ] Fill `src/modules/communication/communication.service.ts`:
  - `sendSMS()` — single SMS via Africa's Talking
  - `sendBulkSMS()` — bulk SMS
  - `handleUSSD()` — USSD session handler (text/plain responses)
- [ ] Fill `src/modules/communication/communication.controller.ts`
- [ ] Fill `src/modules/communication/communication.routes.ts`
- [ ] Implement endpoints:
  - `POST /api/v1/ussd/callback` — Africa's Talking USSD callback
  - `POST /api/v1/sms/send` — send single SMS
  - `POST /api/v1/sms/bulk` — send bulk SMS
- [ ] Implement USSD menu flow:
  - `*483#` → Welcome menu → 1. Fee Balance / 2. Results / 3. Attendance
  - Query tenant DB → return plain text response
- [ ] Mount communication routes in `app.ts`

#### Dev B — Background Workers

- [ ] Create `src/workers/paymentWorker.ts` — process M-Pesa callbacks from queue
- [ ] Create `src/workers/notificationWorker.ts` — dispatch SMS/email/push from queue
- [ ] Create `src/workers/reportWorker.ts` — generate bulk report cards
- [ ] Add queue producer calls in finance.service.ts and report.service.ts
- [ ] Add npm script: `"workers": "tsx src/workers/index.ts"`
- [ ] Wire OTP delivery: auth.service → notificationWorker → Africa's Talking SMS

### 🔗 Sync Point

> - [ ] OTP is sent via real SMS (Africa's Talking sandbox)
> - [ ] USSD returns fee balance for a student
> - [ ] Bulk report generation queues and completes
> - [ ] Workers start with `npm run workers`
> - [ ] Merge to `develop`

---

## Sprint 4 — Security, Library & Exeat 🏫

> **Goal:** Boarding school features are functional. Library and gate security work.
>
> **Duration:** 1.5 weeks

### Dev A — Security Module

- [ ] Add security tables to tenant schema:
  ```
  gate_logs (id, person_type, person_id, direction, timestamp, logged_by)
  visitors (id, name, phone, purpose, student_id, otp, otp_expires, verified, created_at)
  incidents (id, type, description, reported_by, severity, created_at)
  ```
- [ ] Fill `src/modules/security/security.service.ts`
- [ ] Fill `src/modules/security/security.controller.ts`
- [ ] Fill `src/modules/security/security.routes.ts`
- [ ] Implement endpoints:
  - `POST /api/v1/security/gate-log` — log entry/exit
  - `GET  /api/v1/security/gate-log/today` — today's activity
  - `POST /api/v1/security/visitors/register` — register visitor (sends OTP)
  - `POST /api/v1/security/visitors/verify/:id` — verify visitor OTP at gate
  - `POST /api/v1/security/incidents` — report incident
  - `GET  /api/v1/security/incidents` — list incidents
- [ ] Mount security routes in `app.ts`

### Dev B — Exeat Workflow + Library

#### Exeat (New Module)

- [ ] Create `src/modules/exeat/` module:
  ```
  exeat/
  ├── exeat.controller.ts
  ├── exeat.routes.ts
  ├── exeat.service.ts
  └── dto/
      └── create-exeat.dto.ts
  ```
- [ ] Add exeat tables:
  ```
  exeat_requests (id, student_id, reason, departure_date, return_date, status, requested_at)
  exeat_approvals (id, exeat_id, approver_id, approver_role, decision, decided_at)
  ```
- [ ] Implement multi-step approval chain: Student → Parent (SMS OTP) → Principal → Security
- [ ] Implement endpoints:
  - `POST /api/v1/exeat/request` — student requests exeat
  - `POST /api/v1/exeat/approve/:id` — parent/principal approves
  - `POST /api/v1/exeat/verify/:id` — security verifies at gate
  - `GET  /api/v1/exeat/status/:id` — check status
  - `GET  /api/v1/exeat/active` — list active exeats

#### Library

- [ ] Add library tables:
  ```
  books (id, title, author, isbn, category, total_copies, available_copies)
  borrowings (id, book_id, student_id, borrowed_at, due_date, returned_at, status)
  ```
- [ ] Fill `src/modules/library/library.service.ts`
- [ ] Fill `src/modules/library/library.client.ts` (if external catalog API needed, otherwise rename to `library.repository.ts`)
- [ ] Create library controller + routes
- [ ] Implement endpoints:
  - `GET  /api/v1/library/books` — browse catalog
  - `POST /api/v1/library/books` — add book
  - `POST /api/v1/library/borrow` — borrow book
  - `POST /api/v1/library/return/:id` — return book
  - `GET  /api/v1/library/overdue` — list overdue
- [ ] Mount exeat + library routes in `app.ts`

### 🔗 Sync Point

> - [ ] Exeat full chain works: request → parent OTP approve → principal approve → security verify
> - [ ] Visitor OTP at gate works
> - [ ] Library borrow → return → overdue list works
> - [ ] Merge to `develop`

---

## Sprint 5 — Government Integrations & Compliance 🏛️

> **Goal:** KRA eTIMS, KEMIS, SHA integrations are functional. Audit trail is in place.
>
> **Duration:** 2 weeks

### Dev A — KEMIS + Audit Trail

- [ ] Fill `src/modules/kemis/kemis.client.ts` — HTTP client for KEMIS API
- [ ] Fill `src/modules/kemis/kemis.service.ts`:
  - `syncStudent()` — push student data to KEMIS
  - `notifyTransfer()` — notify KEMIS of inter-school transfer
  - `generateComplianceReport()` — capitation report for Ministry of Education
- [ ] Implement endpoints:
  - `POST /api/v1/kemis/sync`
  - `GET  /api/v1/kemis/reports`
  - `POST /api/v1/kemis/transfer-notification`
- [ ] **Audit Trail System** — add to all tenant databases:
  ```
  audit_logs (id, user_id, action, entity, entity_id, previous_value JSONB, new_value JSONB, ip_address, user_agent, timestamp)
  ```
- [ ] Create audit middleware — auto-log all CREATE/UPDATE/DELETE operations
- [ ] Mount kemis routes in `app.ts`

### Dev B — KRA eTIMS + SHA

#### KRA eTIMS

- [ ] Create `src/modules/etims/` module:
  ```
  etims/
  ├── etims.controller.ts
  ├── etims.routes.ts
  ├── etims.service.ts
  └── etims.client.ts       — KRA Enterprise API HTTP client
  ```
- [ ] Implement OSCU (real-time) and VSCU (bulk) invoice modes
- [ ] Implement endpoints:
  - `POST /api/v1/etims/invoice` — generate eTIMS invoice
  - `GET  /api/v1/etims/invoice/:id` — invoice status
  - `POST /api/v1/etims/bulk-invoice` — bulk invoices

#### SHA (Social Health Authority)

- [ ] Create `src/modules/sha/` module:
  ```
  sha/
  ├── sha.controller.ts
  ├── sha.routes.ts
  ├── sha.service.ts
  └── sha.client.ts          — SHA API HTTP client
  ```
- [ ] Implement UHC eligibility check via student UPI
- [ ] Implement endpoints:
  - `GET /api/v1/sha/eligibility/:upi` — check eligibility
  - `GET /api/v1/sha/benefits/:upi` — list benefits
- [ ] Create `src/workers/kemisSyncWorker.ts` — background sync with KEMIS
- [ ] Mount etims + sha routes in `app.ts`

### 🔗 Sync Point

> - [ ] eTIMS sandbox invoice generation works
> - [ ] Audit trail logs visible in DB for all mutations
> - [ ] KEMIS sync flow tested (even with mock API if gov API not available)
> - [ ] Merge to `develop`

---

## Sprint 6 — Database Migrations, Object Storage & Polish 🛠️

> **Goal:** Multi-tenant migrations run reliably. File uploads work. API is documented.
>
> **Duration:** 1.5 weeks

### Dev A — Multi-Tenant Migrations + Provisioning

- [ ] Create `src/infrastructure/database/migrate-all.ts`:
  - Fetch all active tenants from landlord DB
  - For each: connect → run Drizzle migrations → log result
  - Summary report (✅ success / ❌ failed + retry)
- [ ] Create tenant provisioning endpoint (SUPER_ADMIN only):
  - `POST /api/v1/admin/schools` — create new school, provision database, run initial migration, seed defaults
- [ ] Create `src/infrastructure/database/seed.ts` — seed script for test data (roles, classes, subjects, sample students)
- [ ] Add npm scripts:
  ```json
  "seed": "tsx src/infrastructure/database/seed.ts",
  "provision:school": "tsx src/infrastructure/database/provision.ts"
  ```

### Dev B — Object Storage + API Documentation

#### Object Storage

- [ ] Create `src/infrastructure/storage/storage.service.ts`:
  - `upload()` — upload to S3/R2
  - `getSignedUrl()` — generate presigned download URL
  - `delete()` — remove file
- [ ] Create upload middleware (multer) for student documents and CBC evidence
- [ ] Wire into student module (document upload) and assessment module (evidence upload)

#### API Documentation

- [ ] Install Swagger deps: `npm install swagger-ui-express swagger-jsdoc`
- [ ] Add JSDoc/OpenAPI annotations to all route files
- [ ] Mount Swagger UI at `/api/docs`
- [ ] Verify all endpoints appear in Swagger UI

### 🔗 Sync Point

> - [ ] `npm run migrate:all` runs on 2+ tenant DBs successfully
> - [ ] File upload → S3/R2 → presigned URL works
> - [ ] Swagger UI shows all endpoints at `/api/docs`
> - [ ] Merge to `develop` → merge `develop` to `main` → **tag v1.0.0-pilot**

---

## Sprint 7 — Scale & Production Readiness 🚀

> **Goal:** Deploy to production for the first pilot school. Prepare for multi-school scaling.
>
> **Duration:** 2 weeks

### Dev A — DevOps & Production

- [ ] Create `Dockerfile` and `docker-compose.yml` (API + PostgreSQL + Redis + PgBouncer)
- [ ] Set up CI/CD pipeline (GitHub Actions):
  - Lint → Type-check → Test → Build → Deploy
- [ ] Configure PgBouncer in transaction mode
- [ ] Set up health check monitoring
- [ ] Set up log aggregation
- [ ] Rate limiting middleware (per-tenant)
- [ ] CORS configuration (per-tenant subdomain whitelist)

### Dev B — Event System & Notifications Polish

- [ ] Create event bus:
  ```
  src/infrastructure/events/
  ├── eventBus.ts             — EventEmitter or Redis pub/sub
  ├── event.types.ts          — All event type definitions
  └── event.handlers.ts       — Register handlers
  ```
- [ ] Wire all modules to emit events:
  - `student.created` → KEMIS sync + welcome SMS
  - `payment.received` → receipt SMS + dashboard alert
  - `assessment.submitted` → parent notification
  - `exeat.approved` → parent SMS + security alert
- [ ] Polish notification templates (SMS text, email HTML)
- [ ] Add notification preferences per guardian (opt-in/out)

### 🔗 Sync Point

> - [ ] Docker compose spins up entire stack locally
> - [ ] CI pipeline passes (lint + type-check + build)
> - [ ] Event-driven notifications fire correctly across all modules
> - [ ] **Deploy pilot to staging environment**

---

## Sprint 8 — Higher Education & AI Features 🤖

> **Goal:** University/TVET module. AI-powered analytics (future-facing).
>
> **Duration:** 3 weeks (can run after pilot launch)

### Dev A — Higher Education Engine

- [ ] Create `src/modules/higher-ed/` module
- [ ] Credit hour course registration
- [ ] GPA / CGPA calculation (4.0 scale)
- [ ] Academic transcript generation
- [ ] Graduation clearance workflow
- [ ] Prerequisite enforcement
- [ ] Academic standing / probation tracking

### Dev B — AI & Analytics

- [ ] Student performance analytics (trend detection)
- [ ] Predictive fee collection analysis
- [ ] Automated timetable optimization
- [ ] National education analytics dashboards
- [ ] Data export APIs for Ministry reporting

---

## Quick Reference — What to Build First

If you're wondering where to start **right now**, this is the exact order:

### Today → This Week (Sprint 0)

1. **Dev A:** Install PostgreSQL + create Landlord DB + write Drizzle schemas
2. **Dev B:** Install Redis + create Redis client + fill role constants + validation middleware
3. **Together:** Wire tenant resolver → test that a request hits the correct tenant DB

### Next Week (Sprint 1)

4. **Dev A:** Build auth (OTP to console → JWT → protected routes)
5. **Dev B:** Build student CRUD (the first real API consumers will test)

### Week After (Sprint 2)

6. **Dev B:** M-Pesa sandbox integration (the "wow" demo feature)
7. **Dev A:** CBC assessment submissions + report cards

> **Tip:** At the end of Sprint 2 you'll have a **demo-ready** system: login → manage students → collect fees → record assessments. That's your pilot MVP.

---

## Git Workflow Reminder

```bash
# Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/auth-system

# Work on the feature...
git add .
git commit -m "feat(auth): implement OTP request and verification"

# Push and create PR
git push origin feature/auth-system
# → Open PR to develop, request review from other dev

# After PR approval
git checkout develop
git pull origin develop
git merge feature/auth-system
git push origin develop
```

---

## Dependencies Installation Summary

Run these **once** at the start of Sprint 0:

```bash
# Core
npm install express drizzle-orm postgres pg dotenv zod ioredis bullmq jsonwebtoken bcryptjs axios

# Dev
npm install -D drizzle-kit @types/pg @types/jsonwebtoken @types/bcryptjs @types/express

# Sprint 3+
npm install africastalking swagger-ui-express swagger-jsdoc multer
npm install -D @types/multer @types/swagger-ui-express @types/swagger-jsdoc
```

---

> **Last updated:** 2026-03-06
>
> **Developers:** [ Developer A: ___________ ] · [ Developer B: ___________ ]
>
> **Current Sprint:** 0 — Foundation & Shared Infra
