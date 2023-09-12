// Quiz クラス
class Quiz {
  constructor() {
    this.currentIndex = 0;
    this.correctAnswers = 0;
    this.quizData = [];
  }

  // 現在の問題を取得
  getCurrentQuestion() {
    return this.quizData[this.currentIndex];
  }

  // 次の問題に進む
  nextQuestion() {
    this.currentIndex++;
  }

  // 回答を処理し、正解の場合は正解数を増やす
  answer(correct) {
    if (correct) {
      this.correctAnswers++;
    }
  }

  // クイズの状態をリセット
  reset() {
    this.currentIndex = 0;
    this.correctAnswers = 0;
  }
}

// クイズデータを非同期で取得
const fetchQuizData = async () => {
  const response = await fetch("https://opentdb.com/api.php?amount=10");
  const data = await response.json();
  return data.results;
};

// fetchQuizData関数を非同期で呼び、取得したデータを格納
(async () => {
  const quizData = await fetchQuizData();
  // Quizクラスのインスタンス化
  const quiz = new Quiz(quizData);
  // Quizクラスインスタンスのプロパティにクイズデータを渡す
  quiz.quizData = quizData;

  // QuizApp関数（開始ボタンをクリック後呼び出す処理）
  const startQuiz = () => {
    // HTML要素の取得する変数の定義 （ボタンの初期化）
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

    // 開始ボタンのクリックイベント
    startButton.addEventListener("click", () => {
      const pageTitleElement = document.getElementById("title");
      pageTitleElement.textContent = "取得中"; // ページタイトルを更新

      // クイズ関連のコンテンツをクリア
      genreAndDifficultyContainer.innerHTML = "";
      questionTextContainer.innerHTML = "";
      answerButtonsContainer.innerHTML = "";

      // 読み込み中メッセージを表示
      const loadingInfo = document.createElement("p");
      loadingInfo.textContent = "少々お待ちください";
      questionTextContainer.appendChild(loadingInfo);

      // クイズデータの取得とクイズ開始
      quizDisplayQuestion();
    });

    // ホームボタンのクリックイベント
    homeButton.addEventListener("click", () => {
      const pageTitleElement = document.getElementById("title");
      pageTitleElement.textContent = "ようこそ";

      // クイズ関連のコンテンツをクリア
      genreAndDifficultyContainer.innerHTML = "";
      questionTextContainer.innerHTML = initialText;
      answerButtonsContainer.innerHTML = "";

      // 開始ボタンを再表示
      answerButtonsContainer.appendChild(startButton);
      startButton.style.display = "block";

      // ホームボタンを非表示にしてクイズをリセット
      homeButton.style.display = "none";
      quiz.reset();
    });

    // クイズの問題を表示
    const quizDisplayQuestion = () => {
      const question = quiz.getCurrentQuestion();
      const pageTitleElement = document.getElementById("title");
      pageTitleElement.textContent = `問題 ${quiz.currentIndex + 1}`;

      startButton.style.display = "none"; // 開始ボタンを非表示に

      // ジャンルと難易度を表示
      genreAndDifficultyContainer.innerHTML = `
        <p>[ジャンル] ${question.category}</p>
        <p>[難易度] ${question.difficulty}</p>
      `;

      // 質問テキスト格納のためのHTML要素
      questionTextContainer.innerHTML = "";
      const questionText = document.createElement("p");
      questionText.textContent = question.question;
      questionTextContainer.appendChild(questionText);

      // 前回の回答選択肢をクリア
      answerButtonsContainer.innerHTML = "";

      // 不正解と正解の回答を格納する配列を作成 (スプレッド演算子により統合)
      const answers = [...question.incorrect_answers, question.correct_answer];
      // 回答選択肢表示をランダム化
      answers.sort(() => Math.random() - 0.5);

      // 回答選択肢に対する処理
      answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer;
        // ボタンがクリックされ回答の正誤を判定
        button.addEventListener("click", () =>
          handleAnswerClick(answer === question.correct_answer)
        );
        answerButtonsContainer.appendChild(button);
        const buttonWidth = answer.length * 10 + 30;
        button.style.width = `${buttonWidth}px`;
      });
    };

    // 回答ボタンのクリックイベント
    const handleAnswerClick = (correct) => {
      quiz.answer(correct); // 回答を処理し、正解の場合は正解数を増やす
      quiz.nextQuestion(); // 次の問題に進む

      if (quiz.currentIndex < quiz.quizData.length) {
        quizDisplayQuestion(); // 次の問題を表示
      } else {
        quizDisplayResult(); // クイズの結果を表示
      }
    };

    // クイズの結果を表示
    const quizDisplayResult = () => {
      const correctAnswers = quiz.correctAnswers;
      const totalQuestions = quiz.quizData.length;

      const pageTitleElement = document.getElementById("title");
      pageTitleElement.textContent = `あなたの正答数は ${correctAnswers} / ${totalQuestions} です！！`;

      // クイズ関連のコンテンツをクリア
      answerButtonsContainer.innerHTML = "";
      answerButtonsContainer.appendChild(homeButton); // ホームボタンを表示
      homeButton.style.display = "block";
      questionTextContainer.innerHTML = retryText; // 再チャレンジテキストを表示
      genreAndDifficultyContainer.innerHTML = "";
    };
  };

  // クイズを開始するための関数呼び出し
  startQuiz();
})();
