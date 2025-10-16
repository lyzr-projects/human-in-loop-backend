# Express.js Backend with PostgreSQL Database & Prisma ORM

## 📐 Architecture Overview

The following diagram illustrates the system architecture and component interactions:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'14px'}}}%%
graph TB
    subgraph "AI Agents"
        A1[Marketing Agent]
        A2[DevOps Agent]
        A3[Finance Agent]
    end
    subgraph "API Layer - Express + TypeScript"
        API[REST API]
        WS[WebSocket Server]
    end
    subgraph "Core Services"
        WM[Workflow Manager]
        EM[Event Manager]
        DM[Delivery Manager]
        SM[State Manager]
    end
    subgraph "Background Jobs - Bull Queue"
        TJ[Timeout Job]
        RJ[Retry Job]
        EJ[Escalation Job]
    end
    subgraph "Database - PostgreSQL + Prisma"
        DB[(Database)]
        W[Workflows]
        E[Events]
        D[Deliveries]
        WH[Webhooks]
    end
    subgraph "Message Channels"
        SLACK[Slack API]
        EMAIL[Email - Nodemailer]
        SMS[SMS Provider]
    end
    subgraph "Event Bus - Redis Pub/Sub"
        REDIS[(Redis)]
    end
    subgraph "Human Interfaces"
        WEB[Web Dashboard]
        SLACK_UI[Slack Messages]
        EMAIL_UI[Email Links]
    end
    subgraph "External Systems"
        WEBHOOK_EXT[External Webhooks]
    end
    %% Agent to API
    A1 --> API
    A2 --> API
    A3 --> API
    %% API to Services
    API --> WM
    API --> EM
    
    %% Workflow Manager interactions
    WM --> DB
    WM --> EM
    WM --> DM
    WM --> REDIS
    %% Event Manager
    EM --> DB
    EM --> REDIS
    EM --> WEBHOOK_EXT
    %% Delivery Manager
    DM --> DB
    DM --> SLACK
    DM --> EMAIL
    DM --> SMS
    DM --> REDIS
    %% State Manager
    SM --> DB
    SM --> EM
    %% Redis to Jobs
    REDIS --> TJ
    REDIS --> RJ
    REDIS --> EJ
    %% Jobs back to services
    TJ --> WM
    RJ --> DM
    EJ --> WM
    %% Database tables
    DB --> W
    DB --> E
    DB --> D
    DB --> WH
    %% Human responses
    SLACK_UI --> API
    EMAIL_UI --> API
    WEB --> API
    %% WebSocket updates
    WS --> WEB
    REDIS --> WS
    %% Channels to Human
    SLACK --> SLACK_UI
    EMAIL --> EMAIL_UI
    
    %% Softer, eye-friendly styling
    style API fill:#5cb85c,stroke:#81c784,stroke-width:2px,color:#fff
    style WS fill:#5cb85c,stroke:#81c784,stroke-width:2px,color:#fff
    style REDIS fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    style DB fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style WEB fill:#4dd0e1,stroke:#80deea,stroke-width:2px,color:#263238
    style SLACK fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style SLACK_UI fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style EMAIL fill:#ff7043,stroke:#ff8a65,stroke-width:2px,color:#fff
    style EMAIL_UI fill:#ff7043,stroke:#ff8a65,stroke-width:2px,color:#fff
    style SMS fill:#78909c,stroke:#90a4ae,stroke-width:2px,color:#fff
    style WM fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style EM fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style DM fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style SM fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style TJ fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style RJ fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style EJ fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style WEBHOOK_EXT fill:#ffa726,stroke:#ffb74d,stroke-width:2px,color:#fff
    style A1 fill:#37474f,stroke:#546e7a,stroke-width:2px,color:#e3e8ef
    style A2 fill:#37474f,stroke:#546e7a,stroke-width:2px,color:#e3e8ef
    style A3 fill:#37474f,stroke:#546e7a,stroke-width:2px,color:#e3e8ef
    style W fill:#37474f,stroke:#546e7a,stroke-width:1px,color:#e3e8ef
    style E fill:#37474f,stroke:#546e7a,stroke-width:1px,color:#e3e8ef
    style D fill:#37474f,stroke:#546e7a,stroke-width:1px,color:#e3e8ef
    style WH fill:#37474f,stroke:#546e7a,stroke-width:1px,color:#e3e8ef
