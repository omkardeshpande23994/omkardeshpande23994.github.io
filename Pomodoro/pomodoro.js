// Timer Functionality
const timeDisplay = document.querySelector('.time-display');
const startBtn = document.querySelector('.start-btn');
let timerInterval;
let timeRemaining = 25 * 60; // 25 minutes in seconds

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
