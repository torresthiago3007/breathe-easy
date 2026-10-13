const startBtn = document.getElementById('start-btn');
const muteBtn = document.getElementById('mute-btn');
const instruction = document.getElementById('instruction');
const circle = document.querySelector('.circle');

let isRunning = false;
let isMuted = false;
let breathInterval = null;
let currentTimeout = null;
let audioCtx = null;
let activeSource = null;

function playBreathingSound(isInhale, duration = 4) {
    if (isMuted) return;

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Se já houver um som tocando, para ele imediatamente para evitar sobreposição
        if (activeSource) {
            try { activeSource.stop(); } catch (e) {}
        }

        const sampleRate = audioCtx.sampleRate;
        const bufferSize = sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        activeSource = noise;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';

        const gainNode = audioCtx.createGain();
        const now = audioCtx.currentTime;

        if (isInhale) {
            filter.frequency.setValueAtTime(250, now);
            filter.frequency.exponentialRampToValueAtTime(850, now + duration * 0.8);

            gainNode.gain.setValueAtTime(0.01, now);
            gainNode.gain.linearRampToValueAtTime(0.25, now + duration * 0.5);
            gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
        } else {
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(200, now + duration * 0.9);

            gainNode.gain.setValueAtTime(0.01, now);
            gainNode.gain.linearRampToValueAtTime(0.20, now + duration * 0.4);
            gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
        }

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start(now);
        noise.stop(now + duration);
    } catch (e) {
        console.error("Audio Synthesis Error:", e);
    }
}

function breathCycle() {
    if (!isRunning) return;

    // Fase de Inspiração (4s)
    instruction.textContent = "Inhale deeply through your nose...";
    circle.classList.add('grow');
    playBreathingSound(true, 4);

    currentTimeout = setTimeout(() => {
        if (!isRunning) return;
        // Fase de Expiração (4s)
        instruction.textContent = "Exhale slowly through your mouth...";
        circle.classList.remove('grow');
        playBreathingSound(false, 4);
    }, 4000);
}

function startSession() {
    isRunning = true;
    startBtn.textContent = "Pause Session";
    startBtn.classList.remove('primary');
    startBtn.classList.add('secondary');
    muteBtn.style.display = 'inline-block';

    breathCycle();
    breathInterval = setInterval(breathCycle, 8000);
}

function stopSession() {
    isRunning = false;
    clearInterval(breathInterval);
    clearTimeout(currentTimeout);

    // Para o som imediatamente ao pausar
    if (activeSource) {
        try { activeSource.stop(); } catch (e) {}
    }

    instruction.textContent = "Session paused. Click Start to resume.";
    circle.classList.remove('grow');
    startBtn.textContent = "Start Session";
    startBtn.classList.remove('secondary');
    startBtn.classList.add('primary');
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        stopSession();
    } else {
        startSession();
    }
});

muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? "🔇 Unmute Audio" : "🔊 Mute Audio";
    if (isMuted && activeSource) {
        try { activeSource.stop(); } catch (e) {}
    }
});