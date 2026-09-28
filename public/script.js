document.addEventListener("DOMContentLoaded", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
    } 

    const r = new SpeechRecognition();
    r.continuous = false; 
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.lang = 'en-US';

    let chatHistory = [];
    let synthVoices = [];

    const startBtn = document.getElementById('start-btn');
    const chatDisplay = document.getElementById('chat-display');

    function loadVoices() {
        synthVoices = window.speechSynthesis.getVoices();
    }
    
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    if(startBtn) {
        startBtn.addEventListener('click', () => {
            try {
                r.start();
                startBtn.innerText = "Listening deeply...";
                startBtn.style.backgroundColor = "#2E86AB"; // Calming blue
                startBtn.disabled = true;
            } catch(e) {
                console.error(e);
            }
        });
    }
    r.onerror = function(event) {
        // Yeh line terminal/console me asli problem batayegi
        console.error("🎤 Mic Error:", event.error); 
        
        resetUI();
        chatDisplay.innerHTML += `<br><br><b>Samaire:</b> <i>"I didn't quite catch that. Take your time, I'm still here."</i>`;
    };

    r.onresult = async function (event) {
        const transcript = event.results[0][0].transcript;
        chatDisplay.innerHTML += `<br><br><b>You:</b> "${transcript}"`;
        startBtn.innerText = "Processing...";
        startBtn.style.backgroundColor = "#4A90E2";
        
        await callGemini(transcript);
    };

    async function callGemini(text) {
        if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "user") {
            chatHistory.pop();
        }

        chatHistory.push({
            "role": "user",
            "parts": [{ "text": text }]
        });

        try {
            // Automatically determine API endpoint (supports both direct Express port and dev live server)
            const apiUrl = (window.location.port === '3000' || !window.location.port) ? '/api/chat' : 'http://localhost:3000/api/chat';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatHistory: chatHistory })
            });

            if (!response.ok) {
                throw new Error("Server connection failed");
            }

            const data = await response.json();
            const samairaReply = data.reply;
            
            chatDisplay.innerHTML += `<br><br><b>Samaire:</b> <i>"${samairaReply}"</i>`;

            chatHistory.push({
                "role": "model",
                "parts": [{ "text": samairaReply }]
            });

            // Keep memory slightly longer for better therapy context
            if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);

            speak(samairaReply);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = "I'm sorry, my connection dropped for a moment. Just breathe, I'm getting back online.";
            chatDisplay.innerHTML += `<br><br><b>Samaire:</b> <i>"${errorMsg}"</i>`;
            speak(errorMsg);
            
            if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "user") {
                chatHistory.pop(); 
            }
        }
    }

    function speak(text) {
        if (!('speechSynthesis' in window)) return resetUI();

        const spokenText = text
            .replace(/[*_~]/g, '') 
            .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') 
            .replace(/\(.*?\)/g, ''); 

        const utterance = new SpeechSynthesisUtterance(spokenText);
        
        // THERAPEUTIC VOICE SETTINGS: Lower pitch, slower rate for a calming effect
        utterance.pitch = 1.0;  
        utterance.rate = 0.85;  

        const voiceRankings = [
            "Microsoft Aria Online",    
            "Microsoft Jenny Online",    
            "Google UK English Female",  
            "Google US English",         
            "Samantha",                  
            "Tessa",                     
            "Hazel"
        ];

        let selectedVoice = null;

        for (let targetName of voiceRankings) {
            selectedVoice = synthVoices.find(v => v.name.includes(targetName));
            if (selectedVoice) break; 
        }

        if (!selectedVoice) {
            selectedVoice = synthVoices.find(v => /female|woman/i.test(v.name)) || synthVoices[0];
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            resetUI();
        };

        utterance.onerror = () => {
            resetUI();
        };

        window.speechSynthesis.speak(utterance);
    }

    function resetUI() {
        if(startBtn) {
            startBtn.innerText = "Speak to Samaire";
            startBtn.style.backgroundColor = "#4A90E2"; // Soothing blue
            startBtn.disabled = false;
        }
    }
});