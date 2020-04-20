var Matrix = require('./index')

var m1 = [
  [1, 2, 3]
]

var m2 = [
  [3],
  [2],
  [1]
]

var m3 = [
  [1],
  [2],
  [1]
]

var m4 = [
  [1, 2],
  [3, 4]
]
console.log(Matrix.T(m1))           // [[1], [2], [3]]
console.log(Matrix.add(m2, m3))     // [[4], [4], [2]]
console.log(Matrix.deduce(m2, m3))  // [[1], [0], [0]]
console.log(Matrix.numMulti(m1, 2)) // [[2, 4, 6]]
console.log(Matrix.power(m4, 2))    // [[7, 10], [15, 22]]