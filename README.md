# Quick Cut

Quick Cut is a cloud-native platform that enables barbers to connect with clients for on-demand haircut appointments. 

## Features

- **Booking System**: Easily schedule, manage, and track haircut appointments.
- **Secure Authentication**: Google OAuth 2.0 and JWT-based authentication for enhanced security.
- **Dynamic Pricing**: Prices vary based on location and haircut type.
- **SEO Optimized**: Improved visibility with server-side rendering using Next.js.
- **CI/CD Pipeline**: Fully automated builds, testing, and deployment with Jenkins.
- **Cloud Storage**: Multimedia assets are stored securely in AWS S3.

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
- **AWS EC2**: Depolyed on AWS EC2 instance

---

## Setup & Installation

### Prerequisites
- **Node.js** (v16.20.2 or higher)
- **Docker**
- **MongoDB**
- **AWS CLI** (for S3 integration)

### Steps to Run Locally

1. Clone the repository:
 ```bash
 git clone https://github.com/ekmaster/Quick_Cut.git
 cd quick-cut/client
 cd quick-cut/server
 ```

2. Install dependencies for both client and server:
```bash
npm install
```
3. Set up environment variables for the server:
```
Fill .env with the required keys and information
```
4. Run server and client:

```
npm run dev
```


5. Access the application:

Open your browser and navigate to http://localhost:3000 for the client
<br />
The server is running on port 5000


