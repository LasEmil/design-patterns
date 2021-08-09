export const Visitor = (): void => {
  interface Shape {
    move(x: number, y: number): void;
    draw(): void;
    accept(v: Visitor): void;
  }

  class Dot implements Shape {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    draw() {
      console.log(`Drawing Dot at ${this.x}, ${this.y}`);
    }
    accept(v: Visitor) {
      v.visitDot(this);
    }
  }
  class Circle implements Shape {
    x: number;
    y: number;
    radius: number;
    constructor(x: number, y: number, radius: number) {
      this.x = x;
      this.y = y;
      this.radius = radius;
    }

    move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw() {
      console.log(
        `Drawing Circle at ${this.x}, ${this.y} with radius ${this.radius}`
      );
    }
    accept(v: Visitor) {
      v.visitCircle(this);
    }
  }
  class Rectangle implements Shape {
    x: number;
    y: number;
    l: number;
    w: number;
    constructor(x: number, y: number, l: number, w: number) {
      this.x = x;
      this.y = y;
      this.l = l;
      this.w = w;
    }
    move(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    draw() {
      console.log(
        `Drawing Rectangle at ${this.x}, ${this.y} with size ${this.l}x${this.w}`
      );
    }
    accept(v: Visitor) {
      v.visitRectangle(this);
    }
  }
  interface Visitor {
    visitDot(d: Dot): void;
    visitCircle(c: Circle): void;
    visitRectangle(r: Rectangle): void;
  }

  class XMLExportVisitor implements Visitor {
    visitDot(d: Dot) {
      console.log(`Exporting dot: `);
      console.log(d);
    }
    visitCircle(c: Circle) {
      console.log(`Exporting Circle: `);
      console.log(c);
    }
    visitRectangle(r: Rectangle) {
      console.log(`Exporting Rectangle: `);
      console.log(r);
    }
  }

  class Application {
    allShapes: Shape[];
    constructor() {
      this.allShapes = [
        new Dot(1, 2),
        new Dot(2, 5),
        new Circle(1, 5, 12),
        new Rectangle(12, 3, 12, 5),
      ];
    }
    export() {
      const exportVisitor = new XMLExportVisitor();
      this.allShapes.forEach((shape) => {
        shape.accept(exportVisitor);
      });
    }
  }
  const app = new Application();
  app.export();
};
