var CONTROLLER = function (settings) {
    var play,
		move = 0,
		gameOver = false,
		result,
		trees = [],
		bushes = [],
		wolf = {},
		rabbit = {};
    return {
        startGame: function () {
            initField();
            if (gameOver) return;
            play = setInterval(makeMove, settings.moveTime);
        }
    }
    function initField() {
        plantNewPlants();
        setAnimals();
        checkRabbit();
        VIEW.drawForest(trees, bushes, wolf, rabbit, settings.forestSize);
        move = 1;
    }
    function makeMove() {
        var oldWolf = {
            x: wolf.x,
            y: wolf.y
        };
        if (move != 1) {
            checkPlantsAge();
            plantNewPlants();
        }
        var wolfPath = wolf.chase(rabbit, getForestMap());
        wolfPath = (wolfPath.length > settings.wolfStepsPerMove) ? wolfPath.slice(0, settings.wolfStepsPerMove) : wolfPath;
        if (wolfPath.length != 0) {
            wolf.x = wolfPath[wolfPath.length - 1].x;
            wolf.y = wolfPath[wolfPath.length - 1].y;
        }
        checkRabbit();

        if (!gameOver) {
            var rabbitPath = rabbit.run(wolf, getForestMap());
            rabbitPath = (rabbitPath.length > settings.rabbitStepsPerMove) ? rabbitPath.slice(0, settings.rabbitStepsPerMove) : rabbitPath;
            if (rabbitPath.length != 0) {
                rabbit.x = rabbitPath[rabbitPath.length - 1].x;
                rabbit.y = rabbitPath[rabbitPath.length - 1].y;
            }
        }
        checkRabbit();

        VIEW.drawForest(trees, bushes, wolf, rabbit, settings.forestSize);
        VIEW.drawPath(oldWolf, wolfPath);

        move++;
        if (move > settings.moves) {
            gameOver = true;
            clearInterval(play);
            result = "Rabbit is still alive!";
        }

        if (gameOver) { setTimeout(function () { alert(result); }, settings.moveTime); }
    }
    function getForestMap() {
        var forestMap = [];
        for (var x = 0; x < settings.forestSize; x++) {
            forestMap[x] = [];
            for (var y = 0; y < settings.forestSize; y++) {
                forestMap[x][y] = (isEmpty(x, y)) ? 1 : 0;
            }
        }
        return forestMap;
    }
    function plantNewPlants() {
        var newTreesNumb = random(0, settings.treesMaxNumb - trees.length),
			newBushesNumb = random(0, settings.bushesMaxNumb - bushes.length),
			freeCell, age;
        for (i = 0; i < newTreesNumb && !gameOver; i++) {
            freeCell = getFreePlace();
            age = (move === 0) ? random(0, settings.treeLifeDur) : 0;
            trees.push(new Tree(freeCell.x, freeCell.y, age));
        }
        for (i = 0; i < newBushesNumb && !gameOver; i++) {
            freeCell = getFreePlace();
            age = (move === 0) ? random(0, settings.bushLifeDur) : 0;
            bushes.push(new Bush(freeCell.x, freeCell.y, age));
        }
        if (move === 0) {
            trees.sort(compareAge);
            bushes.sort(compareAge);
        }
    }
    function checkPlantsAge() {
        for (var i = 0; i < trees.length; i++) {
            trees[i].getOlder();
            if (trees[i].age > settings.treeLifeDur) {
                i--;
                trees.shift();
            }
        }
        for (var i = 0; i < bushes.length; i++) {
            bushes[i].getOlder();
            if (bushes[i].age > settings.bushLifeDur) {
                i--;
                bushes.shift();
            }
        }
    }
    function setAnimals() {
        var freeCell = getFreePlace();
        rabbit = new Rabbit(freeCell.x, freeCell.y);
        freeCell = getFreePlace();
        wolf = new Wolf(freeCell.x, freeCell.y);
    }
    function checkRabbit() {
        for (var x = rabbit.x - 1; x <= rabbit.x + 1; x++) {
            for (var y = rabbit.y - 1; y <= rabbit.y + 1; y++) {
                if (wolf.x === x && wolf.y === y) {
                    gameOver = true;
                    result = "Sorry.. Rabbit.. RIP";
                    clearInterval(play);
                }
            }
        }
    }
    function getFreePlace() {
        var xCoord, yCoord,
			forestSize = settings.forestSize * settings.forestSize,
			filledCells = trees.length + bushes.length;
        if ((forestSize - filledCells) < 5) {
            gameOver = true;
            result = "forest is almost full!";
            clearInterval(play);
            return {};
        }
        while (true) {
            xCoord = random(0, settings.forestSize - 1);
            yCoord = random(0, settings.forestSize - 1);
            if (isEmpty(xCoord, yCoord, 1)) {
                return { x: xCoord, y: yCoord };
            }
        }
    }
    function isEmpty(x, y, checkAnimalsToo) {
        for (var i = 0; i < trees.length; i++) {
            if ((trees[i].x === x) && (trees[i].y === y)) {
                return false;
            }
        }
        for (var i = 0; i < bushes.length; i++) {
            if ((bushes[i].x === x) && (bushes[i].y === y)) {
                return false;
            }
        }
        if (checkAnimalsToo) {
            if ((rabbit.x === x) && (rabbit.y === y)) {
                return false;
            }
            if ((wolf.x === x) && (rabbit.y === y)) {
                return false;
            }
        }
        return true;
    }
    function compareAge(a, b) {
        return b.age - a.age;
    }
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}