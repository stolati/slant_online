
export default class ZoneDrawingHelper {

  constructor({ mapBorder, boxSize, circleSize }) {
    this._mapBorder = mapBorder
    this._boxSize = boxSize
    this.circleSize = circleSize

    //Should be accesible from outside
    this.gridBoxWidth = this._boxSize
    this.gridBoxHeight = this._boxSize
  }

  getViewBox(width, height){
    return {
      width: (width * this.gridBoxWidth) + (2*this._mapBorder),
      height: (height * this.gridBoxHeight) + (2*this._mapBorder),
    }
  }

  getHintPos(x, y) {
    return {
      x: x * this.gridBoxWidth + this._mapBorder,
      y: y * this.gridBoxHeight + this._mapBorder,
    }
  }

  gridTopLeftPos(x, y) {
    return this.getHintPos(x, y)
  }

  gridTopRightPos(x, y) {
    return this.getHintPos(x + 1, y)
  }

  gridBottomLeftPos(x, y) {
    return this.getHintPos(x, y + 1)
  }

  gridBottomRightPos(x, y) {
    return this.getHintPos(x + 1, y + 1)
  }

}
