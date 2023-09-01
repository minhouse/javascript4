// HTML要素を取得
const genreAndDifficultyContainer =
  document.getElementById("genreAndDifficulty");
const questionTextContainer = document.getElementById("questionText");
const answerButtonsContainer = document.getElementById("answerButtons");
const startButton = document.getElementById("startButton");
const homeButton = document.createElement("button");
homeButton.textContent = "ホームに戻る";
const buttonWidth = 100;
homeButton.style.width = `${buttonWidth}px`;
homeButton.style.display = "none"; // ホームに戻るボタンは最初非表示

// 再チャレンジメッセージの表示
const retryText = "再度チャレンジしたい場合は以下をクリック！！";
questionTextContainer.textContent = retryText;

// 開始ボタンのクリックイベントリスナー
startButton.addEventListener("click", async () => {
  const pageTitleElement = document.getElementById("title");
  pageTitleElement.textContent = "取得中";

  // 前回の問題をクリアするためinnerHTMLメソッド
  genreAndDifficultyContainer.innerHTML = "";
  questionTextContainer.innerHTML = "";
  answerButtonsContainer.innerHTML = "";

  // 読み込み中メッセージの表示
  const loadingInfo = document.createElement("p");
  loadingInfo.textContent = "少々お待ちください";
  questionTextContainer.appendChild(loadingInfo);

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

    // ジャンルと難易度を表示
    genreAndDifficultyContainer.innerHTML = `
      <p>[ジャンル] ${question.category}</p>
      <p>[難易度] ${question.difficulty}</p>
    `;

    // 問題文を表示
    questionTextContainer.innerHTML = "";
    const questionText = document.createElement("p");
    questionText.textContent = question.question;
    questionTextContainer.appendChild(questionText);

    // 回答の選択肢を表示
    answerButtonsContainer.innerHTML = "";

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
      answerButtonsContainer.appendChild(button);
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
      answerButtonsContainer.innerHTML = "";
      pageTitleElement.textContent = `あなたの正答数は ${correctAnswers} です！！`;
      answerButtonsContainer.appendChild(homeButton);
      startButton.style.display = "none"; // 開始ボタンを非表示に
      homeButton.style.display = "block"; // ホームに戻るボタンを表示
      questionTextContainer.innerHTML = retryText; // 再チャレンジテキストを表示
      genreAndDifficultyContainer.innerHTML = "";
    }
  };
  // 初期問題の表示
  displayQuestion(questionIndex);
});

// ホームに戻るボタンのクリックイベントリスナー
homeButton.addEventListener("click", () => {
  const pageTitleElement = document.getElementById("title");
  pageTitleElement.textContent = "ようこそ";
  genreAndDifficultyContainer.innerHTML = "";
  questionTextContainer.innerHTML = initialText; // 初期テキストを再表示
  answerButtonsContainer.innerHTML = "";
  answerButtonsContainer.appendChild(startButton);
  startButton.style.display = "block"; // 開始ボタンを再表示
  homeButton.style.display = "none"; // ホームに戻るボタンを非表示に
});

// 初期状態で開始ボタンを表示
answerButtonsContainer.appendChild(startButton);

// 初期テキストを表示
const initialText = "以下のボタンをクリック";
questionTextContainer.textContent = initialText;
