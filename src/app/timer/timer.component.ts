import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Timer } from '../models/timer.model';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnDestroy {
  countdownSubscription: Subscription = new Subscription;
  countdownTimer: Timer = new Timer;
  timerRunning: boolean = false;
  formHours: number = 0;
  formMinutes: number = 0;
  formSeconds: number = 0;
  validTimer: boolean = true;
  timerPaused: boolean = false;
  negativeTimer: boolean = false;
  faPlus = faPlusSquare;
  faMinus = faMinusSquare;

  ngOnDestroy() {
    this.countdownSubscription.unsubscribe();
  }

  setTimerValue(seconds: number) {
    this.countdownTimer.hours = Math.floor(seconds / (60 * 60));
    this.countdownTimer.minutes = Math.floor((seconds % (60 * 60)) / 60)
    this.countdownTimer.seconds = (seconds % (60 * 60)) % 60
  }


  setTimer(sign: string) {
    let currSecs = this.countdownTimer.hours * 60 * 60 + this.countdownTimer.minutes * 60 + this.countdownTimer.seconds;
    if (sign === 'negative') {
      currSecs++;
    } else {
      currSecs--
    }

    if (currSecs >= 0) {
      this.setTimerValue(currSecs);
    }
  }

  validateTimer() {
    // Validate timer to be within valid ranges
    return ((typeof this.formHours === "number" && this.formHours >= 0 && this.formHours <= 99) && (typeof this.formMinutes === "number" && this.formMinutes >= 0 && this.formMinutes <= 59) && (typeof this.formSeconds === "number" && this.formSeconds >= 0 && this.formSeconds <= 59)) && (this.formHours !== 0 || this.formMinutes !== 0 || this.formSeconds !== 0);
  }

  startTimer() {
    this.negativeTimer = false;
    this.timerPaused = false;
    if (!this.validateTimer()) {
      this.validTimer = false;
    } else {
      this.validTimer = true;
      this.timerRunning = true;
      this.countdownTimer.hours = this.formHours && typeof this.formHours === "number" ? this.formHours : 0;
      this.countdownTimer.minutes = this.formMinutes && typeof this.formMinutes === "number" ? this.formMinutes : 0;
      this.countdownTimer.seconds = this.formSeconds && typeof this.formSeconds === "number" ? this.formSeconds : 0;
      // Decrement second variable every seconds
      this.countdownSubscription = interval(1000)
        .subscribe(x => this.initiateTimer());
    }
  }

  initiateTimer() {
    if (this.negativeTimer) {
      this.setTimer('negative');
    } else {
      this.setTimer('positive');
    }
    this.timerRunning = true;
    if (this.countdownTimer.seconds === 0 && this.countdownTimer.minutes === 0 && this.countdownTimer.hours === 0) {
      this.negativeTimer = true;
    }
  }

  pauseTimer() {
    this.timerPaused = true;
    this.countdownSubscription.unsubscribe();
  }

  resumeTimer() {
    this.timerPaused = false;
    this.countdownSubscription = interval(1000)
      .subscribe(x => this.initiateTimer());
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
    this.negativeTimer = false;
    this.countdownSubscription.unsubscribe();
  }

  jogTimer(seconds: number) {
    let currSecs = this.countdownTimer.hours * 60 * 60 + this.countdownTimer.minutes * 60 + this.countdownTimer.seconds;
    if (this.negativeTimer) {
      currSecs *= -1;
    }
    let newSecs = currSecs + seconds;
    if (newSecs < 0) {
      this.negativeTimer = true;
      newSecs *= -1;
    } else {
      this.negativeTimer = false;
    }
    this.setTimerValue(newSecs);
  }
}
