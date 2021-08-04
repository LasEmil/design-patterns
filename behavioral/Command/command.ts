export const Command = (): void => {
  abstract class Command {
    protected app: Application;
    protected editor: Editor;
    protected backup: string;

    constructor(app: Application, editor: Editor) {
      this.app = app;
      this.editor = editor;
    }

    saveBackup() {
      this.backup = this.editor.text;
    }
    undo() {
      this.editor.text = this.backup;
    }

    abstract execute(): boolean;
  }

  class CopyCommand extends Command {
    execute() {
      this.app.clipboard = this.editor.getSelection();
      return false;
    }
  }

  class CutCommand extends Command {
    execute() {
      this.saveBackup();
      this.app.clipboard = this.editor.getSelection();
      this.editor.deleteSelection();
      return true;
    }
  }
  class PasteCommand extends Command {
    execute() {
      this.saveBackup();
      this.editor.replaceSelection(this.app.clipboard);
      return true;
    }
  }
  class UndoCommand extends Command {
    execute() {
      this.app.undo();
      return false;
    }
  }
  class CommandHistory {
    private history: Command[];

    push(c: Command) {
      this.history.push(c);
    }
    pop(): Command {
      return this.history.pop();
    }
  }

  class Editor {
    text: string;

    getSelection() {
      console.log("get selection");
      return "The selection";
    }
    deleteSelection() {
      console.log("delete selection");
    }
    replaceSelection(s: string) {
      console.log(s, "replace selection");
    }
  }

  class Button {
    command: () => void;
    setCommand(fn: () => void) {
      this.command = fn;
    }
    click() {
      this.command();
    }
  }

  class Shortcuts {
    commands: Record<string, () => void>;
    keysPressed: string;
    onKeyPress(keys: string, command: () => void) {
      this.commands = { ...this.commands, [keys]: command };
    }
    listen() {
      // here it should listen for the keys and run the command
    }
  }
  class Application {
    clipboard: string;
    editors: Editor[];
    activeEditor: Editor;
    history: CommandHistory;
    createUI() {
      const copyButton = new Button();
      const cutButton = new Button();
      const pasteButton = new Button();
      const undoButton = new Button();
      const shortcuts = new Shortcuts();
      const copy = () => {
        this.executeCommand(new CopyCommand(this, this.activeEditor));
      };
      copyButton.setCommand(copy);
      shortcuts.onKeyPress("Ctrl+C", copy);

      const cut = () => {
        this.executeCommand(new CutCommand(this, this.activeEditor));
      };
      cutButton.setCommand(cut);
      shortcuts.onKeyPress("Ctrl+X", cut);

      const paste = () => {
        this.executeCommand(new PasteCommand(this, this.activeEditor));
      };
      pasteButton.setCommand(paste);
      shortcuts.onKeyPress("Ctrl+V", paste);

      const undo = () => {
        this.executeCommand(new UndoCommand(this, this.activeEditor));
      };
      undoButton.setCommand(undo);
      shortcuts.onKeyPress("Ctrl+Z", undo);
    }
    executeCommand(command: Command) {
      if (command.execute) {
        this.history.push(command);
      }
    }
    undo() {
      const command = this.history.pop();
      if (command != null) {
        command.undo();
      }
    }
  }
  const app = new Application();
  app.createUI();
};
