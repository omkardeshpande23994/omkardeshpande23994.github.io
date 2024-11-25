// Timer Functionality
const timeDisplay = document.querySelector('.time-display');
const startBtn = document.querySelector('.start-btn');
const modeButtons = document.querySelectorAll('.mode');
let timerInterval;
let timeRemaining = 25 * 60; // 25 minutes in seconds

// Timer mode durations in minutes
const timerModes = {
    'Pomodoro': 25,
    'Short Break': 5,
    'Long Break': 15
};

// Update active mode button
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Clear existing timer if running
        clearInterval(timerInterval);
        startBtn.textContent = 'START';
        
        // Update active button styling
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Set new timer duration
        const mode = button.textContent;
        timeRemaining = timerModes[mode] * 60;
        timeDisplay.textContent = `${timerModes[mode]}:00`;
    });
});

startBtn.addEventListener('click', () => {
    if (startBtn.textContent === 'START') {
        startBtn.textContent = 'PAUSE';
        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            } else {
                clearInterval(timerInterval);
                timeDisplay.textContent = '00:00';
                startBtn.textContent = 'START';
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        startBtn.textContent = 'START';
    }
});

// Task List Functionality
const addTaskBtn = document.querySelector('.add-task-btn');
const taskInputContainer = document.querySelector('.task-input');
const taskInput = document.getElementById('new-task');
const addTaskConfirmBtn = document.querySelector('.add-task-confirm-btn');
const checklist = document.querySelector('.checklist');

addTaskBtn.addEventListener('click', () => {
    taskInputContainer.classList.remove('hidden');
});

addTaskConfirmBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<input type="checkbox"> <span>${taskText}</span>`;
        checklist.appendChild(listItem);
        taskInput.value = '';
        taskInputContainer.classList.add('hidden');
    }
});
