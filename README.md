<div align="center">

# TalkNest
*A modern, real-time chat application powered by WebSockets.*

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## ✨ Features

- 💬 **Real-Time Messaging**: Send and receive messages instantly with Socket.io.
- 🔐 **Secure Authentication**: JWT-based auth with encrypted cookies and socket handshake validation.
- ⌨️ **Live Typing Indicators**: See when your friends are typing in real-time.
- 🖼️ **Image Sharing**: Seamlessly share images using Cloudinary integration.
- 📱 **Responsive Design**: Beautiful UI built with TailwindCSS and DaisyUI, working flawlessly across all devices.
- 🛡️ **Advanced Security**: Integrated with @arcjet/node for bot and attack protection.
- 🔔 **In-App Notifications**: Toast notifications and sound alerts for a smooth user experience.

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` directory.

| Variable | Description |
| :--- | :--- |
| `PORT` | The port the backend server runs on |
| `NODE_ENV` | Environment mode (e.g., development) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `RESEND_API_KEY` | API key for Resend email service |
| `EMAIL_FROM` | Sender email address for Resend |
| `EMAIL_NAME` | Sender name for Resend |
| `CLIENT_URL` | URL of the frontend (e.g., http://localhost:5173) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret |
| `ARCJET_KEY` | Arcjet security key |
| `ARCJET_ENV` | Arcjet environment |

## 🚀 Getting Started

Follow these instructions to get the project up and running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A [MongoDB](https://www.mongodb.com/) Database
- A [Cloudinary](https://cloudinary.com/) Account

### 1. Backend Setup

Open your terminal and run the following commands:

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The backend server will run on `http://localhost:3000` (or your configured PORT).*

### 2. Frontend Setup

Open a **new terminal tab** and run:

```bash
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will start and be accessible at `http://localhost:5173`.*

## 📂 Folder Structure

```text
TalkNest/
├── backend/
│   ├── src/
│   │   ├── lib/          # Core utilities & socket config
│   │   ├── middlewares/  # Express & Socket auth middlewares
│   │   ├── models/       # Mongoose schemas
│   │   └── app.js        # Server entry point
│   ├── package.json
│   └── .env              # Backend environment variables
└── frontend/
    ├── src/
    │   ├── components/   # Reusable React components
    │   ├── lib/          # Axios config & utilities
    │   ├── store/        # Zustand state management
    │   ├── App.jsx       # Main App component
    │   └── main.jsx      # React entry point
    ├── index.html
    └── package.json
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
