# Ignite Guidance App 🚀

A mentorship platform that connects mentees with experienced mentors to accelerate learning and career growth.

## 🌟 Features

### For Mentees

- **Browse Mentors**: Search and filter mentors by expertise and skills
- **Request Mentorship**: Send detailed proposals to connect with mentors
- **Track Requests**: Monitor the status of your mentorship requests
- **Join Meetings**: Access meeting links for accepted sessions
- **Free Platform**: All mentorship is completely free

### For Mentors

- **Manage Requests**: Review and respond to mentorship requests
- **Accept/Decline**: Choose which mentees to work with
- **Add Meeting Links**: Share meeting links for accepted sessions
- **Multiple Platforms**: Support for Zoom, Google Meet, Teams, and Calendly
- **Dashboard**: Manage all your mentorship activities

## 🛠️ Technology Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express-validator** for input validation

## 📁 Project Structure

```
ignite-guidance-app/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   └── hooks/             # Custom React hooks
├── backend/               # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── utils/             # Utility functions
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Frontend Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Update environment variables:**

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp env.example .env
   ```

4. **Update environment variables:**

   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ignite-guidance
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

6. **Verify backend is running:**
   Navigate to `http://localhost:5000/api/health`

## 📊 Database Schema

### Users

- Authentication information (email, password)

### Profiles

- User profile information
- Role (mentor/mentee)
- Industries (for mentors)
- Name and basic info

### Mentorship Requests

- Connection between mentees and mentors
- Proposal details
- Preferred meeting time
- Request status (pending/accepted/declined)

### Sessions

- Meeting information for accepted requests
- Meeting links and scheduling
- Session status tracking

## 🔐 Authentication Flow

1. **Registration**: User creates account with email/password
2. **Profile Creation**: User selects role and completes profile
3. **Login**: JWT token-based authentication
4. **Protected Routes**: Token verification for all API calls

## 🔄 Mentorship Flow

### For Mentees

1. Browse available mentors
2. Send mentorship request with proposal
3. Wait for mentor response
4. Access meeting links when accepted

### For Mentors

1. Receive mentorship requests
2. Review proposals and accept/decline
3. Add meeting links for accepted requests
4. Manage ongoing sessions

## 🎨 UI Components

The app uses a modern, responsive design with:

- **Hero Section**: Eye-catching landing page
- **Mentor Cards**: Display mentor information
- **Request Modal**: Send mentorship requests
- **Dashboard**: Manage requests and sessions
- **Meeting Link Modal**: Add meeting information

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Profiles

- `POST /api/profiles` - Create profile
- `GET /api/profiles/me` - Get user profile
- `GET /api/profiles/mentors` - Get all mentors

### Mentorship

- `POST /api/mentorship/requests` - Create request
- `GET /api/mentorship/requests/me` - Get user requests
- `PUT /api/mentorship/requests/:id/accept` - Accept request
- `PUT /api/mentorship/requests/:id/decline` - Decline request

### Sessions

- `POST /api/sessions` - Create session
- `GET /api/sessions/me` - Get user sessions
- `PUT /api/sessions/:id` - Update session

## 🚀 Deployment

### Frontend Deployment

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

### Backend Deployment

1. Set production environment variables
2. Deploy to your preferred platform (Heroku, Railway, etc.)
3. Update frontend API URL to point to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- Real-time notifications
- Video call integration
- Advanced search and filtering
- Rating and review system
- Calendar integration
- Mobile app development

---

**Built with ❤️ for the mentorship community**
