
// emailjs.init("Ak1OHw83c5xwHhhHd"); 

// ======== Initialize Game Function ========
function initGame() {
  // 1️⃣ איפוס כל הנתונים ב-sessionStorage
  sessionStorage.clear();

  // 2️⃣ איפוס משתנים גלובליים אם קיימים
  if (typeof currentSection !== "undefined") currentSection = 1;
  if (typeof q5CurrentSection !== "undefined") q5CurrentSection = 0;
  if (typeof timeLeft !== "undefined") timeLeft = 0;
  if (typeof timeLeftQ2 !== "undefined") timeLeftQ2 = 0;
  if (typeof timeLeftQ3 !== "undefined") timeLeftQ3 = 0;
  if (typeof timeLeftQ4 !== "undefined") timeLeftQ4 = 0;
  if (typeof timeLeftQ5 !== "undefined") timeLeftQ5 = 0;
  if (typeof timeLeftQ6 !== "undefined") timeLeftQ6 = 0;
  if (typeof timeLeftQ7 !== "undefined") timeLeftQ7 = 0;

  // 3️⃣ איפוס גרירות קוביות (Q6, Q51, Q7)
  if (typeof resetAllCubes === "function") resetAllCubes();
  if (typeof resetCubePosition === "function") {
    const allCubes = document.querySelectorAll('[class^="cube"]');
    allCubes.forEach(cube => resetCubePosition(cube));
  }
  if (typeof resetCubes === "function") resetCubes();

  // 4️⃣ מעבר לדף ההתחלתי
  window.location.href = "startPage.html";
}

// ======== קריאה לפונקציה בלחיצה על כפתור "אתחול" ========
const resetBtn = document.getElementById("resetGameBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", initGame);
}

// ======== מניעת swipe אופקי באייפון ========
document.addEventListener('DOMContentLoaded', () => {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault(); // חוסם את ה-swipe של הדפדפן
      }
    }
  }, { passive: false });
});

// ===============================
// ===== SCORE FUNCTIONS =========
// ===============================

// Q1
function calcQ1Score() {
  const maxScore = 5;
  const isCorrect = sessionStorage.getItem("q1IsCorrect") === "true";
  return { score: isCorrect ? maxScore : 0, maxScore };
}

// Q2
function calcQ2Score() {
  const maxScore = 10; // סך הניקוד של השאלה
  const perSection = 2.5; // כל סעיף
  let score = 0;

  // נשלוף את הנתונים מה-sessionStorage
  const stored = sessionStorage.getItem("q2Answers");
  if (!stored) {
    // אם לא ענו בכלל → 0 נקודות
    return { score: 0, maxScore };
  }

  const answers = JSON.parse(stored);

  // סכימת נקודות לפי סעיפים
  if (answers.answer1 && answers.answer1.isCorrect) score += perSection;
  if (answers.answer2 && answers.answer2.isCorrect) score += perSection;
  if (answers.answer3 && answers.answer3.isCorrect) score += perSection;
  if (answers.answer4 && answers.answer4.isCorrect) score += perSection;

  return { score, maxScore };
}


// Q3
function calcQ3Score() {
  const maxScore = 5;
  const isCorrect = sessionStorage.getItem("q3IsCorrect") === "true";
  return { score: isCorrect ? maxScore : 0, maxScore };
}

// Q4
function calcQ4Score() {
  const maxScore = 5;
  const isCorrect = sessionStorage.getItem("q4IsCorrect") === "true";
  return { score: isCorrect ? maxScore : 0, maxScore };
}

// Q5 + Q51
function calcQ5Score() {
  const pointsPerCorrect = 2;
  const totalSections = 4;

  let score = 0;

  // ===== Q5 חלק A+B =====
  for (let i = 1; i <= totalSections; i++) {
    const data = JSON.parse(sessionStorage.getItem(`q5AB_${i}`)) || {};

    if (data.answerA?.isCorrect) score += pointsPerCorrect;
    if (data.answerB?.isCorrect) score += pointsPerCorrect;
  }

  // ===== Q5 חלק C =====
  for (let i = 1; i <= totalSections; i++) {
    const data = JSON.parse(sessionStorage.getItem(`q5C_${i}`));
    if (data?.isCorrect) score += pointsPerCorrect;
  }

  // ===== Q51 (drag cubes) =====
  for (let i = 1; i <= totalSections; i++) {
    const b7 = JSON.parse(sessionStorage.getItem(`textBlob7_${i}`));
    const b8 = JSON.parse(sessionStorage.getItem(`textBlob8_${i}`));

    if (b7?.correct) score += pointsPerCorrect;
    if (b8?.correct) score += pointsPerCorrect;
  }

  const maxScore =
    totalSections * 2 * pointsPerCorrect + // AB
    totalSections * pointsPerCorrect +     // C
    totalSections * 2 * pointsPerCorrect;  // Q51

  return { score, maxScore };
}


// Q6
function calcQ6Score() {
  const results = JSON.parse(sessionStorage.getItem("q6Results")) || [];
  let score = 0;

  // כל ה-blobs הנכונים
  const validBlobs = [
    "textBlob1","textBlob2","textBlob3","textBlob4",
    "textBlob5","textBlob6","textBlob7","textBlob8"
  ];

  results.forEach(item => {
    const cubeNum = parseInt(item.cube.replace("cubeTag",""));
    if (cubeNum === 5 || cubeNum === 6) return; // קוביות שלא נספרות
    if (validBlobs.includes(item.attachedTo)) score += 1;
  });

  // maxScore = מספר כל הקוביות שמספורות (כולל אם יש יותר מ-5)
  const maxScore = 5;

  return { score, maxScore };
}


// Q7
function calcQ7Score() {
  const points = 3;
  const steps = 10;
  let score = 0;

  for (let i = 1; i <= steps; i++) {
    const data = JSON.parse(sessionStorage.getItem(`Q7_step_${i}`));
    if (data?.correct) score += points;
  }

  return { score, maxScore: points * steps };
}

