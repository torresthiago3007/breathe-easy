# 🫁 Breathe Easy — Guided Breathing & Calming Acoustics

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-brightgreen.svg)](https://torresthiago3007.github.io/breathe-easy/)

**Breathe Easy** is a minimalist, web-based digital health application designed to assist users in managing acute anxiety, stress, and panic symptoms through paced diaphragmatic breathing accompanied by natural airflow acoustic cues.

---

## 🌟 Key Features (v1.1)

- **Multiple Breathing Techniques**:
  - **4-7-8 Relaxing**: Designed for acute anxiety reduction and sleep onset.
  - **Box Breathing**: Used for focus, emotional grounding, and autonomic stability.
  - **Equal Breathing**: Paced 4s inhale / 4s exhale pattern for daily stress balance.
- **Web Audio API Acoustics**: Zero external audio dependencies. Generates dynamic airflow acoustics programmatically using filtered noise synthesis.
- **Cycle Tracker**: Real-time counter monitoring completed breathing cycles per session.
- **Dark Mode**: Toggleable dark theme for comfortable nighttime use.
- **Layout Stability**: Fixed shadow container design engineered to prevent visual jitter and Cumulative Layout Shift (CLS).

---

## 🔬 Scientific Basis & Research

1. **Diaphragmatic Breathing & Vagus Nerve Stimulation**
   - Slow, deliberate breathing at approximately 6 breaths per minute (~0.1 Hz) stimulates vagal nerve activity, encouraging a transition from sympathetic nervous system dominance ("fight-or-flight") to parasympathetic regulation ("rest and digest").
   - [Effect of Diaphragmatic Breathing on Stress (PubMed)](https://pubmed.ncbi.nlm.nih.gov/28835754/)

2. **Parasympathetic Activation via Prolonged Exhalation**
   - Extended exhalations (such as in the 4-7-8 technique) slow heart rate via Respiratory Sinus Arrhythmia (RSA), aiding in rapid emotional grounding.
   - [Vagus Nerve and Parasympathetic Activation (NCBI)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6137615/)

3. **Box Breathing for Cognitive Control**
   - Four-phase equal duration breathing stabilizes autonomic arousal and restores focus during high-stress states.
   - [Effects of Deep Breathing Techniques (Medical News Today)](https://www.medicalnewstoday.com/articles/324417)

---

## 🛠️ Tech Stack

- **HTML5**: Semantic document structure with embedded scientific references.
- **CSS3**: Custom CSS variables for theme toggling, smooth cubic-bezier transitions, and CSS Grid/Flexbox layout.
- **JavaScript (ES6+)**: Asynchronous timing logic, Web Audio API synthesis, and DOM manipulation.

---

## 🚀 How to Run Locally

1. Clone this repository:
   ```bash
   git clone [https://github.com/torresthiago3007/breathe-easy.git](https://github.com/torresthiago3007/breathe-easy.git)