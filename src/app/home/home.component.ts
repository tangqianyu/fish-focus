import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TaskItem, TaskService } from '../services/task.service';
import { SettingService } from '../services/setting.service';
import { msToTime } from '../utils/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('modeTrigger', [
      state(
        'focus',
        style({
          backgroundColor: '#ba4949',
        })
      ),
      state(
        'shortBreak',
        style({
          backgroundColor: '#38858a',
        })
      ),
      state(
        'longBreak',
        style({
          backgroundColor: '#397097',
        })
      ),
      transition('* => *', animate('500ms ease-in-out')),
    ]),
  ],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  setting: any = {};
  mode = 'focus';
  modeNumber = 0;
  modeColor = '#ba4949';

  modalType = '';

  modeList = ['focus', 'shortBreak', 'longBreak'];
  modeColorList = ['#ba4949', '#38858a', '#397097'];

  countdownStatus = '';
  taskModal!: NgbModalRef;
  settingModal!: NgbModalRef;
  taskItem: TaskItem = {
    text: '',
    status: 0,
  };
  editTaskIndex = 0;

  taskList = [];

  displaySetting: any = {};

  countConfig: CountdownConfig = {
    leftTime: 0,
    demand: true,
    formatDate: ({ date }) => `${msToTime(date)}`,
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private taskService: TaskService,
    private settingService: SettingService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getSetting();
    this.getTaskList();
  }

  ngAfterViewInit(): void {
    this.countdown.event.subscribe((val) => {
      console.log(val);
      this.countdownStatus = val.action;
      if (val.action === 'done') {
        this.playSound();
        if (this.mode === 'focus') {
          this.changeMode('shortBreak');
        } else {
          this.changeMode('focus');
        }
      }
    });
  }

  getSetting() {
    this.setting = this.settingService.getSetting();
    this.translate.setDefaultLang(this.settingService.getSetting().language);
    this.modeNumber = this.setting[`${this.mode}`];
    this.countConfig = {
      ...this.countConfig,
      leftTime: this.modeNumber,
    };
    this.displaySetting = {
      ...this.setting,
      focus: this.setting.focus / 60,
      shortBreak: this.setting.shortBreak / 60,
      longBreak: this.setting.longBreak / 60,
    };
  }

  getTaskList() {
    this.taskList = this.taskService.getTaskList();
  }

  changeMode(mode) {
    if (this.mode === mode) {
      return;
    }
    this.mode = mode;
    const index = this.modeList.findIndex((item) => item === mode);
    this.modeNumber = this.setting[mode];
    console.log(this.modeNumber);

    this.countConfig = {
      ...this.countConfig,
      leftTime: this.modeNumber,
    };

    this.modeColor = this.modeColorList[index];
  }

  startCountdown() {
    this.countdown.begin();
  }
  pauseCountdown() {
    this.countdown.pause();
  }

  openAddTaskModal(content) {
    this.modalType = 'ADD';
    this.taskItem = {
      text: '',
      status: 0,
    };
    this.taskModal = this.modalService.open(content);
  }
  saveAddTaskModal() {
    if (!this.taskItem) {
      return;
    }
    this.taskModal.close();
    this.taskService.addTask(this.taskItem);
    this.getTaskList();
    this.taskItem = {
      text: '',
      status: 0,
    };
  }

  openEditTaskModal(content, index, item) {
    this.modalType = 'EDIT';
    this.taskItem = JSON.parse(JSON.stringify(item));
    this.editTaskIndex = index;
    this.taskModal = this.modalService.open(content);
  }

  saveEditTaskModal() {
    if (!this.taskItem) {
      return;
    }
    this.taskModal.close();
    this.taskService.editTask(this.editTaskIndex, this.taskItem);
    this.getTaskList();
    this.taskItem = {
      text: '',
      status: 0,
    };
  }

  deleteTask(index) {
    this.taskService.deleteTask(index);
    this.getTaskList();
  }

  changeTaskStatus(index, item, val) {
    this.taskService.changeTaskStatus(index, item, val);
    this.getTaskList();
  }

  openSettingModal(content) {
    this.settingModal = this.modalService.open(content, {
      centered: true,
    });
  }

  saveSettingModal() {
    if (
      !this.displaySetting.focus ||
      !this.displaySetting.shortBreak ||
      !this.displaySetting.longBreak
    ) {
      return;
    }

    this.settingModal.close();
    const setting = {
      ...this.displaySetting,
      focus: this.displaySetting.focus * 60,
      shortBreak: this.displaySetting.shortBreak * 60,
      longBreak: this.displaySetting.longBreak * 60,
    };
    this.settingService.changeSetting(setting);
    this.getSetting();
  }

  playSound() {
    const audio = new Audio();
    audio.src = 'assets/media/alarm-kitchen.mp3';
    audio.load();
    audio.play();
  }
}
