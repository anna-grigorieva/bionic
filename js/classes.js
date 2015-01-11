function Animal(x, y) {
    this.x = x;
    this.y = y;
}
function Wolf(x, y) {
    Animal.call(this, x, y);
    this.chase = function (rabbit, forest) {
        var forestGraph = new Graph(forest, { diagonal: true }),
			me = forestGraph.grid[this.x][this.y],
			target = forestGraph.grid[rabbit.x][rabbit.y],
			path = astar.search(forestGraph, me, target);
        path.pop();
        return path;
    };
}
function Rabbit(x, y) {
    Animal.call(this, x, y);
    this.run = function (wolf, forest) {
        forest[wolf.x][wolf.y] = 0;
        var newX, newY, target,
			forestGraph = new Graph(forest, { diagonal: true }),
			me = forestGraph.grid[this.x][this.y];
        do {
            newX = random(0, forest.length - 1);
            newY = random(0, forest.length - 1);
        } while (forest[newX][newY] === 0);
        target = forestGraph.grid[newX][newY];

        return astar.search(forestGraph, me, target);
    };
}
function Plant(x, y, age) {
    this.x = x;
    this.y = y;
    this.age = age || 0;
    this.getOlder = function () {
        this.age += 1;
    };
}
function Tree(x, y, age) {
    Plant.call(this, x, y, age);
}
function Bush(x, y, age) {
    Plant.call(this, x, y, age);
}
