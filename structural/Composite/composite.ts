export const Composite = (): void => {
  interface Structure {
    open: () => string | Structure[];
    getSize: () => number;
  }

  class FileStructure implements Structure {
    name: string;
    content: string;
    createdAt: Date;
    size: number;
    constructor(name: string, content: string) {
      this.name = name;
      this.content = content;
      this.createdAt = new Date();
      this.size = new TextEncoder().encode(this.content).length;
    }
    open() {
      return this.content;
    }
    getSize() {
      return this.size;
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
    getSize() {
      const childrenSizes = this.children.map((child) => child.getSize());
      return childrenSizes.reduce((prev, curr) => prev + curr);
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
      const websiteFolder = new FolderStructure("website");
      websiteFolder.add(
        new FileStructure("index.js", 'console.log("Composite design pattern")')
      );

      websiteFolder.add(
        new FileStructure("styles.css", ".body{display: none}")
      );
      projectsFolder.add(websiteFolder);
      this.files.add(projectsFolder);
      return this;
    }
    openAll() {
      return this.files.open();
    }
    getUsedSize() {
      return this.files.getSize();
    }
  }
  const app = new Application().load();
  const finalTree = app.openAll();
  console.log(JSON.stringify(finalTree, null, 4));
  const usedSize = app.getUsedSize();
  console.log({ usedSize });
};
