document.addEventListener('DOMContentLoaded', start);

function start() {
    const squares = document.querySelectorAll('.grid div');
    const scoreDisplay = document.querySelector('.score');
    const speedDisplay = document.querySelector('.speed');
    const startBtn = document.querySelector('.start');


    const width = 20;

    var letMove = true; //разрешение на отраборку клавиши направления, для невозможности повернуть сразу в две стороны пока не отрисовалась новая голова
    var currentIndex = 0; //first div our grid
    var appleIndex = 0; //so first div grid
    var currentSnake = [2, 1, 0]; // 2 - head 0- tail of snake
    var direction = 1;
    var score = 0;
    //var speed = 20;
    var intervalTime = 500;
    var interval = 0;
    //startGame();
    startBtn.addEventListener('click', startGame);

    function increaseSpeed() {
        return Math.floor(Math.random() * 30);
    }


    //Управлением с клавиатуры
    document.addEventListener('keydown', control);
    function control(e) {
        squares[currentIndex].classList.remove('snake');
        //проверяем клавиши и блокируем нажатие движения в обратную сторону.
        if (e.keyCode === 39 && direction != -1 && letMove) { //key RIGHT
            direction = 1; letMove = false;
        } else if (e.keyCode === 38 && direction != +width && letMove) { //key UP
            direction = -width; letMove = false;
        } else if (e.keyCode === 37 && direction != 1 && letMove) { //key LEFT
            direction = -1; letMove = false;
        } else if (e.keyCode === 40 && direction != -width && letMove) { //key DOWN
            direction = +width; letMove = false;
        }
    }

    //To start and restart game
    function startGame() {
        //чистим поле
        squares.forEach(index => index.classList.remove('snake', 'head-right', 'head-up', 'head-left', 'head-down', 'apple'));
        //сбрасываем скорость и очки
        clearInterval(interval);
        
        score = 0;
        randomApple();
        direction = 1;
        scoreDisplay.innerText = score;
        currentSnake = [2, 1, 0];
        currentIndex = 0;
        currentSnake.forEach(index => squares[index].classList.add('snake'));
        squares[currentSnake[0]].classList.add('head-right');
        //squares[currentSnake[0]].classList.add('head');
        interval = setInterval(moveOutcomes, intervalTime);
        speedDisplay.textContent = intervalTime;
    }

    //Все  виды коллизий   
    // край экрана или само тело змей
    function moveOutcomes() {
        if (
            (currentSnake[0] + width >= (width * width) && direction === width) ||//столкновение с дном
            (currentSnake[0] % width === (width - 1) && direction === 1) || //правая стена
            (currentSnake[0] % width === (0) && direction === -1) || //левая стена
            (currentSnake[0] - width < (0) && direction === -width) || //верх
            squares[currentSnake[0] + direction].classList.contains('snake') //с телом
        ) {
            new Audio('media/lose.mp3').autoplay = true; //звук GameOver
            //currentSnake.forEach(index => squares[index].classList.remove('head-right', 'head-up', 'head-left', 'head-down'));
            currentSnake.forEach(index => squares[index].className = '');
            currentSnake.forEach(index => squares[index].classList.add('apple'));
            return clearInterval(interval);
        }

        //движение
        const tail = currentSnake.pop(); //получаем конец хвоста
        squares[tail].classList.remove('snake'); //удаляем конец хвоста
        //squares[currentSnake[0]].classList.remove('head-right', 'head-up', 'head-left', 'head-down');
        squares[currentSnake[0]].classList.remove('head-right', 'head-up', 'head-left', 'head-down'); //удаляем все направления голов
        currentSnake.unshift(currentSnake[0] + direction); //добавляет в начало массива элемент сдвигая змейку вперед
        //рисуем спрайт головы в зависимости от направления движения
        switch (direction) {
            case 1:
                squares[currentSnake[0]].classList.add('head-right');
                break;
            case -width:
                squares[currentSnake[0]].classList.add('head-up');
                break;
            case -1:
                squares[currentSnake[0]].classList.add('head-left');
                break;
            case width:
                squares[currentSnake[0]].classList.add('head-down');
                break;
        }
        letMove = true; // включаем отрабоку нажатия стрелок

        // с яблоком
        if (squares[currentSnake[0]].classList.contains('apple')) {
            squares[currentSnake[0]].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            randomApple();
            score++;
            new Audio('media/eat-apple.mp3').autoplay = true; //звук GameOver
            scoreDisplay.textContent = score;
            //отключаем таймер
            clearInterval(interval);
            //ускоряемся
            var speed = increaseSpeed();
            intervalTime -= speed;
            speedDisplay.textContent = `${intervalTime} (-${speed}ms)`;
            interval = setInterval(moveOutcomes, intervalTime);

        }
        squares[currentSnake[0]].classList.add('snake');
    }

    //генерируем случайное яблоко на поле
    function randomApple() {
        do {
            appleIndex = Math.floor(Math.random() * squares.length)
        } while (squares[appleIndex].classList.contains('snake'));
        squares[appleIndex].classList.add('apple');
    }



















}