// כל השאלות ביחד
function getAllScores() {
  return [
    calcQ1Score(),
    calcQ2Score(),
    calcQ3Score(),
    calcQ4Score(),
    calcQ5Score(),
    calcQ6Score(),
    calcQ7Score()
  ];
}

// =====  Start Page (name + personal number + army details) =====
const nameInput = document.querySelector('.nameInput');
const numInput = document.getElementById('numInput');
const submitButton = document.getElementById('submitButton');

const classInput = document.querySelector('.miniInput3');   // כיתה
const platoonInput = document.querySelector('.miniInput1'); // מחלקה
const companyInput = document.querySelector('.miniInput2'); // פלוגה

if (submitButton) {
  submitButton.addEventListener('click', function () {
    const fullName = nameInput.value.trim();
    const personalNum = numInput.value.trim();
    const userClass = classInput.value.trim();
    const platoon = platoonInput.value.trim();
    const company = companyInput.value.trim();

    if (!fullName || !personalNum || !userClass || !platoon || !company) {
      alert("אנא מלא את כל השדות לפני המעבר");
      return;
    }

    sessionStorage.setItem('fullName', fullName);
    sessionStorage.setItem('personalNum', personalNum);
    sessionStorage.setItem('userClass', userClass);
    sessionStorage.setItem('platoon', platoon);
    sessionStorage.setItem('company', company);

    window.location.href = "instructions.html";
  });
}

// ===== Instructions Text Logic =====

const instructionsTexts = [
  "שלום לכולם אני דני ובדיוק כמוכם עברתי את מבחני הכניסה לקמ''כ.",
  "עכשיו תעברו סדרת שאלות בנושא ניווטים.",
  "לכל שאלה יהיה זמן מוקצב וניתן לראות את הזמן שנשאר בטיימר משמאל למעלה.",
  "שימו לב! איכות עדיפה על כמות. חשוב שיהיו תשובות נכונות גם אם לא מלאות.",
  "במידה ותצאו מהאפליקציה, הזמן ימשיך לרדת ולא תוכלו לקבל אותו בחזרה.",
  "אני מאמין בכם, זוהי תחילת דרככם בביסל\"ח על מנת שתהיו מפקדי כיתות א-ל-ו-פ-י-ם.",
  "בהצלחה ממני, דני."
];

const textDiv = document.querySelector(".text");
const startButton = document.querySelector(".button");
const overButton = document.querySelector(".over");
const nextInstruction = document.querySelector(".nextInstruction");

const AUTO_READ_TIME = 3000; // כמה זמן "חייבים" לקרוא לפני שמופיע הכפתור

if (textDiv && startButton && overButton && nextInstruction) {
  let currentIndex = 0;
  let timeoutId = null;

  const showText = () => {
    textDiv.textContent = instructionsTexts[currentIndex];

    // בזמן קריאה חובה – אין כפתורים
    nextInstruction.style.display = "none";
    startButton.style.display = "none";
    overButton.style.display = "none";

    // אחרי מספר שניות – מופיע כפתור המשך (אם לא סוף)
    timeoutId = setTimeout(() => {
      if (currentIndex < instructionsTexts.length - 1) {
        nextInstruction.style.display = "block";
      } else {
        // סוף ההוראות – מציגים כפתורים סופיים
        startButton.style.display = "block";
        overButton.style.display = "block";
      }
    }, AUTO_READ_TIME);
  };

  const nextText = () => {
    if (timeoutId) clearTimeout(timeoutId);

    currentIndex++;
    showText();
  };

  const restartAll = () => {
    if (timeoutId) clearTimeout(timeoutId);
    currentIndex = 0;
    showText();
  };

  // אירועים
  nextInstruction.addEventListener("click", nextText);
  overButton.addEventListener("click", restartAll);

  // הרצה ראשונית
  showText();
}


// =====  Question Timer Q1=====
const timerElement = document.getElementById("timerQ1");

if (timerElement) {
  let timeLeft = 90; 

  const timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      goToNextQuestion();
    }

    timeLeft--;
  }, 1000);
}

function goToNextQuestion() {
  window.location.href = "q2.html"; // השאלה הבאה
}

// ===== Q1 Answer Saving =====
const q1Radios = document.querySelectorAll('input[name="q1"]');

