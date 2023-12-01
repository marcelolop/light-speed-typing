"use strict";

/*
!------------------------------------------
!              SCORE CLASS
!------------------------------------------
*/

class Score {
  #date;
  #hits;
  #percentage;

  constructor(date, hits, percentage) {
    this.#date = date;
    this.#hits = hits;
    this.#percentage = percentage;
  }

  get date() {
    return this.#date;
  }

  get hits() {
    return this.#hits;
  }

  get percentage() {
    return this.#percentage;
  }

  set date(date) {
    if (typeof date === "string") {
      this.#date = date;
    }
  }

  set hits(hits) {
    if (typeof hits === "number") {
      this.#hits = hits;
    }
  }

  set percentage(percentage) {
    if (typeof percentage === "number") {
      this.#percentage = percentage;
    }
  }

  getInfo() {
    return {
      date: this.#date,
      hits: this.#hits,
      percentage: this.#percentage,
    };
  }

  toString() {
    return `Date: ${this.#date} - Hits: ${this.#hits} - Percentage: ${
      this.#percentage
    }%`;
  }
}

export default Score;
