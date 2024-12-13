// Select elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date');

// Get today's date in the format YYYY-MM-DD
const today = new Date().toISOString().split('T')[0];
document.getElementById('due-date').value = today;

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks(tasks);

// Add a new task
addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (!text) {
    alert('Task cannot be empty.');
    return;
  }

  const newTask = {
    text,
    priority,
    dueDate,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks(tasks);
  clearInputs();
});

// Clear input fields
function clearInputs() {
  taskInput.value = '';
  prioritySelect.value = 'select-priority';
  dueDateInput.value = today; // Reset to today's date
}

// Render tasks
function renderTasks(taskArray) {
  taskList.innerHTML = '';
  taskArray.forEach((task, index) => {
    const taskItem = document.createElement('li');
    taskItem.className = `task ${task.completed ? 'completed' : ''}`;
    taskItem.style.borderLeft = `5px solid ${
      task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'
    }`;

    taskItem.innerHTML = `
      <span>${task.text}</span>
      <span class="due-date">${task.dueDate || 'No Due Date'}</span>
      <div>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="toggleComplete(${index})">${task.completed ? 'Undo' : 'Complete'}</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(taskItem);
  });
}

// Edit task
function editTask(index) {
  const newTaskText = prompt('Edit your task:', tasks[index].text);
  if (newTaskText !== null && newTaskText.trim() !== '') {
    tasks[index].text = newTaskText.trim();
    saveTasks();
    renderTasks(tasks);
  }
}

// Filter tasks
function filterTasks(filter) {
  let filteredTasks;
  if (filter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (filter === 'incomplete') {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else {
    filteredTasks = tasks; // Show all tasks
  }
  renderTasks(filteredTasks);
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks(tasks);
}

// Delete a task with animation
function deleteTask(index) {
  const taskItem = taskList.children[index];
  taskItem.classList.add('removed');
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(tasks);
  }, 300); // Wait for animation to finish
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Sort tasks
function sortTasks(criteria) {
  if (criteria === 'priority') {
    tasks.sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  } else if (criteria === 'dueDate') {
    tasks.sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity));
  }
  renderTasks(tasks);
}
