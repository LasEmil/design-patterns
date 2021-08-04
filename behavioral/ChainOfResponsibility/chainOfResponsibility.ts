export const ChainOfResponsibility = (): void => {
  interface ComponentWithContextualHelp {
    showHelp: () => string;
  }
  abstract class Component implements ComponentWithContextualHelp {
    tooltipText: string;
    container: Container;
    setContainer(container: Container) {
      this.container = container;
      console.log({ container });
    }
    public showHelp() {
      if (!this.tooltipText) {
        return this.container.showHelp();
      } else {
        return this.tooltipText;
      }
    }
  }
  abstract class Container extends Component {
    protected children: Component[];
    constructor() {
      super();
      this.children = [];
    }
    add(child: Component) {
      child.setContainer(this);

      this.children.push(child);
    }
  }
  class Button extends Component {
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    constructor(x: number, y: number, w: number, h: number, text: string) {
      super();
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.text = text;
    }
  }

  class Panel extends Container {
    modalHelpText: string;
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number) {
      super();
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    showHelp() {
      if (this.modalHelpText !== undefined) {
        return this.modalHelpText;
      } else {
        return super.showHelp();
      }
    }
  }

  class Dialog extends Container {
    wikiPageURL: string;
    text: string;
    constructor(text: string) {
      super();
      console.log(super());
      this.text = text;
    }
    showHelp() {
      if (this.wikiPageURL !== undefined) {
        return this.wikiPageURL;
      } else {
        return super.showHelp();
      }
    }
  }
  class Application {
    finalComponent: Component;
    createUI() {
      const dialog = new Dialog("Budget reports");
      dialog.wikiPageURL = "http://...";
      const panel = new Panel(0, 0, 400, 800);
      panel.modalHelpText = "This panel does some stuff";
      const ok = new Button(320, 760, 50, 20, "OK");
      ok.tooltipText = "This is an OK button that does some amazing stuff";
      panel.add(ok);
      dialog.add(panel);
      this.finalComponent = ok;
      return this;
    }
    onF1KeyPress() {
      const component = this.finalComponent;
      return component.showHelp();
    }
  }
  const helpText = new Application().createUI().onF1KeyPress();
  console.log(helpText);
};
