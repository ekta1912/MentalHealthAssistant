# 🌿 Samaira - AI Mental Health & Wellness Companion

Samaira is an empathetic, voice-interactive AI mental health companion designed to provide supportive, grounded, and therapeutic conversations. Built with Node.js, Express, the Web Speech API, and Google's Gemini Flash model, Samaira combines cognitive reframing techniques (CBT, DBT, and somatic grounding) with real-time speech recognition and therapeutic vocal delivery.

---

## ✨ Features

- **🎙️ Voice-First Interaction**: Hands-free voice recognition using the Web Speech API (`SpeechRecognition`).
- **🗣️ Calibrated Therapeutic Speech**: Custom text-to-speech engine fine-tuned for calming pitch and pacing (`speechSynthesis`).
- **🧠 Grounded Psychology Framework**: Backed by system instructions tailored around CBT, DBT, and nervous system regulation.
- **🛡️ Built-in Safety Boundaries**: Configured to recognize crisis and actively guide users toward professional healthcare resources.
- **⚡ Lightweight & Fast**: Vanilla JavaScript frontend with an Express.js backend serving as a secure API proxy.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 5, CORS, Dotenv
- **AI Brain**: Google Gemini 2.5 Flash API
- **Frontend**: HTML5, Vanilla CSS, Web Speech API (SpeechRecognition & SpeechSynthesis)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd MentalCoach
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key in `.env`:
   ```env
   API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```

4. **Start the application:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (Google Chrome or Microsoft Edge recommended for full Speech API support).

---

## 📁 Project Structure

```text
├── public/
│   ├── index.html       # Client interface with calming aesthetic
│   └── script.js        # Voice recognition, TTS, and chat handling
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules (node_modules, .env)
├── package.json         # Project metadata and dependencies
├── server.js            # Express server & Gemini API proxy
└── README.md            # Project documentation
```

---

## 🔒 Security & Privacy

- The API Key is securely stored in `.env` and kept server-side to prevent leakage to client browsers.
- `.env` and `node_modules` are excluded from version control via `.gitignore`.

---

## 📄 License

This project is licensed under the ISC License.
