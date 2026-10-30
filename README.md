# 🌿 Samaira - AI Mental Health & Wellness Companion

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange.svg)](https://aistudio.google.com/)

**Samaira** is an empathetic, voice-interactive AI mental health companion designed to provide supportive, grounded, and mindful therapeutic conversations. Built with Node.js, Express, the Web Speech API, and Google's Gemini Flash model, Samaira combines cognitive reframing techniques (CBT, DBT, and somatic grounding) with real-time speech recognition, soothing vocal delivery, and interactive nervous-system regulation exercises.

---

## ✨ Features & Capabilities

- **🎙️ Dual-Mode Communication**: 
  - **Voice-First**: Natural hands-free conversation with browser Speech Recognition.
  - **Text Fallback**: Quiet environment mode with instant text messaging input.
- **🗣️ Calibrated Therapeutic Voice**:
  - Natural speech synthesis calibrated with calming pitch and measured pacing.
  - One-click privacy voice mute toggle (`Voice Audio: ON/OFF`).
- **🫁 4-7-8 Somatic Breathing Exercise**:
  - Built-in guided breathing guide with expanding and contracting visual feedback to down-regulate acute anxiety.
- **🌱 Mood Starter Chips**:
  - Rapid conversation starters for racing thoughts, insomnia, emotional exhaustion, and venting.
- **🌊 Dynamic Soundwave Visualizer**:
  - Real-time animated audio wave bars reflecting active listening and speaking states.
- **🔄 Session Management**:
  - Instant conversation reset to start a fresh, confidential reflection anytime.
- **🛡️ Immediate Crisis Support Integration**:
  - Prominent emergency lifeline access for 24/7 suicide prevention and psychological crisis assistance.
- **🏥 System Health Endpoint**:
  - Dedicated `/api/health` monitoring route providing uptime, model details, and status.

---

## 🛠️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │ Web Speech Recognition│   │ Web Speech Synthesis │  │
│  └───────────┬───────────┘   └──────────▲───────────┘  │
│              │                          │              │
│              ▼                          │              │
│     [Voice / Text Input]       [Spoken Response]       │
└──────────────┬──────────────────────────┴──────────────┘
               │                          ▲
          HTTP POST                  HTTP Response
               │                          │
┌──────────────▼──────────────────────────┴──────────────┐
│                Express.js Server (Port 3000)           │
│  - /api/chat   : Context-managed proxy & safety filter │
│  - /api/health : Server uptime & diagnostics           │
└──────────────┬──────────────────────────▲──────────────┘
               │                          │
          Secure REST API            Candidate Text
               │                          │
┌──────────────▼──────────────────────────┴──────────────┐
│           Google Gemini 2.5 Flash Engine               │
│  - Evidence-based CBT/DBT System Prompt                │
│  - Zero-latency voice thinking budget configuration    │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Quick Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ekta1912/MentalHealthAssistant.git
   cd MentalHealthAssistant
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key in `.env`:
   ```env
   API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Run the server:**
   ```bash
   npm start
   ```
   Or run in hot-reload development mode:
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) (Google Chrome or Microsoft Edge recommended for optimal Speech API support).

---

## 📡 API Reference

### `GET /api/health`
Returns live server and runtime health diagnostics.
```json
{
  "status": "healthy",
  "app": "Samaira Mental Health Coach",
  "uptime": 42,
  "model": "gemini-2.5-flash",
  "timestamp": "2026-10-30T17:35:00.000Z"
}
```

### `POST /api/chat`
Proxies chat history to Gemini with therapeutic system instructions.
- **Request Body**:
  ```json
  {
    "chatHistory": [
      {
        "role": "user",
        "parts": [{ "text": "I'm feeling very overwhelmed today." }]
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "reply": "I hear how heavy things feel right now. Let's take a slow breath together..."
  }
  ```

---

## 🆘 Immediate Crisis Resources

If you or someone you care about is experiencing suicidal thoughts or severe psychological distress, please connect with trained human counselors:

- **India**: 
  - **Tele-MANAS**: `14416` or `1800-891-4416` (24x7, Toll-Free)
  - **Vandrevala Foundation**: `+91 9999 666 555`
  - **AASRA**: `+91 98204 66726`
- **United States & Canada**:
  - **Suicide & Crisis Lifeline**: Dial or text `988`
- **United Kingdom**:
  - **Samaritans**: `116 123`
  - **NHS Mental Health**: `111`
- **International**:
  - Find your national emergency support at [findahelpline.com](https://findahelpline.com)

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
