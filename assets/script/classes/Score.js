'use strict';

/*
!------------------------------------------
!              SCORE CLASS
!------------------------------------------
*/
/*
Final project: Coding a game Weight: 30/100
In this assignment you will develop a fast-typing game. This project will test your programming 
skills as well as your ability to apply the concepts you've learned so far to a game.
Game structure and rules
* Game has a name (be creative).
* Game contains 120 words (see the array below).
* Players have 99 seconds to enter as many words as possible (in an input field).
* Game randomizes the words.
* Game displays a new word as soon as the player enter the previous one. Players can't go to 
* the next word unless they get the current word right.
* Players can start a new game by pressing a ‘start’ button. Players must be able to start (restart)
* a new game without reloading the page.
* Game displays the remaining seconds and the number of hits/points.
* Web page plays a background music when the game starts.
* Game ends when the time runs out, or when the player gets all the words right.
• Background music stops when the game ends.
const words = [
 'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
 'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
 'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
 'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
 'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
 'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
 'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
 'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
 'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
 'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
 'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
 'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope'
 'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
 'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
 'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];
Directions and requirements
* Develop an interactive web game, not a traditional website. Use colours, shapes, transitions, 
*animations and sounds that are suitable for a game.
* Your game must contain - and play - at least one background music. Animations are optional.
* Players must be able to start a new game when their game ends, without reloading the page.
* Use royalty-free songs.
* Create a class named Score with 3 private properties (date, hits, percentage), 3 getters and 
* a constructor). 
* Score objects are created when the game ends.
• Host your game on GitHub pages and add a README file with a link to it.
• Present your game to the class and invite your classmates to test your application.
* Have fun
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
        if (typeof date === 'string') {
            this.#date = date;
        }
    }

    set hits(hits) {
        if (typeof hits === 'number') {
            this.#hits = hits;
        }
    }

    set percentage(percentage) {
        if (typeof percentage === 'number') {
            this.#percentage = percentage;
        }
    }

    getInfo() {
        return {
            date: this.#date,
            hits: this.#hits,
            percentage: this.#percentage
        };
    }

    toString() {
        return `Date: ${this.#date} - Hits: ${this.#hits} - Percentage: ${this.#percentage}%`;
    }
}

export default Score;