if (q1Radios.length > 0) {
  q1Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "3";

      const isCorrect = selectedValue === correctAnswer;

      // Save data
      sessionStorage.setItem('q1Answer', selectedValue);
      sessionStorage.setItem('q1IsCorrect', isCorrect);

      console.log("Q1 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
// function calcQ1Score() {
//   const maxScore = 5;
//   let score = 0;

//   const isCorrect = sessionStorage.getItem("q1IsCorrect");

//   // אם לא ענה או ענה לא נכון – 0 נקודות
//   if (isCorrect === "true") {
//     score = maxScore;
//   }

//   return {
//     score,
//     maxScore
//   };
// }


// ===== Q2 Answer Saving =====
const q2Answers = {
  answer1: "90",   // שתי תשובות נכונות
  answer2: "מערב",
  answer3: "270",
  answer4:  "180"
};

// בוחרים את השדות
const answer1Input = document.querySelector('.answer1Input');
const answer2Input = document.querySelector('.answer2Input');
const answer3Input = document.querySelector('.answer3Input');
const answer4Input = document.querySelector('.answer4Input');

if (answer1Input && answer2Input && answer3Input && answer4Input) {

  const saveQ2Answers = () => {
    const a1 = answer1Input.value.trim();
    const a2 = answer2Input.value.trim();
    const a3 = answer3Input.value.trim();
    const a4 = answer4Input.value.trim();

    const answersData = {
      answer1: {
        value: a1,
        isCorrect: q2Answers.answer1.includes(a1)
      },
      answer2: {
        value: a2,
        isCorrect: a2 === q2Answers.answer2
      },
    answer3: {
      value: a3,
      isCorrect: q2Answers.answer3.includes(a3)
},
    answer4: {
      value: a4,
      isCorrect: q2Answers.answer4.includes(a4)
}
    };

    sessionStorage.setItem('q2Answers', JSON.stringify(answersData));
  };

  [answer1Input, answer2Input, answer3Input, answer4Input].forEach(input => {
    input.addEventListener('blur', saveQ2Answers);
  });
}
// function calcQ2Score() {
//   const maxScore = 10; // סך הניקוד של השאלה
//   const perSection = 2.5; // כל סעיף
//   let score = 0;

//   // נשלוף את הנתונים מה-sessionStorage
//   const stored = sessionStorage.getItem("q2Answers");
//   if (!stored) {
//     // אם לא ענו בכלל → 0 נקודות
//     return { score: 0, maxScore };
//   }

//   const answers = JSON.parse(stored);

//   // סכימת נקודות לפי סעיפים
//   if (answers.answer1 && answers.answer1.isCorrect) score += perSection;
//   if (answers.answer2 && answers.answer2.isCorrect) score += perSection;
//   if (answers.answer3 && answers.answer3.isCorrect) score += perSection;
//   if (answers.answer4 && answers.answer4.isCorrect) score += perSection;

//   return { score, maxScore };
// }

// =====  Question Timer Q2 =====
const timerElementQ2 = document.getElementById("timerQ2");

if (timerElementQ2) {
  let timeLeftQ2 = 120; 

  const timerIntervalQ2 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ2 / 60);
    let seconds = timeLeftQ2 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ2.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ2 === 0) {
      clearInterval(timerIntervalQ2);
      goToNextQuestionQ2();
    }

    timeLeftQ2--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ2() {
  // לפני המעבר אפשר לשמור את התשובות הפעם סופית
  if (typeof saveQ2Answers === "function") {
    saveQ2Answers();
  }

  window.location.href = "q3.html"; // העמוד הבא
}
// ===== Q3 Answer Saving =====
const q3Radios = document.querySelectorAll('input[name="q3"]'); // אם ב-q3 גם זה name="q1"

if (q3Radios.length > 0) {
  q3Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "1"; // תשובה נכונה

      const isCorrect = selectedValue === correctAnswer;

      // שמירה ב-sessionStorage תחת Q3
      sessionStorage.setItem('q3Answer', selectedValue);
      sessionStorage.setItem('q3IsCorrect', isCorrect);

      console.log("Q3 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
// function calcQ3Score() {
//   const maxScore = 5; // סך הנקודות של שאלה 3
//   let score = 0;

//   const storedIsCorrect = sessionStorage.getItem("q3IsCorrect");

//   if (storedIsCorrect === "true") {
//     score = maxScore;
//   } else {
//     score = 0; // אם לא ענו או לא נכון
//   }

//   return { score, maxScore };
// }


// =====  Question Timer Q3 =====
const timerElementQ3 = document.getElementById("timerQ3");

if (timerElementQ3) {
  let timeLeftQ3 = 90; 

  const timerIntervalQ3 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ3 / 60);
    let seconds = timeLeftQ3 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ3.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ3 === 0) {
      clearInterval(timerIntervalQ3);
      goToNextQuestionQ3();
    }

    timeLeftQ3--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ3() {
  window.location.href = "q4.html"; // העמוד הבא
}
// =====  Question Timer Q4 =====
const timerElementQ4 = document.getElementById("timerQ4");

if (timerElementQ4) {
  let timeLeftQ4 = 90; 

  const timerIntervalQ4 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ4 / 60);
    let seconds = timeLeftQ4 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ4.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ4 === 0) {
      clearInterval(timerIntervalQ4);
      goToNextQuestionQ4();
    }

    timeLeftQ4--;
  }, 1000);
}

// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ4() {
  window.location.href = "instructions5.html"; // העמוד הבא
}
// ===== Q4 Answer Saving =====
const q4Radios = document.querySelectorAll('input[name="q4"]'); // אם ב-q4 גם name="q1"

if (q4Radios.length > 0) {
  q4Radios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedValue = radio.value;
      const correctAnswer = "4"; // תשובה נכונה

      const isCorrect = selectedValue === correctAnswer;

      // שמירה ב-sessionStorage תחת Q4
      sessionStorage.setItem('q4Answer', selectedValue);
      sessionStorage.setItem('q4IsCorrect', isCorrect);

      console.log("Q4 selected:", selectedValue);
      console.log("Is correct:", isCorrect);
    });
  });
}
// function calcQ4Score() {
//   const maxScore = 5; // סך הנקודות של שאלה 4
//   let score = 0;

//   const storedIsCorrect = sessionStorage.getItem("q4IsCorrect");

//   if (storedIsCorrect === "true") {
//     score = maxScore;
//   } else {
//     score = 0; // אם לא ענו או ענו לא נכון
//   }

//   return { score, maxScore };
// }


// =====  Question Timer Q5 =====
const timerElementQ5 = document.getElementById("timerQ5");

if (timerElementQ5) {
  let timeLeftQ5 = 420; 

  const timerIntervalQ5 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ5 / 60);
    let seconds = timeLeftQ5 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ5.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ5 === 0) {
      clearInterval(timerIntervalQ5);
      goToNextQuestionQ5();
    }

    timeLeftQ5--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ5() {
  window.location.href = "q6.html"; // העמוד הבא
}

// =====  Question Timer Q6 =====
const timerElementQ6 = document.getElementById("timerQ6");

if (timerElementQ6) {
  let timeLeftQ6 = 180; 

  const timerIntervalQ6 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ6 / 60);
    let seconds = timeLeftQ6 % 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ6.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ6 === 0) {
      clearInterval(timerIntervalQ6);
      goToNextQuestionQ6();
    }

    timeLeftQ6--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ6() {
  window.location.href = "q7.html"; // העמוד הבא
}

// =====  Question Timer Q7 =====
const timerElementQ7 = document.getElementById("timerQ7");

if (timerElementQ7) {
  let timeLeftQ7 = 330; 

  const timerIntervalQ7 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ7 / 60);
    let seconds = timeLeftQ7% 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ7.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ7 === 0) {
      clearInterval(timerIntervalQ7);
      goToNextQuestionQ7();
    }

    timeLeftQ7--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ7() {
  window.location.href = "result.html"; // העמוד הבא
}

// ===== Q6 Drag & Drop Logic (Desktop + Mobile) =====
const cubeTags = document.querySelectorAll('[class^="cubeTag"]');
const textBlobs = document.querySelectorAll('[class^="textBlob"]');

