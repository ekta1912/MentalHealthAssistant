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
    const crisisModal = document.getElementById('crisis-modal');
    const openCrisisBtn = document.getElementById('open-crisis-btn');
    const closeCrisisBtn = document.getElementById('close-crisis-btn');
    const breathingModal = document.getElementById('breathing-modal');
    const openBreathingBtn = document.getElementById('open-breathing-btn');
    const closeBreathingBtn = document.getElementById('close-breathing-btn');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingInstruction = document.getElementById('breathing-instruction');
    const breathingTimer = document.getElementById('breathing-timer');
    const toggleBreathingCycle = document.getElementById('toggle-breathing-cycle');
    const textChatForm = document.getElementById('text-chat-form');
    const textInput = document.getElementById('text-input');
    const sendBtn = document.getElementById('send-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const soundwave = document.getElementById('soundwave');
    const toggleSoundBtn = document.getElementById('toggle-sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundStatusText = document.getElementById('sound-status-text');
    let isVoiceMuted = false;

    function setSoundwave(active) {
        if (!soundwave) return;
        if (active) soundwave.classList.add('active');
        else soundwave.classList.remove('active');
    }

    if (toggleSoundBtn) {
        toggleSoundBtn.addEventListener('click', () => {
            isVoiceMuted = !isVoiceMuted;
            if (isVoiceMuted) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                if (soundIcon) soundIcon.innerText = '🔇';
                if (soundStatusText) soundStatusText.innerText = 'Voice Audio: OFF';
                setSoundwave(false);
            } else {
                if (soundIcon) soundIcon.innerText = '🔊';
                if (soundStatusText) soundStatusText.innerText = 'Voice Audio: ON';
            }
        });
    }

    function toggleCrisisModal(show) {
        if (!crisisModal) return;
        if (show) {
            crisisModal.classList.add('active');
        } else {
            crisisModal.classList.remove('active');
        }
    }

    if (openCrisisBtn) openCrisisBtn.addEventListener('click', () => toggleCrisisModal(true));
    if (closeCrisisBtn) closeCrisisBtn.addEventListener('click', () => toggleCrisisModal(false));
    if (crisisModal) {
        crisisModal.addEventListener('click', (e) => {
            if (e.target === crisisModal) toggleCrisisModal(false);
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleCrisisModal(false);
            toggleBreathingModal(false);
        }
    });

    let breathingInterval = null;
    let isBreathingActive = false;

    function toggleBreathingModal(show) {
        if (!breathingModal) return;
        if (show) {
            breathingModal.classList.add('active');
        } else {
            breathingModal.classList.remove('active');
            stopBreathingCycle();
        }
    }

    function stopBreathingCycle() {
        isBreathingActive = false;
        clearInterval(breathingInterval);
        if (breathingCircle) {
            breathingCircle.className = 'breathing-circle';
        }
        if (breathingInstruction) breathingInstruction.innerText = 'Ready to begin';
        if (breathingTimer) breathingTimer.innerText = 'Press Start to synchronize';
        if (toggleBreathingCycle) toggleBreathingCycle.innerText = 'Start Exercise';
    }

    function runBreathingCycle() {
        const phases = [
            { name: 'Inhale gently through nose...', class: 'inhale', seconds: 4 },
            { name: 'Hold your breath calmly...', class: 'hold', seconds: 7 },
            { name: 'Exhale completely through mouth...', class: 'exhale', seconds: 8 }
        ];

        let phaseIndex = 0;
        let count = phases[0].seconds;

        function setPhase() {
            const current = phases[phaseIndex];
            if (breathingCircle) breathingCircle.className = `breathing-circle ${current.class}`;
            if (breathingInstruction) breathingInstruction.innerText = current.name;
            if (breathingTimer) breathingTimer.innerText = `${count}s`;
        }

        setPhase();

        breathingInterval = setInterval(() => {
            count--;
            if (count > 0) {
                if (breathingTimer) breathingTimer.innerText = `${count}s`;
            } else {
                phaseIndex = (phaseIndex + 1) % phases.length;
                count = phases[phaseIndex].seconds;
                setPhase();
            }
        }, 1000);
    }

    if (openBreathingBtn) openBreathingBtn.addEventListener('click', () => toggleBreathingModal(true));
    if (closeBreathingBtn) closeBreathingBtn.addEventListener('click', () => toggleBreathingModal(false));
    if (breathingModal) {
        breathingModal.addEventListener('click', (e) => {
            if (e.target === breathingModal) toggleBreathingModal(false);
        });
    }

    if (toggleBreathingCycle) {
        toggleBreathingCycle.addEventListener('click', () => {
            if (isBreathingActive) {
                stopBreathingCycle();
            } else {
                isBreathingActive = true;
                toggleBreathingCycle.innerText = 'Stop Exercise';
                runBreathingCycle();
            }
        });
    }

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
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }
                r.start();
                setSoundwave(true);
                startBtn.innerText = "Listening deeply...";
                startBtn.classList.add('listening-pulse');
                startBtn.disabled = true;
            } catch(e) {
                console.error(e);
                resetUI();
            }
        });
    }

    if (textChatForm) {
        textChatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = textInput ? textInput.value.trim() : '';
            if (!text) return;

            if (textInput) {
                textInput.value = '';
                textInput.disabled = true;
            }
            if (sendBtn) sendBtn.disabled = true;
            if (startBtn) startBtn.disabled = true;

            chatDisplay.innerHTML += `<br><br><b>You:</b> "${text}"`;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            await callGemini(text);

            if (textInput) {
                textInput.disabled = false;
                textInput.focus();
            }
            if (sendBtn) sendBtn.disabled = false;
        });
    }

    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            chatHistory = [];
            chatDisplay.innerHTML = `<div class="chat-welcome">Take a deep, gentle breath. I'm here to listen whenever you're ready.</div>`;
            resetUI();
            if (textInput) {
                textInput.value = '';
                textInput.disabled = false;
            }
            if (sendBtn) sendBtn.disabled = false;
        });
    }

    const chipButtons = document.querySelectorAll('.chip-btn');
    chipButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const prompt = button.getAttribute('data-prompt');
            if (!prompt) return;

            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }

            if (startBtn) startBtn.disabled = true;
            if (sendBtn) sendBtn.disabled = true;

            chatDisplay.innerHTML += `<br><br><b>You:</b> "${prompt}"`;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            await callGemini(prompt);

            if (sendBtn) sendBtn.disabled = false;
        });
    });

    r.onerror = function(event) {
        console.error("🎤 Mic Error:", event.error); 
        resetUI();
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            chatDisplay.innerHTML += `<br><br><b>Samaira:</b> <i>"I didn't quite catch that. Take your time, I'm still here."</i>`;
        }
    };

    r.onresult = async function (event) {
        const transcript = event.results[0][0].transcript;
        chatDisplay.innerHTML += `<br><br><b>You:</b> "${transcript}"`;
        startBtn.innerText = "Processing...";
        setSoundwave(false);
        startBtn.classList.remove('listening-pulse');
        startBtn.disabled = true;
        
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server connection failed (${response.status})`);
            }

            const data = await response.json();
            const samairaReply = data.reply;
            
            chatDisplay.innerHTML += `<br><br><b>Samaira:</b> <i>"${samairaReply}"</i>`;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            chatHistory.push({
                "role": "model",
                "parts": [{ "text": samairaReply }]
            });

            // Keep memory bounded, always ensuring first turn starts with user
            if (chatHistory.length > 12) {
                chatHistory = chatHistory.slice(-12);
                if (chatHistory.length > 0 && chatHistory[0].role === "model") {
                    chatHistory.shift();
                }
            }

            speak(samairaReply);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = "I had a momentary glitch reaching the server. Please try speaking once more.";
            chatDisplay.innerHTML += `<br><br><b>Samaira:</b> <i>"${errorMsg}"</i>`;
            speak(errorMsg);
            
            if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "user") {
                chatHistory.pop(); 
            }
        }
    }

    function speak(text) {
        if (!('speechSynthesis' in window) || isVoiceMuted) return resetUI();
        setSoundwave(true);

        // Clear any previous or stalled utterances to prevent audio playback freezing in Chrome/Edge
        window.speechSynthesis.cancel();

        const spokenText = text
            .replace(/[*_~`#]/g, '') 
            .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '') 
            .replace(/\(.*?\)/g, ''); 

        const utterance = new SpeechSynthesisUtterance(spokenText);
        
        // THERAPEUTIC VOICE SETTINGS: Lower pitch, slower rate for a calming effect
        utterance.pitch = 1.0;  
        utterance.rate = 0.88;  

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

        utterance.onerror = (e) => {
            console.error("SpeechSynthesis error:", e);
            resetUI();
        };

        window.speechSynthesis.speak(utterance);
    }

    function resetUI() {
        setSoundwave(false);
        if(startBtn) {
            startBtn.innerText = "Speak to Samaira";
            startBtn.classList.remove('listening-pulse');
            startBtn.disabled = false;
        }
    }
});