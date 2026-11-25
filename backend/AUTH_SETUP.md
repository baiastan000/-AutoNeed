# Customer account setup

Customer registration and sign-in use `POST /api/auth/register` and `POST /api/auth/login`. Passwords are stored as salted scrypt hashes in `backend/data/users.json`; the file is ignored by git.

Password recovery uses these endpoints:

- `POST /api/auth/password/forgot`
- `POST /api/auth/password/verify-code`
- `POST /api/auth/password/reset`

Email codes expire after 10 minutes and allow at most five attempts. Add the following values to `backend/.env` to enable delivery through Resend:

```env
RESEND_API_KEY=re_your_api_key
AUTH_EMAIL_FROM=AutoNeed <no-reply@your-verified-domain.com>
```

Verify the sender domain with Resend before using it. The Vite development server proxies `/api` to the backend on port 3001. For a deployed site, deploy the backend and configure a same-origin `/api` proxy to that backend.
