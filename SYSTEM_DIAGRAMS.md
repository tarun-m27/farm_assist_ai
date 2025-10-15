# Farm Assist AI - System Diagrams and Flowcharts

## Block Diagram - System Architecture

```
                    FARM ASSIST AI SYSTEM ARCHITECTURE
                             ┌─────────────────────┐
                             │                     │
                             │    USER LAYER       │
                             │                     │
                             └──────────┬──────────┘
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
    │                 │       │                 │       │                 │
    │  REACT FRONTEND │       │   NEXT.JS       │       │   API CLIENTS   │
    │  (User Portal)  │       │ ADMIN DASHBOARD │       │  (Mobile Apps)  │
    │                 │       │                 │       │                 │
    └─────────┬───────┘       └─────────┬───────┘       └─────────┬───────┘
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        │
                                        ▼
                           ┌─────────────────────────────────┐
                           │                                 │
                           │        BACKEND LAYER            │
                           │     (Node.js + Express)         │
                           │                                 │
                           │  ┌─────────────────────────────┐│
                           │  │     AUTHENTICATION          ││
                           │  │   (JWT + bcryptjs)          ││
                           │  └─────────────────────────────┘│
                           │                                 │
                           │  ┌─────────────────────────────┐│
                           │  │     ROUTE HANDLERS          ││
                           │  │  • User Management          ││
                           │  │  • Disease Prediction       ││
                           │  │  • Chatbot                  ││
                           │  │  • Payment Processing       ││
                           │  │  • Admin Functions          ││
                           │  └─────────────────────────────┘│
                           │                                 │
                           └─────────────┬───────────────────┘
                                         │
                     ┌───────────────────┼───────────────────┐
                     │                   │                   │
                     ▼                   ▼                   ▼
           ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
           │                 │ │                 │ │                 │
           │   DATABASE      │ │   ML SERVICE    │ │   EXTERNAL      │
           │     LAYER       │ │     LAYER       │ │    SERVICES     │
           │                 │ │                 │ │                 │
           │ ┌─────────────┐ │ │ ┌─────────────┐ │ │ ┌─────────────┐ │
           │ │  MONGODB    │ │ │ │   FASTAPI   │ │ │ │   GEMINI    │ │
           │ │   ATLAS     │ │ │ │   SERVER    │ │ │ │     AI      │ │
           │ │             │ │ │ │             │ │ │ │             │ │
           │ │ • Users     │ │ │ │ • CNN Model │ │ │ │ • Treatment │ │
           │ │ • Requests  │ │ │ │ • MobileNet │ │ │ │   Advice    │ │
           │ │ • Payments  │ │ │ │ • Image     │ │ │ │             │ │
           │ │ • Analytics │ │ │ │   Processing│ │ │ │             │ │
           │ └─────────────┘ │ │ └─────────────┘ │ │ └─────────────┘ │
           │                 │ │                 │ │                 │
           └─────────────────┘ │                 │ │ ┌─────────────┐ │
                               │                 │ │ │ OPENROUTER  │ │
                               │                 │ │ │  GPT-3.5    │ │
                               │                 │ │ │             │ │
                               │                 │ │ │ • Chatbot   │ │
                               │                 │ │ │   Responses │ │
                               │                 │ │ └─────────────┘ │
                               │                 │ │                 │
                               └─────────────────┘ │ ┌─────────────┐ │
                                                   │ │ CLOUDINARY  │ │
                                                   │ │             │ │
                                                   │ │ • Image     │ │
                                                   │ │   Storage   │ │
                                                   │ │ • CDN       │ │
                                                   │ └─────────────┘ │
                                                   │                 │
                                                   │ ┌─────────────┐ │
                                                   │ │  RAZORPAY   │ │
                                                   │ │             │ │
                                                   │ │ • Payment   │ │
                                                   │ │   Gateway   │ │
                                                   │ └─────────────┘ │
                                                   │                 │
                                                   └─────────────────┘
```

## Data Flow Diagram

