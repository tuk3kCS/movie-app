# 🎬 Movie Search App

A modern, responsive movie search application built with React and Node.js that allows users to discover and search for movies using The Movie Database (TMDB) API. The app features search analytics and trending movie tracking powered by MongoDB.

![Movie Search App](./public/hero.png)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- TMDB API key

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd movie-app
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the project root:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/movie-app
PORT=5000
```

### 5. Get TMDB API Key
1. Visit [TMDB Website](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (free for personal use)
5. Copy the **API Read Access Token** (not the API Key)