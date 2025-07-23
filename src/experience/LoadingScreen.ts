import { animate } from "motion";
import Experience from "./Experience";

const CLASS_NAMES = {
  container: "loader_container",
  loader: "loader",
  text: "loader_text",
  progressBarContainer: "progressbar_container",
  progressBar: "progressbar",
  disclaimer: "disclaimer",
} as const;

class LoadingScreen {
  private readonly resources = Experience.getInstance().resources;
  private container: HTMLDivElement;
  private loader: HTMLDivElement;
  private loading: HTMLSpanElement;
  private progressBarContainer: HTMLDivElement;
  private progressBar: HTMLDivElement;
  private disclaimer: HTMLParagraphElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add(CLASS_NAMES.container);

    this.loader = document.createElement("div");
    this.loader.classList.add(CLASS_NAMES.loader);

    this.loading = document.createElement("span");
    this.loading.classList.add(CLASS_NAMES.text);
    this.loading.innerText = "Loading";

    this.progressBarContainer = document.createElement("div");
    this.progressBarContainer.classList.add("progressbar_container");
    this.progressBarContainer.classList.add(CLASS_NAMES.progressBarContainer);

    this.progressBar = document.createElement("div");
    this.progressBar.classList.add(CLASS_NAMES.progressBar);

    this.disclaimer = document.createElement("p");
    this.disclaimer.classList.add(CLASS_NAMES.text, CLASS_NAMES.disclaimer);
    this.disclaimer.innerText =
      "Non-commercial educational project. Not affiliated with any IP.";

    /* MOUNT */
    this.progressBarContainer.appendChild(this.progressBar);
    this.container.append(
      this.loader,
      this.loading,
      this.progressBarContainer,
      this.disclaimer
    );
    document.body.appendChild(this.container);

    /* ARIA */
    this.progressBarContainer.setAttribute("role", "progressbar");
    this.progressBarContainer.setAttribute("aria-valuemin", "0");
    this.progressBarContainer.setAttribute("aria-valuemax", "100");
    this.loading.setAttribute("role", "status");
    this.loading.setAttribute("aria-live", "polite");

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