```

---

## 🔄 Approval Request Flow

This sequence diagram shows how a single approval request moves through the system:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 
  'background':'#000000',
  'mainBkg':'#000000',
  'secondBkg':'#1a1d23',
  'tertiaryBkg':'#252932',
  'primaryColor':'#42a5f5',
  'primaryTextColor':'#ffffff',
  'primaryBorderColor':'#90caf9',
  'lineColor':'#90caf9',
  'secondaryColor':'#5c6bc0',
  'tertiaryColor':'#7986cb',
  'actorBkg':'#37474f',
  'actorBorder':'#90caf9',
  'actorTextColor':'#ffffff',
  'actorLineColor':'#90caf9',
  'signalColor':'#90caf9',
  'signalTextColor':'#ffffff',
  'labelBoxBkgColor':'#252932',
  'labelBoxBorderColor':'#90caf9',
  'labelTextColor':'#ffffff',
  'loopTextColor':'#ffffff',
  'noteBorderColor':'#546e7a',
  'noteBkgColor':'#1a1d23',
  'noteTextColor':'#e3e8ef',
  'activationBorderColor':'#90caf9',
  'activationBkgColor':'#5c6bc0',
  'sequenceNumberColor':'#ffffff',
  'sectionBkgColor':'#1a1d23',
  'altSectionBkgColor':'#252932',
  'sectionBkgColor2':'#2c3e50',
  'taskBorderColor':'#90caf9',
  'taskBkgColor':'#3949ab',
  'taskTextColor':'#ffffff',
  'activeTaskBorderColor':'#90caf9',
  'activeTaskBkgColor':'#5c6bc0',
  'gridColor':'#37474f',
  'doneTaskBkgColor':'#66bb6a',
  'doneTaskBorderColor':'#81c784',
  'critBkgColor':'#ef5350',
  'critBorderColor':'#e57373',
  'todayLineColor':'#42a5f5',
  'fontSize':'16px',
  'fontFamily':'Arial, sans-serif'
}}}%%
sequenceDiagram
    participant Agent as AI Agent
    participant API as API Server
    participant WM as Workflow Manager
    participant EM as Event Manager
    participant DM as Delivery Manager
    participant DB as PostgreSQL
    participant Redis as Redis Pub/Sub
    participant BG as Background Jobs
    participant Slack as Slack API
    participant Email as Email Service
    participant Human as Human Approver
    participant WS as WebSocket
    
    rect rgb(26, 29, 35)
    Note over Agent,API: Step 1: Agent Requests Approval
    Agent->>+API: POST /workflows/create
    Note right of Agent: actionType, actionData, uiSchema
    
    API->>+WM: createWorkflow()
    WM->>+DB: Insert Workflow (PENDING)
    DB-->>-WM: workflow created
    
    WM->>+EM: emit workflow.created
    EM->>DB: Insert Event + snapshot
    EM->>Redis: publish workflow.created
    EM-->>-WM: acknowledged
    end
    
    rect rgb(37, 47, 55)
    Note over WM,Email: Step 2: Multi-Channel Delivery
    WM->>+DM: sendApproval(workflow)
    
    par Slack Channel
        DM->>DB: Insert Delivery (slack)
        DM->>+Slack: Send interactive message
        Slack-->>-DM: message_id
        DM->>DB: Update Delivery (sent)
        DM->>EM: emit approval.sent.slack
    and Email Channel
        DM->>DB: Insert Delivery (email)
        DM->>+Email: Send approval email
        Email-->>-DM: email_id
        DM->>DB: Update Delivery (sent)
        DM->>EM: emit approval.sent.email
    end
    
    DM-->>-WM: delivery complete
    EM->>Redis: publish events
    Redis->>+WS: broadcast to dashboard
    WS->>Human: Real-time update
    WS-->>-Redis: acknowledged
    end
    
    rect rgb(26, 29, 35)
    Note over WM,BG: Step 3: Schedule Timeout
    WM->>Redis: schedule timeout job
    Redis->>+BG: enqueue(workflowId, expiresAt)
    BG-->>-Redis: job scheduled
    WM-->>-API: workflow created
    API-->>-Agent: workflowId, status: PENDING
    end
    
    rect rgb(50, 80, 70)
    Note over Human,API: Step 4: Human Responds (Success Path)
    Human->>Slack: Click "Approve"
    Slack->>+API: POST /webhooks/slack/callback
    Note right of Slack: workflowId, decision: approved
    
    API->>+WM: handleApproval(workflowId, decision)
    WM->>DB: Update Workflow (APPROVED)
    
    WM->>+EM: emit human.responded
    EM->>DB: Insert Event + snapshot
    EM->>Redis: publish human.responded
    EM-->>-WM: acknowledged
    end
    
    rect rgb(37, 47, 55)
    Note over WM,Redis: Step 5: Cancel Timeout & Execute
    WM->>Redis: cancel timeout job
    Redis-->>WM: job cancelled
    
    WM->>WM: executeAction()
    WM->>DB: Update Workflow (EXECUTING)
    WM->>EM: emit action.executing
    
    Note over WM: Perform actual action<br/>(send email, deploy, etc)
    
    WM->>DB: Update Workflow (COMPLETED)
    WM->>+EM: emit workflow.completed
    EM->>DB: Insert Event + snapshot
    EM->>Redis: publish workflow.completed
    EM-->>-WM: acknowledged
    WM-->>-API: execution complete
    API-->>-Slack: acknowledged
    end
    
    rect rgb(26, 29, 35)
    Note over Redis,Human: Step 6: Notify Completion
    Redis->>Agent: workflow completed
    Redis->>+WS: broadcast update
    WS->>Human: Show completion status
    WS-->>-Redis: acknowledged
    end
    
    rect rgb(60, 40, 30)
    Note over BG,Human: Alternative: Timeout Scenario
    BG->>DB: Check expired workflows
    BG->>+WM: handleTimeout(workflowId)
    WM->>DB: Update Workflow (TIMEOUT)
    WM->>+EM: emit workflow.timeout
    EM->>Redis: publish workflow.timeout
    EM-->>-WM: acknowledged
    WM-->>-BG: timeout handled
    end
    
    %% Color coding participant boxes to match architecture diagram
    %%{init: {'themeVariables': {
      'actor1Bkg':'#37474f',
      'actor2Bkg':'#5cb85c',
      'actor3Bkg':'#5c6bc0',
      'actor4Bkg':'#5c6bc0',
      'actor5Bkg':'#5c6bc0',
      'actor6Bkg':'#42a5f5',
      'actor7Bkg':'#ef5350',
      'actor8Bkg':'#546e7a',
      'actor9Bkg':'#7e57c2',
      'actor10Bkg':'#ff7043',
      'actor11Bkg':'#37474f',
      'actor12Bkg':'#5cb85c'
    }}}%%
```

