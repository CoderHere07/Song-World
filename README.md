# 🎵 SongWorld - Reach Your Music

SongWorld is a sleek, responsive web-based music player that allows users to browse albums, manage playlists, and enjoy their favorite tracks with a modern Spotify-inspired UI.

## 🚀 Features

### 🎧 Superior Music Playback
- **Full Control**: Play, pause, skip forward, and go back with ease.
- **Interactive Seek Bar**: Fluid progress indicator with click-to-seek functionality.
- **Real-time Volume Control**: Smooth volume slider for the perfect listening experience.
- **Dynamic Timing**: Displays current playback time and total duration.

### 📂 Smart Album & Song Management
- **Dynamic Loading**: Automatically fetches `.mp3` files and album metadata (`info.json`) from server directories.
- **Rich Visuals**: Displays album covers, titles, and descriptions dynamically.
- **Instant Library**: Populates your library sidebar with songs from the selected album in one click.

### 📱 Responsive & Modern Design
- **Cross-Device Support**: Optimized for mobile, tablet, and desktop viewports.
- **Adaptive UI**: Includes a sidebar for navigation and a hidden hamburger menu for smaller screens.
- **Premium Aesthetics**: Dark-themed, modern interface with smooth transitions and hover effects.

---

## 🛠️ Setup Instructions

To get SongWorld running on your local machine, follow these steps:

### 1. Project Requirements
- A local web server (e.g., [VS Code Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)).
- Modern web browser (Chrome, Firefox, Safari, Edge).

### 2. Adding Your Music
By default, the repository contains folder structures for various artists but **no MP3 files**.
- Navigate to the `Songs/` directory.
- Open any artist folder (e.g., `Songs/Aujla/`).
- Place your `.mp3` files inside that folder.

### 3. Running the App
- Open the project directory in VS Code.
- Right-click `index.html` and select **"Open with Live Server"**.
- The app will load all available albums automatically.

---

## 💻 Tech Stack
- **HTML5**: Semantic structure for the web interface.
- **Vanilla CSS3**: Custom styles, flexbox/grid layouts, and responsive media queries.
- **JavaScript (ES6+)**: Dynamic song fetching, audio controls, and UI interactions.

---

## 📝 License
This project is open-source and free to use.

Made with ❤️ by Adnan Shahzad
