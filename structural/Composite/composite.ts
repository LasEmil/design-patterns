export const Composite = (): void => {
  interface Structure {
    open: () => string | Structure[];
  }

  class FileStructure implements Structure {
    name: string;
    content: string;
    createdAt: Date;
    constructor(name: string, content: string) {
      this.name = name;
      this.content = content;
      this.createdAt = new Date();
    }
    open() {
      return this.content;
    }
  }

  class FolderStructure implements Structure {
    children: Structure[];
    name: string;
    createdAt: Date;
    constructor(name: string) {
      this.children = [];
      this.name = name;
      this.createdAt = new Date();
    }
    add(child: Structure) {
      this.children = [...this.children, child];
    }
    remove(child: Structure) {
      this.children = this.children.filter((item) => {
        item !== child;
      });
    }
    open() {
      this.children.forEach((child) => {
        const childContents = child.open();
        console.log({ childContents });
      });
      return this.children;
    }
  }

  class Application {
    files: FolderStructure;
    load() {
      this.files = new FolderStructure("system");
      this.files.add(new FileStructure("image.png", "fancy cat image"));
      const musicFolder = new FolderStructure("music");
      musicFolder.add(new FileStructure("Wonderwall.mp3", "Wonderwall music"));
      this.files.add(musicFolder);
      const projectsFolder = new FolderStructure("github");
      projectsFolder.add(new FileStructure("index.js", "eval(2+2)"));
      this.files.add(projectsFolder);
      return this;
    }
    openAll() {
      return this.files.open();
    }
  }
  const app = new Application().load();
  const finalTree = app.openAll();
  console.log(JSON.stringify(finalTree, null, 4));
};
