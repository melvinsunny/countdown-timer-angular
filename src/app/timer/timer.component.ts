import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Timer } from '../models/timer.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit, OnDestroy {
  countdownSubscription: Subscription = new Subscription;
  countdownTimer: Timer = new Timer;
  timerRunning: boolean = false;
  timerDone: boolean = false;
  formHours: number = 0;
  formMinutes: number = 0;
  formSeconds: number = 0;
  validTimer: boolean = true;
  timerPaused: boolean = false;

  ngOnInit() {

  }

  ngOnDestroy() {
    this.countdownSubscription.unsubscribe();
  }

  setTimer() {
    this.countdownTimer.seconds--;
    if (this.countdownTimer.seconds < 0) {
      this.countdownTimer.seconds = 59;
      this.countdownTimer.minutes--;
      if (this.countdownTimer.minutes < 0) {
        this.countdownTimer.minutes = 59;
        this.countdownTimer.hours--;
      }
    }
  }

  validateTimer() {
    return ((typeof this.formHours === "number" && this.formHours >= 0 && this.formHours <= 99) && (typeof this.formMinutes === "number" && this.formMinutes >= 0 && this.formMinutes <= 59) && (typeof this.formSeconds === "number" && this.formSeconds >= 0 && this.formSeconds <= 59)) && (this.formHours !== 0 || this.formMinutes !== 0 || this.formSeconds !== 0);
  }

  startTimer() {
    if (!this.validateTimer()) {
      this.validTimer = false;
    } else {
      this.validTimer = true;
      this.timerDone = false;
      this.timerRunning = true;
      this.countdownTimer.hours = this.formHours && typeof this.formHours === "number" ? this.formHours : 0;
      this.countdownTimer.minutes = this.formMinutes && typeof this.formMinutes === "number" ? this.formMinutes : 0;
      this.countdownTimer.seconds = this.formSeconds && typeof this.formSeconds === "number" ? this.formSeconds : 0;
      this.countdownSubscription = interval(1000)
        .subscribe(x => {
          this.setTimer();
          this.timerRunning = true;
          if (this.countdownTimer.seconds <= 0 && this.countdownTimer.minutes === 0 && this.countdownTimer.hours === 0) {
            this.countdownSubscription.unsubscribe();
            setTimeout(() => {
              this.timerDone = true;
              this.timerRunning = false;
            }, 1000);
          }
        });
    }
  }

  pauseTimer() {
    this.timerPaused = true;
    this.countdownSubscription.unsubscribe();
  }

  resumeTimer() {
    this.timerPaused = false;
    this.countdownSubscription = interval(1000)
        .subscribe(x => {
          this.setTimer();
          this.timerRunning = true;
          if (this.countdownTimer.seconds <= 0 && this.countdownTimer.minutes === 0 && this.countdownTimer.hours === 0) {
            this.countdownSubscription.unsubscribe();
            setTimeout(() => {
              this.timerDone = true;
              this.timerRunning = false;
            }, 1000);
          }
        });
  }

  resetTimer() {
    this.countdownTimer.hours = 0;
    this.countdownTimer.minutes = 0;
    this.countdownTimer.seconds = 0;
    this.formHours = 0;
    this.formMinutes = 0;
    this.formSeconds = 0;
    this.timerRunning = false;
    this.timerPaused = false;
    this.validTimer = true;
    this.timerDone = false;
    this.countdownSubscription.unsubscribe();
  }

  jogTimer(minutes: number) {
    this.countdownTimer.minutes += minutes;
    if (this.countdownTimer.minutes > 59) {
      this.countdownTimer.minutes = (this.countdownTimer.minutes) % 60;
      this.countdownTimer.hours++;
    }
  }
}
