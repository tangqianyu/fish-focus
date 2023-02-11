import { Injectable } from '@angular/core';

export type TaskItem = {
  text: string;
  status: 0 | 1; //0:not complete  1: complete
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor() {}

  getTaskList(): TaskItem[] {
    return JSON.parse(localStorage.getItem('TASKS') || '[]');
  }

  editTask(index: number, task: TaskItem) {
    const taskList = this.getTaskList();
    taskList.splice(index, 1, task);
    this.save(taskList);
  }

  deleteTask(index: number) {
    const taskList = this.getTaskList();
    taskList.splice(index, 1);
    this.save(taskList);
  }

  addTask(task: TaskItem) {
    const taskList = this.getTaskList();
    taskList.push(task);
    this.save(taskList);
  }

  changeTaskStatus(index: number, task: TaskItem, status: 0 | 1) {
    this.editTask(index, {
      text: task.text,
      status,
    });
  }

  private save(taskList: TaskItem[]) {
    localStorage.setItem('TASKS', JSON.stringify(taskList));
  }
}