```
                              DATA FLOW DIAGRAM
                           PLANT DISEASE DETECTION

START
  │
  ▼
┌─────────────────┐
│  USER UPLOADS   │
│  PLANT IMAGE    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │───▶│   BACKEND API   │
│  VALIDATION     │    │  AUTHENTICATION │
└─────────────────┘    └─────────┬───────┘
                                 │
                                 ▼
                       ┌─────────────────┐
                       │  CHECK USER     │
                       │   ATTEMPTS      │
                       └─────────┬───────┘
                                 │
                                 ▼
                       ┌─────────────────┐
                       │  FORWARD TO     │
                       │  ML SERVICE     │
                       └─────────┬───────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────┐
│                ML SERVICE                           │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   IMAGE     │  │  VALIDATE   │  │ PREPROCESS  │ │
│  │  RECEIVED   │─▶│  AS PLANT   │─▶│   IMAGE     │ │
│  └─────────────┘  └─────────────┘  └─────────┬───┘ │
│                                               │     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┴───┐ │
│  │   RETURN    │  │ CALCULATE   │  │  RUN CNN    │ │
│  │  RESULTS    │◀─│ CONFIDENCE  │◀─│ PREDICTION  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────┬───────────────────────────────────────┘
              │
              ▼
    ┌─────────────────┐
    │   BACKEND API   │
    │   PROCESSING    │
    └─────────┬───────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│              PARALLEL PROCESSING                    │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   GEMINI    │  │ CLOUDINARY  │  │  DATABASE   │ │
│  │ TREATMENT   │  │   IMAGE     │  │   UPDATE    │ │
│  │   ADVICE    │  │  STORAGE    │  │   HISTORY   │ │
│  └─────────┬───┘  └─────────┬───┘  └─────────┬───┘ │
└────────────┼────────────────┼────────────────┼─────┘
             │                │                │
             ▼                ▼                ▼
       ┌─────────────────────────────────────────────┐
       │          CONSOLIDATE RESPONSE               │
       │                                             │
       │  • Disease Classification                   │
       │  • Confidence Score                         │
       │  • Treatment Recommendations                │
       │  • Rot Percentage                          │
       │  • Image URL                               │
       │  • Remaining Attempts                      │
       └─────────────────┬───────────────────────────┘
                         │
                         ▼
                 ┌─────────────────┐
                 │   SEND TO       │
                 │   FRONTEND      │
                 └─────────┬───────┘
                           │
                           ▼
                 ┌─────────────────┐
                 │   DISPLAY       │
                 │   RESULTS       │
                 └─────────────────┘
                           │
                           ▼
                         END
```

## User Journey Flowchart

```
                           USER JOURNEY FLOWCHART

                              ┌─────────────┐
                              │    START    │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │   VISITOR   │
                              └──────┬──────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ NEW USER?   │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │ YES            │                │ NO
                    ▼                ▼                ▼
            ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
            │   SIGN UP   │   │   SIGN IN   │  │   SIGN IN   │
            └──────┬──────┘   └──────┬──────┘  └──────┬──────┘
                   │                 │                │
                   └─────────────────┼────────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │  DASHBOARD  │
                              └──────┬──────┘
                                     │
                          ┌──────────┼──────────┐
                          │          │          │
                          ▼          ▼          ▼
                  ┌─────────────┐ ┌──────┐ ┌─────────────┐
                  │   DISEASE   │ │CHAT  │ │   ACCOUNT   │
                  │ DETECTION   │ │ BOT  │ │ MANAGEMENT  │
                  └──────┬──────┘ └──┬───┘ └──────┬──────┘
                         │           │            │
                         ▼           ▼            ▼
                  ┌─────────────┐ ┌──────┐ ┌─────────────┐
                  │   UPLOAD    │ │ ASK  │ │  VIEW API   │
                  │    IMAGE    │ │QUEST │ │    USAGE    │
                  └──────┬──────┘ │ ION  │ └──────┬──────┘
                         │        └──┬───┘        │
                         ▼           ▼            ▼
                  ┌─────────────┐ ┌──────┐ ┌─────────────┐
                  │  ATTEMPTS   │ │GET   │ │  PURCHASE   │
                  │ REMAINING?  │ │ANSW  │ │    PLAN     │
                  └──────┬──────┘ │ ER   │ └──────┬──────┘
                         │        └──────┘        │
              ┌─────────┼─────────┐               │
              │ YES     │         │ NO            │
              ▼         ▼         ▼               ▼
      ┌─────────────┐ ┌───────┐ ┌──────┐  ┌─────────────┐
      │  GET PRED   │ │UPGRADE│ │ END  │  │  RAZORPAY   │
      │  ICTION     │ │ PLAN  │ │      │  │  PAYMENT    │
      └──────┬──────┘ └───────┘ └──────┘  └──────┬──────┘
             │                                   │
             ▼                                   ▼
      ┌─────────────┐                    ┌─────────────┐
      │   DISPLAY   │                    │  PAYMENT    │
      │   RESULTS   │                    │  SUCCESS?   │
      └──────┬──────┘                    └──────┬──────┘
             │                                  │
             ▼                        ┌─────────┼─────────┐
      ┌─────────────┐                 │ YES     │         │ NO
      │   SAVE TO   │                 ▼         ▼         ▼
      │   HISTORY   │          ┌─────────────┐ ┌───────┐ ┌──────┐
      └──────┬──────┘          │  ACTIVATE   │ │RETRY  │ │CANCEL│
             │                 │   PLAN      │ │      │ │      │
             ▼                 └─────────────┘ └───────┘ └──────┘
      ┌─────────────┐
      │    END      │
      └─────────────┘
```

