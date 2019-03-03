// Perceptron-JS: main loop
// author: Cédric "tuzepoito" Chartron

var stop = false;;

var ctx;
var width, height;

var points, realWeights;
var perceptron;
var accuracy = 0;
var error = 0;

var zoom = 1.5; // max. coordinate in the figure
var zoomV; // vertical equivalent

// fallback for requestAnimationFrame
var requestAnimation = window.requestAnimationFrame ||
  function (callback, el) { setTimeout(callback, 1000/60.0); };


function init () {
  points = [];

  // choose 2 random points on the graph and draw the line
  var point1 = [-zoom + 2 * zoom * Math.random(), -zoomV + 2 * Math.random() * zoomV];
  var point2 = [-zoom + 2 * zoom * Math.random(), -zoomV + 2 * Math.random() * zoomV];

  realWeights = new Array(3);
  // ax + by + c = ax' + by' + c
  realWeights[0] = 1 + 4 * Math.random();
  // considering a = 1
  // b = a * (x' - x) / (y - y')
  realWeights[1] = realWeights[0] * (point2[0] - point1[0]) / (point1[1] - point2[0]);
  // c = -ax - by
  realWeights[2] = - realWeights[0] * point1[0] - realWeights[1] * point1[1]
  perceptron = new Perceptron();

  draw();
  displayValues();
}

function step () {
  if (points.length < 3000) {
    var point = [-zoom + 2 * zoom * Math.random(), -zoomV + 2 * Math.random() * zoomV];
    var result = realWeights[0] * point[0] + realWeights[1] * point[1] + realWeights[2];
    points.push(point);
    error = perceptron.update(point, result);
    return [result, error];
  }
  return [0, 0];
}

function draw () {
  function toCanvasCoords (x, y) {
    return [(x / zoom + 1) * width / 2, (y / zoomV + 1) * height / 2];
  }

  // update
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // axes
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // real line
  ctx.fillStyle = 'black';
  ctx.beginPath();
  var linePoint = toCanvasCoords(-zoom, (zoom * realWeights[0] - realWeights[2]) / realWeights[1]);
  ctx.moveTo(linePoint[0], linePoint[1]);
  linePoint = toCanvasCoords(zoom, (-zoom * realWeights[0] - realWeights[2]) / realWeights[1]);
  ctx.lineTo(linePoint[0], linePoint[1]);
  ctx.stroke();
  
  // perceptron line
  ctx.lineWidth = 1;
  ctx.beginPath();
  linePoint = toCanvasCoords(-zoom, (zoom * perceptron.weights[0] - perceptron.weights[2]) / perceptron.weights[1]);
  ctx.moveTo(linePoint[0], linePoint[1]);
  linePoint = toCanvasCoords(zoom, (-zoom * perceptron.weights[0] - perceptron.weights[2]) / perceptron.weights[1]);
  ctx.lineTo(linePoint[0], linePoint[1]);
  ctx.stroke();
  
  var correct = 0;

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var result = perceptron.feedback(point);
    var realResult = realWeights[0] * point[0] + realWeights[1] * point[1] + realWeights[2];
    var pointCanvas = toCanvasCoords(point[0], point[1]);
    if (result > 0) {
      ctx.beginPath();
      ctx.arc(pointCanvas[0], pointCanvas[1], 5, 0, 2 * Math.PI);
      ctx.fill();
      if (realResult > 0) {
        correct++;
      }
    } else {
      ctx.beginPath();
      ctx.arc(pointCanvas[0], pointCanvas[1], 5, 0, 2 * Math.PI);
      ctx.stroke();
      if (realResult <= 0) {
        correct++;
      }
    }
  }

  if (points.length > 0) {
    accuracy = 100 * correct / points.length;
  } else {
    accuracy = 0;
  }

}

function render () {
  if (!stop) {
    step();

    draw();

    if (this.points.length % 25 == 0) {
      displayValues();
    }
  }

  requestAnimation(render);
}

function displayValues () {
  document.getElementById("numPoints").innerText = points.length;

  document.getElementById("rw1").innerText = realWeights[0].toFixed(5);
  document.getElementById("rw2").innerText = realWeights[1].toFixed(5);
  document.getElementById("rbias").innerText = realWeights[2].toFixed(5);

  document.getElementById("w1").innerText = perceptron.weights[0].toFixed(5);
  document.getElementById("w2").innerText = perceptron.weights[1].toFixed(5);
  document.getElementById("bias").innerText = perceptron.weights[2].toFixed(5);

  document.getElementById("accuracy").innerText = accuracy.toFixed(2);
  document.getElementById("error").innerText = error.toFixed(2);

}

window.onload = function() {
  var canvas = document.getElementById("maincanvas");

  if (!canvas.getContext)
    return;

  width = canvas.width;
  height = canvas.height;
  zoomV = zoom * height / width;

  ctx = canvas.getContext('2d', { alpha: false });
  ctx.strokeStyle = 'black';

  init();

  document.getElementById("reset").addEventListener("click", init);
  document.getElementById("pause").addEventListener("click", function () {
    stop = !stop;
  })
  document.getElementById("step").addEventListener("click", function () {
    if (!stop) {
      stop = true;
    } else {
      step();
      draw();
    }
    displayValues();
  })

  requestAnimation(render);
};
