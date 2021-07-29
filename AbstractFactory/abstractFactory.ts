{
  /**
	# Abstract Factory is a creational design pattern that lets you produce families
	of related objects without specifying their concrete classes.

	## What problem does it solve?
	It solves the problem of creating incompatible families of Objects

	## How does it solve the problem?
	It suggests createing an interface with a list of methods for all products
	that are part of the same product family. These methods must return abstract
	product types represented by the interfaces
	For each variant in the product family, we create a spearate factory class based
	on AbstractFactory interface, this is a factory that returns products of particular
	kind. Now Client doesn't have to be aware of the factory class, nor does it matter
	what kind of product it gets, the client treats all in the same manner
*/
}
export const AbstractFactory = (): void => {
  interface Button {
    paint: () => string;
  }

  class MaterialButton implements Button {
    paint() {
      console.log("Material button is build");
      return "MaterialButton";
    }
  }
  class CupertinoButton implements Button {
    paint() {
      console.log("Cupertino Button is build!");
      return "CupertinoButton";
    }
  }
  interface Checkbox {
    paint: () => string;
  }

  class MaterialCheckbox implements Button {
    paint() {
      return "MaterialCheckbox";
    }
  }
  class CupertinoCheckbox implements Button {
    paint() {
      return "CupertinoCheckbox";
    }
  }
  interface GUIFactory {
    createButton(): Button;
    createCheckbox(): Checkbox;
  }

  class MaterialFactory implements GUIFactory {
    createButton() {
      return new MaterialButton();
    }
    createCheckbox() {
      return new MaterialCheckbox();
    }
  }

  class CupertinoFactory implements GUIFactory {
    createButton() {
      return new CupertinoButton();
    }
    createCheckbox() {
      return new CupertinoCheckbox();
    }
  }
  enum DEVICES {
    android,
    ios,
  }
  const config = {
    OS: DEVICES.android,
  };
  class Application {
    private factory: GUIFactory;
    private button: Button;
    constructor(factory: GUIFactory) {
      this.factory = factory;
    }
    createUI() {
      this.button = this.factory.createButton();
    }
    paint() {
      this.button.paint();
    }
  }
  class AppConfig {
    factory: GUIFactory;
    app: Application;
    main() {
      if (config.OS === DEVICES.android) {
        this.factory = new MaterialFactory();
      } else if (config.OS === DEVICES.ios) {
        this.factory = new CupertinoFactory();
      } else {
        throw new Error("Error! Unknown operating system!");
      }

      this.app = new Application(this.factory);
      this.app.createUI();
      this.app.paint();
    }
  }
  const app = new AppConfig().main();
};
