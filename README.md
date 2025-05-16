# LinkedIn Clone

A full-stack LinkedIn clone built with the MERN stack (MongoDB, Express.js, React, Node.js) and modern web technologies.

## Features

- 🔐 User Authentication
- 👤 User Profiles
  - Profile customization (name, headline, about, location)
  - Profile and banner image uploads
  - Skills management
  - Experience tracking
  - Education history
- 🤝 Professional Networking
  - Connection requests
  - Connection management
  - Network suggestions
- 📝 Posts
  - Create text and image posts
  - Like and comment on posts
  - View post details
- 🔔 Notifications
  - Real-time notifications for connections, likes, and comments
- 🎨 Modern UI
  - Responsive design
  - Dark/Light mode support
  - Tailwind CSS styling

## Tech Stack

### Frontend
- React.js
- React Query for data fetching and caching
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/linkedin-clone.git
cd linkedin-clone
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Variables

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the development servers
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request