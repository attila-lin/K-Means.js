var kmeans = require("./lib/kmeans");

var km = new kmeans();
km.setK(2);
km.setFormula('Euclidean');
// if you want to set the Formula of caculate the middle distance,
// you should also set the λ
// e.g.
//      km.setFormula('Minkowski', 3);

km.train([[1,1], [1.5,2], [3,4], [5,7], [3.5, 5.0], [4.5, 5.0], [3.5, 4.5]]);


// maxtime = 100000
var output = km.run(100000);
// return e.g.
//        [ { x: 3.9, y: 5.1 }, { x: 1.25, y: 1.5 } ]

console.log(JSON.stringify(output));