let draggedCube = null;

// ===== שמירת מיקומים התחלתיים =====
const initialPositions = new Map();
cubeTags.forEach(cube => {
  initialPositions.set(cube, {
    left: cube.style.left,
    top: cube.style.top
  });
});

// ===== מי יושב על איזה blob =====
const blobOccupancy = {};

// ===== Desktop Drag =====
cubeTags.forEach(cube => {
  const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
  if (cubeNum === 5 || cubeNum === 6) return;

  cube.setAttribute("draggable", true);

  cube.addEventListener("dragstart", () => {
    draggedCube = cube;
  });
});

textBlobs.forEach(blob => {
  blob.addEventListener("dragover", e => e.preventDefault());

  blob.addEventListener("drop", () => {
    if (!draggedCube) return;
    attachCubeToBlob(draggedCube, blob);
    draggedCube = null;
  });
});

// ===== Mobile Touch Drag =====
cubeTags.forEach(cube => {
  const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
  if (cubeNum === 5 || cubeNum === 6) return;

  let offsetX = 0;
  let offsetY = 0;

  cube.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    const rect = cube.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
    draggedCube = cube;
  });

  cube.addEventListener("touchmove", e => {
    if (!draggedCube) return;
    e.preventDefault();
    const touch = e.touches[0];
    cube.style.left = touch.clientX - offsetX + "px";
    cube.style.top  = touch.clientY - offsetY + "px";
  });

  cube.addEventListener("touchend", () => {
    if (!draggedCube) return;

    let dropped = false;
    const cubeRect = draggedCube.getBoundingClientRect();

    textBlobs.forEach(blob => {
      const blobRect = blob.getBoundingClientRect();
      const isInside =
        cubeRect.left < blobRect.right &&
        cubeRect.right > blobRect.left &&
        cubeRect.top < blobRect.bottom &&
        cubeRect.bottom > blobRect.top;

      if (isInside) {
        attachCubeToBlob(draggedCube, blob);
        dropped = true;
      }
    });

    if (!dropped) {
      returnCubeToStart(draggedCube);
    }

    draggedCube = null;
  });
});

// ===== הצמדת קובייה ל־Blob (משותף לדסקטופ + מובייל) =====
function attachCubeToBlob(cube, blob) {
  const blobName = blob.className;

  // אם blob תפוס – מחזירים את הקובייה הקודמת
  if (blobOccupancy[blobName] && blobOccupancy[blobName] !== cube) {
    returnCubeToStart(blobOccupancy[blobName]);
    blobOccupancy[blobName].dataset.attachedTo = "";
  }

  // ניקוי blob קודם של הקובייה
  if (cube.dataset.attachedTo) {
    blobOccupancy[cube.dataset.attachedTo] = null;
  }

  // הצמדה למרכז
  const blobRect = blob.getBoundingClientRect();
  cube.style.left =
    blobRect.left + blobRect.width / 2 - cube.offsetWidth / 2 + "px";
  cube.style.top =
    blobRect.top + blobRect.height / 2 - cube.offsetHeight / 2 + "px";

  cube.dataset.attachedTo = blobName;
  blobOccupancy[blobName] = cube;

  saveQ6State();
}

// ===== החזרת קובייה למקום =====
function returnCubeToStart(cube) {
  const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
  if (cubeNum === 5 || cubeNum === 6) return;

  const pos = initialPositions.get(cube);
  cube.style.left = pos.left;
  cube.style.top = pos.top;
  cube.dataset.attachedTo = "";
}

// ===== שמירת מצב Q6 =====
function saveQ6State() {
  const result = [];

  cubeTags.forEach(cube => {
    if (cube.dataset.attachedTo) {
      const cubeNum = parseInt(cube.className.replace("cubeTag", ""));
      const validBlobs = [
  "textBlob1", "textBlob2", "textBlob3", "textBlob4",
  "textBlob5", "textBlob6", "textBlob7", "textBlob8"
];


      result.push({
        cube: cube.className,
        attachedTo: cube.dataset.attachedTo,
        isCorrect: validBlobs.includes(cube.dataset.attachedTo) && cubeNum !== 5 && cubeNum !== 6
      });
    }
  });

  sessionStorage.setItem("q6Results", JSON.stringify(result));
  console.log("Q6 saved:", result);
}


// ===== Zoom In / Out =====
// ===== Zoom In / Out Q5 =====
const zoomBtn = document.getElementById("zoomBtn");
const zoomContainer = document.getElementById("zoomContainer");

let isZoomed = false;

if (zoomBtn && zoomContainer) {
  zoomBtn.addEventListener("click", () => {
    isZoomed = !isZoomed;
    zoomContainer.classList.toggle("zoomed");
  });
}

// // ===== Drag & Rotate Qoardinatot Q5 (mouse + touch) =====
// const qoardinatot = document.getElementById("qoardinatot");

// let isDragging = false;
// let startX, startY, imgX = 0, imgY = 0;

// let currentRotation = 0;
// let initialAngle = 0;

// if (qoardinatot) {
//   qoardinatot.style.position = "absolute";
//   qoardinatot.style.touchAction = "none"; // למנוע גלילה בעת גרירה

//   // --- גרירה ---
//   const startDrag = (x, y) => {
//     isDragging = true;
//     startX = x - imgX;
//     startY = y - imgY;
//   };

//   const moveDrag = (x, y) => {
//     if (!isDragging) return;
//     imgX = x - startX;
//     imgY = y - startY;
//     qoardinatot.style.left = imgX + "px";
//     qoardinatot.style.top = imgY + "px";
//   };

//   const stopDrag = () => {
//     isDragging = false;
//   };

//   // --- סיבוב עבור שתי אצבעות ---
//   const rotateTouch = (touches) => {
//     const dx = touches[1].clientX - touches[0].clientX;
//     const dy = touches[1].clientY - touches[0].clientY;
//     const angle = Math.atan2(dy, dx) * (180 / Math.PI);

//     if (!initialAngle && initialAngle !== 0) initialAngle = angle - currentRotation;