---

## 🔀 State Management & Event Flow

This diagram shows how state transitions, event logs, snapshots, and retry logic work together:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'14px'}}}%%
graph TB
    subgraph StateTransitions["State Transitions"]
        S1[PENDING]
        S2[APPROVED]
        S3[REJECTED]
        S4[EXECUTING]
        S5[COMPLETED]
        S6[FAILED]
        S7[TIMEOUT]
        
        S1 -->|human approves| S2
        S1 -->|human rejects| S3
        S1 -->|no response| S7
        S2 -->|execute action| S4
        S4 -->|success| S5
        S4 -->|error| S6
    end
    
    subgraph EventLog["Event Log Pattern"]
        E1[workflow.created]
        E2[approval.sent.slack]
        E3[approval.sent.email]
        E4[human.viewed]
        E5[human.responded]
        E6[action.executing]
        E7[workflow.completed]
        
        E1 --> E2
        E2 --> E3
        E3 --> E4
        E4 --> E5
        E5 --> E6
        E6 --> E7
    end
    
    subgraph Snapshots["State Snapshots for Rollback"]
        SNAP1["Snapshot 1<br/>Status: PENDING"]
        SNAP2["Snapshot 2<br/>Status: APPROVED"]
        SNAP3["Snapshot 3<br/>Status: EXECUTING"]
        SNAP4["Snapshot 4<br/>Status: COMPLETED"]
        
        SNAP1 --> SNAP2
        SNAP2 --> SNAP3
        SNAP3 --> SNAP4
    end
    
    subgraph RetryLogic["Retry Logic Flow"]
        R1[Delivery Created]
        R2{Sent Successfully?}
        R3[Mark as SENT]
        R4[Increment attempts]
        R5{Max attempts reached?}
        R6[Schedule retry]
        R7[Mark as FAILED]
        
        R1 --> R2
        R2 -->|Yes| R3
        R2 -->|No| R4
        R4 --> R5
        R5 -->|No| R6
        R5 -->|Yes| R7
        R6 --> R1
    end
    
    E1 -.stores.-> SNAP1
    E5 -.stores.-> SNAP2
    E6 -.stores.-> SNAP3
    E7 -.stores.-> SNAP4
    
    S1 -.triggers.-> E1
    S2 -.triggers.-> E5
    S4 -.triggers.-> E6
    
    %% Eye-friendly styling
    style S1 fill:#fdd835,stroke:#f9a825,stroke-width:2px,color:#263238
    style S2 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    style S3 fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    style S4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style S5 fill:#5cb85c,stroke:#81c784,stroke-width:2px,color:#fff
    style S6 fill:#d32f2f,stroke:#e57373,stroke-width:2px,color:#fff
    style S7 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    
    style E1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E3 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E4 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E5 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E6 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E7 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    
    style SNAP1 fill:#37474f,stroke:#64b5f6,stroke-width:2px,color:#e3e8ef
    style SNAP2 fill:#37474f,stroke:#64b5f6,stroke-width:2px,color:#e3e8ef
    style SNAP3 fill:#37474f,stroke:#64b5f6,stroke-width:2px,color:#e3e8ef
    style SNAP4 fill:#37474f,stroke:#64b5f6,stroke-width:2px,color:#e3e8ef
    
    style R1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style R2 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style R3 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    style R4 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style R5 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style R6 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style R7 fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
```

---

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
