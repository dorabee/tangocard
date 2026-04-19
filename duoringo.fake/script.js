
let savedData = JSON.parse(localStorage.getItem("quizData"));

// データが空 or 無効なら初期化
if (!savedData || !Array.isArray(savedData) || savedData.length === 0) {
  savedData = [];
}

// 🔥 デバッグ用：ローカルストレージをリセット
// localStorage.removeItem("quizData");


let quizData = savedData;
let currentCategoryIndex = 0;
let currentWords = [];
let index = 0;
let score = 0;
let answered = false;

// 要素
const menu = document.getElementById("menu");
const addArea = document.getElementById("addArea");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const categoryList = document.getElementById("categoryList");
const editCategoryList = document.getElementById("editCategoryList");

const newCategoryInput = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategoryBtn");

const editBtn = document.getElementById("editBtn");
const backMenuFromEdit = document.getElementById("backMenuFromEdit");

const newQuestionInput = document.getElementById("newQuestion");
const newAnswerInput = document.getElementById("newAnswer");
const addBtn = document.getElementById("addBtn");

const wordList = document.getElementById("wordList");

const wordElement = document.getElementById("word");
const choicesElement = document.getElementById("choices");

const scoreElement = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

const resultText = document.getElementById("resultText");
const restartBtn = document.getElementById("restartBtn");
const backMenuBtn = document.getElementById("backMenuBtn");

// 保存
function save() {
  localStorage.setItem("quizData", JSON.stringify(quizData));
}

function renderCategoryList() {
  categoryList.innerHTML = "";

  // 空のとき
  if (quizData.length === 0) {
    categoryList.innerHTML = "<p>カテゴリがありません</p>";
    return;
  }

  quizData.forEach((cat, i) => {
    if (!cat.name || cat.name.trim() === "") return;

    const card = document.createElement("div");
    card.className = "category-card";
    card.textContent = cat.name;

    card.onclick = () => startQuiz(i);

    categoryList.appendChild(card);
  });
}


// カテゴリ表示


// 編集カテゴリ


// カテゴリ追加
addCategoryBtn.onclick = () => {
  const name = newCategoryInput.value.trim();
  if (!name) return;

  quizData.push({ name, words: [] });
  newCategoryInput.value = "";

  save();
  renderCategoryList();
  renderEditCategoryList();
};

// 単語一覧
function renderWordList() {
  wordList.innerHTML = "";

  currentWords.forEach((w, i) => {
    const div = document.createElement("div");
    div.innerHTML = `${w.question} - ${w.answer} <button data-i="${i}">削除</button>`;
    wordList.appendChild(div);
  });

  document.querySelectorAll("#wordList button").forEach(btn => {
    btn.onclick = () => {
      currentWords.splice(btn.dataset.i, 1);
      save();
      renderWordList();
    };
  });
}

// 単語追加
addBtn.onclick = () => {
  const q = newQuestionInput.value.trim();
  const a = newAnswerInput.value.trim();

  if (!q || !a) return;

  currentWords.push({ question: q, answer: a });

  newQuestionInput.value = "";
  newAnswerInput.value = "";

  save();
  renderWordList();
};

// クイズ
function startQuiz(i) {
  currentCategoryIndex = i;
  currentWords = quizData[i].words;

  if (!currentWords.length) {
    alert("問題がありません");
    return;
  }

  index = 0;
  score = 0;

  menu.style.display = "none";
  quiz.style.display = "block";

  updateProgress();
  showQuiz();
}

function updateProgress() {
  // 要素がなければ何もしない（エラー防止）
  if (!progressBar || !progressText) return;

  // 問題がないときも防止
  if (!currentWords || currentWords.length === 0) return;

  const progress = (score / currentWords.length) * 100;

  // バー更新
  progressBar.style.width = progress + "%";

  // テキスト更新
  progressText.textContent = `${score} / ${currentWords.length}`;

  // アニメーションを一旦リセット
  progressBar.classList.remove("progress-animate");

  // 少し遅らせて再追加（これで毎回動く）
  setTimeout(() => {
    progressBar.classList.add("progress-animate");
  }, 10);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showQuiz() {
  const current = currentWords[index];

  wordElement.textContent = current.question;
  choicesElement.innerHTML = "";
  answered = false;

  let choices = currentWords.map(w => w.answer);
  choices = shuffle(choices).slice(0, 4);

  if (!choices.includes(current.answer)) {
    choices[0] = current.answer;
  }

  choices = shuffle(choices);

  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;

    btn.onclick = () => {
      if (answered) return;
      answered = true;

      if (choice === current.answer) {
        score++;
        btn.classList.add("correct");
        updateProgress();
        const rect = btn.getBoundingClientRect();

// キラを複数出す
for (let i = 0; i < 8; i++) {
  createSparkle(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2
  );
}
      } else {
        btn.classList.add("wrong");
      }

      setTimeout(() => {
        index++;
        if (index >= currentWords.length) {
          showResult();
        } else {
          showQuiz();
        }
      }, 700);
    };

    choicesElement.appendChild(btn);
  });
}