//     currentRotation = angle - initialAngle;
//     qoardinatot.style.transform = `rotate(${currentRotation}deg)`;
//   };

//   // --- Mouse events ---
//   qoardinatot.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
//   document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
//   document.addEventListener("mouseup", stopDrag);

//   // --- Touch events ---
//   qoardinatot.addEventListener("touchstart", e => {
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       startDrag(touch.clientX, touch.clientY);
//     }
//   });

//   document.addEventListener("touchmove", e => {
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       moveDrag(touch.clientX, touch.clientY);
//     } else if (e.touches.length === 2) {
//       rotateTouch(e.touches);
//     }
//   });

//   document.addEventListener("touchend", e => {
//     stopDrag();
//     if (e.touches.length < 2) initialAngle = 0;
//   });
// }

// ===== Main Q5 & Q51 Logic =====

// =======================
// ======== Q5 AB ========
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const q5TazaImg  = document.querySelector(".taza5");
  const q5AnswerA  = document.querySelector("input.answerAInput");
  const q5AnswerB  = document.querySelector("input.answerBInput");
  const q5NextBtn  = document.querySelector(".nextQ5");

  if (!q5NextBtn) return;

  const q5Sections = [
    { taza:"assets/elements/taza1.png", answerB:{min:0,max:10}, answerA:{min:870,max:920} },
    { taza:"assets/elements/taza2.png", answerB:{min:45,max:55}, answerA:{min:870,max:920} },
    { taza:"assets/elements/taza3.png", answerB:{min:90,max:100},   answerA:{min:980,max:1030} },
    { taza:"assets/elements/taza4.png", answerB:{min:128,max:138}, answerA:{min:1180,max:1230} }
  ];

  let current = 0;

  function checkMinMax(range, value) {
    const num = parseInt(value.replace(/[^\d]/g,""),10);
    return Number.isFinite(num) && num>=range.min && num<=range.max;
  }

  function save() {
    const s = q5Sections[current];

    const data = {
      answerA:{
        value:q5AnswerA?.value||"",
        isCorrect:checkMinMax(s.answerA,q5AnswerA?.value||"")
      },
      answerB:{
        value:q5AnswerB?.value||"",
        isCorrect:checkMinMax(s.answerB,q5AnswerB?.value||"")
      }
    };

    sessionStorage.setItem(`q5AB_${current+1}`,JSON.stringify(data));
  }

  function load(i) {
    const s = q5Sections[i];
    if (q5TazaImg) q5TazaImg.src = s.taza;

    const stored = JSON.parse(sessionStorage.getItem(`q5AB_${i+1}`)||"{}");

    if (q5AnswerA) q5AnswerA.value = stored.answerA?.value||"";
    if (q5AnswerB) q5AnswerB.value = stored.answerB?.value||"";
  }

  [q5AnswerA,q5AnswerB].filter(Boolean).forEach(el=>{
    el.addEventListener("input",save);
  });

  q5NextBtn.addEventListener("click",()=>{
    save();
    current++;

    if(current<q5Sections.length){
      load(current);
    } else {
      window.location.href="52.html"; // ← מעבר ל-52
    }
  });

  load(current);
});

// =======================
// ======== Q52 C ========
// =======================

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".answerCInput");
  const nextBtn = document.querySelector(".nextQ52");
  const tazaImg = document.querySelector(".taza52");

  if (!input || !nextBtn) return;

  const sections = [
    { taza:"assets/elements/taza1.png", special:[{first3:"693",min:4,max:24},{first3:"442",min:79,max:99}] },
    { taza:"assets/elements/taza2.png", special:[{first3:"693",min:60,max:80},{first3:"442",min:33,max:53}] },
    { taza:"assets/elements/taza3.png", special:[{first3:"693",min:79,max:99},{first3:"441",min:79,max:99}] },
    { taza:"assets/elements/taza4.png", special:[{first3:"693",min:79,max:99},{first3:"441",min:40,max:60}] }
  ];

  let current = 0;

  function checkSpecial(arr,value){
    const cleaned=value.replace(/[^\d]/g,"");

    return arr.some(sp=>{
      const r=new RegExp(sp.first3+"(\\d{1,3})");
      const m=cleaned.match(r);
      if(!m) return false;

      const n=parseInt(m[1],10);
      return n>=sp.min && n<=sp.max;
    });
  }

  function save(){
    const s=sections[current];

    sessionStorage.setItem(
      `q5C_${current+1}`,
      JSON.stringify({
        value:input.value,
        isCorrect:checkSpecial(s.special,input.value)
      })
    );
  }

  function load(i){
    const s=sections[i];
    if(tazaImg) tazaImg.src=s.taza;

    const stored=JSON.parse(sessionStorage.getItem(`q5C_${i+1}`)||"{}");
    input.value=stored.value||"";
  }

input.addEventListener("input", save);

const goNext = () => {
  save();
  current++;

  if (current < sections.length) {
    load(current);
  } else {
    window.location.href = "q51.html";
  }
};

nextBtn.addEventListener("click", goNext);

nextBtn.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    goNext();
  }
});

load(current);

  });
  
// ===== Question Timer Q52 =====
const timerElementQ52 = document.getElementById("timerQ52");

if (timerElementQ52) {
  let timeLeftQ52 = 420;

  const timerIntervalQ52 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ52 / 60);
    let seconds = timeLeftQ52 % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ52.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ52 === 0) {
      clearInterval(timerIntervalQ52);
      window.location.href = "q51.html"; 
    }

    timeLeftQ52--;
  }, 1000);
}

// =======================
// ===== חישוב ניקוד Q5 =====
// =======================

// function calcQ5Score() {
//   let score = 0;
//   const maxScore = 24; // 16 נקודות ל-AB + 8 נקודות ל-C

//   // חלק 1 – A ו-B (16 נקודות בסך הכל, 4 סעיפים * 2 נקודות לכל תשובה)
//   for (let i = 1; i <= 4; i++) {
//     const sectionData = JSON.parse(sessionStorage.getItem(`q5AB_${i}`)) || {};
//     Object.values(sectionData).forEach(ans => {
//       if (ans.isCorrect) score += 2; // כל תשובה נכונה = 2 נקודות
//     });
//   }

