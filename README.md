# 🌸 PastelCart – A Cute & Secure Online Shop

This is the backend service for PastelCart.

PastelCart is a full-stack e-commerce web application with a soft, pastel-themed UI and secure user authentication. Built using React for the frontend and Node.js + Express for the backend, it features JWT-based authentication and bcrypt password hashing to keep your shopping experience both adorable and safe. 🛍️✨

## 🔐 Features

- User registration & login with JWT auth

- Secure password encryption using bcrypt

- Product browsing in a pastel-themed UI

- Interactive API docs with Swagger UI

- RESTful API using Express.js

## 🛠️ Tech Stack

- Frontend: React, TailwindCSS

- Backend: Node.js, Express

- Authentication: JWT (JSON Web Token), bcrypt

- Database: MySQL

- Other: REST API, Zod, Swagger


## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/ouyniya/pastel-cart.git .


# Install dependencies
npm install

# Start the development server
npm start
```

Create a .env file with:

```bash
JWT_SECRET=your_secret_key

DATABASE_URL=your_db_url
```


## 📚 Swagger UI
Once the server is running, you can explore and test all API routes at:
http://localhost:5001/docs