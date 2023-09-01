class QuizApp {
  constructor() {
    // HTML要素を取得しインスタンスのプロパティとして保存
    this.genreAndDifficultyContainer =
      document.getElementById("genreAndDifficulty");
    this.questionTextContainer = document.getElementById("questionText");
    this.answerButtonsContainer = document.getElementById("answerButtons");
    this.startButton = document.getElementById("startButton");
    this.homeButton = document.createElement("button");
    this.homeButton.textContent = "ホームに戻る";
    this.buttonWidth = 100;
    this.homeButton.style.width = `${this.buttonWidth}px`;
    this.homeButton.style.display = "none"; // ホームに戻るボタンは最初非表示

    // 再チャレンジメッセージの表示
    this.retryText = "再度チャレンジしたい場合は以下をクリック！！";
    this.questionTextContainer.textContent = this.retryText;

    // 初期テキストを表示
    this.initialText = "以下のボタンをクリック";
    this.questionTextContainer.textContent = this.initialText;
  }

  // 開始ボタンのクリックイベントハンドラ
  handleStartButtonClick = async () => {
    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = "取得中";

    // 前回の問題をクリアするためinnerHTMLメソッド
    this.genreAndDifficultyContainer.innerHTML = "";
    this.questionTextContainer.innerHTML = "";
    this.answerButtonsContainer.innerHTML = "";

    // 読み込み中メッセージの表示
    const loadingInfo = document.createElement("p");
    loadingInfo.textContent = "少々お待ちください";
    this.questionTextContainer.appendChild(loadingInfo);

    // 非同期的にクイズデータの取得
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    // 非同期的にJsonデータを取得
    const data = await response.json();

    let questionIndex = 0;
    let correctAnswers = 0;

    // 問題番号を表示する関数
    const displayQuestion = async (index) => {
      const question = data.results[index];
      pageTitleElement.textContent = `問題 ${index + 1}`;

      this.startButton.style.display = "none"; // 開始ボタンを非表示に

      // ジャンルと難易度を表示
      this.genreAndDifficultyContainer.innerHTML = `
        <p>[ジャンル] ${question.category}</p>
        <p>[難易度] ${question.difficulty}</p>
      `;

      // 問題文を表示
      this.questionTextContainer.innerHTML = "";
      const questionText = document.createElement("p");
      questionText.textContent = question.question;
      this.questionTextContainer.appendChild(questionText);

      // 回答の選択肢を表示
      this.answerButtonsContainer.innerHTML = "";

      // ...スプレッド演算子により正解と不正解を含む配列を生成
      const answers = [...question.incorrect_answers, question.correct_answer];
      // 回答選択肢の配列をランダムにシャッフル
      answers.sort(() => Math.random() - 0.5);

      // answer配列に対してボタンを生成
      answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer;
        // 選択肢をクリックしたときにcheckAnswer関数をコール
        button.addEventListener("click", () =>
          checkAnswer(answer, question.correct_answer)
        );
        // 選択肢のボタンを表示エリアに追加
        this.answerButtonsContainer.appendChild(button);
        // 回答に応じたボタンの幅を決定
        const buttonWidth = answer.length * 10 + 30;
        button.style.width = `${buttonWidth}px`;
      });
    };

    // 回答の正誤をチェックする関数
    const checkAnswer = (selectedAnswer, correctAnswer) => {
      if (selectedAnswer === correctAnswer) {
        correctAnswers++;
      }

      questionIndex++;
      // 正答数を表示
      if (questionIndex < data.results.length) {
        displayQuestion(questionIndex);
      } else {
        // answerButtonsContainer.innerHTML = `<p>正答数: ${correctAnswers} / ${data.results.length}</p>`;
        this.answerButtonsContainer.innerHTML = "";
        pageTitleElement.textContent = `あなたの正答数は ${correctAnswers} です！！`;
        this.answerButtonsContainer.appendChild(this.homeButton);
        this.homeButton.style.display = "block"; // ホームに戻るボタンを表示
        this.questionTextContainer.innerHTML = this.retryText; // 再チャレンジテキストを表示
        this.genreAndDifficultyContainer.innerHTML = "";
      }
    };

    // 初期問題の表示
    displayQuestion(questionIndex);
  };

  // ホームに戻るボタンのクリックイベントハンドラ
  handleHomeButtonClick = () => {
    const pageTitleElement = document.getElementById("title");
    pageTitleElement.textContent = "ようこそ";
    this.genreAndDifficultyContainer.innerHTML = "";
    this.questionTextContainer.innerHTML = this.initialText; // 初期テキストを再表示
    this.answerButtonsContainer.innerHTML = "";
    this.answerButtonsContainer.appendChild(this.startButton);
    this.startButton.style.display = "block"; // 開始ボタンを再表示
    this.homeButton.style.display = "none"; // ホームに戻るボタンを非表示に
  };
}

// クラスのインスタンスを作成
const quizApp = new QuizApp();
// クリックイベントハンドラを設定
quizApp.startButton.addEventListener("click", quizApp.handleStartButtonClick);
quizApp.homeButton.addEventListener("click", quizApp.handleHomeButtonClick);
