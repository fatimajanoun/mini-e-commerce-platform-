# Mini E-Commerce Platform

A full-stack e-commerce application built with **React, TypeScript, Node.js, Fastify, PostgreSQL, and Sequelize**.

## Features

* User authentication
* Product listing and details
* Product variants and stock
* Cart management
* Wishlist management
* Checkout and order placement
* Stock validation
* Lazy loading
* Database indexing

## Tech Stack

* **Frontend:** React, TypeScript, Vite, React Router
* **Backend:** Node.js, Fastify, Sequelize
* **Database:** PostgreSQL
* **Infrastructure:** Docker & Docker Compose

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/fatimajanoun/mini-e-commerce-platform-.git
cd mini-e-commerce-platform-
```
### 2. Prerequisites

Make sure you have:

* Node.js
* npm
* Docker Desktop

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
POSTGRES_DB=mini_ecommerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432

NODE_ENV=development
API_PORT=3000
WEB_PORT=5173

DATABASE_URL=postgresql://postgres:your_password@postgres:5432/mini_ecommerce
JWT_SECRET=your_jwt_secret
```

Replace your_password with your PostgreSQL password and your_jwt_secret with a secure secret used to sign JWT tokens.

### 4. Start the Application

From the project root:

```bash
docker compose up --build
```

This starts:

* PostgreSQL
* API
* Web frontend

### 5. Run Database Migrations

In another terminal, from the project root:

```bash
cd apps/api
npx sequelize db:migrate
```

### 6. Seed the Database

After running the migrations:

```bash
npx sequelize db:seed:all
```

This populates the database with the required test data.

### 7. Open the Application

Open:

```text
http://localhost:5173
```

The API is available at:

```text
http://localhost:3000
```

### 8. Test Account

Use this account to test authenticated features:

```text
Email: test@example.com
Password: Test123!
```

You can test:

* Cart
* Wishlist
* Checkout
* Orders

## Useful Commands

Stop the application:

```bash
docker compose down
```

View running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

## Ports

| Service    | Port |
| ---------- | ---: |
| Web        | 5173 |
| API        | 3000 |
| PostgreSQL | 5432 |
