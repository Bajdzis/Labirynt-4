class FadeAnimation {
  private transitionClass: string = "fade";
  private fadeInClass: string = "fade-in";
  private fadeOutClass: string = "fade-out";

  fadeOut(id: string): Promise<void> {
    return this.animate(id, this.fadeOutClass);
  }

  fadeIn(id: string): Promise<void> {
    return this.animate(id, this.fadeInClass);
  }

  prepare(id: string, currentStatus: "visible" | "unVisible"): void {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    element.classList.remove(this.transitionClass);
    element.classList.remove(this.fadeInClass);
    element.classList.remove(this.fadeOutClass);
    element.classList.add(
      currentStatus === "visible" ? this.fadeInClass : this.fadeOutClass,
    );
    element.classList.add(this.transitionClass);
  }

  private animate(id: string, className: string): Promise<void> {
    const element = document.getElementById(id);
    if (!element) {
      return Promise.reject();
    }

    return new Promise((resolve) => {
      const handler = () => {
        resolve();
        element.removeEventListener("transitionend", handler);
      };
      element.addEventListener("transitionend", handler);
      element.classList.remove(this.fadeInClass);
      element.classList.remove(this.fadeOutClass);
      element.classList.add(this.transitionClass);
      element.classList.add(className);
    });
  }
}

export const fadeAnimation = new FadeAnimation();
