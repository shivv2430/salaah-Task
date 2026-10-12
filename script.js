/**
 * Salaah Task Manager — The Mentor Community at ABESEC, Ghaziabad
 * Vanilla JavaScript implementation for offline-first local task management.
 */

(function () {
  'use strict';

  // Local storage keys
  const STORAGE_KEY = 'salaah_student_tasks';
  const THEME_KEY = 'salaah_theme';

  // Seed tasks for first-time visitors (ABESEC student realistic examples)
  const DEFAULT_TASKS = [
    {
      id: 'task-1',
      text: 'Finish Applied Mathematics assignments',
      completed: false,
      createdAt: Date.now() - 40000000,
    },
    {
      id: 'task-2',
      text: 'Practice 2 DSA questions',
      completed: true,
      createdAt: Date.now() - 30000000,
    },
    {
      id: 'task-3',
      text: 'Update my portfolio',
      completed: false,
      createdAt: Date.now() - 20000000,
    },
    {
      id: 'task-4',
      text: 'Research an internship',
      completed: false,
      createdAt: Date.now() - 10000000,
    },
    {
      id: 'task-5',
      text: 'Prepare questions before talking to a senior',
      completed: true,
      createdAt: Date.now() - 5000000,
    },
  ];

  // DOM Elements
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const formFeedback = document.getElementById('formFeedback');
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');

  // Progress & Counter elements
  const completedCountEl = document.getElementById('completedCount');
  const totalCountEl = document.getElementById('totalCount');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressBarEl = document.getElementById('progressBar');
  const countAllEl = document.getElementById('countAll');
  const countPendingEl = document.getElementById('countPending');
  const countCompletedEl = document.getElementById('countCompleted');

  // Filter buttons & interactive controls
  const filterBtns = document.querySelectorAll('.filter-btn');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const currentDateEl = document.getElementById('currentDate');
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // App State
  let tasks = [];
  let currentFilter = 'all';

  /**
   * Initialize the application
   */
  function init() {
    initTheme();
    initDateDisplay();
    loadTasks();
    setupEventListeners();
    render();
  }

  /**
   * Initialize theme and color scheme preference
   */
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }

    // Listen for OS theme changes if user hasn't chosen manually
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Apply theme attribute and update toggle button accessibility labels
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      const labelText = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggleBtn.setAttribute('aria-label', labelText);
      themeToggleBtn.setAttribute('title', labelText);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
  }

  /**
   * Display formatted current date
   */
  function initDateDisplay() {
    if (!currentDateEl) return;
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  /**
   * Load tasks from localStorage or seed initial data
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        tasks = JSON.parse(stored);
        if (!Array.isArray(tasks)) {
          tasks = [];
        }
      } else {
        tasks = [...DEFAULT_TASKS];
        saveTasks();
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default tasks', e);
      tasks = [...DEFAULT_TASKS];
    }
  }

  /**
   * Save current tasks to localStorage
   */
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not write to localStorage', e);
    }
  }

  /**
   * Register event listeners
   */
  function setupEventListeners() {
    // Form submission
    taskForm.addEventListener('submit', handleAddTask);

    // Input feedback clearing
    taskInput.addEventListener('input', function () {
      if (formFeedback.textContent) {
        formFeedback.textContent = '';
        taskInput.classList.remove('input-error');
      }
    });

    // Filter switching
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.dataset.filter;
        setFilter(filter);
      });
    });

    // Quick suggestion prompt chips
    promptChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const text = chip.dataset.text || chip.textContent.trim();
        taskInput.value = text;
        taskInput.focus();
        formFeedback.textContent = '';
        taskInput.classList.remove('input-error');
      });
    });

    // Theme toggle button
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  }

  /**
   * Add a new task
   */
  function handleAddTask(e) {
    e.preventDefault();
    const rawValue = taskInput.value;
    const trimmed = rawValue.trim();

    if (!trimmed) {
      formFeedback.textContent = 'Please enter a task description.';
      taskInput.classList.add('input-error');
      taskInput.focus();
      return;
    }

    // Create unique task object
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    // Prepend to top of list
    tasks.unshift(newTask);
    saveTasks();

    // Reset input
    taskInput.value = '';
    formFeedback.textContent = '';
    taskInput.classList.remove('input-error');

    // If currently filtered on 'completed', switch to 'all' so new task is immediately visible
    if (currentFilter === 'completed') {
      setFilter('all');
    } else {
      render();
    }

    taskInput.focus();
  }

  /**
   * Toggle task completion status
   */
  function toggleTask(id) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
    saveTasks();
    render();
  }

  /**
   * Delete a task
   */
  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    render();
  }

  /**
   * Change current filter
   */
  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(function (btn) {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    render();
  }

  /**
   * Update counters and progress bar
   */
  function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(function (t) {
      return t.completed;
    }).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update UI numbers
    completedCountEl.textContent = completed;
    totalCountEl.textContent = total;
    progressPercentEl.textContent = percentage + '%';
    progressBarEl.style.width = percentage + '%';

    // Update filter badges
    countAllEl.textContent = total;
    countPendingEl.textContent = pending;
    countCompletedEl.textContent = completed;
  }

  /**
   * Render the task list and empty state based on active filter
   */
  function render() {
    updateProgress();

    // Filter tasks
    const filteredTasks = tasks.filter(function (task) {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true; // 'all'
    });

    // Clear previous task list
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
      taskList.style.display = 'none';
      emptyState.style.display = 'flex';

      // Contextual empty state messaging
      if (currentFilter === 'pending') {
        emptyTitle.textContent = 'All caught up! No pending tasks.';
        emptyDesc.textContent = 'Great job staying on top of your college goals today.';
      } else if (currentFilter === 'completed') {
        emptyTitle.textContent = 'No completed tasks yet.';
        emptyDesc.textContent = 'Check off tasks as you finish them to track your daily progress.';
      } else {
        emptyTitle.textContent = 'Nothing here for now. Add a task and get started.';
        emptyDesc.textContent = 'Break your college work into smaller goals and tackle them one step at a time.';
      }
      return;
    }

    // Has tasks to display
    taskList.style.display = 'flex';
    emptyState.style.display = 'none';

    filteredTasks.forEach(function (task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' is-completed' : '');
      li.id = 'item-' + task.id;

      // Container for checkbox and title
      const mainDiv = document.createElement('div');
      mainDiv.className = 'task-main';

      // Custom Checkbox label
      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'custom-checkbox';
      checkboxLabel.setAttribute('aria-label', 'Mark "' + task.text + '" as ' + (task.completed ? 'pending' : 'completed'));

      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxInput.checked = task.completed;
      checkboxInput.addEventListener('change', function () {
        toggleTask(task.id);
      });

      const visualSpan = document.createElement('span');
      visualSpan.className = 'checkbox-visual';
      visualSpan.innerHTML =
        '<svg class="checkbox-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M2.5 6.2L4.8 8.5L9.5 3.5"/>' +
        '</svg>';

      checkboxLabel.appendChild(checkboxInput);
      checkboxLabel.appendChild(visualSpan);

      // Task Title text
      const titleSpan = document.createElement('span');
      titleSpan.className = 'task-title';
      titleSpan.textContent = task.text;
      titleSpan.addEventListener('click', function () {
        toggleTask(task.id);
      });

      mainDiv.appendChild(checkboxLabel);
      mainDiv.appendChild(titleSpan);

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete';
      deleteBtn.setAttribute('aria-label', 'Delete task: ' + task.text);
      deleteBtn.title = 'Delete task';
      deleteBtn.innerHTML =
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 6h18"/>' +
        '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>' +
        '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
        '<line x1="10" y1="11" x2="10" y2="17"/>' +
        '<line x1="14" y1="11" x2="14" y2="17"/>' +
        '</svg>';

      deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteTask(task.id);
      });

      li.appendChild(mainDiv);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Start the application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
