function Matrix () {}

// 获取矩阵的元
Matrix.getItem = function (m, i, j) {
  return m[i][j]
}

// 获取矩阵的转置
Matrix.T = function (m) {
  var res = []
  var r = m.length
  var c = m[0].length

  for (var i = 0; i < c; i++) {
    res.push([])
    for(var j = 0; j < r; j++) {
      res[i].push(m[j][i])
    }
  }

  return res
}

// 矩阵相加
Matrix.add = function (m1, m2) {
  m1.forEach((r, i) => {
    r.forEach((c, j) => {
      m1[i][j] = c + m2[i][j]
    })
  })

  return m1
}

// 矩阵相减
Matrix.deduce = function (m1, m2) {
  m1.forEach((r, i) => {
    r.forEach((c, j) => {
      m1[i][j] = c - m2[i][j]
    })
  })

  return m1
}

// 数乘矩阵
Matrix.numMulti = function (m, n) {
  m.forEach((r, i) => {
    r.forEach((c, j) => m[i][j] = c * n)
  })

  return m
}

// 矩阵相乘
Matrix.multi = function (m1, m2) {
  var r = m1.length;
  var s = m2.length;
  var c = m2[0].length;
  var res = []

  for (var i = 0; i < r; i++) {
    res.push([])
    for (var j = 0; j < c; j++) {
      var sum = 0
      for (var p = 0; p < s; p++) {
        sum += m1[i][p] * m2[p][j]
      }
      res[i].push(sum) 
    }
  }

  return res
}

// 矩阵的幂
Matrix.power = function (m, n) {
  var res = this.copy(m)

  while (--n) {
    res = this.multi(m, m)
  }

  return res
}

// 拷贝矩阵
Matrix.copy = function (m) {
  var res = []

  for (var i = 0; i < m.length; i++) {
    res.push([])
    for(var j = 0; j < m[1].length; j++) {
      res[i].push(m[i][j])
    }
  }

  return res
}

// 单位矩阵
Matrix.E = function (n) {
  var res = []

  for(var i = 0; i < n; i++) {
    res.push([])
    for (var j = 0; j < n; j++) {
      res[i].push(i === j ? 1 : 0)
    }
  }

  return res
}

module.exports = Matrix