# 🏃 Strava Wrapped

Your year in motion — A beautiful Spotify Wrapped-style visualization of your Strava activities.

![Strava Wrapped](https://img.shields.io/badge/Strava-FC4C02?style=for-the-badge&logo=strava&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 📖 Overview

Strava Wrapped transforms your yearly Strava activity data into an engaging, story-based presentation — similar to Spotify Wrapped. Connect your Strava account or upload your data export, select a year, and watch your fitness journey come to life through animated slides showcasing your achievements, stats, and highlights.

### How It Works

**Option 1: Connect with Strava (Online)**
1. **Authenticate** with your Strava account via OAuth 2.0
2. **Select a year** to view your wrapped summary
3. **Swipe through slides** featuring your personalized stats
4. **Download & share** your summary card with friends

**Option 2: Upload Strava Export (Offline)**
1. **Download** your data archive from Strava settings
2. **Upload** the ZIP file directly to the app
3. **View your wrapped** without needing API access
4. **Full privacy** — all processing happens locally in your browser

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Total Stats** | Distance, time, elevation gain, and activity count |
| 🏆 **Personal Highlights** | Your longest activity and top achievements |
| 📅 **Monthly Breakdown** | Visualize your most active months |
| 🎯 **Activity Types** | Breakdown of all your sports (running, cycling, swimming, etc.) |
| 🗺️ **Locations Heatmap** | Heat map visualization of where you've been most active |
| 👏 **Kudos Count** | Total love received from the Strava community |
| 📱 **Shareable Summary** | Download and share your wrapped card |
| 📁 **Offline Mode** | Upload your Strava export ZIP for complete privacy |

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite 7, Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Maps** | Leaflet, React-Leaflet, Leaflet.heat |
| **Backend** | Express.js (Node.js) |
| **File Parsing** | JSZip, FIT File Parser, Pako |
| **Image Export** | html-to-image |
| **Icons** | Lucide React |

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

### Step 2: Create a Strava API Application (Optional - for OAuth)

> **Note**: Skip this step if you only want to use the file upload feature.

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Click **Create an App** (or use an existing one)
3. Fill in the application details:
   - **Application Name**: Strava Wrapped (or any name you prefer)
   - **Category**: Choose appropriate category
   - **Website**: `http://localhost:5173`
   - **Authorization Callback Domain**: `localhost`
4. Save and note down your **Client ID** and **Client Secret**

### Step 3: Configure Environment Variables (Optional - for OAuth)

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

# Install backend dependencies (only needed for OAuth)
cd server
npm install
cd ..
```

### Step 5: Start the Application

**For File Upload Only (No Backend Required)**

```bash
# Just start the frontend
npm run dev
```

**For OAuth + File Upload (Full Features)**

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

Click **Connect with Strava** to authenticate, or **Upload Strava Export** to use your downloaded data archive!

## 📁 Using File Upload (Offline Mode)

If you prefer not to use OAuth or want complete privacy, you can upload your Strava data export:

### How to Get Your Strava Export

1. Go to [strava.com](https://www.strava.com) → **Settings** → **My Account**
2. Scroll down and click **"Download or Delete Your Account"**
3. Click **"Request Your Archive"**
4. Wait for an email with the download link (may take a few hours)
5. Download and upload the ZIP file to the app

### Supported Data

The file upload feature parses:
- **activities.csv** — Activity metadata (name, type, date, stats)
- **FIT files** — GPS routes and detailed activity data
- **GPX files** — GPS routes (if available)

## 📁 Project Structure

```
strava-wrapped/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── slides/         # Individual slide components
│   │   ├── ui/             # Reusable UI components
│   │   ├── FileUpload.tsx  # File upload component
│   │   └── Landing.tsx     # Landing page with auth options
│   ├── context/            # React context (Auth)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services & data processing
│   │   ├── stravaApi.ts    # Strava API service
│   │   ├── stravaExportParser.ts  # ZIP file parser
│   │   └── dataProcessing.ts      # Data transformation
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
- The app only reads your activity data via Strava's API or your uploaded export
- No data is stored on any external server
- All processing happens in your browser
- Tokens are stored locally and can be cleared anytime
- **File upload mode**: Data never leaves your device

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

**File upload not working**
- Ensure you're uploading the original ZIP file from Strava (don't extract it)
- The ZIP must contain `activities.csv` or activity files in the `activities/` folder
- Check browser console for detailed error messages

**Map not showing routes**
- Some activities may not have GPS data
- FIT files with GPS data will show routes on the heatmap

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- [Strava API](https://developers.strava.com/) for providing activity data
- Inspired by [Spotify Wrapped](https://www.spotify.com/wrapped/)
- [Leaflet](https://leafletjs.com/) for map visualization
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