//   // חלק 2 – C (8 נקודות בסך הכל, 4 סעיפים * 2 נקודות לכל סעיף)
//   for (let i = 1; i <= 4; i++) {
//     const cData = JSON.parse(sessionStorage.getItem(`q5C_${i}`)) || {};
//     if (cData.isCorrect) score += 2;
//   }

//   return { score, maxScore };
// }


// =======================
// ======== Q51 =========
// =======================

document.addEventListener("DOMContentLoaded", () => {

  const cubes = document.querySelectorAll(".cube1, .cube2, .cube3, .cube4, .cube5, .cube6, .cube7, .cube8, .cube9");
  const textBlob7 = document.querySelector(".textBlob7");
  const textBlob8 = document.querySelector(".textBlob8");
  const tazaImg = document.querySelector(".taza");
  const nextQ = document.querySelector(".nextQ");
  let blob7Cube = null;
  let blob8Cube = null;
  const correctAnswersBlob7 = ["cube9", "cube6", "cube7","cube2"];
  const correctAnswersBlob8 = ["cube4", "cube2", "cube1","cube9" ];

  let draggedCube = null;
  let offsetX = 0;
  let offsetY = 0;
  let currentSection = 1;

  // מיקום התחלתי של כל קוביה
const initialPositions = {};

cubes.forEach(cube => {
  const rect = cube.getBoundingClientRect();
  const cubeKey = cube.classList[0]; // cube1 / cube2 / ...

  initialPositions[cubeKey] = {
    left: rect.left,
    top: rect.top
  };

  cube.style.position = "absolute";
  cube.style.left = rect.left + "px";
  cube.style.top = rect.top + "px";
});



  function resetAllCubes() {
    cubes.forEach(cube => {
      const pos = initialPositions[cube.className];
      cube.style.left = pos.left + "px";
      cube.style.top = pos.top + "px";
      cube.style.cursor = "grab";
      cube.style.zIndex = 2000;
    });
    textBlob7.textContent = "";
    textBlob8.textContent = "";
  }

  function isOverlapping(cube, blob) {
    const cubeRect = cube.getBoundingClientRect();
    const blobRect = blob.getBoundingClientRect();
    return !(
      cubeRect.right < blobRect.left ||
      cubeRect.left > blobRect.right ||
      cubeRect.bottom < blobRect.top ||
      cubeRect.top > blobRect.bottom
    );
  }

function handleDrop(cube, blob) {
  const cubeClass = cube.classList[0];

  // אם כבר יש קוביה על ה-blob → להחזיר אותה למקום
  if (blob === textBlob7 && blob7Cube && blob7Cube !== cube) {
    resetCubePosition(blob7Cube);
  }

  if (blob === textBlob8 && blob8Cube && blob8Cube !== cube) {
    resetCubePosition(blob8Cube);
  }

  // עדכון מי יושב על ה-blob
  if (blob === textBlob7) blob7Cube = cube;
  if (blob === textBlob8) blob8Cube = cube;

  // הצגת טקסט
  blob.textContent = cube.textContent;

  // מרכז הקוביה על ה-blob
  const blobRect = blob.getBoundingClientRect();
  const cubeRect = cube.getBoundingClientRect();

  cube.style.left =
    blobRect.left + (blobRect.width - cubeRect.width) / 2 + "px";
  cube.style.top =
    blobRect.top + (blobRect.height - cubeRect.height) / 2 + "px";

  cube.style.cursor = "default";
  cube.style.zIndex = 5000;

  // בדיקת נכונות
  let isCorrect = false;
  if (
    (blob === textBlob7 && correctAnswersBlob7.includes(cubeClass)) ||
    (blob === textBlob8 && correctAnswersBlob8.includes(cubeClass))
  ) {
    isCorrect = true;
  }

sessionStorage.setItem(
  `${blob.classList[0]}_${currentSection}`,
  JSON.stringify({ answer: cube.textContent, correct: isCorrect })
);

}

  function resetCubePosition(cube) {
    const pos = initialPositions[cube.className];
    cube.style.left = pos.left + "px";
    cube.style.top = pos.top + "px";
    cube.style.cursor = "grab";
    cube.style.zIndex = 2000;
  }

  function changeTaza(sectionNumber) {
    tazaImg.src = `assets/elements/taza${sectionNumber}.png`;
  }

  // ====== אירועי גרירה ======
  cubes.forEach(cube => {
    const startDrag = (e) => {
      e.preventDefault();
      draggedCube = cube;
      const rect = cube.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      cube.style.zIndex = 10000;
    };

    cube.addEventListener("mousedown", startDrag);
    cube.addEventListener("touchstart", startDrag);

    const onDrag = (e) => {
      if (!draggedCube) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      draggedCube.style.left = (clientX - offsetX) + "px";
      draggedCube.style.top = (clientY - offsetY) + "px";
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });

    const endDrag = () => {
      if (!draggedCube) return;

      if (isOverlapping(draggedCube, textBlob7)) {
        handleDrop(draggedCube, textBlob7);
      } else if (isOverlapping(draggedCube, textBlob8)) {
        handleDrop(draggedCube, textBlob8);
      } else {
        resetCubePosition(draggedCube);
      }

      draggedCube = null;
    };

    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  });

  // ====== nextQ ======
  if (nextQ) {
    nextQ.addEventListener("click", () => {
      // אם זה הסעיף האחרון (סעיף 4) – שינוי תמונת הכפתור והעברה ל-q6
      if (currentSection === 4) {
        nextQ.src = "assets/buttons/toNextQ.png";
        window.location.href = "q6.html";
        return;
      }

      currentSection++;
      changeTaza(currentSection);
      resetAllCubes();
    });
  }

  // ====== טעינת תשובות מה-sessionStorage ======
  function loadAnswers() {
    const blobs = [textBlob7, textBlob8];
    blobs.forEach(blob => {
      const data =sessionStorage.getItem(`${blob.classList[0]}_${currentSection}`);
      if (data) {
        const parsed = JSON.parse(data);
        blob.textContent = parsed.answer;
      }
    });
  }

  // =====  Question Timer Q51 =====
const timerElementQ51 = document.getElementById("timerQ51");

if (timerElementQ51) {
  let timeLeftQ51 = 150; 

  const timerIntervalQ51 = setInterval(() => {
    let minutes = Math.floor(timeLeftQ51 / 60);
    let seconds = timeLeftQ51% 60;

    // הוספת אפס מוביל
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timerElementQ51.textContent = `${minutes}:${seconds}`;

    if (timeLeftQ51 === 0) {
      clearInterval(timerIntervalQ51);
      goToNextQuestionQ51();
    }

    timeLeftQ51--;
  }, 1000);
}
// פונקציה למעבר אוטומטי לעמוד הבא
function goToNextQuestionQ51() {
  window.location.href = "q6.html"; // העמוד הבא
}
  loadAnswers();
  changeTaza(currentSection);
});
// // ===== חישוב ניקוד Q51 =====
// function calcQ5Score() {
//   const pointsPerCorrect = 2;
//   const totalSections = 4;

