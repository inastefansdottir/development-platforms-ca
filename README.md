# Development Platforms CA -News Platform API

This project is a REST API for a simple news platform built with Express.js and TypeScript.
It allows users to register, log in, and submit news articles, while anyone can browse published articles.

The project focuses on authentication, database integration, validation, and API structure, with no frontend required.


## Table of Contents  
1. [Technology stack](#technology-stack)
2. [Installation](#installation)
3. [API Endpoints](#api-endpoints)
4. [Database Structure](#database-structure)
5. [Motivation](#motivation)
6. [Testing](#testing)
7. [Author](#author)


## Technology stack  
- Node.js
- Express.js
- TypeScript
- MySQL (mysql2)
- JWT for authentication
- bcrypt for password hashing
- Zod for request validation

## Installation  
To get a local copy of this project up and running:  

1. Clone the repo:  
   ```bash
   git clone https://github.com/inastefansdottir/development-platforms-ca.git
   cd development-platforms-ca

2. Install dependencies:
   ```bash
   npm install

3. Environment variables
   Create a `.env` file in the root of the project:
   ```bash
    PORT=4000
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=development_platforms_ca
    JWT_SECRET=your_jwt_secret_here
   ```
    You can use any strong random string for `JWT_SECRET`.

4. Database setup
   The database schema and sample data are included in:
   ```bash
   database.sql
   ```
   Import it using **MySQL Workbench** or the MySQL CLI:
   ```bash
   mysql -u root -p news_platform < database.sql

5. Start the development server:
   ```bash
   npm run dev
   ```
   Server will start at:
   ```bash
   http://localhost:4000

## API Endpoints

### Authentication
**Register User**
```bash
POST /auth/register
```
Body:
```bash
{
  "email": "user@example.com",
  "password": "password123"
}
```
---

**Login User**
```bash
POST /auth/login
```
Body:
```bash
{
  "email": "user@example.com",
  "password": "password123"
}
```
Returns a JWT token

---

### Articles

**Get all articles (public)**
```bash
GET /articles
```

---

**Create articles (protected)**
```bash
POST /articles
```
Headers:
```bash
Authorization: Bearer <JWT_TOKEN>
```
Body:
```bash
{
  "title": "My article",
  "body": "Article content",
  "category": "news"
}
```

## Database structure

**users**
- id
- email
- password_hash
- created_at

**articles**
- id
- title
- body
- category
- submitted_by (foreign key -> users.id)
- created_at

## Motivation

I chose Option 1 (Express.js API) because I wanted to improve my understanding of Express.js and backend development. I plan to use Express.js as the backend for a real client website in the future, so I wanted to challenge myself by going deeper into how backend systems work in a real-world scenario.

The development process helped me better understand how APIs are structured, how authentication works, and how a database connects to an application. I found the modules in this course to be clear and digestible, which made it easier to understand how the backend works and how to design and interact with a database.

The most challenging part of the project was using TypeScript with Express.js, especially when working with request types, middleware, and database responses. However, working through these challenges helped strengthen my confidence in building backend systems that could be used in real-world products.

Overall, this project gave me valuable experience that I plan to apply to future professional and client-based projects.

## Testing
All endpoints were tesing using **Postman**, including:
- User registration
- Login and JWT authentication
- Protected article creation
- Public article fetching

## Author
Ína S. Stefánsdóttir
