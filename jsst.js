$(function(){
  const words = [
      {en: "cat", uk: "кіт", img: "1.jpg"},
      {en: "halcyon", uk: "безтурботний", img: "2.jpg"},
      {en: "petrichor", uk: "свіжий запах землі після дощу", img: "3.jpg"},
      {en: "limerence", uk: "любов до котів", img: "4.jpg"},
      {en: "serendipity", uk: "вдалий збіг обставин", img: "5.jpg"},
      {en: "clandestine", uk: "таємний", img: "6.jpg"},
      {en: "aurora", uk: "полярне сяйво", img: "7.jpg"},
      {en: "mellifuous", uk: "медовий", img: "8.jpg"},
      {en: "kitten", uk: "кошеня", img: "9.jpg"},
      {en: "etgreal", uk: "небесний", img: "10.jpg"}
  ];

  let randomWords = [];
  let index = 0;
  let correct = 0;
  let wrong = 0;

  function randomD(array) {
      return array.sort(() => Math.random() - 0.5);
  }
  
  function startGame() {
      randomWords = randomD(words).slice(0, 10);
      index = 0;
      correct = 0;
      wrong = 0;
      $("#correct").text(correct);
      $("#wrong").text(wrong); 
      $("#total").text(randomWords.length);
      $("#step").text(index + 1);
      $("#image").attr("src", randomWords[index].img);
      $("#translation").val("");
      $("#feedback").text("");
      $("#result").hide(); 
  }

  $("#nextBtn, #card").click(function(){
      const input = $("#translation").val().trim().toLowerCase();
      if (input === "") {
          alert("Enter the translation!");
          return;
      }

      const correctAnswer = randomWords[index].uk.toLowerCase();
      if (input === correctAnswer) {
          correct++;
          $("#feedback")
              .removeClass("wrong")
              .addClass("correct")
              .text("Right!");
      } else {
          wrong++;
          $("#feedback")
              .removeClass("correct")
              .addClass("wrong")
              .text(`Wrong! Correct answer: "${randomWords[index].uk}"`);
      }

      $("#correct").text(correct);
      $("#wrong").text(wrong);

      index++;

      if (index < randomWords.length) {
          setTimeout(() => {
              $("#step").text(index + 1);
              $("#image").attr("src", randomWords[index].img);
              $("#translation").val("");
              $("#feedback").text("");
          }, 900);
      } else {
          setTimeout(show, 1000);
      }
  });

  function show() {
      const percent = (correct / randomWords.length) * 100;
      let level = "";
      if (percent >= 90) level = "Excellent! You're almost a native speaker!";
      else if (percent >= 70) level = "Good level!";
      else if (percent >= 50) level = "Intermediate level, keep practicing!";
      else level = "You need to practice more!";

      $("#resultText").html(
        `You translated correctly. ${correct} from ${randomWords.length} (${percent.toFixed(1)}%).<br>${level}`
      );
      $("#result").fadeIn();
  }

  $("#restartBtn").click(function(){
      $("#result").fadeOut();
      startGame();
  });
  startGame();
});