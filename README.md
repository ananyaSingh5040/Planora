# Planora

A personal event budget planner that lets you create events, allocate budgets across categories, track expenses, and get AI-generated spending insights — all behind a secure, per-user authentication system.

Live at [planora-orcin.vercel.app](https://planora-orcin.vercel.app)

---

## What it does

You create an event — a wedding, birthday, photoshoot, anything — set a total budget, and break it down into categories like catering, decor, or music. As you log expenses against those categories, Planora tracks what you have spent, what remains, and alerts you when a category goes over its allocation. When you want a second opinion, hitting "Generate Insights" sends your spending data to an AI model that returns three observations, two cost-saving suggestions, and a one-line budget health verdict.

Every user sees only their own events. There is no shared dashboard.

---

## Tech stack

**Frontend**
- React 19 with Vite 8
- React Router v7
- Tailwind CSS v4
- Axios

**Backend**
- Node.js with Express 5
- MongoDB with Mongoose 9
- JSON Web Tokens for authentication
- bcryptjs for password hashing
- Groq SDK with Llama 3.1 8B for AI insights

**Infrastructure**
- Frontend deployed on Vercel
- Backend deployed on Render
- Database on MongoDB Atlas

---

## Project structure

```
Planora/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   └── PrivateRoute.jsx    # Auth guard for protected routes
│   │   └── pages/
│   │       ├── Dashboard.jsx       # Event listing
│   │       ├── CreateEvent.jsx     # New event form
│   │       ├── EventDetails.jsx    # Budget tracking + AI insights
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── index.html
│   └── vercel.json
│
└── backend/
    ├── config/
    │   └── db.js
    ├── middleware/
    │   └── authMiddleware.js       # JWT verification
    ├── models/
    │   ├── User.js
    │   └── Event.js
    ├── routes/
    │   ├── authRoutes.js           # /api/auth/register, /api/auth/login
    │   └── eventRoutes.js          # All event CRUD + AI suggestions
    └── server.js
```

---

## Running locally

**Prerequisites:** Node.js, a MongoDB Atlas cluster, a Groq API key.

**1. Clone the repo**

```bash
git clone https://github.com/your-username/planora.git
cd planora
```

**2. Set up the backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret_string
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

Start the server:

```bash
node server.js
```

**3. Set up the frontend**

```bash
cd ../frontend
npm install
```

Update `src/api/api.js` to point to localhost:

```js
baseURL: "http://localhost:5000/api"
```

Start the dev server:

```bash
npm run dev
```

The app will be at `http://localhost:5173`.

---

## API reference

All `/events` routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Sign in, receive JWT |
| GET | `/api/events` | Get all events for the logged-in user |
| POST | `/api/events` | Create a new event |
| GET | `/api/events/:id` | Get a single event with budget breakdown |
| PUT | `/api/events/:id` | Update event name or budget |
| DELETE | `/api/events/:id` | Delete an event |
| POST | `/api/events/:id/category` | Add a budget category |
| DELETE | `/api/events/:id/category/:name` | Delete a category |
| POST | `/api/events/:id/expense` | Log an expense against a category |
| GET | `/api/events/:id/ai-suggestions` | Get AI budget insights |

---

## Deployment

The frontend is deployed on Vercel with a `vercel.json` rewrite rule so React Router handles all client-side navigation. The backend is a web service on Render with environment variables set in the dashboard. Both point to the same MongoDB Atlas cluster.

To deploy your own copy, set the backend URL in `frontend/src/api/api.js` to your Render service URL, and update the CORS origin in `backend/server.js` to your Vercel URL before pushing.

---

## License

MIT