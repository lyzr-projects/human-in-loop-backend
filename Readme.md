# Express.js Backend with PostgreSQL Database & Prisma ORM

## 🚀 Getting Started

Follow these steps to set up and run the backend locally.

### 1️⃣ Clone the Repository

```sh
git clone "https://github.com/lyzr-projects/human-in-loop-backend.git"
cd human-in-loop-backend
```

### 2️⃣ Checkout to the Main Branch

```sh
git checkout main
```

### 3️⃣ Install Dependencies

```sh
yarn
```

### 4️⃣ Set Up Environment Variables

- Create a `.env` file in the root directory.
- Obtain the required environment variables from the admin and update the `.env` file accordingly.

### 5️⃣ Generate Prisma Client

```sh
npx prisma generate
```

### 6️⃣ Run Database Migrations

Apply database migrations to create/update tables in PostgreSQL:

```sh
npx prisma migrate dev --name init
```

This command will:

- Create a new migration file in `prisma/migrations/`
- Apply the migration to your PostgreSQL database
- Automatically regenerate the Prisma Client

**Alternative (Quick Sync for Development):**

If you want to quickly sync your schema without creating migration files:

```sh
npx prisma db push
```

### 7️⃣ Build the Project

```sh
yarn build
```

### 8️⃣ Start the Backend Server

```sh
yarn dev
```

The backend should now be running! 🚀

---

## 🗃️ Database & Prisma Management

### Prisma Migrations

Prisma migrations help you manage database schema changes in a controlled and versioned way.

#### Create a New Migration

After making changes to `prisma/schema.prisma`, create a new migration:

```sh
npx prisma migrate dev --name <migration_name>
```

#### Apply Migrations in Production

Deploy pending migrations to production:

```sh
npx prisma migrate deploy
```

#### Check Migration Status

View the status of all migrations:

```sh
npx prisma migrate status
```

#### Reset Database (⚠️ Deletes All Data)

Reset the database and reapply all migrations:

```sh
npx prisma migrate reset
```

**Warning:** This will delete all data in your database!

#### Prisma Studio (Database GUI)

Open a browser-based GUI to view and edit your database:

```sh
npx prisma studio
```

This runs on `http://localhost:5555` by default.

#### Format Prisma Schema

Format your `schema.prisma` file:

```sh
npx prisma format
```

#### Regenerate Prisma Client

If you make changes to your schema without running migrations:

```sh
npx prisma generate
```

---

## 🛠️ Tech Stack

- **Backend:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Package Manager:** Yarn

---

## 📌 Notes

- Ensure you have **Node.js** and **Yarn** installed before proceeding.
- If using a different branch, replace `main` with the appropriate branch name.
- Always run migrations after pulling changes that include schema updates.
- Use `npx prisma studio` to visually inspect your database during development.

---

## 🚨 Redeployment Instructions

The application is deployed using Docker. Follow these steps to redeploy the backend:

1. Navigate to the backend project directory:

   ```sh
   cd projects/human-in-loop-backend
   ```

2. Pull the latest changes from the repository:

   ```sh
   git checkout main  # Replace with your appropriate branch if different
   git pull
   ```

3. Stop and remove the currently running backend container:

   ```sh
   docker stop human-in-loop-backend
   docker rm human-in-loop-backend
   ```

4. Build the new Docker image and run the updated Docker container:

   ```sh
   docker build -t human-in-loop-backend .
   docker run -d \
     --name human-in-loop-backend \
     -p 4000:4000 \
     --env-file .env \
     human-in-loop-backend
   ```

5. **Run database migrations inside the Docker container (if needed):**

   ```sh
   docker exec -it human-in-loop-backend npx prisma migrate deploy
   ```

The updated backend application should now be redeployed successfully! 🎉

---

## 📂 Environment Variables

Below is a list of required environment variables for this backend application:

```env
# Server & App Configuration
PORT=4000
LLM_BACKEND_HOST=your-llm-backend-url

# Database
DATABASE_URL=your-database-url

# Authentication & Security
JWT_SECRET=your-jwt-secret
```

## 📞 Support

For issues or questions, please contact the development team or create an issue in the repository.