## Database Entity Relationship Diagram

```
                    DATABASE SCHEMA RELATIONSHIPS

┌─────────────────────────────────────────────────────────────┐
│                          USERS                              │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PRIMARY KEY)                                 │
│ name: String                                                │
│ email: String (UNIQUE)                                      │
│ password: String (HASHED)                                   │
│ api_key: String                                             │
│ apiKeyActive: Boolean                                       │
│ apiUsageCount: Number                                       │
│ totalRemaining: Number                                      │
│ lastRequestAt: Date                                         │
│ role: String (enum: ["user", "admin"])                      │
│ createdAt: Date                                             │
│ lastRequests: [RequestSchema] (EMBEDDED)                    │
│ payments: [PaymentSchema] (EMBEDDED)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ 1:N (EMBEDDED)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      REQUESTS                               │
├─────────────────────────────────────────────────────────────┤
│ imageUrl: String                                            │
│ fileName: String                                            │
│ date: Date                                                  │
│ result: String                                              │
│ confidence: Number                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      PAYMENTS                               │
├─────────────────────────────────────────────────────────────┤
│ paymentId: String                                           │
│ plan: String                                                │
│ amount: Number                                              │
│ date: Date                                                  │
│ status: String                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  REQUEST_TRACKING                           │
├─────────────────────────────────────────────────────────────┤
│ _id: ObjectId (PRIMARY KEY)                                 │
│ requestType: String (enum: ["web", "api"])                  │
│ endpoint: String                                            │
│ timestamp: Date (DEFAULT: NOW)                              │
└─────────────────────────────────────────────────────────────┘

                        RELATIONSHIPS:
                   ┌────────────────────────┐
                   │       USERS            │
                   └────────┬───────────────┘
                            │
                            │ 1:N (Embedded)
                            ▼
                   ┌────────────────────────┐
                   │     LAST_REQUESTS      │
                   │   (Max 5 records)      │
                   └────────────────────────┘

                   ┌────────────────────────┐
                   │       USERS            │
                   └────────┬───────────────┘
                            │
                            │ 1:N (Embedded)
                            ▼
                   ┌────────────────────────┐
                   │      PAYMENTS          │
                   └────────────────────────┘

External References:
- Cloudinary URLs (imageUrl in Requests)
- Razorpay Payment IDs (paymentId in Payments)
```

## API Architecture Diagram

```
                            API ARCHITECTURE

                        ┌─────────────────┐
                        │   CLIENT APPS   │
                        │                 │
                        │ • React Web     │
                        │ • Next.js Admin │
                        │ • Mobile Apps   │
                        │ • Third-party   │
                        └─────────┬───────┘
                                  │
                          HTTP/HTTPS Requests
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │      LOAD BALANCER          │
                    │        (Optional)           │
                    └─────────────┬───────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │        BACKEND API          │
                    │     (Express.js)            │
                    │                             │
                    │  ┌─────────────────────┐    │
                    │  │    MIDDLEWARE       │    │
                    │  │                     │    │
                    │  │ • CORS             │    │
                    │  │ • Body Parser      │    │
                    │  │ • Multer           │    │
                    │  │ • Authentication   │    │
                    │  │ • Rate Limiting    │    │
                    │  └─────────────────────┘    │
                    │                             │
                    │  ┌─────────────────────┐    │
                    │  │      ROUTES         │    │
                    │  │                     │    │
                    │  │ /api/user/*        │    │
                    │  │ /api/predict/*     │    │
                    │  │ /api/chat/*        │    │
                    │  │ /api/payment/*     │    │
                    │  │ /api/admin/*       │    │
                    │  └─────────────────────┘    │
                    │                             │
                    │  ┌─────────────────────┐    │
                    │  │    CONTROLLERS      │    │
                    │  │                     │    │
                    │  │ • User Controller   │    │
                    │  │ • Disease Controller│    │
                    │  │ • Chat Controller   │    │
                    │  │ • Payment Controller│    │
                    │  │ • Admin Controller  │    │
                    │  └─────────────────────┘    │
                    └─────────────┬───────────────┘
                                  │
                  ┌───────────────┼───────────────┐
                  │               │               │
                  ▼               ▼               ▼
        ┌─────────────────┐ ┌──────────┐ ┌─────────────────┐
        │   ML SERVICE    │ │ DATABASE │ │   EXTERNAL      │
        │   (FastAPI)     │ │ (MongoDB)│ │   SERVICES      │
        │                 │ │          │ │                 │
        │ ┌─────────────┐ │ │ • Users  │ │ • Google Gemini │
        │ │   /predict1 │ │ │ • Tracks │ │ • OpenRouter    │
        │ │             │ │ │          │ │ • Cloudinary    │
        │ │ CNN Model   │ │ │          │ │ • Razorpay      │
        │ │ (MobileNet) │ │ │          │ │                 │
        │ └─────────────┘ │ │          │ │                 │
        │                 │ │          │ │                 │
        └─────────────────┘ └──────────┘ └─────────────────┘

                        REQUEST FLOW:
                  ┌──────────────────────────┐
                  │  1. Client sends request │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  2. Middleware processes │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  3. Route matches        │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  4. Controller handles   │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  5. External services    │
                  └─────────────┬────────────┘
                                │
                                ▼
                  ┌──────────────────────────┐
                  │  6. Response sent back   │
                  └──────────────────────────┘
```

