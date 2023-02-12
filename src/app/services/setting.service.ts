import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private defaultSetting = {
    focus: 1500,
    shortBreak: 300,
    longBreak: 900,
    language: 'en',
  };
  constructor() {}

  getSetting() {
    return JSON.parse(
      localStorage.getItem('SETTING') || JSON.stringify(this.defaultSetting)
    );
  }

  changeSetting(setting) {
    localStorage.setItem('SETTING', JSON.stringify(setting));
  }
}
