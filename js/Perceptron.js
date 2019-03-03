// Perceptron-JS: Perceptron object
// author: Cédric "tuzepoito" Chartron

Perceptron = function() {
  this.weights = [-0.5 + 0.5 * Math.random(), -0.5 + 0.5 * Math.random(), -0.5 + 0.5 * Math.random()];
  this.c = 0.02;
  console.debug("initial state:", this.weights);
};

Perceptron.prototype.feedback = function(point) {
  return this.weights[0] * point[0] + this.weights[1] * point[1] + this.weights[2];
};

Perceptron.prototype.update = function(point, desired) {
  // calculate result
  var guess = this.feedback(point);
  var error = desired - guess;

  this.weights[0] += this.c * error * point[0];
  this.weights[1] += this.c * error * point[1];
  this.weights[2] += this.c * error;

  return error;
};