# Aurelia Vault | Institutional-Grade Asset Tokenization Protocol

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)

</div>

## Executive Summary

Aurelia Vault is a polyglot microservices architecture designed for the immutable fractionalization and algorithmic trading of tangible assets (fine art, hypercars, commercial real estate). The protocol bridges the gap between physical Special Purpose Vehicle (SPV) custody and decentralized ledger state transitions, providing institutional investors with sub-millisecond finality and zero-knowledge privacy guarantees (Buterin, 2014).

## Architectural Topology

The system decouples the presentation layer from the transaction processing logic to optimize both user experience (UX) and system throughput. 

* **Frontend (Monolithic DOM):** Utilizes embedded ECMAScript and CSS to minimize network waterfall requests, reducing Time to Interactive (TTI).
* **API Gateway (Python/FastAPI):** Handles Identity and Access Management (IAM) and asynchronous I/O routing.
* **Client SDK (TypeScript):** Enforces strict contract testing and type safety between the browser and the gateway.
* **Transaction Engine (Java/Spring):** Leverages the JVM's robust concurrency models to prevent race conditions during high-frequency fractional asset allocation.

## Prerequisites

* Node.js >= 18.0.0
* Python >= 3.10
* Java Development Kit (JDK) >= 17
* Maven >= 3.8.0

## Installation & Deployment

### 1. Frontend Presentation Layer
The frontend is a single-page application contained within `index.html`. No build step is required for the base deployment.
```bash
cd frontend
python -m http.server 8080
```

### 2. API Gateway (Python)
```bash
cd backend-gateway
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pyjwt pydantic
uvicorn app.main:app --reload --port 8000
```

### 3. Transaction Engine (Java)
```bash
cd transaction-engine
mvn clean install
java -jar target/ledger-engine-1.0.0.jar
```

## API Documentation

### `POST /api/v1/ledger/allocate`
Initiates a fractional allocation request.

**Headers:**
* `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "asset_id": "AST-9981-X",
  "fraction_volume": 25000.00,
  "fiat_denomination": "USD"
}
```

**Response (201 Created):**
```json
{
  "tx_hash": "0x8f7a...",
  "state_root": "0x1b2c...",
  "timestamp": 1694532100
}
```

## Security & Compliance

* **Zero-Knowledge Proofs:** All high-volume fractional transfers are executed without exposing underlying asset valuation to the public mempool.
* **SPV Custody:** Physical assets are held in bankruptcy-remote Special Purpose Vehicles, legally mirroring the on-chain tokenomic structure.
* **Isolation Levels:** The Java transaction engine utilizes `Isolation.SERIALIZABLE` to guarantee ACID compliance during concurrent ledger updates (Gray et al., 1976).

## References

Abramov, D. (2015). *Flux: Unidirectional data flow*. Facebook Developers. 

Buterin, V. (2014). *A next-generation smart contract and decentralized application platform*. Ethereum Whitepaper.

Fielding, R. T., & Taylor, R. N. (2002). Principled design of the modern Web architecture. *ACM Transactions on Internet Technology (TOIT)*, 2(2), 115-150.

Gray, J., Lorie, R. A., Putzolu, G. F., & Traiger, I. L. (1976). Granularity of locks and degrees of consistency in a large shared data base. *Communications of the ACM*, 19(9), 465-472.

Nielsen, J. (1994). *Usability engineering*. Morgan Kaufmann.
```
