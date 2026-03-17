# Nexus Hooks

![CI](https://github.com/suhashehade/learn-cicd-typescript-starter/actions/workflows/ci.yml/badge.svg)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Goal](#goal)
- [API Documentation](#api-documentation)
  - [Interactive Swagger UI](#interactive-swagger-ui)
  - [Available Endpoints](#available-endpoints)
  - [Usage](#usage)
- [Setup](#setup)
  - [Clone repo](#clone-repo)
  - [.env setup](#env-setup)
  - [Install dependencies](#install-dependencies)
  - [Start all services with Docker](#start-all-services-with-docker)
- [Running Tests](#running-tests)
- [Architecture & Design Decisions](#architecture--design-decisions)
  - [Design Decisions](#-design-decisions)
  - [Core Services](#-core-services)
  - [Shared Libraries](#-shared-libraries)
- [Pipeline Processing](#pipeline-processing)
  - [Pipeline Steps](#pipeline-steps)
  - [Processing Flow](#processing-flow)

## Overview

Nexus Hooks is a webhook-driven event processing system that allows external systems such as restaurants, stores, handmade mini-projects, or any commercial platform to send order events. These events are processed through configurable pipelines and then delivered to downstream systems such as shipping and accounting services.

The system simulates a simplified integration platform where incoming orders pass through a sequence of pipeline steps (some required and others optional), see [Pipeline Processing](#pipeline-processing).

### Key Features

- Webhook ingestion endpoint
- Pipeline secret authentication
- webhook signature verification
- Configurable event pipelines
- Background job processing
- Reliable event delivery to subscribers
- Retry and error handling
- Containerized services using: Docker
- **Interactive API Documentation**: Swagger UI for testing and exploration

### Goal

The goal of this project is to demonstrate how webhook-driven systems can process events reliably using pipelines, background workers, and service-based architecture.

## API Documentation

### Interactive Swagger UI

The Nexus API provides interactive documentation through Swagger UI, available during development:

**📚 API Documentation URL**: `http://localhost:4000/api-docs-ui/`

### Features of Swagger UI:

- **Interactive Testing**: Try API endpoints directly from your browser
- **Request/Response Examples**: See sample payloads and expected responses
- **Parameter Validation**: Understand required fields and formats
- **Authentication Headers**: View required X-API-KEY for webhook endpoints
- **Schema Documentation**: Complete data models for all endpoints

### Available Endpoints:

- **Health Check**: `GET /health`
- **Pipelines**: `GET /api/pipelines`, `GET /api/pipelines/{id}`,`POST /api/pipelines`, `DELETE /api/pipelines/{id}`
- **Sources**: `GET /api/sources`
- **Actions**: `GET /api/actions`
- **Subscribers**: `GET /api/subscribers`
- **Jobs**: `GET /api/jobs/{id}`, `GET /api/jobs?pipelineId={id}`
- **Webhooks**: `POST /api/nexus/webhooks` (requires `X-API-KEY` header, pipelineId in request body)
- **Internal**: `POST /internal/deliver` (internal system use)

### Usage:

1. Start the server: `docker compose up`
2. Visit Swagger UI: `http://localhost:4000/api-docs-ui/`
3. Click any endpoint to view details and test
4. Use the "Try it out" feature to make live API calls

## Architecture & Design Decisions

Nexus Hooks follows a **service-oriented architecture** organized as a monorepo using npm workspaces. Each major component runs as an independent service inside [Docker](https://www.docker.com/) while sharing internal libraries when appropriate.

The system is composed of several core services that work together to process webhook events through configurable pipelines.

---

### 🎯 Design Decisions

#### 1️⃣ Monorepo Workspace Architecture

**Decision:** Use npm workspaces instead of separate microservices.  
**Rationale:**

- **Development Efficiency:** Single repository with shared dependencies and tooling.
- **Code Sharing:** Easy sharing of types and utilities between workspaces.
- **Simplified Deployment:** Single Docker Compose for all services.
- **Testing:** Integrated testing across service boundaries.

#### 2️⃣ Database-Driven Job Processing

**Decision:** Use database polling instead of an external queue system.  
**Rationale:**

- **Simplicity:** No additional infrastructure dependencies.
- **Persistence:** Jobs are naturally persisted in the database.
- **Reliability:** Database transactions ensure job consistency.
- **Monitoring:** Easy to query job status and history.
- **Cost:** No additional queue service costs.

#### 3️⃣ Schema Design Philosophy

**Decision:** Use normalized, extensible schemas with clear relationships.  
**Rationale:**

- **Data Integrity:** Foreign key constraints ensure referential integrity.
- **Flexibility:** JSONB for configuration fields allows future expansion.
- **Audit Trail:** Job history and delivery attempts tables provide a complete audit trail.
- **Performance:** Proper indexing on frequently queried columns.
- **Maintainability:** Clear table structure with descriptive column names.

#### 4️⃣ Pipeline Configuration Strategy

**Decision:** Store pipelines as JSON with configurable action sequences.  
**Rationale:**

- **Business Agility:** Easy to modify processing logic without code changes.
- **Reusability:** Same pipeline can process different order types.
- **Testing:** Easier to test individual components in isolation.
- **Versioning:** Pipeline configurations can be versioned and rolled back.
- **Documentation:** Self-documenting configuration format.

#### 5️⃣ TypeScript Strict Mode

**Decision:** Use TypeScript with strict typing throughout.  
**Rationale:**

- **Reliability:** Catch errors at compile time rather than runtime.
- **Maintainability:** Self-documenting code with clear classes and types.
- **Refactoring:** Safe code modifications with compiler assistance.
- **Team Collaboration:** Clear contracts between services.

#### 6️⃣ Pretty Logging

**Decision:** Implement comprehensive logging with visual formatting.  
**Rationale:**

- **Debugging:** Easier to trace issues in production.
- **Monitoring:** Clear visibility into system health.
- **User Experience:** Pleasant demo and debugging experience.
- **Operations:** Better operational awareness.

---

### 🏗 Core Services

#### **Server**

- Handles incoming HTTP requests and system configuration.
- Exposes API endpoints for:
  - Receiving webhook events from sources (e.g., restaurants)
  - Managing pipelines
  - Delivering configured orders to subscribers (e.g., shipping)
  - Retrying failed deliveries
  - Listing job status, history, and delivery attempts

> The server queues each incoming job in the database for asynchronous execution.  
> Implemented using: [Express](https://www.npmjs.com/package/express).
> Request Body, Request Params, and Request Query validated using: [Zod](https://zod.dev/)

---

#### **Worker**

- Processes jobs asynchronously in the background.
- Executes pipeline actions step by step on queued jobs.

> HTTP POST requests to send configured orders are implemented using: [Axios](https://www.npmjs.com/package/axios)

---

#### **Subscribers**

- External systems that receive processed events.
- Two example subscribers:
  - Accounting
  - Shipping

> Each runs as an independent service, receiving events after transformation and enrichment.  
> Implemented using: [Express](https://www.npmjs.com/package/express)

---

#### **Database (PostgreSQL)**

- Primary database for storing:
  - Incoming webhook jobs
  - Pipelines and configurations
  - Job status and processing history
  - Delivery attempts

> Runs as a dedicated Docker service, shared by server and worker.  
> Access handled through the shared `db` workspace using: [Drizzle ORM](https://orm.drizzle.team/)

---

#### **Migration Service**

- Runs during startup to prepare database schema.
- Responsibilities:
  - Generate database artifacts
  - Run migrations
  - Seed initial data

> Ensures the database schema is up to date before server and worker start.  
> Implemented using: [drizzle_kit](https://www.npmjs.com/package/drizzle-kit)

---

### 🔗 Shared Libraries

#### **Database Library**

- Implemented in the `db` workspace, used by server and worker.
- Contains:
  - Database queries
  - Migrations
  - Seed scripts

> Provides a single source of truth for data access.  
> Uses: [Drizzle ORM](https://orm.drizzle.team/)

## Pipeline Processing

Incoming webhook events are processed through a configurable pipeline composed of multiple actions. Each action performs a specific transformation or validation step before passing the data to the next stage.

The pipeline in Nexus Hooks includes both **required** and **optional** steps.

### Pipeline Steps

1. **Merge Duplicated Items (Optional)**  
   Combines duplicated order items into a single entry to ensure accurate quantities and pricing.

2. **Price Filter (Optional)**  
   Filters out items that do not meet a configured price condition.

3. **Phone Normalization (Optional)**  
   Normalizes customer phone numbers into a consistent format, e.g.: add +970 or +972 country codes.

4. **Price Recalculation (Optional)**  
   Recalculates the total order price based on the processed items.

5. **Fork Per Subscriber (Required)**  
   Creates a copy of the order for each configured subscriber and attaches a label indicating the target system.

6. **Transform Per Subscriber (Required)**  
   Converts the order format into the structure expected by each subscriber system.

7. **Enrich Per Subscriber (Required)**  
   Adds additional subscriber-specific data required by the destination system before delivery.

### Processing Flow

Webhook Event  
↓  
Server receives event  
↓  
Job created in database  
↓  
Worker processes pipeline steps  
↓  
Subscriber-specific transformation  
↓  
Event delivered to subscribers

## Setup

This section explains how to set up and run the Nexus Hooks project locally using Docker Compose.

### Prerequisites

- Docker >= 20.x
- Docker Compose >= 1.29.x
- Node.js >= 18.x (for local dev if not using Docker)
- npm >= 9.x

### Run with Docker

The project is fully containerized. All services run independently but are connected via Docker Compose.

### Clone repo

git clone https://github.com/suhashehade/Nexus-Hooks.git

### .env setup

```bash
cd db
cp .env.example .env
```

#### Server port

##### The port the Nexus API server will listen on

PORT=4000

#### Database connection URL

##### Format: postgres://username:password@host:port/database

###### Example for local PostgreSQL:

DATABASE_URL=postgres://postgres:postgres@localhost:5432/nexusdb

### Install dependencies

```bash
npm install
```

### Start all services with Docker

```bash
docker compose up
```

## Running Tests

Nexus Hooks includes automated tests for the worker pipelines and the server health endpoint.

### Run tests on Docker

You can run the tests using [Vitest](https://vitest.dev/guide/):

```bash id="vitest-run"
# Run tests for the worker
npm run test:worker

# Run tests for the server
npm run test:server
```
