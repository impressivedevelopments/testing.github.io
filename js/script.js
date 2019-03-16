let xhr = new XMLHttpRequest();
xhr.open('GET', 'js/tasks.json', false);
xhr.send();

let data = JSON.parse(xhr.responseText);

let winStart = document.querySelector('#start'),
    winTesting = document.querySelector('#testing'),
    winResults = document.querySelector('#results'),
    totalPercent = document.querySelector('#results span'),
    results = document.querySelector('#results .panel-body-form-control'),
    taskQuestion = document.querySelector('#testing .panel-header'),
    taskAnswers = document.querySelectorAll('.panel-body-form-control label'),
    taskRadio = document.querySelectorAll('.panel-body-form-control input'),
    timer = document.querySelector('.panel-footer-timer'),
    currentQuestion = document.querySelector('.current-question'),
    totalQuestions = document.querySelector('.total-questions');

let minutes,
    seconds,
    time = 60*data.length,
    total = data.length,
    taskCount = 0,
    correctAnswerCount = 0,
    currentTask = 1,
    currentAnswer;

let answers = [];

currentQuestion.innerHTML = currentTask;
totalQuestions.innerHTML = total;
timer.innerHTML = "Время на тест: " + time + " сек";

// Перебор вариантов ответа и выбор правильного по клику
taskRadio.forEach(function(radio) {
    radio.addEventListener('click', function(e) {
        currentRadio = e.target;
        currentAnswer = currentRadio.labels[0].innerHTML;
    });
});

// Проверка ответа
function checkAnswer(taskCount, currentAnswer) {
    if (currentAnswer == data[taskCount].correctAnswer) {
        correctAnswerCount++;
        answers.push({
            currentQuestion : data[taskCount].question,
            currentTask : currentTask,
            currentAnswer : currentAnswer,
            correct : 'Правильно'
        });
        return true;
    } else {
        answers.push({
            currentQuestion : data[taskCount].question,
            currentTask : currentTask,
            currentAnswer : currentAnswer,
            correct : 'Неправильно'
        });
        return true;
    }
};

// Переход на следующий вопрос
function nextTask() {
    if(checkAnswer(taskCount, currentAnswer)) {
        if(taskCount < data.length-1) {            
            taskCount++;
            currentTask++;
            currentQuestion.innerHTML = currentTask;
            showTask(taskCount, data);
        } else {
            showResults();
        }
    }    
};

// Отображение вопроса
function showTask(taskCount, data) {
    taskQuestion.innerHTML = data[taskCount].question;
    taskAnswers.forEach(function(answer, i) {
        answer.innerHTML = data[taskCount].answers[i];
    });
    currentQuestion.innerHTML = currentTask;
};

showTask(taskCount, data);

// Отображение окна с результатами
function showResults() {
    winTesting.classList.add('hidden');
    winResults.classList.remove('hidden');
    totalPercent.innerHTML = (correctAnswerCount/total*100).toFixed(0);
    answers.forEach(function(answer) {
        results.innerHTML += "<span>" + answer['currentTask'] + ") " +
            answer['currentQuestion'] + "<br>" + 
            " Ответ: " + answer['currentAnswer'] + " " +
            answer['correct'] + "</span>";
    });
};

// Запуск тестирования
function startTest() {
    winStart.classList.add('hidden');
    winTesting.classList.remove('hidden');

    // Таймер на прохождение теста
    let remaningTime = setTimeout(function tick() {
        if (time > 0) {
            time--;
            let hours = Math.floor(time / 3600),
                minutes = Math.floor((time - (3600 * hours))/60),
                seconds = time - hours * 3600 - minutes * 60;
    
            timer.innerHTML = "Время: " + minutes + " мин : " + seconds + " сек";
            remaningTime = setTimeout(tick, 1000);
        } else {
            clearTimeout(remaningTime);
        }  
    }, 1000);    
};

// Запуск нового тестирования
function newTesting() {
    location.reload();
};
