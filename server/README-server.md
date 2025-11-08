Server (Express + MongoDB)

Quickstart

1. Install dependencies:

   npm install

2. Create a .env file in the server/ folder (optional). Environment variables:

   MONGODB_URI=mongodb://127.0.0.1:27017/in-out
   JWT_SECRET=change_this_to_a_secure_value

3. Seed rooms (optional):

   npm run seed

4. Start server:

   npm start

The server listens on port 4000 by default. Set VITE_API_URL in the frontend to point at the server if not running on localhost:4000.

Endpoints implemented (basic):

- POST /auth/signup { email, password, full_name } -> { token, user, profile }
- POST /auth/signin { email, password } -> { token, user, profile }
- GET /auth/me (Authenticated)
- GET /rooms
- GET /rooms/:id
- GET /bookings/mine (Authenticated)
- POST /bookings (Authenticated)
- POST /bookings/:id/cancel (Authenticated)