## Security Architecture

```
                           SECURITY ARCHITECTURE

                    ┌─────────────────────────────┐
                    │        CLIENT SIDE          │
                    │                             │
                    │ • HTTPS Only               │
                    │ • Input Validation         │
                    │ • JWT Token Storage        │
                    │ • CSRF Protection          │
                    └─────────────┬───────────────┘
                                  │
                              HTTPS/TLS
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │       BACKEND API           │
                    │                             │
                    │ ┌─────────────────────────┐ │
                    │ │   AUTHENTICATION        │ │
                    │ │                         │ │
                    │ │ • JWT Verification      │ │
                    │ │ • API Key Validation    │ │
                    │ │ • Role-based Access     │ │
                    │ │ • Session Management    │ │
                    │ └─────────────────────────┘ │
                    │                             │
                    │ ┌─────────────────────────┐ │
                    │ │   INPUT VALIDATION      │ │
                    │ │                         │ │
                    │ │ • File Type Checking    │ │
                    │ │ • Size Limitations      │ │
                    │ │ • SQL Injection Prev.   │ │
                    │ │ • XSS Protection        │ │
                    │ └─────────────────────────┘ │
                    │                             │
                    │ ┌─────────────────────────┐ │
                    │ │   RATE LIMITING         │ │
                    │ │                         │ │
                    │ │ • API Call Limits       │ │
                    │ │ • IP-based Throttling   │ │
                    │ │ • Abuse Detection       │ │
                    │ └─────────────────────────┘ │
                    │                             │
                    │ ┌─────────────────────────┐ │
                    │ │   CORS CONFIGURATION    │ │
                    │ │                         │ │
                    │ │ • Origin Restrictions   │ │
                    │ │ • Method Limitations    │ │
                    │ │ • Header Controls       │ │
                    │ └─────────────────────────┘ │
                    └─────────────┬───────────────┘
                                  │
                      ┌───────────┼───────────┐
                      │           │           │
                      ▼           ▼           ▼
            ┌─────────────┐ ┌──────────┐ ┌──────────────┐
            │  DATABASE   │ │   FILES  │ │   EXTERNAL   │
            │  SECURITY   │ │ SECURITY │ │   SERVICES   │
            │             │ │          │ │              │
            │ • MongoDB   │ │ • Cloud  │ │ • API Keys   │
            │   Atlas     │ │   Storage│ │   in Env     │
            │ • Encrypted │ │ • Secure │ │ • HTTPS Only │
            │   at Rest   │ │   URLs   │ │ • OAuth 2.0  │
            │ • Network   │ │ • Access │ │              │
            │   Isolation │ │   Controls│ │              │
            └─────────────┘ └──────────┘ └──────────────┘

                    SECURITY MEASURES BY LAYER:

                ┌──────────────────────────────────┐
                │        APPLICATION LAYER         │
                │                                  │
                │ • Password Hashing (bcryptjs)    │
                │ • JWT Token Expiration           │
                │ • Environment Variable Security  │
                │ • Error Message Sanitization     │
                └──────────────────────────────────┘

                ┌──────────────────────────────────┐
                │         NETWORK LAYER            │
                │                                  │
                │ • HTTPS/TLS 1.3                  │
                │ • Firewall Rules                 │
                │ • VPN Access (Production)        │
                │ • DDoS Protection                │
                └──────────────────────────────────┘

                ┌──────────────────────────────────┐
                │         INFRASTRUCTURE           │
                │                                  │
                │ • Cloud Security Groups          │
                │ • Regular Security Updates       │
                │ • Monitoring & Logging           │
                │ • Backup Encryption              │
                └──────────────────────────────────┘
```

This comprehensive set of diagrams and flowcharts provides visual representations of:

1. **Block Diagram**: Complete system architecture overview
2. **Data Flow Diagram**: Step-by-step process flow for disease detection
3. **User Journey Flowchart**: User experience paths and decision points
4. **Database ERD**: Data relationships and schema structure  
5. **API Architecture**: Technical API structure and request flow
6. **Security Architecture**: Multi-layer security implementation

These diagrams complement the detailed documentation and help visualize the complete Farm Assist AI system architecture and workflows.