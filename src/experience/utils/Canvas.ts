class Canvas {
  domElement: HTMLCanvasElement;
  constructor() {
    this.domElement = document.createElement("canvas");
    this.domElement.id = "webgl_canvas";
    this.domElement.style.cssText = `
      appearance: none;
      user-select: none;
      outline: none;
      position: fixed;
      top: 0;
      left: 0;
    `;
    document.body.appendChild(this.domElement);
  }

  destroy() {
    this.domElement.remove();
  }
}

export default Canvas;
