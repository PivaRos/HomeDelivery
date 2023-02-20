var points = {
    "point1": {
    "x":32.4454248,
    "y":34.895778
},

"point2":{
    "x":32.445352,
    "y":34.890639
}
}
var dy = points.point1.y - points.point2.y
var dx = points.point1.x - points.point2.x

var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))*110.574;
console.log(Math.round(distance*1000)+ "m");