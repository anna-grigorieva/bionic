var VIEW = function (canvas) {
	var context = canvas.getContext("2d");
	var cellSize = 20;
	return {
		drawForest: function (trees, bushes, wolf, rabbit, forestSize) {
			drawGrid(forestSize);
			for (var i = 0; i < trees.length; i++) {	
				drawCell("tree", trees[i], true);
			}				
			for (i = 0; i < bushes.length; i++) {	
				drawCell("bush", bushes[i], true);
			}
			drawCell("rabbit", rabbit);
			drawCell("wolf", wolf);
		},
		drawPath: function (animal, path) {
			var oldStrokeStyle = context.strokeStyle,
				oldLineWidth = context.lineWidth,
				x0 = animal.x * cellSize + cellSize/2,
				y0 = animal.y * cellSize + cellSize/2;
			context.beginPath();
			context.moveTo(x0, y0);
			for (var i = 0; i < path.length - 1; i++) {
				var x1 = path[i].x * cellSize + cellSize/2,
					y1 = path[i].y * cellSize + cellSize/2,
					x2 = path[i+1].x * cellSize + cellSize/2,
					y2 = path[i+1].y * cellSize + cellSize/2;
				if (i === 0) { context.lineTo(x1, y1); }
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
			}			
			context.strokeStyle = "gray";
			context.lineWidth = 2;
			context.stroke();
			context.strokeStyle = oldStrokeStyle;
			context.lineWidth = oldLineWidth;
			}			
	};		
	function drawCell(type, inhabitant, showAge) {
		var cellColor,
			x = inhabitant.x * cellSize,
			y = inhabitant.y * cellSize;
		switch (type) {
			case "tree":
				cellColor = "#009933";
				break;
			case "bush":
				cellColor = "#99FF66";
				break;
			case "rabbit":
				cellColor = "#C2C2A3";
				break;
			case "wolf":
				cellColor = "#333399";
				break;
		}
		context.fillStyle = cellColor;
		context.fillRect(x, y, cellSize, cellSize);
		if (showAge) {
			context.font = "bold 12px sans-serif";
			context.fillStyle = "#fff";
			context.fillText(inhabitant.age, x + cellSize/3, y + cellSize*2/3);
		}
	}
	function drawGrid(cellNumb) {
		var width = cellNumb * cellSize;
		canvas.width = width;
		canvas.height = width;
		context.beginPath();
		for (var i = 0.5; i < width; i += cellSize) {
			context.moveTo(i, 0);
			context.lineTo(i, width);
			context.moveTo(0, i);
			context.lineTo(width, i);
		}
		context.strokeStyle = "#80CC99";
		context.stroke();	
	}
};
