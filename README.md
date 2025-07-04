# Quick Cut

Quick Cut is a cloud-native platform that enables barbers to connect with clients for on-demand haircut appointments. The platform features secure authentication, dynamic pricing, cloud storage for assets, and a robust CI/CD pipeline for automated deployment.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [License](#license)

---

## Features

- **Booking System**: Easily schedule, manage, and track haircut appointments.
- **Secure Authentication**: Google OAuth 2.0 and JWT-based authentication for enhanced security.
- **Dynamic Pricing**: Prices vary based on location and haircut type.
- **Cloud Storage**: Multimedia assets are stored securely in AWS S3.
- **SEO Optimized**: Improved visibility with server-side rendering using Next.js.
- **CI/CD Pipeline**: Automated builds, testing, and deployment with Jenkins.
- **Containerized**: Dockerized client, server, and Nginx for easy deployment.
- **Reverse Proxy**: Nginx for secure and efficient traffic routing.

---

## Tech Stack

### Frontend
- **Next.js**: Server-side rendering and optimized static site generation.
- **TailwindCSS**: For responsive and modern styling.

### Backend
- **Node.js/Express**: API server with robust routing and middleware.
- **MongoDB**: NoSQL database for user data storage.
- **AWS S3**: Cloud storage for multimedia assets.

### DevOps
- **Jenkins**: CI/CD pipelines for automated deployment.
- **Nginx**: Reverse proxy server for secure traffic routing.
- **Docker**: Containerized deployment for isolated environments.
- **AWS EC2**: Deployed on AWS EC2 instance.

---

## Project Structure

```
barber_proj/
│
├── client/           # Next.js frontend application
│   ├── app/          # Application pages and components
│   ├── public/       # Static assets
│   ├── styles/       # CSS/SCSS files
│   ├── package.json  # Frontend dependencies
│   └── ...           
│
├── server/           # Express backend API
│   ├── handlers/     # Route handler logic
│   ├── mongoose/     # Mongoose schemas
│   ├── routes/       # Express routes
│   ├── utils/        # Utility functions
│   ├── __tests__/    # Unit tests
│   ├── e2e/          # End-to-end tests
│   ├── package.json  # Backend dependencies
│   └── ...
│
├── nginx/            # Nginx reverse proxy config and Dockerfile
│
├── Jenkinsfile       # Jenkins CI/CD pipeline
├── README.md         # Project documentation
├── LICENSE           # License file
└── ...
```

---

## Setup & Installation

### Prerequisites

- **Node.js** (v16.20.2 or higher)
- **Docker**
- **MongoDB**
- **AWS CLI** (for S3 integration)
- **Jenkins** (for CI/CD, optional for local dev)

### Steps to Run Locally

1. **Clone the repository:**
    ```bash
    git clone https://github.com/ekmaster/Quick_Cut.git
    cd quick_cut
    ```

2. **Install dependencies for both client and server:**
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Set up environment variables for the server:**
    - Create a `.env` file in the `server/` directory with the following keys:
        ```
        MONGODB_PRODUCTION=your_mongodb_connection_string
        MONGODB_TEST=your_mongodb_test_connection_string
        AWS_ACCESS_KEY_ID=your_aws_access_key
        AWS_SECRET_ACCESS_KEY=your_aws_secret_key
        AWS_REGION=your_aws_region
        GMAIL_USER=your_gmail_address
        GMAIL_PASS=your_gmail_app_password
        GOOGLE_OAUTH_REDIRECT=your_google_oauth_redirect_url
        ENVIRONMENT=development
        ```

4. **Run server and client:**
    - In two separate terminals:
        ```bash
        # Terminal 1 (server)
        cd server
        npm run dev

        # Terminal 2 (client)
        cd client
        npm run dev
        ```

5. **Access the application:**
    - Open your browser and navigate to [http://localhost:3000](http://localhost:3000) for the client.
    - The server runs on port 8080 by default.

---

## Environment Variables

| Variable                | Description                                 | Required |
|-------------------------|---------------------------------------------|----------|
| MONGODB_PRODUCTION      | MongoDB connection string (prod)            | Yes      |
| MONGODB_TEST            | MongoDB connection string (test)            | Yes      |
| AWS_ACCESS_KEY_ID       | AWS S3 Access Key                           | Yes      |
| AWS_SECRET_ACCESS_KEY   | AWS S3 Secret Key                           | Yes      |
| AWS_REGION              | AWS Region                                  | Yes      |
| GMAIL_USER              | Gmail address for sending emails            | Yes      |
| GMAIL_PASS              | Gmail app password                          | Yes      |
| GOOGLE_OAUTH_REDIRECT   | Google OAuth redirect URI                   | Yes      |
| ENVIRONMENT             | `development` or `production`               | Yes      |

---

## Running the Application

- **Frontend:**  
  ```bash
  cd client
  npm run dev
  ```
  Runs the Next.js app on [http://localhost:3000](http://localhost:3000).

- **Backend:**  
  ```bash
  cd server
  npm run dev
  ```
  Runs the Express server on [http://localhost:8080](http://localhost:8080).

---

## Testing

- **Unit and Integration Tests:**  
  Located in `server/__tests__/`.  
  Run with:
  ```bash
  cd server
  npm run test
  ```

- **End-to-End Tests:**  
  Located in `server/e2e/`.  
  Run with:
  ```bash
  cd server
  npm run test:e2e
  ```

- **Custom Test Reporting:**  
  The server uses a custom Jest reporter ([server/testReporter.mjs](server/testReporter.mjs)) and runner ([server/testRunner.mjs](server/testRunner.mjs)) for summarizing test results.

---

## Deployment

### Docker

- **Build Docker Images:**
  ```bash
  docker build -t ekmaster/nextjs-app ./client
  docker build -t ekmaster/express-app ./server
  docker build -t ekmaster/nginx-proxy ./nginx
  ```

- **Run Containers:**
  ```bash
  docker network create app-network
  docker run -d --name backend --network app-network ekmaster/express-app
  docker run -d --name frontend --network app-network ekmaster/nextjs-app
  docker run -d --name nginx --network app-network -p 80:80 ekmaster/nginx-proxy
  ```

### Jenkins CI/CD

- The [Jenkinsfile](Jenkinsfile) automates:
  - Checkout from GitHub
  - Install dependencies and run tests
  - Build Docker images for client and server
  - Push images to Docker Hub
  - Deploy to AWS EC2 using AWS SSM

---

## CI/CD Pipeline

- **Automated by Jenkins:**
  - On push to `main`, Jenkins will:
    1. Checkout code
    2. Install dependencies and run all tests
    3. Build Docker images for client and server
    4. Push images to Docker Hub
    5. Deploy to AWS EC2 using SSM to run/replace containers

- **Credentials:**
  - GitHub PAT, Docker Hub, and AWS credentials are managed securely in Jenkins.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

---

## Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/EKmaster/barber_proj) or contact the maintainer.
