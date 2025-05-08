import { animate } from "motion";
import Experience from "./Experience";

const CLASS_NAMES = {
  container: "loader_container",
  loader: "loader",
  text: "loader_text",
  progressBarContainer: "progressbar_container",
  progressBar: "progressbar",
} as const;

class LoadingScreen {
  private readonly resources = Experience.getInstance().resources;
  private container: HTMLDivElement;
  private loader: HTMLDivElement;
  private text: HTMLSpanElement;
  private progressBarContainer: HTMLDivElement;
  private progressBar: HTMLDivElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add(CLASS_NAMES.container);

    this.loader = document.createElement("div");
    this.loader.classList.add(CLASS_NAMES.loader);

    this.text = document.createElement("span");
    this.text.classList.add(CLASS_NAMES.text);
    this.text.innerText = "Loading";

    this.progressBarContainer = document.createElement("div");
    this.progressBarContainer.classList.add("progressbar_container");
    this.progressBarContainer.classList.add(CLASS_NAMES.progressBarContainer);

    this.progressBar = document.createElement("div");
    this.progressBar.classList.add(CLASS_NAMES.progressBar);

    /* MOUNT */
    this.progressBarContainer.appendChild(this.progressBar);
    this.container.append(this.loader, this.text, this.progressBarContainer);
    document.body.appendChild(this.container);

    /* ARIA */
    this.progressBarContainer.setAttribute("role", "progressbar");
    this.progressBarContainer.setAttribute("aria-valuemin", "0");
    this.progressBarContainer.setAttribute("aria-valuemax", "100");
    this.text.setAttribute("role", "status");
    this.text.setAttribute("aria-live", "polite");

    /* EVENTS */
    this.resources.on("fileLoaded", () => this.updateProgress());
    this.resources.on("loadFinish", () => this.destroy());
  }

  private updateProgress() {
    const progress = this.resources.loadProgress;

    const percent = Math.round(progress * 100);
    this.progressBarContainer.setAttribute("aria-valuenow", String(percent));

    this.progressBar.style.transform = `scaleX(${progress + 0.005})`;
  }

  destroy() {
    animate(
      this.container,
      { opacity: 0 },
      {
        duration: 1,
        ease: "easeInOut",
        delay: 0.6,
        onComplete: () => {
          this.container.remove();
        },
      }
    );
  }
}

export default LoadingScreen;
