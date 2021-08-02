{
  /**
  # Factory Method is a creational design pattern that provides an interface for
  creating objects in a superclass, but allows subclasses to alter the type of 
  objects that will be created.

  ## What problem does it solve?
  It solves the problem where the one class is tightly copuled with application
  bussiness logic and this makes difficult to add or remove another classes
  with similar fucntionalities

  ## How does it solve the problem?
  Instead of directly constructing objects we are calling a special factory
  method
*/
}

export const Factory = (): void => {
  const BUTTON_TYPES = {
    rounded: "rounded",
    squared: "squared",
  };
  const VARIANT = BUTTON_TYPES.squared;
  type Button = {
    onClick: (func: (event: Event) => void) => void;
    render: () => string;
  };

  class SquaredButton implements Button {
    render() {
      return "SquaredButton";
    }
    onClick(f) {
      f();
    }
  }

  class RoundedButton implements Button {
    render() {
      return "RoundedButton";
    }
    onClick(f) {
      f();
    }
  }
  abstract class Dialog {
    abstract createButton(): Button;

    render() {
      const okButton = this.createButton();
      okButton.onClick(() => console.log("close dialog"));
      const buttonResult = okButton.render();
      console.log(buttonResult);
    }
  }

  class SquaredDialog extends Dialog {
    createButton() {
      return new SquaredButton();
    }
  }

  class RoundedDialog extends Dialog {
    createButton() {
      return new RoundedButton();
    }
  }

  class Application {
    dialog: Dialog;
    init() {
      if (VARIANT == `squared`) {
        this.dialog = new SquaredDialog();
      } else if (VARIANT == `rounded`) {
        this.dialog = new RoundedDialog();
      } else {
        throw new Error("Error! Unknown Dialog type");
      }
    }
    main() {
      this.init();
      this.dialog.render();
    }
  }

  const app = new Application().main();
};
