# 🏃 Strava Wrapped

Your year in motion — A beautiful Spotify Wrapped-style visualization of your Strava activities.

![Strava Wrapped](https://img.shields.io/badge/Strava-FC4C02?style=for-the-badge&logo=strava&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📖 Overview

Strava Wrapped transforms your yearly Strava activity data into an engaging, story-based presentation — similar to Spotify Wrapped. Connect your Strava account, select a year, and watch your fitness journey come to life through animated slides showcasing your achievements, stats, and highlights.

### How It Works

1. **Authenticate** with your Strava account via OAuth 2.0
2. **Select a year** to view your wrapped summary
3. **Swipe through slides** featuring your personalized stats
4. **Download & share** your summary card with friends

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Total Stats** | Distance, time, elevation gain, and activity count |
| 🏆 **Personal Highlights** | Your longest activity and top achievements |
| 📅 **Monthly Breakdown** | Visualize your most active months |
| 🎯 **Activity Types** | Breakdown of all your sports (running, cycling, swimming, etc.) |
| 🗺️ **Locations** | Map visualization of where you've been active |
| 👏 **Kudos Count** | Total love received from the Strava community |
| 📱 **Shareable Summary** | Download and share your wrapped card |

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Maps** | Leaflet, React-Leaflet |
| **Backend** | Express.js (Node.js) |
| **Image Export** | html-to-image |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js) or **yarn**
- A **Strava account** with some recorded activities

## 🚀 Installation Guide (Local Hosting)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/strava-wrapped.git
cd strava-wrapped
```

### Step 2: Create a Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click **Create an App** (or use an existing one)
3. Fill in the application details:
   - **Application Name**: Strava Wrapped (or any name you prefer)
   - **Category**: Choose appropriate category
   - **Website**: `http://localhost:5173`
   - **Authorization Callback Domain**: `localhost`
4. Save and note down your **Client ID** and **Client Secret**

### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your Strava credentials:

```env
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
PORT=3001
```

> ⚠️ **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### Step 4: Install Dependencies

Install dependencies for both frontend and backend:

```bash
# From the project root directory
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 5: Start the Application

You need to run both the backend server and frontend development server:

**Option A: Run in separate terminals**

```bash
# Terminal 1 - Start the backend server
npm run server

# Terminal 2 - Start the frontend dev server
npm run dev
```

**Option B: Run backend in background (Unix/macOS/Git Bash)**

```bash
# Start backend in background
npm run server &

# Start frontend
npm run dev
```

### Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

Click **Connect with Strava** to authenticate and view your wrapped!

## 📁 Project Structure

```
strava-wrapped/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── slides/         # Individual slide components
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React context (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services & data processing
│   └── types/              # TypeScript type definitions
├── server/                 # Backend Express server
│   ├── index.js            # Server entry point
│   └── env.example         # Environment variables template
├── functions/              # Cloudflare Pages functions (for deployment)
├── public/                 # Static assets
└── dist/                   # Production build output
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server |
| `npm run server` | Start backend Express server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🌐 Deployment

The project includes Cloudflare Pages functions in the `functions/` directory for serverless deployment. For local development, use the Express server in the `server/` directory.

## 🔒 Privacy

Your data stays private:
- The app only reads your activity data via Strava's API
- No data is stored on any external server
- All processing happens in your browser
- Tokens are stored locally and can be cleared anytime

## 🐛 Troubleshooting

### Common Issues

**"Invalid Client ID" error**
- Double-check your `STRAVA_CLIENT_ID` in the `.env` file
- Ensure there are no extra spaces or quotes around the value

**"Redirect URI mismatch" error**
- Make sure your Strava app's Authorization Callback Domain is set to `localhost`
- Verify you're accessing the app via `http://localhost:5173`

**Backend not connecting**
- Ensure the server is running on port 3001
- Check that no other process is using port 3001

**No activities showing**
- Make sure you have activities recorded in the selected year
- Check that your Strava account has public or authorized activities

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Strava API](https://developers.strava.com/) for providing activity data
- Inspired by [Spotify Wrapped](https://www.spotify.com/wrapped/)
