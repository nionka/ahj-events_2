/* eslint-disable no-param-reassign */
import Task from './Task';

export default class Complite {
  constructor(container) {
    this.tasks = [];
    this.id = 1;
    this.container = container;
    this.input = this.container.querySelector('.input');
    this.pinned = this.container.querySelector('.pinned__list');
    this.allTasks = this.container.querySelector('.alltasks__list');
  }

  init() {
    this.checkTasks();
    this.input.addEventListener('input', (event) => this.onInput(event));
    this.input.addEventListener('keydown', (event) => this.onEnter(event));
    this.container.addEventListener('change', (event) => this.onChange(event));
  }

  onInput(e) {
    this.container.querySelector('div.mistake').classList.add('hidden');

    this.autoComplite(e.target.value);
  }

  onEnter(e) {
    if (e.key === 'Enter') {
      if (e.target.value === '') {
        this.container.querySelector('div.mistake').classList.remove('hidden');
      } else {
        this.tasks.push(new Task(this.id, this.input.value));
        this.addTaskAllTasks(new Task(this.id, this.input.value));
        this.input.value = '';
        this.id += 1;

        this.autoComplite(this.input.value);
      }
    }

    this.checkTasks();
  }

  onChange(e) {
    this.tasks.forEach((task) => {
      if (task.id === +e.target.closest('.item').dataset.id) {
        task.check = e.target.checked;
      }
    });

    this.autoComplite(this.input.value);
    this.getPinnedTask();
    this.checkTasks();
  }

  autoComplite(value) {
    const noPinned = this.getNoPinnedTasks();
    this.allTasks.innerHTML = '';

    if (value === '') {
      noPinned.forEach((task) => this.addTaskAllTasks(task));
    } else {
      noPinned.forEach((task) => {
        if (task.text.toLowerCase().includes(value.toLowerCase())) {
          this.addTaskAllTasks(task);
        }
      });
    }

    this.checkTasks();
  }

  getPinnedTask() {
    this.pinned.innerHTML = '';
    this.tasks.forEach((task) => {
      if (task.check) {
        this.addTaskPinned(task);
      }
    });
  }

  getNoPinnedTasks() {
    const result = [];
    this.tasks.forEach((task) => {
      if (!task.check) {
        result.push(task);
      }
    });

    return result;
  }

  checkTasks() {
    if (!this.pinned.hasChildNodes()) {
      this.addMessagePinned();
    }

    if (!this.allTasks.hasChildNodes()) {
      this.addMessageAllTasks();
    }
  }

  addTaskPinned(task) {
    const li = document.createElement('li');
    li.classList.add('item');
    li.dataset.id = `${task.id}`;
    li.innerHTML = `<label><span>${task.text}</span><input type="checkbox" class="checkbox" checked></label>`;

    this.pinned.append(li);
  }

  addTaskAllTasks(task) {
    const li = document.createElement('li');
    li.classList.add('item');
    li.dataset.id = `${task.id}`;
    li.innerHTML = `<label><span>${task.text}</span><input type="checkbox" class="checkbox"></label>`;

    this.allTasks.append(li);
  }

  addMessagePinned() {
    const li = document.createElement('li');
    li.classList.add('message');
    li.textContent = 'No pinned tasks';
    this.pinned.append(li);
  }

  addMessageAllTasks() {
    const li = document.createElement('li');
    li.classList.add('message');
    li.textContent = 'No tasks found';
    this.allTasks.append(li);
  }
}
