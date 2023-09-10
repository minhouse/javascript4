// Quiz クラス
class Quiz {
  constructor() {
    this.currentIndex = 0;
    this.correctAnswers = 0;
    this.quizData = [];
  }

  async fetchQuizData() {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    this.quizData = data.results;
  }

  getCurrentQuestion() {
    return this.quizData[this.currentIndex];
  }

  nextQuestion() {
    this.currentIndex++;
  }

  answer(correct) {
    if (correct) {
      this.correctAnswers++;
    }
  }

  reset() {
    this.currentIndex = 0;
    this.correctAnswers = 0;
  }
}

// QuizApp 関数
const startQuiz = () => {
  const quiz = new Quiz();
  const genreAndDifficultyContainer =
    document.getElementById("genreAndDifficulty");
  const questionTextContainer = document.getElementById("questionText");
  const answerButtonsContainer = document.getElementById("answerButtons");
  const startButton = document.getElementById("startButton");
  const homeButton = document.createElement("button");
  homeButton.textContent = "ホームに戻る";
  const buttonWidth = 100;
  homeButton.style.width = `${buttonWidth}px`;
  homeButton.style.display = "none";

  const retryText = "再度チャレンジしたい場合は以下をクリック！！";
  const initialText = "以下のボタンをクリック";
  questionTextContainer.textContent = initialText;

  startButton.addEventListener("click", async () => {
    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = "取得中";

    genreAndDifficultyContainer.innerHTML = "";
    questionTextContainer.innerHTML = "";
    answerButtonsContainer.innerHTML = "";

    const loadingInfo = document.createElement("p");
    loadingInfo.textContent = "少々お待ちください";
    questionTextContainer.appendChild(loadingInfo);

    await quiz.fetchQuizData();

    quizDisplayQuestion();
  });

  homeButton.addEventListener("click", () => {
    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = "ようこそ";
    genreAndDifficultyContainer.innerHTML = "";
    questionTextContainer.innerHTML = initialText;
    answerButtonsContainer.innerHTML = "";
    answerButtonsContainer.appendChild(startButton);
    startButton.style.display = "block";
    homeButton.style.display = "none";
    quiz.reset();
  });

  const quizDisplayQuestion = () => {
    const question = quiz.getCurrentQuestion();
    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = `問題 ${quiz.currentIndex + 1}`;

    startButton.style.display = "none";

    genreAndDifficultyContainer.innerHTML = `
      <p>[ジャンル] ${question.category}</p>
      <p>[難易度] ${question.difficulty}</p>
    `;

    questionTextContainer.innerHTML = "";
    const questionText = document.createElement("p");
    questionText.textContent = question.question;
    questionTextContainer.appendChild(questionText);

    answerButtonsContainer.innerHTML = "";

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () =>
        handleAnswerClick(answer === question.correct_answer)
      );
      answerButtonsContainer.appendChild(button);
      const buttonWidth = answer.length * 10 + 30;
      button.style.width = `${buttonWidth}px`;
    });
  };

  const handleAnswerClick = (correct) => {
    quiz.answer(correct);
    quiz.nextQuestion();

    if (quiz.currentIndex < quiz.quizData.length) {
      quizDisplayQuestion();
    } else {
      quizDisplayResult();
    }
  };

  const quizDisplayResult = () => {
    const correctAnswers = quiz.correctAnswers;
    const totalQuestions = quiz.quizData.length;

    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = `あなたの正答数は ${correctAnswers} / ${totalQuestions} です！！`;

    answerButtonsContainer.innerHTML = "";
    answerButtonsContainer.appendChild(homeButton);
    homeButton.style.display = "block";
    questionTextContainer.innerHTML = retryText;
    genreAndDifficultyContainer.innerHTML = "";
  };
};

// クイズを開始するための関数呼び出し
startQuiz();
