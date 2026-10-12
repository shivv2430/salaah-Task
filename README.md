# Salaah Task Manager

> **The Mentor Community at ABES Engineering College (ABESEC), Ghaziabad**  
> *"A little progress, every day."*

🔗 **Live Website**: [https://shivv2430.github.io/salaah-Task/](https://shivv2430.github.io/salaah-Task/)  
📂 **Repository**: [https://github.com/shivv2430/salaah-Task](https://github.com/shivv2430/salaah-Task)

A simple, responsive, and distraction-free task manager tailored for ABESEC students to organize college coursework, personal learning goals, and mentorship preparation in one place.

---

## Features

- **Community Identity & Notebook Aesthetic**: Warm cream background, deep forest-green accents, and mustard-yellow highlights inspired by Salaah's mentor community.
- **Light & Dark Mode**: Seamless toggle between warm cream paper mode and a soothing forest-night dark mode with automatic OS preference detection and LocalStorage persistence.
- **Progress Tracking**: Real-time summary showing completed vs total tasks with a visual progress bar.
- **Smart Filtering**: Switch between **All**, **Pending**, and **Completed** views with live count badges.
- **Student-Centered Examples**: Built-in realistic task prompts (Applied Mathematics assignments, DSA practice, portfolio updates, internship research, senior mentorship prep).
- **Offline & LocalStorage Persistence**: Saves all tasks under `salaah_student_tasks` and theme under `salaah_theme`. Never requires an account, backend, or network connection.
- **Fully Responsive**: Optimized for desktop and mobile screens with touch-friendly controls and zero horizontal scroll.

---

## File Structure

```text
Salaah-Task/
├── index.html       # Semantic HTML5 layout and accessibility markup
├── style.css        # Clean CSS styling with custom theme tokens
├── script.js        # Vanilla JS logic for CRUD, filtering, and persistence
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

---

## Getting Started

Simply open `index.html` in any web browser, or serve it locally:

```bash
# Using Python's built-in server
python3 -m http.server 8080
```

Then visit `http://localhost:8080` in your browser.
