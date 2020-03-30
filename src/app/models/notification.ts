export class Notification {
  time: Date;
  level: NotificationLevel;
  message: string;

  constructor(time: Date, level: NotificationLevel, message: string) {
    this.time = time;
    this.level = level;
    this.message = message;
  }
}

export enum NotificationLevel {
  Info = "info",
  Warn = "warn",
  Error = "error"
}