export const TemplateMethod = (): void => {
  class Structure {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    collect() {
      console.log(`Collecting resources from Structure: ${this.name}`);
    }
  }
  class Enemy {
    position: number[];
    constructor(x: number, y: number) {
      this.position = [x, y];
    }
  }
  class Map {
    w: number;
    l: number;
    private static instance: Map;
    private constructor(w: number, l: number) {
      this.w = w;
      this.l = l;
    }
    public getCenter() {
      const centerX = this.w / 2;
      const centerY = this.l / 2;
      return [centerX, centerY];
    }
    public static getInstance() {
      if (Map.instance === undefined) {
        Map.instance = new Map(120, 120);
      }
      return Map.instance;
    }
  }

  abstract class GameAI {
    builtStructures: Structure[];
    turn() {
      this.collectResources();
      this.buildStructures();
      this.buildUnits();
      this.attack();
    }
    collectResources() {
      this.builtStructures.forEach((structure) => {
        structure.collect();
      });
    }
    abstract buildStructures(): void;
    abstract buildUnits(): void;
    attack() {
      const enemy = this.getClosestEnemy();
      if (enemy == null) {
        this.sendScouts(Map.getInstance().getCenter());
      } else {
        this.sendWarriors(enemy.position);
      }
    }
    getClosestEnemy() {
      return new Enemy(5, 6);
    }
    abstract sendScouts?(position: number[]): void;
    abstract sendWarriors?(position: number[]): void;
  }

  class OrcsAI extends GameAI {
    buildStructures() {
      console.log(`Building orc Structures`);
    }
    buildUnits() {
      console.log(`Building Orc units`);
    }
    sendScouts(position: number[]) {
      console.log(`Sending orc scouts at ${position}`);
    }
    sendWarriors(position: number[]) {
      console.log(`Sending orc warriors to ${position}`);
    }
  }

  class MonstersAI extends GameAI {
    collectResources() {
      console.log(`Monsters don't collect resources`);
    }
    buildStructures() {
      console.log("Monsters don't build structures");
    }
    buildUnits() {
      console.log(`Monsters don't build units`);
    }
    sendScouts() {
      undefined;
    }
    sendWarriors() {
      undefined;
    }
  }
};
