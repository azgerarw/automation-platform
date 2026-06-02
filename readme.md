# Event-Driven Automation Platform

A microservices-based automation platform that allows users to create rules, receive external events through webhooks, evaluate conditions, and execute automated actions such as sending emails, logging events, or triggering external APIs.

The project is designed as a learning-oriented distributed system that explores modern backend architecture concepts including microservices, event-driven communication, authentication, asynchronous processing, observability, and CI/CD.

---

## Architecture

### Components

#### API Gateway

Responsibilities:

* JWT authentication validation
* Rate limiting
* Request routing
* Initial request validation

#### Auth Service

Responsibilities:

* User registration
* User login
* JWT generation
* Refresh token management
* Role management

Database:

* Dedicated PostgreSQL database

#### Rule Service

Responsibilities:

* Rule CRUD operations
* Rule validation
* Condition parsing and evaluation
* Rule persistence

Example rule:

```json
{
  "trigger": "payment.received",
  "conditions": ["payload.amount > 100", "user = 'vip'"],
  "actions": ["send_email", "log_event"]
}
```

#### Webhook Service

Responsibilities:

* Receive external events
* Validate payloads
* Normalize events
* Publish events to the Event Bus

Example event:

```json
{
  "event_type": "payment.received",
  "payload": { 
       "amount": 120,
       "user": "vip"
  },
  "user": "2",
  "message": "payment received by user 2"
}
```

#### Event Bus

Technology:

* Redis Pub/Sub or Streams

Responsibilities:

* Asynchronous communication
* Event distribution
* Decoupling services

#### Execution Engine

Responsibilities:

* Consume events
* Retrieve active rules
* Evaluate conditions
* Execute actions
* Handle retries
* Ensure idempotency

This service acts as the core processing engine of the platform.

#### Realtime Service

* Connects with frontend via websockets
* Consume events from redis
* Send event updates to frontend dashboard and admin panel so data gets rerendered

#### Notification Service

Responsibilities:

* Email delivery (SMTP)
* Websockets Event notifications
* Logging
* Discord

Future integrations:

* Slack
* Push notifications

---

## Event Flow

### Rule Creation

```text
Client
   ↓
API Gateway
   ↓
Rule Service
   ↓
PostgreSQL
```

### Webhook Processing

```text
External Webhook
       ↓
Webhook Service
       ↓
Redis Event Bus
       ↓
Execution Engine
```

### Action Execution

```text
Execution Engine
       ↓
Evaluate Rules
       ↓
Execute Actions
       ↓
Notification Service
```

---

## Technology Stack

### Backend

* Node.js
* Express
* Python
* FastAPI

### Databases

* PostgreSQL

### Messaging

* Redis
* Websockets

### Containerization

* Docker
* Docker Compose

### Security

* JWT
* Refresh Tokens
* Rate Limiting
* Cookies

### CI/CD

* GitHub Actions
* Trivy
* Docker Build Pipeline


### Frontend

* React

---

## User Roles

The platform supports role-based access control with two primary roles:

### User

Regular users can:

* Register and authenticate
* Create automation rules
* Edit existing rules
* Enable or disable rules
* Delete rules
* Manage their own automations
* View execution results
* Access a personal dashboard
* Generate or delete api keys
* Enable or disable web alerts

Example capabilities:

```text
Create Rule
Update Rule
Delete Rule
Enable/Disable Rule
View Execution History
```

### Administrators

To change role to admin open user_db database and update the role column record of your existing account to admin as this 
cannot be done from the UI, once you have admin credentials log in as admin to access the panel

Administrators have elevated permissions and can:

* Access the administration panel
* View platform-wide statistics
* Manage users
* Manage roles and permissions
* Monitor system activity
* Review execution logs
* Inspect service health and system 
* Update global retry strategy and circuit breaker rules

Example capabilities:

```text
User Management
System Monitoring
Audit Logs
Platform Administration
```

---

## Dashboard

### User Dashboard

Provides a self-service interface for automation management:

* Rule CRUD operations
* Rule status management
* Execution history
* Personal activity overview

### Admin Dashboard

Provides platform administration features:

* User administration
* Global metrics
* System monitoring
* Service health checks
* Operational visibility
* Job queues

```
```

## Learning Objectives

This project is intended to provide hands-on experience with:

* Microservices architecture
* Event-driven systems
* Authentication and authorization
* Distributed system design
* Docker and container networking
* Redis messaging patterns
* Resilience and fault tolerance
* Websockets bidirectional communication
* Observability
* CI/CD pipelines
* Security scanning

---

## To start servers

run the following command from project directory ( root dir )

```
docker compose up
```

## License

This project is licensed under the MIT License.
