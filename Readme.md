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
```

---

## 📨 Multichannel Delivery Flow

This diagram illustrates how approval requests are delivered through multiple channels (Slack, Email, SMS) in parallel, with retry logic and failure handling:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'13px'}}}%%
graph TB
    subgraph Start[" Approval Request Initiated "]
        WF["Workflow Created<br/>Status: PENDING<br/>Approver assigned"]
    end

    subgraph DeliveryManager[" Delivery Manager - Parallel Execution "]
        DM["sendApproval<br/>triggered"]
    end

    DM --> SLACK_FLOW
    DM --> EMAIL_FLOW
    DM --> SMS_FLOW

    subgraph SLACK_FLOW[" Channel 1: Slack Delivery "]
        direction TB
        S1["Create Delivery<br/>channel: slack"]
        S2["Lookup Slack<br/>User ID"]
        S3["Build Interactive<br/>Blocks"]
        S4{"Send to<br/>Slack API"}
        S5["Update status<br/>to sent"]
        S6["Log event<br/>sent.slack"]
        SFAIL["Retry scheduled<br/>2 min backoff"]
        
        S1 --> S2 --> S3 --> S4
        S4 -->|Success| S5 --> S6
        S4 -->|Failed| SFAIL
        SFAIL -.retry.-> S4
    end

    subgraph EMAIL_FLOW[" Channel 2: Email Delivery "]
        direction TB
        E1["Create Delivery<br/>channel: email"]
        E2["Generate Approval<br/>Token"]
        E3["Build HTML<br/>Template"]
        E4{"Send via<br/>SMTP"}
        E5["Update status<br/>to sent"]
        E6["Log event<br/>sent.email"]
        EFAIL["Retry scheduled<br/>4 min backoff"]
        
        E1 --> E2 --> E3 --> E4
        E4 -->|Success| E5 --> E6
        E4 -->|Failed| EFAIL
        EFAIL -.retry.-> E4
    end

    subgraph SMS_FLOW[" Channel 3: SMS Delivery Optional "]
        direction TB
        M1["Create Delivery<br/>channel: sms"]
        M2["Format Short<br/>Message"]
        M3{"Send via SMS<br/>Provider"}
        M4["Update status<br/>to sent"]
        M5["Log event<br/>sent.sms"]
        MFAIL["Retry scheduled<br/>5 min backoff"]
        
        M1 --> M2 --> M3
        M3 -->|Success| M4 --> M5
        M3 -->|Failed| MFAIL
        MFAIL -.retry.-> M3
    end

    subgraph RetryLogic[" Retry Logic - Exponential Backoff "]
        direction TB
        R1["Attempt 1<br/>Immediate"]
        R2["Attempt 2<br/>+2 minutes"]
        R3["Attempt 3<br/>+4 minutes"]
        R4{"Max attempts<br/>reached?"}
        R5["Mark as FAILED<br/>Try next channel"]
        R6["Continue<br/>retrying"]
        
        R1 --> R2 --> R3 --> R4
        R4 -->|Yes| R5
        R4 -->|No| R6
    end

    subgraph HumanResponse[" Human Receives and Responds "]
        direction TB
        H1["Manager receives<br/>approval request"]
        H2["Via Slack<br/>Interactive Buttons"]
        H3["Via Email<br/>Click Links"]
        H4["Via SMS<br/>Click Link"]
        H5["Manager clicks<br/>APPROVE"]
        
        H1 --> H2
        H1 --> H3
        H1 --> H4
        H2 --> H5
        H3 --> H5
        H4 --> H5
    end

    subgraph Response[" Response Handling "]
        direction TB
        RH1["Webhook receives<br/>response"]
        RH2["Workflow Manager<br/>processes"]
        RH3["Update Workflow<br/>status: APPROVED"]
        RH4["All channels<br/>notified"]
        
        RH1 --> RH2 --> RH3 --> RH4
    end

    subgraph DeliveryTracking[" Database State "]
        DB1["Delivery Records<br/>slack: sent<br/>email: sent<br/>sms: sent"]
    end

    WF --> DM
    S6 --> H1
    E6 --> H1
    M5 --> H1
    H5 --> RH1

    %% Semantic dark theme colors
    
    %% Start - Initial state (Gray)
    style WF fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    
    %% Delivery Manager - Orchestrator (Purple)
    style DM fill:#7e57c2,stroke:#9575cd,stroke-width:3px,color:#fff
    
    %% Slack Flow - Success path (Green), Failure (Red)
    style S1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style S2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style S3 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style S4 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style S5 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style S6 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    style SFAIL fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    
    %% Email Flow - Success path (Green), Failure (Red)
    style E1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E3 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style E4 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style E5 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style E6 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    style EFAIL fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    
    %% SMS Flow - Success path (Green), Failure (Red)
    style M1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style M2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style M3 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style M4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style M5 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    style MFAIL fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    
    %% Retry Logic - Progressive attempts (Gray to Orange to Red)
    style R1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style R2 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style R3 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style R4 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style R5 fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    style R6 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    
    %% Human Response - User interaction (Yellow for action, Blue for channels)
    style H1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style H2 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style H3 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style H4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style H5 fill:#fdd835,stroke:#ffee58,stroke-width:3px,color:#263238
    
    %% Response Handling - Final processing (Blue to Green)
    style RH1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style RH2 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style RH3 fill:#66bb6a,stroke:#81c784,stroke-width:3px,color:#fff
    style RH4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    
    %% Database State - Storage (Deep blue)
    style DB1 fill:#3949ab,stroke:#5c6bc0,stroke-width:2px,color:#fff
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

## 🗄️ Database Schema Visualization

This entity-relationship diagram shows the database structure and relationships:

```mermaid
%%{init: {'themeVariables': {'scale': 0.5}}}%%
erDiagram
    WORKFLOW ||--o{ WORKFLOW_EVENT : "has many"
    WORKFLOW ||--o{ DELIVERY : "has many"
    WEBHOOK ||..o{ WORKFLOW_EVENT : "notified by"
    
    WORKFLOW {
        string id PK
        string name
        string agentId
        string status "PENDING|APPROVED|REJECTED|etc"
        string actionType
        json actionData
        string approverEmail
        datetime expiresAt
        string timeoutAction "reject|approve|escalate"
        json uiSchema "Dynamic form config"
        string decision "approved|rejected|modified"
        json responseData "Modified values"
        string feedback
        datetime respondedAt
        datetime createdAt
        datetime updatedAt
    }
    
    WORKFLOW_EVENT {
        string id PK
        string workflowId FK
        string type "workflow.created|approved|etc"
        json data "Event payload"
        json stateSnapshot "Complete state for rollback"
        string actor "Who triggered"
        string source "api|slack_webhook|timeout_job"
        datetime timestamp
    }
    
    DELIVERY {
        string id PK
        string workflowId FK
        string channel "slack|email|sms"
        string recipient "email|slack_id|phone"
        string status "pending|sent|delivered|failed"
        int attempts
        int maxAttempts
        datetime nextRetryAt "For retry job"
        string lastError
        json metadata "Channel-specific data"
        datetime sentAt
        datetime deliveredAt
        datetime createdAt
    }
    
    WEBHOOK {
        string id PK
        string url
        string_array events "Event types to listen"
        string secret "For HMAC signature"
        boolean isActive
        datetime createdAt
    }
```

---

## 🏗️ Service Layer Architecture

This diagram illustrates the service layer organization and dependencies:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'13px'}}}%%
graph TB
    subgraph API["API Layer - Express"]
        REST["REST<br/>Endpoints"]
        WH["Webhook<br/>Handlers"]
        WS["WebSocket<br/>Server"]
    end
    
    subgraph Services["Service Layer - Business Logic"]
        WM["Workflow Manager<br/>create workflow<br/>handle approval<br/>execute action<br/>schedule timeout"]
        EM["Event Manager<br/>log event<br/>publish event<br/>get timeline<br/>replay workflow"]
        DM["Delivery Manager<br/>send approval<br/>via Slack/Email<br/>handle retry"]
        SM["State Manager<br/>transition state<br/>validate transition<br/>rollback<br/>get history"]
    end
    
    subgraph Data["Data Layer"]
        PRISMA["Prisma<br/>ORM"]
        PG["PostgreSQL<br/>Database"]
    end
    
    subgraph Infrastructure["Infrastructure Layer"]
        REDIS["Redis<br/>Pub/Sub"]
        BULL["Bull<br/>Queue"]
    end
    
    subgraph External["External Services"]
        SLACK["Slack<br/>API"]
        EMAIL["Email<br/>SMTP"]
        SMS["SMS<br/>Provider"]
    end
    
    %% API to Services
    REST --> WM
    WH --> WM
    REST --> EM
    
    %% Service Dependencies
    WM --> EM
    WM --> DM
    WM --> SM
    WM --> BULL
    
    EM --> REDIS
    EM --> PRISMA
    EM --> WS
    
    DM --> PRISMA
    DM --> EM
    DM --> SLACK
    DM --> EMAIL
    DM --> SMS
    
    SM --> PRISMA
    SM --> EM
    
    %% Data Layer
    PRISMA --> PG
    
    %% Bull Queue
    BULL --> REDIS
    BULL --> WM
    
    %% Semantic color coding with dark theme
    
    %% API Layer - Entry points (Amber/Orange)
    style REST fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style WH fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style WS fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    
    %% Service Layer - Core business logic (Different colors per function)
    style WM fill:#66bb6a,stroke:#81c784,stroke-width:3px,color:#fff
    style EM fill:#42a5f5,stroke:#64b5f6,stroke-width:3px,color:#fff
    style DM fill:#7e57c2,stroke:#9575cd,stroke-width:3px,color:#fff
    style SM fill:#ec407a,stroke:#f06292,stroke-width:3px,color:#fff
    
    %% Data Layer - Storage (Blue shades)
    style PRISMA fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style PG fill:#3949ab,stroke:#5c6bc0,stroke-width:3px,color:#fff
    
    %% Infrastructure - Support systems (Red/Orange)
    style REDIS fill:#ef5350,stroke:#e57373,stroke-width:3px,color:#fff
    style BULL fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    
    %% External Services - Third party (Cyan/Teal)
    style SLACK fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff
    style EMAIL fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff
    style SMS fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff
```

---

## 🔔 Event-Driven Architecture Flow

This comprehensive diagram shows the event-driven architecture with publishers, subscribers, and event timelines:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'13px'}}}%%
graph TB
    subgraph Example3["Example 3: Human Response Flow"]
        direction TB
        EX3A["Human clicks Approve<br/>in Slack"]
        EX3B["Webhook processes<br/>callback"]
        EX3C["Workflow Manager<br/>publishes event"]
        EX3D["Subscribers notified"]
        EX3E["Dashboard updates<br/>Agent notified"]
        
        EX3A --> EX3B --> EX3C --> EX3D --> EX3E
    end
    
    subgraph Example2["Example 2: Delivery Flow"]
        direction TB
        EX2A["Delivery Manager<br/>sends messages"]
        EX2B["Publishes to channels<br/>Slack and Email"]
        EX2C["Subscribers receive"]
        EX2D["Dashboard shows<br/>delivery status"]
        
        EX2A --> EX2B --> EX2C --> EX2D
    end
    
    subgraph Publishers["Event Publishers"]
        WM["Workflow<br/>Manager"]
        DM["Delivery<br/>Manager"]
        SM["State<br/>Manager"]
        BG["Background<br/>Jobs"]
    end
    
    subgraph EventBus["Redis Pub/Sub Event Bus"]
        CHANNEL["workflow_events<br/>channel"]
    end
    
    subgraph Subscribers["Event Subscribers"]
        WS["WebSocket<br/>Server"]
        WEBHOOK["Webhook<br/>Trigger"]
        LOGGER["Event<br/>Logger"]
        METRICS["Metrics<br/>Collector"]
        AGENT["Agent<br/>Notifier"]
    end
    
    %% Publishers to Event Bus
    WM -->|publish| CHANNEL
    DM -->|publish| CHANNEL
    SM -->|publish| CHANNEL
    BG -->|publish| CHANNEL
    
    %% Event Bus to Subscribers
    CHANNEL -->|subscribe| WS
    CHANNEL -->|subscribe| WEBHOOK
    CHANNEL -->|subscribe| LOGGER
    CHANNEL -->|subscribe| METRICS
    CHANNEL -->|subscribe| AGENT
    
    subgraph EventTimeline["Event Timeline"]
        direction TB
        
        subgraph Early["Initial Events"]
            T1["workflow.created<br/>t=0s"]
            T2["approval.sent.slack<br/>t=0.4s"]
            T3["approval.sent.email<br/>t=0.5s"]
        end
        
        subgraph Middle["Human Interaction"]
            T4["human.viewed<br/>t=2min"]
            T5["human.responded<br/>t=5min"]
        end
        
        subgraph Late["Execution Phase"]
            T6["action.executing<br/>t=5min+1s"]
            T7["workflow.completed<br/>t=5min+5s"]
        end
        
        Early --> Middle --> Late
    end
    
    subgraph AlternativeFlows["Alternative Flows"]
        A1["delivery.failed<br/>Retry scheduled"]
        A2["workflow.timeout<br/>Auto action"]
        A3["state.changed<br/>Log transition"]
    end
    
    subgraph Example1["Example 1: Creation Flow"]
        direction TB
        EX1A["Agent requests<br/>approval via API"]
        EX1B["Workflow created<br/>in database"]
        EX1C["Event published<br/>to Redis"]
        EX1D["Subscribers<br/>notified"]
        EX1E["Dashboard shows<br/>new approval"]
        
        EX1A --> EX1B --> EX1C --> EX1D --> EX1E
    end
    
    %% Semantic color coding
    
    %% Redis Event Bus - Critical infrastructure (Red)
    style CHANNEL fill:#ef5350,stroke:#e57373,stroke-width:4px,color:#fff
    
    %% Publishers - Source/Origin (Purple shades)
    style WM fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style DM fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style SM fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style BG fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    
    %% Subscribers - Consumers/Endpoints (Blue shades)
    style WS fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style WEBHOOK fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style LOGGER fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style METRICS fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style AGENT fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    
    %% Timeline - Progressive from start to completion
    style T1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style T2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style T3 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style T4 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style T5 fill:#fdd835,stroke:#ffee58,stroke-width:3px,color:#263238
    style T6 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style T7 fill:#66bb6a,stroke:#81c784,stroke-width:3px,color:#fff
    
    %% Alternative Flows - Status indicators
    style A1 fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    style A2 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style A3 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    
    %% Example 1 - Creation flow (Gray to Blue to Green)
    style EX1A fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style EX1B fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style EX1C fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style EX1D fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style EX1E fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    
    %% Example 2 - Delivery flow (Gray to Purple to Blue to Green)
    style EX2A fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style EX2B fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style EX2C fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style EX2D fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
    
    %% Example 3 - Response flow (Yellow start for human action)
    style EX3A fill:#fdd835,stroke:#ffee58,stroke-width:3px,color:#263238
    style EX3B fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style EX3C fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style EX3D fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style EX3E fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
