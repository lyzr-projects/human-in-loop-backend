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

### 6️⃣ Build the Project

```sh
yarn build
```

### 7️⃣ Start the Backend Server

```sh
yarn dev
```

The backend should now be running! 🚀

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
- Run `yarn prisma migrate dev` if database migrations are needed.

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
   docker remove human-in-loop-backend
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