//   let score = 0;

//   // ===== חלק 1 – A+B =====
//   // q5AB_1 … q5AB_4
//   for (let section = 1; section <= totalSections; section++) {
//     const sectionData = JSON.parse(
//       sessionStorage.getItem(`q5AB_${section}`)
//     ) || {};

//     Object.values(sectionData).forEach(ans => {
//       if (ans?.isCorrect) score += pointsPerCorrect;
//     });
//   }

//   // ===== חלק 2 – C =====
//   // q5C_1 … q5C_4
//   for (let section = 1; section <= totalSections; section++) {
//     const cData = JSON.parse(
//       sessionStorage.getItem(`q5C_${section}`)
//     );

//     if (cData?.isCorrect) score += pointsPerCorrect;
//   }

//   const maxScore =
//     totalSections * pointsPerCorrect * 2 + // A+B
//     totalSections * pointsPerCorrect;     // C

//   return { score, maxScore };
// }



// =======================
// ======== Q7 =========
// =======================

(() => {
  if (!document.getElementById("timerQ7")) return;

  // ---------- CONFIG ----------
  const totalSteps = 10;

  const correctAnswers = {
    c1: "cubeT1",
    c2: "cubeT3",
    c3: "cubeT4",
    c4: "cubeT5",
    c5: "cubeT7",
    c6: "cubeT2",
    c7: "cubeT2",
    c8: "cubeT8",
    c9: "cubeT1",
    c10: "cubeT6"
  };

  let currentStep = 1;
  let draggedCube = null;
  let lastDroppedCubeId = null;

  // ---------- ELEMENTS ----------
  const cubes = document.querySelectorAll("[class^='cubeT']");
  const circles = document.querySelectorAll(".circle-outline");
  const nextBtn = document.querySelector(".nextQ7");

  // ---------- ORIGINAL POSITIONS ----------
  const originalPositions = {};
  cubes.forEach(cube => {
    originalPositions[cube.classList[0]] = {
      top: cube.style.top,
      left: cube.style.left
    };
  });

  // ==================================================
  // =============== DESKTOP DRAG =====================
  // ==================================================
  cubes.forEach(cube => {
    cube.draggable = true;

    cube.addEventListener("dragstart", () => {
      draggedCube = cube;
      resetCubePosition(cube);
      cube.style.zIndex = 10000;
    });
  });

  circles.forEach(circle => {
    circle.addEventListener("dragover", e => e.preventDefault());

    circle.addEventListener("drop", () => {
      if (!draggedCube) return;
      attachCubeToCircle(draggedCube, circle);
      draggedCube = null;
    });
  });

  // ==================================================
  // =============== MOBILE TOUCH =====================
  // ==================================================
  cubes.forEach(cube => {
    let offsetX = 0;
    let offsetY = 0;

    cube.addEventListener("touchstart", e => {
      const touch = e.touches[0];
      const rect = cube.getBoundingClientRect();
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;

      draggedCube = cube;
      resetCubePosition(cube);
      cube.style.zIndex = 10000;
    });

    cube.addEventListener("touchmove", e => {
      if (!draggedCube) return;
      e.preventDefault();
      const touch = e.touches[0];
      cube.style.left = touch.clientX - offsetX + "px";
      cube.style.top  = touch.clientY - offsetY + "px";
    });

    cube.addEventListener("touchend", () => {
      if (!draggedCube) return;

      let dropped = false;
      const cubeRect = draggedCube.getBoundingClientRect();

      circles.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const inside =
          cubeRect.left < rect.right &&
          cubeRect.right > rect.left &&
          cubeRect.top < rect.bottom &&
          cubeRect.bottom > rect.top;

        if (inside) {
          attachCubeToCircle(draggedCube, circle);
          dropped = true;
        }
      });

      if (!dropped) {
        resetCubePosition(draggedCube);
      }

      draggedCube = null;
    });
  });

  // ==================================================
  // =============== HELPERS ==========================
  // ==================================================
  function attachCubeToCircle(cube, circle) {
    const rect = circle.getBoundingClientRect();
    cube.style.position = "absolute";
    cube.style.left = rect.left + "px";
    cube.style.top = rect.top + "px";
    lastDroppedCubeId = cube.classList[0];
  }

  function resetCubePosition(cube) {
    const key = cube.classList[0];
    cube.style.left = originalPositions[key].left;
    cube.style.top = originalPositions[key].top;
  }

  // ==================================================
  // =============== STEP LOGIC =======================
  // ==================================================
  function highlightCurrentCircle() {
    circles.forEach(circle => {
      circle.style.display = "none";
      circle.style.borderColor = "#FFEBCD";
      circle.style.background = "transparent";
    });

    const active = document.getElementById(`c${currentStep}`);
    if (active) active.style.display = "block";
  }

  function resetCubes() {
    cubes.forEach(resetCubePosition);
    lastDroppedCubeId = null;
  }

