# MongoDB Atlas

The backend connects to the MongoDB Atlas database named `SMS`. It creates the
`students` collection automatically when the first student is added; no SQL
schema initialization is required.

Configure the Atlas connection string in `backend/.env` using
`backend/.env.example` as a template. The seed-list connection string avoids
Node.js SRV DNS lookup failures while still connecting to the Atlas replica
set. The Atlas database user's password must be URL-encoded if it contains
reserved URI characters. Ensure the Atlas Network Access list allows
connections from the machine running the backend.
