<template>
  <div class="quiz container header center">
    <router-link to="/">
      <img width="120px" src="../assets/logo.png">
    </router-link>
        <div v-if="questions.length">
          <!-- Timer -->
              <div v-if="startTimerNum" class="timer">
                <h3 class="grey-text">{{ formattedTimeLeft }}</h3>
              </div>
            <!-- / Timer -->
          <h3 class="center-align grey-text" v-html="index+1 + ' of 10'"></h3>
          <transition-group :duration="{ enter: 4000 }" enter-active-class="animated zoomInDown" tag="tr">
          <h3 class="center-align deep-purple-text" v-html="currentQuestion.question" :key="currentQuestion.question"></h3>
          <div v-for="(answer, index) in shuffledAnswers" :key="answer" class="answers">
            <button class="chip" @click="selectAnswer(index)" :class="submitClass(index)" v-html="answer"></button>
          </div>
          </transition-group>
          <br>
          <div class="actions">
            <button :disabled="index >= 9 || submitted" id="next" @click="skip">Skip</button>
            
            <button
              id="submit"
              @click="submitAnswer"
              :disabled="submitted || selectedIndex === null"
            >Submit</button>
          </div>
        </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Timer from '@/components/Timer';


import _ from "lodash";
import { mapGetters } from "vuex";

const TIME_LIMIT = 3;

export default {
  name: "Question",
  components: {
      Timer,
    },
  props: {
    category: String
  },
  data() {
    return {
      questions: [],
      index: 0,
      selectedIndex: null,
      shuffledAnswers: [],
      correctIndex: null,
      submitted: false,
      timerInterval: null,
      timePassed: 0,
      startTimerNum: false
    };
  },
  mounted() {
    this.$store.dispatch("getQuestions", this.category)
    .then(() => {
      this.questions = this.$store.state.questions;
      this.$store.dispatch("resetDefault");
      // console.log(this.questions)
    });
    
  },
  computed: {
    formattedTimeLeft() {
      let seconds = this.timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${seconds}`;
    },

    timeLeft() {
      return TIME_LIMIT - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    },

    answers() {
      let answers = [
        ...this.currentQuestion.incorrect_answers,
        this.currentQuestion.correct_answer
      ];
      return answers;
    },
    currentQuestion() {
      return this.questions[this.index];
    },
    ...mapGetters(["numTotal", "numCorrect"])
  },
  watch: {
    currentQuestion: {
      immediate: true,
      handler() {
        if (this.questions.length) {
          this.selectedIndex = null;
          this.submitted = false;
          this.shuffleAnswers();
        }
      }
    },
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },
  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval);
    },

    selectAnswer(index) {
      this.selectedIndex = index;
    },
    shuffleAnswers() {
      let answers = [
        ...this.currentQuestion.incorrect_answers,
        this.currentQuestion.correct_answer
      ];
      this.shuffledAnswers = _.shuffle(answers);
      this.correctIndex = this.shuffledAnswers.indexOf(
        this.currentQuestion.correct_answer
      );
    },
    increment(isCorrect) {
      if (isCorrect) {
        this.$store.dispatch("incrementNumCorrect");
      }
      this.$store.dispatch("incrementNumTotal");
    },
    skip() {
      this.next();
      this.increment(false);
    },
    next() {
      this.index++;
    },
    submitAnswer() {
      let isCorrect = false;

      if (this.correctIndex === this.selectedIndex) {
        isCorrect = true;
      }
      this.submitted = true;

      this.increment(isCorrect);
      this.startTimer();
      this.startTimerNum = true;
      setTimeout(() => {
        if (this.index < 9) {
          this.next();
        } else {
          this.$router.push("/result");
        }
      }, 3000)
      ;
    },

    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
      this.timePassed = 0;
    },
    

    submitClass(index) {
      let submit = "answer";
      if (this.submitted && this.correctIndex === index) {
        submit = "answer correct";
      } else if (
        this.submitted &&
        this.selectedIndex !== this.correctIndex &&
        this.selectedIndex === index
      ) {
        submit = "answer wrong";
      } else if (!this.submitted && this.selectedIndex === index) {
        submit = "answer selected";
      }

      return submit;
    }
  }
};
</script>

<style scoped>

/* Timer */



/* Quiz */
button {
  transition: 0.3s;
}

.btn {
	 transition: 0.3s;
   background-color: whitesmoke
}

.quiz h3 {
	 font-family: Montserrat, sans-serif;
	 font-weight: normal;
   font-size: 1.8em;
   margin: 20px auto
}

.animated {
	 transition-duration: 0.15s;
}

.quiz {
	 max-width: 400px;
	 margin-top: 60px;
	 background: #fafafa;
	 position: relative;
	 padding: 20px;
	 border-radius: 0.5rem;
	 overflow: hidden;
	 box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.quiz .field{
    margin: 20px auto;
    position: relative
}

.quiz p {
  font-weight: bold;
  font-size: 1.1em;
}

.quiz .answers {
  display: flex;
  flex-direction: column;
}

.quiz .answers .answer {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.quiz .actions {
  display: flex;
  justify-content: space-between;
}

.quiz .actions button {
  width: 100px;
  color: #fff;
  border: none;
  padding: 15px;
  font-size: 1em;
  border-radius: 50px;
}

.quiz .actions button:focus {
  outline: none;
}

#submit {
  background: #673ab7;
}

#submit:disabled {
  background: #9e6ef1 !important;
  cursor: not-allowed;
}

#submit:hover {
  background: #9e6ef1;
}

#next {
  background:#e91e63;
}

#next:disabled {
  background: #e91e63 !important;
  cursor: not-allowed;
}

#next:hover {
  background:#eb5b8b;
}

.selected {
  background: #d0e2dd;
  border: 1px solid #d0e2dd;
}

.correct {
  background: #acdfba;
  border: 1px solid #acdfba;
}

.wrong {
  background: #ee8787;
  border: 1px solid #ee8787;
  color: #fff;
}

@media (max-width: 600px) {
  .quiz .actions {
    justify-content: center;
  }

  #submit {
    margin-left: 10px;
  }
}
</style>