const startBtn = document.getElementById('start-btn');
const muteBtn = document.getElementById('mute-btn');
const themeToggle = document.getElementById('theme-toggle');
const techniqueSelect = document.getElementById('technique-select');
const instruction = document.getElementById('instruction');
const circle = document.querySelector('.circle');
const cycleCounter = document.getElementById('cycle-counter');

let isRunning = false;
let isMuted = false;
let audioCtx = null;
let activeSource = null;
let currentTimeout = null;
let completedCycles = 0;

const techniques = {
    '4-7-8': { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
    'box': { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    'equal': { inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 }
};

function playBreathingSound(isInhale, duration) {
    if (isMuted) return;

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

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

function runBreathPhase(config) {
    if (!isRunning) return;

    circle.style.transition = `transform ${config.inhale}s cubic-bezier(0.4, 0, 0.2, 1), background-color ${config.inhale}s ease-in-out`;

    instruction.textContent = `Inhale deeply through nose (${config.inhale}s)...`;
    circle.classList.remove('hold');
    circle.classList.add('grow');
    playBreathingSound(true, config.inhale);

    currentTimeout = setTimeout(() => {
        if (!isRunning) return;

        if (config.holdIn > 0) {
            instruction.textContent = `Hold breath (${config.holdIn}s)...`;
            circle.classList.add('hold');
            
            currentTimeout = setTimeout(() => {
                if (!isRunning) return;
                startExhalePhase(config);
            }, config.holdIn * 1000);
        } else {
            startExhalePhase(config);
        }
    }, config.inhale * 1000);
}

function startExhalePhase(config) {
    if (!isRunning) return;

    circle.style.transition = `transform ${config.exhale}s cubic-bezier(0.4, 0, 0.2, 1), background-color ${config.exhale}s ease-in-out`;

    instruction.textContent = `Exhale slowly through mouth (${config.exhale}s)...`;
    circle.classList.remove('grow', 'hold');
    playBreathingSound(false, config.exhale);

    currentTimeout = setTimeout(() => {
        if (!isRunning) return;

        if (config.holdOut > 0) {
            instruction.textContent = `Hold empty (${config.holdOut}s)...`;
            
            currentTimeout = setTimeout(() => {
                if (!isRunning) return;
                finishCycle(config);
            }, config.holdOut * 1000);
        } else {
            finishCycle(config);
        }
    }, config.exhale * 1000);
}

function finishCycle(config) {
    if (!isRunning) return;

    completedCycles++;
    cycleCounter.textContent = `Completed Cycles: ${completedCycles}`;
    runBreathPhase(config);
}

function startSession() {
    isRunning = true;
    startBtn.textContent = "Pause Session";
    startBtn.classList.remove('primary');
    startBtn.classList.add('secondary');
    muteBtn.style.display = 'inline-block';
    techniqueSelect.disabled = true;

    const selectedTech = techniqueSelect.value;
    const config = techniques[selectedTech];

    runBreathPhase(config);
}

function stopSession() {
    isRunning = false;
    clearTimeout(currentTimeout);

    if (activeSource) {
        try { activeSource.stop(); } catch (e) {}
    }

    instruction.textContent = "Session paused. Click Start to resume.";
    circle.classList.remove('grow', 'hold');
    startBtn.textContent = "Start Session";
    startBtn.classList.remove('secondary');
    startBtn.classList.add('primary');
    techniqueSelect.disabled = false;
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

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