function createSparkle(x, y) {
  const sparkle = document.createElement("div");
  sparkle.className = "sparkle";

  const offsetX = (Math.random() - 0.5) * 80 + "px";
  const offsetY = (Math.random() - 0.5) * 80 + "px";

  sparkle.style.setProperty("--x", offsetX);
  sparkle.style.setProperty("--y", offsetY);

  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";

  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 600);
}


function renderEditCategoryList() {
  editCategoryList.innerHTML = "";

  if (quizData.length === 0) {
    editCategoryList.innerHTML = "<p>カテゴリがありません</p>";
    return;
  }

  quizData.forEach((cat, i) => {
    if (!cat.name || cat.name.trim() === "") return;

    const card = document.createElement("div");
    card.className = "category-card";
    card.textContent = cat.name;

    card.onclick = () => {
      currentCategoryIndex = i;
      currentWords = quizData[i].words;
      renderWordList();
    };

    editCategoryList.appendChild(card);
  });
}

function showResult() {
  quiz.style.display = "none";
  result.style.display = "block";

  const percent = (score / currentWords.length) * 100;

  let message = "";
  let isPerfect = false;
  let isBad = false;

  if (percent === 100) {
    message = "完璧！！神レベル！！🎉";
    isPerfect = true;
  } else if (percent >= 80) {
    message = "すごい！あと少し！👏";
  } else if (percent >= 50) {
    message = "いい感じ！👍";
  } else {
    message = "かなり難しいね…もう一回挑戦しよう😢";
    isBad = true;
  }

  resultText.innerHTML = `
    <div class="${isPerfect ? "perfect-text" : isBad ? "bad-text" : ""}">
      ${score} / ${currentWords.length}<br>
      <h3>${message}</h3>
    </div>
  `;

  // 一旦リセット
  result.classList.remove("perfect-bg", "bad-bg");

  // 演出分岐
  if (isPerfect) {
    result.classList.add("perfect-bg");
    createConfetti();
    setTimeout(createConfetti, 200);
    setTimeout(createConfetti, 400);
  } else if (isBad) {
    result.classList.add("bad-bg");
    createTears();
    setTimeout(createTears, 300);
  } else {
    // 通常
    createConfetti();
  }
}

function createTears() {
  for (let i = 0; i < 20; i++) {
    const tear = document.createElement("div");
    tear.className = "tear";

    tear.textContent = "💧";

    tear.style.left = Math.random() * window.innerWidth + "px";
    tear.style.top = "-20px";

    tear.style.animationDuration = 1.5 + Math.random() * 2 + "s";

    document.body.appendChild(tear);

    setTimeout(() => {
      tear.remove();
    }, 3000);
  }
}

// 画面切替
editBtn.onclick = () => {
  menu.style.display = "none";
  addArea.style.display = "block";

  renderEditCategoryList();

  currentCategoryIndex = 0;
  currentWords = quizData[0]?.words || [];
  renderWordList();
};

backMenuFromEdit.onclick = () => {
  addArea.style.display = "none";
  menu.style.display = "block";
};

backMenuBtn.onclick = () => {
  result.style.display = "none";
  menu.style.display = "block";
};

restartBtn.onclick = () => {
  index = 0;
  score = 0;

  result.style.display = "none";
  quiz.style.display = "block";

  updateProgress();
  showQuiz();
};

function createConfetti() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.top = "-10px";

    const colors = ["#f44336", "#ffeb3b", "#4caf50", "#2196f3", "#ff9800"];
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

    confetti.style.animationDuration = 1 + Math.random() * 2 + "s";

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

// 初期化
renderCategoryList();
renderEditCategoryList();