let player1 = "";
let player2 = "";
let player1Score = 0;
let player2Score = 0;
function PlayerNames() {
  player1 = document.getElementById("player1").value;
  player2 = document.getElementById("player2").value;

  if (player1 !== "" && player2 !== "") {
    document.getElementById("players").style.display = "none";
    document.getElementById("category-selection").style.display = "block";
    alert(`The game is between ${player1} and ${player2} you can start 👍`);
  } else {
    alert("Enter two Player names 😐");
  }

  fetchCategories();
}

function fetchCategories() {
  fetch("https://the-trivia-api.com/v2/questions")
    .then((response) => {
      if (!response.ok) {
        throw new error(`there is an error: ${response.status}`);
      }
      return response.json();
    })
    .then((categories) => {
      displayCategory(categories);
    })
    .catch((error) => {
      console.error("error:", error);
    });
}

function displayCategory(categories) {
  categories.forEach((data) => {
    const Select = document.createElement("option");
    Select.innerHTML = ` ${data.category}`;
    if (!categorySelect.innerHTML.includes(`${data.category}`)) {
      categorySelect.appendChild(Select);
    }
    console.log(categorySelect);
  });
}
const categoryDiv = document.getElementById("category-selection");
const categorySelectDiv = document.getElementById("categorySelect");
// console.log(category)
document.getElementById("questions").addEventListener("click", () => {
  const category = document.getElementById("categorySelect").value;
  console.log(category);

  if (!category) {
    alert("select category");
  } else {
    categoryDiv.style.display = "none";
    for (i = 0; i <= categorySelectDiv.options.length; i++) {
      if (categorySelectDiv.options[i].value === category) {
        categorySelectDiv.remove(i);
        break;
      }
    }

    questionsFetch(category);
  }
});
let questionsList = [];
let questionContainer = document.getElementById("questions-container");
let level = ["easy", "medium", "hard"];
function questionsFetch(category) {
  for (const x of level) {
    fetch(
      `https://the-trivia-api.com/api/questions?categories=${category}&limit=2&difficulty=${x}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new error(`error while fetching questions: ${response.status}`);
        }
        return response.json();
      })
      .then((values) => {
        questionsList = questionsList.concat(values);
        console.log(questionsList);
        questionContainer.style.display = "block";
        displayQuestions();
      })
      .catch((error) => {
        console.error("error while fetching questions:", error);
      });
  }
}

let PresentQuestion = 0;
let currentPlayer = 1;
function displayQuestions() {
  if (currentPlayer === 1) {
    playerName = player1;
  } else {
    playerName = player2;
  }
  questionContainer.innerHTML = "";

  if (PresentQuestion < questionsList.length) {
    const question = questionsList[PresentQuestion];
    const questionDiv = document.createElement("div");
    category = document.getElementById("categorySelect").value;
    const turn = document.createElement("h4");
    const categoryName = document.createElement("h4");
    const names = document.createElement("h5");
    const display = document.createElement("p")
    questionDiv.appendChild(display);
    names.textContent = `${player1} ✌️ ${player2}`;
    turn.textContent = `${playerName}'s turn!`;
    // categoryName.textContent = `category name : ${category}`;
    questionDiv.appendChild(names);
    questionDiv.appendChild(turn);
    questionDiv.appendChild(categoryName);
    // console.log(questionDiv)

    const questionText = document.createElement("h3");
    questionText.textContent = question.question;
    questionDiv.appendChild(questionText);

    const options = question.incorrectAnswers.concat(question.correctAnswer);
    options.sort(() => Math.random() - 0.5);

    options.forEach((option) => {
      const answerLabel = document.createElement("label");
      const answerInput = document.createElement("input");
      answerInput.value = option;
      answerInput.type = "radio";
      answerInput.name = "answer";

      answerLabel.appendChild(answerInput);
      answerLabel.appendChild(document.createTextNode(option));
      questionDiv.appendChild(answerLabel);
      const br = document.createElement("br");
      questionDiv.appendChild(br);
    });
    questionContainer.appendChild(questionDiv);
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    questionDiv.appendChild(submitButton);

    submitButton.addEventListener("click", () => {
      const selectedOption = document.querySelector(
        'input[name="answer"]:checked'
      );
      console.log(selectedOption);
      if (!selectedOption) {
        alert("select an option");
        return;
      }
      const selectedAns = selectedOption.value;
      const correctAnswer = question.correctAnswer;
      // const feedback = document.getElementById("feedback");
      // feedback.innerHTML = "";
      console.log(selectedAns);
      console.log(correctAnswer);
      if (selectedAns === correctAnswer) {
        // alert(`Yaahooo your answer is correct 🎉🥳`)
        // feedback.innerHTML = `<p class="correct"> Correct! the correct answer is ${question.correctAnswer}.</p>`;
        if (PresentQuestion === 0) {
          player1Score += 10;
        } else if (PresentQuestion === 1) {
          player2Score += 10;
        } else if (PresentQuestion === 2) {
          player1Score += 15;
        } else if (PresentQuestion === 3) {
          player2Score += 15;
        } else if (PresentQuestion === 4) {
          player1Score += 20;
        } else if (PresentQuestion === 5) {
          player2Score += 20;
        }
      }
      // feedback.innerHTML = `<p class="correct"> InCorrect! the correct answer is ${question.correctAnswer}.</p>`;
      PresentQuestion += 1;
      if (currentPlayer === 1) {
        currentPlayer = 2;
      } else {
        currentPlayer = 1;
      }

      displayQuestions();
    });
  } else {
    questionsList = [];
    PresentQuestion = 0;
    currentPlayer = 1;
    const next = document.createElement("button");
    next.textContent = "Next Category";
    questionContainer.appendChild(next);
    const endGame = document.createElement("button");
    endGame.textContent = "EndGame";
    questionContainer.appendChild(endGame);
    console.log("E");
    next.addEventListener("click", () => {
      if (categorySelectDiv.options.length <= 1) {
        GameEnd();
      } else {
        questionContainer.style.display = "none";
        document.getElementById("category-selection").style.display = "block";
      }
    });

    endGame.addEventListener("click", GameEnd);
    function GameEnd() {
      questionContainer.innerHTML = "";
      const winner = document.createElement("h2");
      if (player1Score === player2Score) {
        winner.textContent = `The Game is Tie `;
      } else if (player1Score > player2Score) {
        winner.textContent = `${player1} is Winner 🎉`;
      } else {
        winner.textContent = `${player2} is Winner 🎉`;
      }
      questionContainer.appendChild(winner);
      const finVal = document.createElement("p");
      finVal.textContent = `player1score: ${player1Score}`;
      const finVal2 = document.createElement("p");
      finVal2.textContent = `player1score: ${player2Score}`;
      questionContainer.appendChild(finVal);
      questionContainer.appendChild(finVal2);
    }
  }
}