function saveStepResult() {
  const circleId = `c${currentStep}`;

  const chosen = lastDroppedCubeId || null;
  const isCorrect = chosen === correctAnswers[circleId];

  sessionStorage.setItem(
    `Q7_step_${currentStep}`,
    JSON.stringify({
      circle: circleId,
      chosen,
      correct: isCorrect
    })
  );

  // חשוב!!!
  lastDroppedCubeId = null;
}


// ---------- NEXT BUTTON SAFE ----------
const cleanNextBtn = nextBtn.cloneNode(true);
nextBtn.parentNode.replaceChild(cleanNextBtn, nextBtn);

cleanNextBtn.addEventListener("click", () => {
  saveStepResult();

  // ===== אם זה השלב האחרון =====
  if (currentStep === totalSteps) {

    // 💥 שליחה למייל
    sendResultsEmail();

    // נותנים זמן לשליחה לפני מעבר
    setTimeout(() => {
      window.location.href = "result.html";
    }, 1000);

    return;
  }

  // שינוי כפתור בשלב לפני אחרון
  if (currentStep === totalSteps - 1) {
    cleanNextBtn.src = "assets/buttons/checkWrongBtn.png";
  }

  currentStep++;
  resetCubes();
  highlightCurrentCircle();
});

// ---------- INIT ----------
highlightCurrentCircle();
})();
// // ===== חישוב ניקוד Q7 =====
// function calcQ7Score() {
//   const pointsPerCorrectDrag = 3;
//   const totalSteps = 10;
//   let score = 0;

//   for (let step = 1; step <= totalSteps; step++) {
//     const stepData = JSON.parse(sessionStorage.getItem(`Q7_step_${step}`));
//     if (stepData && stepData.correct) {
//       score += pointsPerCorrectDrag;
//     }
//   }

//   const maxScore = pointsPerCorrectDrag * totalSteps;
//   return { score, maxScore };
// }

// //5 score
// function calcQ5Score() {
//   const pointsPerCorrect = 2;
//   const totalSections = 4;

//   let score = 0;

//   // ===== Q5 חלק A+B =====
//   for (let i = 1; i <= totalSections; i++) {
//     const data = JSON.parse(sessionStorage.getItem(`q5AB_${i}`)) || {};

//     if (data.answerA?.isCorrect) score += pointsPerCorrect;
//     if (data.answerB?.isCorrect) score += pointsPerCorrect;
//   }

//   // ===== Q5 חלק C =====
//   for (let i = 1; i <= totalSections; i++) {
//     const data = JSON.parse(sessionStorage.getItem(`q5C_${i}`));
//     if (data?.isCorrect) score += pointsPerCorrect;
//   }

//   // ===== Q51 (drag cubes) =====
//   for (let i = 1; i <= totalSections; i++) {
//     const b7 = JSON.parse(sessionStorage.getItem(`textBlob7_${i}`));
//     const b8 = JSON.parse(sessionStorage.getItem(`textBlob8_${i}`));

//     if (b7?.correct) score += pointsPerCorrect;
//     if (b8?.correct) score += pointsPerCorrect;
//   }

//   const maxScore =
//     totalSections * 2 * pointsPerCorrect + // AB
//     totalSections * pointsPerCorrect +     // C
//     totalSections * 2 * pointsPerCorrect;  // Q51

//   return { score, maxScore };
// }

// ===== Results Page – Show Scores =====
// ===============================
// ===== RESULT PAGE =============
// ===============================

const scoreDiv = document.querySelector(".scoreInfo");

if (scoreDiv) {
  const scores = getAllScores();

  const totalScore = scores.reduce((a, b) => a + b.score, 0);
  const totalMax = scores.reduce((a, b) => a + b.maxScore, 0);

  scoreDiv.textContent = `${totalScore} / ${totalMax}`;
}

// ===== Results Page – Show Scores Per Question (resultInfo.html) =====

// ===============================
// ===== RESULT INFO PAGE ========
// ===============================

const scores = getAllScores();

scores.forEach((q, i) => {
  const div = document.querySelector(`.q${i + 1}`);
  if (div) {
    div.textContent = `${q.score} / ${q.maxScore}`;
  }
});



// ===== Results Page – Show Personal Info =====
const personalInfoDiv = document.querySelector('.personalInfo');

if (personalInfoDiv) {
  const fullName = sessionStorage.getItem('fullName');
  const personalNum = sessionStorage.getItem('personalNum');
  const userClass = sessionStorage.getItem('userClass');
  const platoon = sessionStorage.getItem('platoon');
  const company = sessionStorage.getItem('company');

  if (fullName && personalNum && userClass && platoon && company) {
    personalInfoDiv.innerHTML = `
      <div>${fullName}</div>
      <div>מס' אישי: ${personalNum}</div>
      <div>כיתה: ${userClass}</div>
      <div>מחלקה: ${platoon}</div>
      <div>פלוגה: ${company}</div>
    `;
  } else {
    personalInfoDiv.textContent = "פרטים אישיים לא זמינים";
  }
}

function sendResultsEmail() {
  const fullName = sessionStorage.getItem('fullName');
  const personalNum = sessionStorage.getItem('personalNum');
  const userClass = sessionStorage.getItem('userClass');
  const platoon = sessionStorage.getItem('platoon');
  const company = sessionStorage.getItem('company');

  const scores = getAllScores();

  const totalScore = scores.reduce((a, b) => a + b.score, 0);
  const totalMax = scores.reduce((a, b) => a + b.maxScore, 0);

  let details = "";
  scores.forEach((q, i) => {
    details += `שאלה ${i + 1}: ${q.score} / ${q.maxScore}\n`;
  });

  const templateParams = {
    fullName,
    personalNum,
    userClass,
    platoon,
    company,
    totalScore: `${totalScore} / ${totalMax}`,
    details
  };

  return emailjs.send("service_zn8idxu", "template_tvc0aig", templateParams)
    .then((res) => {
      sessionStorage.setItem("emailStatus", "sent");
      sessionStorage.setItem("emailResponse", JSON.stringify(res));
      return res;
    })
    .catch((err) => {
      sessionStorage.setItem("emailStatus", "failed");
      sessionStorage.setItem("emailError", JSON.stringify(err));
      return err;
    });
}