```

---

## 🎨 Frontend Architecture Diagram

This diagram illustrates the React-based frontend architecture, showing the component hierarchy, state management, real-time communication, and user interaction flows:

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'darkMode':'true', 'background':'#1a1d23', 'primaryColor':'#42a5f5', 'primaryTextColor':'#e3e8ef', 'primaryBorderColor':'#42a5f5', 'lineColor':'#64b5f6', 'secondaryColor':'#5c6bc0', 'tertiaryColor':'#37474f', 'clusterBkg':'#252932', 'clusterBorder':'#546e7a', 'edgeLabelBackground':'#1a1d23', 'fontSize':'13px'}}}%%
graph TB
    subgraph Browser["Browser Environment"]
        
        subgraph Pages["Pages and Routes"]
            DASH["Dashboard<br/>/dashboard"]
            DETAIL["Workflow Detail<br/>/workflow/:id"]
            TIMELINE["Timeline View<br/>/timeline/:id"]
        end

        subgraph Components["UI Components"]
            WC["WorkflowCard<br/>Approval display"]
            AF["ApprovalForm<br/>Dynamic form"]
            TL["TimelineView<br/>Event history"]
            STATUS["StatusBadge<br/>Visual status"]
        end

        subgraph Hooks["Custom Hooks"]
            USE_WS["useWebSocket<br/>Connection mgmt"]
            USE_WF["useWorkflows<br/>Data fetching"]
            USE_RT["useRealTime<br/>Live updates"]
        end

        subgraph State["State Management"]
            CONTEXT["React Context<br/>Global state"]
            WS_STATE["WebSocket<br/>Connection"]
            WF_STATE["Workflows<br/>Data store"]
        end

        subgraph Network["Network Layer"]
            API_CLIENT["API Client<br/>Axios"]
            WS_CLIENT["WebSocket<br/>Socket.io"]
        end
    end

    subgraph Backend["Backend Services"]
        REST_API["REST API<br/>Express<br/>Port 3000"]
        WS_SERVER["WebSocket<br/>Socket.io<br/>Port 3000"]
        REDIS["Redis<br/>Pub/Sub"]
    end

    subgraph UserFlow["User Interaction Flow"]
        direction TB
        U1["User opens<br/>dashboard"]
        U2["Fetch workflows<br/>via API"]
        U3["Connect to<br/>WebSocket"]
        U4["Receive live<br/>events"]
        U5["UI updates<br/>automatically"]
        
        U1 --> U2 --> U3 --> U4 --> U5
    end

    subgraph ApprovalFlow["Approval Action Flow"]
        direction TB
        AP1["User clicks<br/>Approve"]
        AP2["Form submits<br/>POST request"]
        AP3["Backend<br/>processes"]
        AP4["Event broadcast<br/>via WebSocket"]
        AP5["UI reflects<br/>change"]
        
        AP1 --> AP2 --> AP3 --> AP4 --> AP5
    end

    subgraph DynamicUI["Dynamic UI Example"]
        direction TB
        DU1["uiSchema from API<br/>fields: version, confirm"]
        DU2["ApprovalForm<br/>renders dynamic"]
        DU3["Generated form<br/>with fields"]
        
        DU1 --> DU2 --> DU3
    end

    subgraph RealtimeFlow["Real-Time Update"]
        direction TB
        R1["Event occurs<br/>in backend"]
        R2["Redis broadcasts<br/>to subscribers"]
        R3["WebSocket pushes<br/>to clients"]
        R4["React receives<br/>and updates"]
        
        R1 --> R2 --> R3 --> R4
    end

    %% Page to Component
    DASH --> WC
    DASH --> STATUS
    DETAIL --> AF
    DETAIL --> TL

    %% Component to Hook
    WC --> USE_WF
    AF --> USE_WF
    DASH --> USE_WS
    DASH --> USE_RT

    %% Hook to State
    USE_WS --> WS_STATE
    USE_WF --> WF_STATE
    USE_RT --> WF_STATE

    %% State to Context
    WS_STATE --> CONTEXT
    WF_STATE --> CONTEXT

    %% Hook to Network
    USE_WF --> API_CLIENT
    USE_WS --> WS_CLIENT

    %% Network to Backend
    API_CLIENT -->|HTTP| REST_API
    WS_CLIENT -->|WebSocket| WS_SERVER

    %% Backend connections
    WS_SERVER --> REDIS
    REST_API --> REDIS

    %% Semantic dark theme colors
    
    %% Pages - Entry points (Cyan/Teal)
    style DASH fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff
    style DETAIL fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff
    style TIMELINE fill:#26c6da,stroke:#4dd0e1,stroke-width:2px,color:#fff

    %% Components - UI building blocks (Blue)
    style WC fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style AF fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style TL fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style STATUS fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff

    %% Hooks - Logic layer (Purple)
    style USE_WS fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style USE_WF fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style USE_RT fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff

    %% State - Data management (Pink)
    style CONTEXT fill:#ec407a,stroke:#f06292,stroke-width:3px,color:#fff
    style WS_STATE fill:#ec407a,stroke:#f06292,stroke-width:2px,color:#fff
    style WF_STATE fill:#ec407a,stroke:#f06292,stroke-width:2px,color:#fff

    %% Network - Communication (Orange)
    style API_CLIENT fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style WS_CLIENT fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff

    %% Backend - Server side (Green)
    style REST_API fill:#66bb6a,stroke:#81c784,stroke-width:3px,color:#fff
    style WS_SERVER fill:#66bb6a,stroke:#81c784,stroke-width:3px,color:#fff
    style REDIS fill:#ef5350,stroke:#e57373,stroke-width:3px,color:#fff

    %% User Flow - Progressive journey
    style U1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style U2 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style U3 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style U4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style U5 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff

    %% Approval Flow - Action sequence
    style AP1 fill:#fdd835,stroke:#ffee58,stroke-width:2px,color:#263238
    style AP2 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style AP3 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style AP4 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff
    style AP5 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff

    %% Dynamic UI - Schema to render
    style DU1 fill:#5c6bc0,stroke:#7986cb,stroke-width:2px,color:#fff
    style DU2 fill:#7e57c2,stroke:#9575cd,stroke-width:2px,color:#fff
    style DU3 fill:#42a5f5,stroke:#64b5f6,stroke-width:2px,color:#fff

    %% Realtime Flow - Event propagation
    style R1 fill:#546e7a,stroke:#78909c,stroke-width:2px,color:#fff
    style R2 fill:#ef5350,stroke:#e57373,stroke-width:2px,color:#fff
    style R3 fill:#ff9800,stroke:#ffb74d,stroke-width:2px,color:#fff
    style R4 fill:#66bb6a,stroke:#81c784,stroke-width:2px,color:#fff
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
