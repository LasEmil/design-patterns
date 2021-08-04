export const Mediator = (): void => {
  interface Mediator {
    notify(sender: Component, event: string): void;
  }
  class Component {
    dialog: Mediator;
    constructor(dialog: Mediator) {
      this.dialog = dialog;
    }
    click() {
      this.dialog.notify(this, "click");
    }
    keyPress() {
      this.dialog.notify(this, "keyPress");
    }
  }
  class TextBox extends Component {}
  class Button extends Component {
    click() {
      this.dialog.notify(this, "click");
    }
  }
  class Checkbox extends Component {
    checked: boolean;
    constructor(dialog: Mediator) {
      super(dialog);
      this.checked = false;
    }
    check() {
      this.checked = !this.checked;
      this.dialog.notify(this, "check");
    }
  }
  class AuthenticationDialog implements Mediator {
    private title: string;
    loginOrRegisterChkBx: Checkbox;
    private loginUsername: TextBox;
    private loginPassword: TextBox;
    private registrationUsername: TextBox;
    private registrationPassword: TextBox;
    private registrationEmail: TextBox;
    okButton: Button;
    private cancelButton: Button;

    constructor() {
      this.title = "Register or login";
      this.loginOrRegisterChkBx = new Checkbox(this);
      this.loginUsername = new TextBox(this);
      this.loginPassword = new TextBox(this);
      this.registrationUsername = new TextBox(this);
      this.registrationPassword = new TextBox(this);
      this.registrationEmail = new TextBox(this);
      this.okButton = new Button(this);
      this.cancelButton = new Button(this);
    }
    notify(sender: Component, event: string) {
      if (sender === this.loginOrRegisterChkBx && event === "check") {
        if (this.loginOrRegisterChkBx.checked) {
          this.title = "Log in";
        } else {
          this.title = "Register";
        }
        console.log(this.title);
      }
      if (sender === this.okButton && event === "click") {
        if (this.loginOrRegisterChkBx.checked) {
          console.log("Try login user");
        } else {
          console.log("Create user and login user");
        }
      }
    }
  }
  const dialog = new AuthenticationDialog();
  dialog.loginOrRegisterChkBx.check();
  dialog.loginOrRegisterChkBx.check();
  // dialog.loginOrRegisterChkBx.check();
  dialog.okButton.click();
};
