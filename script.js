document.addEventListener("DOMContentLoaded", async() => {
    let quizData = null;
    await fetch("Quiz-Data.json")
    .then(response => response.json())
    .then(data => {
        quizData = data.quiz;
    })
    .catch(error => console.log("Error loading quiz data: ", error));

    let container = document.getElementById("quiz-container");
    quizData.forEach((element, index) => {
        let quizBox = document.createElement("div");
        quizBox.classList.add("quiz");
        quizBox.innerHTML = `
            <img src=${element.image} alt=${element.category} />
            <button class="quiz-btn" data-section=${index}>${element.category}</button>
        `

        container.appendChild(quizBox);
    });

    let quizbtns = document.querySelectorAll(".quiz-btn");

    quizbtns.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-section");

            startQuiz(index);
        })
    })

    function startQuiz(index){
        const questionBank = quizData[index].questions;
        let countQuestionIndex = 0;
        let score = 0;
        let answerSelected = false;

        document.querySelector("section").style.display = "none";
        document.getElementById("question-container").style.display = "block";

        showQuestion();


        function showQuestion(){
            let currQuestion = questionBank[countQuestionIndex];

            let questionElement = document.getElementById("question");
            let options = document.getElementById("options");

            questionElement.textContent = currQuestion.question;
            options.innerHTML = "";

            if(currQuestion.type === "MCQ"){
                currQuestion.options.forEach((option, index) => {
                    let optionElement = document.createElement("div");
                    optionElement.textContent = option;
                    options.appendChild(optionElement);

                    optionElement.addEventListener("click", () => {
                        if(!answerSelected){
                            answerSelected = true;
                            optionElement.classList.add("selected")

                            checkAnswer(option, currQuestion.answer)
                        }
                    })
                })
            } else {
               const inputElement = document.createElement("input");
               inputElement.type = currQuestion.type === 'NUMBER' ? 'number' : 'text';

               const submitBtn = document.createElement("button");
               submitBtn.textContent = "Submit Answer";
               submitBtn.className = 'submit-answer';

               submitBtn.addEventListener("click", () => {
                    if(!answerSelected){
                        answerSelected = true;
                        checkAnswer(inputElement.value.toString(), currQuestion.answer.toString())
                    }
               });
               options.appendChild(inputElement);
               options.appendChild(submitBtn);


            }

        }

        function checkAnswer(userAns, answer){
            let feedbackElement = document.createElement("p");
            feedbackElement.id ="feedback";
            if(userAns === answer || userAns.toLowerCase() === answer.toLowerCase()){
                score++;
                feedbackElement.textContent = 'Correct!';
                feedbackElement.style.color = 'green';
            } else{
                feedbackElement.textContent = `Wrong, Correct answer is ${answer}`;
                feedbackElement.style.color = 'red';
            }

            let options = document.getElementById("options");
            options.appendChild(feedbackElement);

            updateScore();
        }

        function updateScore(){
            document.getElementById("score").textContent = `Score: ${score}`
        }

        document.getElementById("next-btn").addEventListener("click", () => {
            if(countQuestionIndex === questionBank.length - 1){
                console.log("Quiz is Over");
                endQuiz();
            } else {
                answerSelected = false;
                countQuestionIndex++;
                showQuestion();
            }
        })

        function endQuiz(){
            document.getElementById("question-container").innerHTML = `
                <h1>Quiz Completed</h1>
                <p>Your Final Score Is : ${score}/${questionBank.length}</p>
                <button id="home-btn">Go TO Home</button>
            `;

            document.getElementById("home-btn").addEventListener("click", () => {
                document.getElementById("question-container").style.display = "none";
                document.querySelector("section").style.display = "block";
            })
        }
        
    }

    const random = Math.floor(Math.random() * quizData.length);
    document.getElementById("random-quiz").addEventListener("click", () => {
        startQuiz(random);
    })

})
