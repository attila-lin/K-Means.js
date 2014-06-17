"use strict";

var Formula = {
  Default   : 0,
  Minkowski : 1,
  Euclidean : 2,
  CityBlock : 3
}

var Kmeans = module.exports = function () {
  this.data = [];
  this.K = 2;
  this.formula = Formula.Default;
  this.λ = 2;
}

Kmeans.prototype.setK = function(k) {
  this.K = k;
}

Kmeans.prototype.setFormula = function(formula, λ) {
  formula = formula.toLowerCase();
  if (typeof String.prototype.startsWith != 'function') {
      // see below for better implementation!
    String.prototype.startsWith = function (str){
      return this.indexOf(str) == 0;
    };
  }

  if (formula.startsWith('min')) {
    this.formula = Formula.Minkowski;
    this.λ = λ;
  } else if (formula.startsWith('euc')) {
    this.formula = Formula.Euclidean;
    this.λ = 2;
  } else if (formula.startsWith('cit')) {
    this.formula = Formula.CityBlock;
    this.λ = 1;
  }
};

Kmeans.prototype.train = function(data) {
  this.data = data;
}

Kmeans.prototype.run = function(maxtime) {

  var getMiddle = function (data, formula) {
    var res = {
      x : 0,
      y : 0
    };

    if (formula !== Formula.Default) {
      for(var i = 0; i < data.length; i++) {
        res.x += data[i][0];
        res.y += data[i][1];
      }
      res.x = res.x/data.length;
      res.y = res.y/data.length;
    } else { //
      for(var i = 0; i < data.length; i++) {
        res.x += data[i][0];
        res.y += data[i][1];
      }
      res.x = res.x/data.length;
      res.y = res.y/data.length;
    }

    return res;
  }

  var getDistance = function (a, b) {
    return Math.sqrt(Math.pow(a[0] - b.x, 2) + Math.pow(a[1] - b.y, 2));
  }

  var initPoint = function (data, K) {
    var points = [];

    var maxX = 0,
      maxY = 0,
      minX = 10000,
      minY = 10000;

    for(var i = 0; i < data.length; i++) {
      if (maxX < data[i][0]) maxX = data[i][0];
      if (minX > data[i][0]) minX = data[i][0];
      if (maxY < data[i][1]) maxY = data[i][1];
      if (minY > data[i][1]) minY = data[i][1];
    }
    for(var i = 0; i < K; i++) {
      points.push({
                    x : minX + Math.random() * (maxX - minX),
                    y : minY + Math.random() * (maxY - minY),
                  });
    }
    return points;
  }

  var addGroup = function (points, data, K) {
    var groups = [];
    for(var i = 0; i < K; i++) {
      groups.push([]);
    }

    var p, mindis;
    for(var i = 0; i < data.length; i++) {
      p = 0;
      mindis = getDistance(data[i], points[0]);
      for(var j = 1; j < K; j++) {
        var dis = getDistance(data[i], points[j]);
        if (getDistance(data[i], points[j]) < mindis) {
          p = j;
        }
      }
      groups[p].push(data[i]);
    }

    return groups;
  }

  var isSame = function (l1, l2) {
    for(var i = 0; i < l1.length; i++) {
      if (l1[i] !== l2[i]) return false;
    }
    return true;
  }

  var initList= function(length) {
    var list = [];
    for(var i = 0; i < length; i++)
      list.push([]);
    return list;
  }

  var hasEmptyGroup = function(groups) {
    for(var i = 0; i < groups.length; i++) {
      if(groups[i].length === 0){
        return true;
      }
    }
    return false;
  }

  var points = initPoint(this.data, this.K);
  var nextpoints = initList(this.K);
  var groups;
  var time = 0;
  while(true) {
    groups = addGroup(points, this.data, this.K);
    if (hasEmptyGroup(groups)) {
      points = initPoint(this.data, this.K);
      continue;
    }
    for(var i = 0 ; i < this.K; i++) {
      nextpoints[i] = getMiddle(groups[i], this.formula);
    }
    if (isSame(points, nextpoints)) break;
    points = nextpoints;
    if (maxtime != undefined) {
      if (time >= maxtime) break;
    }

  }

  return [points, groups];
};