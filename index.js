
const Matrix = {
  /**
   * 获取行
   * @param {Array []} matrix 矩阵
   * @param {Number} rowIndex 行索引
   */
  row (matrix, rowIndex) {
    return [...matrix[rowIndex]]
  },

  /**
   * 获取列
   * @param {Array []} matrix 矩阵
   * @param {Number} collumnIndex 列索引
   */
  col (matrix, collumnIndex) {
    return matrix.map(r => r[collumnIndex])
  },

  /**
   * 矩阵相乘
   * @param {Array []} matrix1 矩阵1
   * @param {Array []} matrix2 矩阵2
   */
  multi (matrix1, matrix2) {
    let r = matrix1.length
    let c = matrix2[0].length
    let res = []
    
    for (let i = 0; i < r; i++) {
      res.push([])
      for (let j = 0; j < c; j++) {
        res[i][j] = this._rc(this.row(matrix1, i), this.col(matrix2, j))
      }
    }
    return res
  },

  /**
   * 拼接矩阵
   * @param {*} matrix1 矩阵1
   * @param {*} matrix2 矩阵2
   */
  concat (matrix1, matrix2) {
    var res = []
    matrix1.forEach((r, i) => res.push([...r, ...matrix2[i]]))
    return res
  },

  /**
   * 矩阵截取片段
   * @param {Array []} matrix 
   * @param {Number} startRowIndex 起始行 
   * @param {Number} startCollumnIndex 起始列 
   * @param {Number} rowNum 行数
   * @param {Number} collumnNum 列数
   */
  slice (matrix, startRowIndex, startCollumnIndex, rowNum, collumnNum) {
    startRowIndex = 
      startRowIndex < 0 ? matrix.length + startRowIndex :
      startRowIndex === undefined ? 0 : startRowIndex
    startCollumnIndex = 
      startCollumnIndex < 0 ? matrix.length + startCollumnIndex :
      startCollumnIndex === undefined ? 0 : startCollumnIndex
    const r = rowNum !== undefined ? Math.min(startRowIndex + rowNum, matrix.length) : matrix.length
    const c = collumnNum !== undefined ? Math.min(startCollumnIndex + collumnNum, matrix[0].length): matrix[0].length
    var res = []
    for (let index = startRowIndex; index < r; index++) {
      res.push(matrix[index].slice(startCollumnIndex, c))
    }
    return res
  },

  /**
   * 获取单位矩阵
   * @param {Number} rank 矩阵阶数
   */
  E (rank) {
    var res = []
    for (let i = 0; i < rank; i++) {
      res.push([])
      for (let j = 0; j < rank; j++) {
        res[i][j] = i === j ? 1 : 0
      }
    }
    return res
  },

  /**
   * 获取转置矩阵
   * @param {Array []} matrix 方阵
   */
  T (matrix) {
    var res = []
    var c = matrix[0].length
    for (let i = 0; i < c; i++) {
      res.push(this.col(matrix, i))
    }
    return res
  },

  /**
   * 逆矩阵
   * @param {Array []} matrix 矩阵
   */
  reverse (matrix) {
    if (this.R(matrix) < matrix.length) return null
    let res = this.concat(this.clone(matrix), this.E(matrix.length))
    let RS = this.RS(res)
    return this.slice(RS, 0, matrix[0].length)
  },
  
  /**
   * 判断是否为行阶梯矩阵
   * @param {Array []} matrix 矩阵
   */
  isRE (matrix) {
    let firstZeroItemIndex = -1;
    let boo = true

    matrix.forEach(row => {
      let index = this._getFirstNotZeroItemIndex(row)
      if (index <= firstZeroItemIndex) return boo = false
      firstZeroItemIndex = index
    })

    return boo
  },

  /**
   * 获取行阶梯矩阵
   * @param {Array []} matrix 矩阵
   */
  RE (matrix) {
    matrix = this.clone(matrix)

    let r = 0
    const fn = () => {
      this._SortRowByFirstNotZeroItemIndex(matrix)
      let firstNotZeroIndex = this._getFirstNotZeroItemIndex(matrix[r])
      if (firstNotZeroIndex === -1) return
      let firstItem = this._getFirstNotZeroItem(matrix[r])
      for (let i = r + 1; i < matrix.length; i++) {
        let row = matrix[i]
        if (row[firstNotZeroIndex]) {
          let n = row[firstNotZeroIndex]
          this._kr(row, -firstItem / n)
          this._addr(row, matrix[r])
        }
      }
      
      if (!this.isRE(matrix)) {
        r++
        fn()
      }
    }
    fn()

    return matrix
  },

  /**
   * 判断是不是行最简单矩阵
   * @param {Array []} matrix 矩阵
   */
  isRS (matrix) {
    let firstZeroItemIndex = -1;
    let boo = true

    matrix.forEach(row => {
      let item = this._getFirstNotZeroItem(row)
      if (item !== null && item !== 1) return boo = false

      let index = this._getFirstNotZeroItemIndex(row)
      if (index <= firstZeroItemIndex) return boo = false
      firstZeroItemIndex = index

      if (this._getNotZeroItemNum(row) > 1) return boo = false
    })

    return boo
  },

  /**
   * 获取行最简矩阵
   * @param {Array []} matrix 矩阵
   */
  RS (matrix) {
    matrix = this.RE(matrix)
    let r = matrix.length
    while (r--) {
      let index = this._getFirstNotZeroItemIndex(matrix[r])
      if (index !== -1) {
        let n = this._getFirstNotZeroItem(matrix[r])
        if (n !== 1) {
          this._kr(matrix[r], 1 / n)
        }
        
        for (let i = 0; i < r; i++) {
          if (matrix[i][index]) {
            this._rAddKc(matrix[i], matrix[r], -matrix[i][index])
          }
        }
      }
    }
    return matrix
  },

  /**
   * 矩阵的秩
   * @param {Array []} matrix 矩阵
   */
  R (matrix) {
    let r = 0
    matrix = this.RE(matrix)
    matrix.forEach(row => {
      if (this._getFirstNotZeroItem(row)) {
        r++
      }
    })

    return r
  },

  /**
   * 克隆矩阵
   * @param {Array []} matrix 矩阵
   */
  clone (matrix) {
    var res = []
    for (let i = 0; i < matrix.length; i++) {
      res.push(this.row(matrix, i))
    }
    return res
  },
  
  /**
   * 根据非零首元的索引进行行排列
   * @param {Array []} matrix 矩阵
   */
  _SortRowByFirstNotZeroItemIndex (matrix) {
    return matrix.sort((a, b) => this._getFirstNotZeroItemIndex(a) - this._getFirstNotZeroItemIndex(b))
  },

  /**
   * 获取非零首元
   * @param {Array} row 矩阵行向量
   */
  _getFirstNotZeroItem (row) {
    var n = null
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0) {
        n = row[i]
        break
      }
    }

    return n
  },

  /**
   * 获取非零首元的下标
   * @param {Array} row 矩阵行向量
   */
  _getFirstNotZeroItemIndex (row) {
    var index = -1
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0) {
        index = i
        break
      }
    }

    return index
  },

  /**
   * 获取非零元个数
   * @param {Array} row 矩阵
   */
  _getNotZeroItemNum (row) {
    return row.reduce((res, n) => {
      res += n !== 0 ? 1 : 0
    }, 0)
  },

  /**
   * 行列相乘
   * @param {Array} row 行向量
   * @param {Array} col 列向量
   */
  _rc (row, col) {
    let res = 0
    row.forEach((n, i) => {
      res += n * col[i]
    })
    return res
  },

  /**
   * 初等行变换 k * ri
   * @param {Array} row 行向量
   * @param {Number} k 常数
   */
  _kr (row, k) {
    row.forEach((n, i) => row[i] = n * k)
    return row
  },
  /**
   * 初等行变换 ri + rj
   * @param {Array} row1 要变换的行向量
   * @param {Array} row2 行向量2
   */
  _addr (row1, row2) {
    row1.forEach((n, i) => row1[i] = n + row2[i] )
    return row1
  },
  /**
   * 初等行变换 ri + k * rj
   * @param {Array} 要变换的行向量 
   * @param {Array} 行向量2 
   * @param {Number} k 常数 
   */
  _rAddKc (row1, row2, k) {
    row1.forEach((n, i) => row1[i] = n + row2[i] * k )
    return row1
  }
}


/***************** test 测试代码 *****************/
const m = [
  [1, 2],
  [3, 4]
]

const log = m => {
  var str = ''
  m.forEach(r => {
    str += `\n  [${r.join(', ')}]`
  })
  console.log(`[${str}\n]`)
}

log(Matrix.clone(m))
log(Matrix.reverse(m))
log(Matrix.multi(Matrix.reverse(m), m))