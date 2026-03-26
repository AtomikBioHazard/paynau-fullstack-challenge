# Technical Decisions and Trade-offs

**Project:** Paynau Fullstack Challenge
**Date:** March 26, 2026

---

## Decision 1: Backend - Node.js + Express + TypeScript

### Context
Backend needed for fullstack application.

### Options Considered
- **Node.js + Express**: Familiar, JSON native, fast setup
- **Nest.js**: Opinionated but steeper learning curve

### Decision
Node.js + Express + TypeScript

### Justification
- Familiarity with JavaScript/TypeScript
- JSON handling is native
- Fast setup for prototyping

---

## Decision 2: Database - SQLite

### Context
Strict time constraints for prototype.

### Options Considered
- **SQLite**: Zero configuration, single file
- **PostgreSQL**: Production-ready but requires setup

### Decision
SQLite

### Justification
- Zero configuration needed
- Single file database
- Sufficient for prototype scope

---

## Decision 3: Concurrency Control - Optimistic Locking

### Context
Prevent stock from going negative under concurrent requests.

### Options Considered
- **Optimistic Locking**: Better throughput, no deadlocks
- **Pessimistic Locking**: Simpler but can deadlock

### Decision
Optimistic Locking with version column

### Justification
- Reads never block
- No deadlocks possible
- Simple version column implementation

---

## Decision 4: Authentication - JWT

### Context
Stateless authentication for REST API.

### Decision
JWT with access tokens

### Justification
- Stateless, no session storage
- REST API standard
- Cross-domain friendly

---

## Decision 5: Frontend - React + Vite

### Decision
React + Vite + TypeScript

### Justification
- Vite faster than CRA
- TypeScript strict mode
- Modern tooling

---

## Decision 6: Architecture - MVC

### Decision
MVC with clear layer separation

### Justification
- Well-understood pattern
- Fast to implement
- Clear separation of concerns

**Structure:**
```
backend/src/
├── controllers/  # HTTP handling
├── services/     # Business logic
├── models/       # Data access
├── middleware/   # Cross-cutting
└── routes/       # Definitions
```
