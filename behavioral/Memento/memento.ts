export const Memento = (): void => {
  class Editor {
    private text: string;
    private curX: number;
    private curY: number;
    private selectionWidth: number;
    setText(text: string) {
      this.text = text;
      return this;
    }
    setCursor(x: number, y: number) {
      this.curX = x;
      this.curY = y;
      return this;
    }
    setSelectionWidth(width: number) {
      this.selectionWidth = width;
      return this;
    }
    createSnapshot(): Snapshot {
      return new Snapshot(
        this,
        this.text,
        this.curX,
        this.curY,
        this.selectionWidth
      );
    }
  }
  class Snapshot {
    private editor: Editor;
    private text: string;
    private curX: number;
    private curY: number;
    private selectionWidth: number;
    constructor(
      editor: Editor,
      text: string,
      curX: number,
      curY: number,
      selectionWidth: number
    ) {
      this.editor = editor;
      this.text = text;
      this.curX = curX;
      this.curY = curY;
      this.selectionWidth = selectionWidth;
    }

    restore() {
      this.editor.setText(this.text);
      this.editor.setCursor(this.curX, this.curY);
      this.editor.setSelectionWidth(this.selectionWidth);
    }
  }
  abstract class Command {
    private backup: Snapshot[];
    editor: Editor;
    constructor(editor: Editor) {
      this.backup = [];
      this.editor = editor;
    }
    makeBackup() {
      console.log("Making a backup");
      this.backup.push(this.editor.createSnapshot());
      console.log(this.backup);
    }
    undo() {
      if (this.backup.length) {
        this.backup.pop().restore();
      }
    }
    abstract execute(): Command;
  }
  class TypeCommand extends Command {
    text: string;
    constructor(editor: Editor, text: string) {
      super(editor);
      this.text = text;
    }
    execute() {
      this.makeBackup();
      this.editor.setText(this.text);
      return this;
    }
  }
  const editor = new Editor()
    .setCursor(12, 22)
    .setText("Nobody")
    .setSelectionWidth(3);
  const typeCommand = new TypeCommand(editor, "something").execute();
  const typeCommand2 = new TypeCommand(editor, "trolololo").execute();
  typeCommand2.undo();
  console.log(editor);
};
