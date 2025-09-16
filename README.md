# Xeno FDE Internship Assignment: Shopify Data Ingestion & Insights Service

[cite_start]This project is a multi-tenant Shopify Data Ingestion & Insights Service built to fulfill the requirements of the Xeno Forward Deployed Engineer (FDE) Internship assignment[cite: 1, 6].

[cite_start]The service connects to Shopify stores, ingests key e-commerce data (customers, orders, products), and provides a user-friendly dashboard to visualize business insights[cite: 6, 12, 23].

---

### 🚀 **Live Demo**

* **Frontend (Dashboard):** [https://frontend-one-dun-77.vercel.app/](https://frontend-one-dun-77.vercel.app/)
* **Backend API:** [https://backend-1-zzoe.onrender.com/](https://backend-1-zzoe.onrender.com/)

---

### ✨ **Features**

* [cite_start]**Multi-Tenant Architecture:** Securely onboard multiple Shopify stores with complete data isolation using a `tenantId`[cite: 18].
* **Shopify OAuth 2.0 Integration:** A seamless and secure onboarding flow for store owners to connect their Shopify data.
* [cite_start]**Automated Data Ingestion:** Ingests **Customers**, **Orders**, and **Products** from Shopify via its Admin API[cite: 13, 14, 15].
* [cite_start]**Real-time Sync with Webhooks:** Keeps the database synchronized with Shopify in real-time for events like `orders/create`, `customers/update`, and `products/update`[cite: 36].
* [cite_start]**User Authentication:** Secure JWT-based authentication for dashboard access[cite: 23, 38].
* [cite_start]**Insights Dashboard:** A clean, intuitive UI to visualize key business metrics[cite: 23].
    * [cite_start]View aggregate data like **Total Revenue**, **Total Orders**, and **Total Customers**[cite: 24].
    * [cite_start]Filter orders and revenue by a specific date range[cite: 25].
    * [cite_start]Identify the **Top 5 Customers** by total spending[cite: 26].
    * [cite_start]Visualize trends with interactive charts for business performance analysis[cite: 27].

---

### 🏗️ **Architecture Diagram**

[cite_start]The following diagram illustrates the high-level architecture of the system, showcasing the flow of data from Shopify to the end-user dashboard[cite: 30].

*(Paste your generated diagram image here)*

![Project Architecture Diagram](placeholder.png)

---

### 🛠️ **Tech Stack**

[cite_start]This project was built using the preferred technologies outlined in the assignment brief[cite: 39].

| Category | Technology |
| :--- | :--- |
| **Backend** | [cite_start]Node.js, Express.js [cite: 40] |
| **Frontend** | [cite_start]Next.js, React.js [cite: 41] |
| **Database** | [cite_start]PostgreSQL [cite: 42] |
| **ORM** | [cite_start]Prisma [cite: 37] |
| **Deployment**| [cite_start]Vercel (Frontend), Render (Backend) [cite: 35] |
| **Charting** | [cite_start]Chart.js / Recharts [cite: 44] |

---

### ⚙️ **Getting Started**

Follow these instructions to set up and run the project locally.

#### **Prerequisites**

* Node.js (v18 or later)
* npm or yarn
* Git
* A PostgreSQL database instance
* [cite_start]A Shopify Partner Account and a development store [cite: 9]

#### **1. Clone the Repositories**

You need to clone both the frontend and backend repositories into a parent directory.

```bash
# Clone the Backend Repository
git clone [https://github.com/archi-jr/Backend.git](https://github.com/archi-jr/Backend.git)

# Clone the Frontend Repository
git clone [https://github.com/archi-jr/Frontend.git](https://github.com/archi-jr/Frontend.git)
```

#### **2. Backend Setup (`Backend`)**

1.  Navigate to the backend directory:
    ```bash
    cd Backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```

4.  Update the `.env` file with your credentials:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    
    # Get these from your custom Shopify App
    SHOPIFY_API_KEY="YOUR_SHOPIFY_API_KEY"
    SHOPIFY_API_SECRET="YOUR_SHOPIFY_API_SECRET"
    SCOPES="read_products,read_customers,read_orders"
    
    # A secure string for signing JWT tokens
    JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
    
    # The public URL of your deployed backend
    HOST="http://localhost:8080" # For local dev
    # HOST="[https://backend-1-zzoe.onrender.com/](https://backend-1-zzoe.onrender.com/)" # For production
    ```

5.  Run database migrations and seed initial data:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

6.  Start the development server:
    ```bash
    npm run dev
    ```
    The backend will be running at `http://localhost:8080`.

#### **3. Frontend Setup (`Frontend`)**

1.  Navigate to the frontend directory:
    ```bash
    cd ../Frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file with the backend API URL:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```
    *Note: For the deployed frontend, this is set to `https://backend-1-zzoe.onrender.com/`.*

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

---

### 📄 **API Endpoints & Data Models**

#### **Database Schema (Prisma)**

[cite_start]The schema is designed to be multi-tenant, with most models linking back to a `Tenant` (Shopify Store)[cite: 18, 31].

```prisma
// /prisma/schema.prisma

model Tenant {
  id          String    @id @default(cuid())
  shop        String    @unique // e.g., 'your-store.myshowpify.com'
  accessToken String
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  users     User[]
  customers Customer[]
  products  Product[]
  orders    Order[]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  createdAt DateTime @default(now())
}

model Customer {
  id              String   @id @default(cuid())
  shopifyCustomerId BigInt @unique
  firstName       String?
  lastName        String?
  email           String?
  phone           String?
  totalSpent      Float
  ordersCount     Int
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id])
}

model Product {
  id              String  @id @default(cuid())
  shopifyProductId BigInt @unique
  title           String
  vendor          String?
  productType     String?
  tenantId        String
  tenant          Tenant  @relation(fields: [tenantId], references: [id])
}

model Order {
  id             String    @id @default(cuid())
  shopifyOrderId BigInt    @unique
  totalPrice     Float
  currency       String
  financialStatus String
  fulfillmentStatus String
  createdAt      DateTime
  tenantId       String
  tenant         Tenant    @relation(fields: [tenantId], references: [id])
}
```

#### **API Endpoints**

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user for a tenant. | - |
| `POST` | `/api/auth/login` | Log in and receive a JWT. | - |
| `GET` | `/api/shopify/auth` | Initiates the Shopify OAuth flow. | - |
| `GET` | `/api/shopify/callback` | Callback URL for Shopify to send the auth code. | - |
| `GET` | `/api/insights/summary` | Get dashboard summary metrics. | ✅ |
| `GET` | `/api/insights/orders-by-date`| Get order data within a date range. | ✅ |
| `GET` | `/api/insights/top-customers` | Get the top 5 customers by total spend. | ✅ |
| `POST` | `/api/webhooks/orders/create` | Webhook endpoint for new Shopify orders. | - |
| `POST` | `/api/webhooks/customers/update`| Webhook endpoint for customer updates. | - |

---

### 🤔 **Assumptions & Limitations**

#### [cite_start]**Assumptions** [cite: 29]
* The user has an existing Shopify Partner account to create a development store and a custom app.
* The initial data sync after a new store is onboarded is triggered manually via an API call (this could be automated as a next step).
* All monetary values are assumed to be in the store's primary currency and are not converted.

#### [cite_start]**Limitations** [cite: 61]
* **Rate Limiting:** The implementation relies on Shopify's API rate limits. [cite_start]For very large stores, a more robust solution with background jobs and a queue (like RabbitMQ) would be needed to handle bulk data ingestion without hitting limits[cite: 43].
* **Error Handling:** While basic error handling is in place, a production system would require more comprehensive logging and alerting for failed API calls or webhook events.
* **Data Volume:** The dashboard queries are not optimized for extremely large datasets (millions of orders). This would require database indexing optimizations and potentially a data warehousing solution.

---

### [cite_start]🔮 **Next Steps to Productionize** [cite: 32]

1.  **Enhanced Security:** Implement CSRF protection, security headers (using Helmet.js), and more granular role-based access control (RBAC).
2.  [cite_start]**Scalability:** Integrate a job queue system like **Redis/RabbitMQ** for handling data ingestion and webhook processing asynchronously, making the system more resilient[cite: 43].
3.  **CI/CD Pipeline:** Set up a CI/CD pipeline (e.g., using GitHub Actions) to automate testing and deployments.
4.  **Comprehensive Testing:** Add a full suite of unit, integration, and end-to-end tests to ensure code quality and reliability.
5.  **Monitoring & Logging:** Integrate a logging service (like Winston or Pino) and an application performance monitoring (APM) tool (like Sentry or Datadog) to proactively track application health and errors.
