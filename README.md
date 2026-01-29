# ⚛️ CloudNote - Frontend

![React](https://img.shields.io/badge/React-Vite-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow) ![Vercel](https://img.shields.io/badge/Deployment-Vercel-black)

The **CloudNote Frontend** is a modern, responsive Single Page Application (SPA) built with **React** and **Vite**. It serves as the user interface for the CloudNote system, providing a secure and intuitive experience for managing notes and images in the cloud.

This frontend is designed to work seamlessly with the [CloudNote Backend](https://github.com/your-username/CloudNote-Backend), utilizing a **Reverse Proxy** pattern to handle secure communication with the AWS infrastructure.

---

## 🚀 Features

* **⚡ Fast Performance:** Built with **Vite** for lightning-fast development and optimized production builds.
* **🔐 Secure Authentication:** Full Login and Signup flow integrated with Spring Security (JWT/Session).
* **🖼️ Media Handling:** specific UI for uploading images to AWS S3 and rendering them via CloudFront CDN.
* **📱 Responsive Design:** Works on desktop and mobile devices.
* **🛡️ Secure API Proxy:** Solves "Mixed Content" (HTTPS -> HTTP) security blocks using Vercel Rewrites.

---

## 🛠️ Tech Stack

* **Core:** [React.js](https://react.dev/) (v18+)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Styling:** CSS Modules / Styled Components
* **Deployment:** Vercel

---

## ⚙️ Configuration & The "Proxy" Pattern

A key challenge in this architecture was connecting a **Secure Frontend (HTTPS)** on Vercel to an **Insecure Backend (HTTP)** on AWS EC2 without purchasing an SSL certificate for the backend.

We solved this using a **Reverse Proxy** in `vercel.json`:

1.  **Browser Request:** The React app makes a request to `/api/notes`.
2.  **Vercel Interception:** Vercel receives this request on HTTPS.
3.  **Forwarding:** Vercel forwards the request internally to the AWS ALB (HTTP).
4.  **Result:** The browser remains happy (Green Lock), and the connection succeeds.

### `vercel.json` Configuration
This file must be present in the root directory:
```json
{
  "rewrites": [
    {
      "source": "/api/:match*",
      "destination": "http://YOUR-AWS-ALB-URL/api/:match*"
    },
    {
      "source": "/auth/:match*",
      "destination": "http://YOUR-AWS-ALB-URL/auth/:match*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}