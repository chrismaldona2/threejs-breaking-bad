class InstructionBanner {
  container: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("instruction_banner");

    const fullscreenMsg = document.createElement("span");
    const tweaksMsg = document.createElement("span");

    fullscreenMsg.innerText = "F → Toggle fullscreen";
    tweaksMsg.innerText = "H → Toggle tweaks panel";

    const codeLink = document.createElement("a");
    codeLink.classList.add("instruction_banner__link");
    codeLink.href = "https://github.com/chrismaldona2/threejs-breaking-bad.git";
    codeLink.target = "_blank";
    codeLink.innerText = "Source Code";

    /* MOUNT */
    this.container.append(fullscreenMsg, tweaksMsg, codeLink);
    document.body.appendChild(this.container);
  }

  destroy() {
    this.container.remove();
  }
}
export default InstructionBanner;
