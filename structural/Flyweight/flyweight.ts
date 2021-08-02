{
  /**
	# Use the Flyweight pattern only when your program must support a huge number
	of objects which barely fit into available RAM.
*/
}
import { createCanvas, Image, NodeCanvasRenderingContext2D } from "canvas";
import color from "color";
import fs from "fs";
import path from "path";
import sharp from "sharp";
const CANVAS_SIZE = 2000;
function randomIntFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomRGB(): string {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    o(r() * s) +
    "," +
    r().toFixed(1) +
    ")"
  );
}
export const Flyweight = async (): Promise<void> => {
  const DOG_SPRITE = fs.readFileSync(path.join(__dirname, "sprite.png"));
  const initialMemoryUsage = process.memoryUsage();
  console.log({ initialMemoryUsage });
  const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  const ctx = canvas.getContext("2d");

  class DogType {
    name: string;
    color: string;
    texture: Buffer;

    constructor(name: string, color: string, texture: Buffer) {
      this.name = name;
      this.color = color;
      this.texture = texture;
    }
    async draw(
      canvas: NodeCanvasRenderingContext2D,
      x: number,
      y: number
    ): Promise<Image> {
      const tintedImage = await sharp(this.texture)
        .tint(color(this.color))
        .rotate(randomIntFromInterval(0, 360), {
          background: color("rgba(0, 0, 0, 0)"),
        })
        .toBuffer();
      const img = new Image();
      img.width = 39;
      img.height = 39;
      img.src = `data:image/png;base64,${Buffer.from(tintedImage).toString(
        "base64"
      )}`;
      canvas.drawImage(img, x, y);
      return img;
    }
  }

  class DogFactory {
    static dogTypes: DogType[];

    static getDogType(name: string, color: string, texture: Buffer) {
      if (!this.dogTypes) {
        this.dogTypes = [];
      }
      let type = this.dogTypes.find(
        (dog) =>
          dog.color == color && dog.name == name && dog.texture == texture
      );
      if (!type) {
        type = new DogType(name, color, texture);
        this.dogTypes.push(type);
        return type;
      }
    }
  }

  class Dog {
    x: number;
    y: number;
    type: DogType;
    constructor(x: number, y: number, type: DogType) {
      this.x = x;
      this.y = y;
      this.type = type;
    }
    async draw(canvas: NodeCanvasRenderingContext2D) {
      return await this.type.draw(canvas, this.x, this.y);
    }
  }

  class Pack {
    dogs: Dog[];

    addDog(x: number, y: number, name: string, color: string, texture: Buffer) {
      const type = DogFactory.getDogType(name, color, texture);
      const dog = new Dog(x, y, type);
      if (!this.dogs) {
        this.dogs = [];
      }
      this.dogs.push(dog);
    }
    async draw(canvas: NodeCanvasRenderingContext2D) {
      const promises = [];
      this.dogs.forEach(async (dog) => {
        promises.push(dog.draw(canvas));
      });
      return Promise.all(promises);
    }
  }

  // CLIENT
  class Application {
    pack: Pack;
    constructor(pack: Pack) {
      this.pack = pack;
    }
    addDogs(amount: number) {
      for (let i = 0; i < amount; i++) {
        this.pack.addDog(
          randomIntFromInterval(0, CANVAS_SIZE),
          randomIntFromInterval(0, CANVAS_SIZE),
          "Jon",
          randomRGB(),
          DOG_SPRITE
        );
      }
      return this;
    }
    async draw(ctx: NodeCanvasRenderingContext2D) {
      const drawn = await this.pack.draw(ctx);
      if (drawn) {
        const dataURL = canvas.toDataURL();
        const totalImage = new Image();
        totalImage.width = CANVAS_SIZE;
        totalImage.height = CANVAS_SIZE;
        totalImage.src = dataURL;
        const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

        fs.writeFileSync(
          path.join(__dirname, "output.png"),
          base64Data,
          "base64"
        );
        console.log("Image drawn");
      }
    }
  }
  const pack = new Pack();
  const app = new Application(pack);
  app.addDogs(200).draw(ctx);
  const finalMemoryUsage = process.memoryUsage();
  console.log({ finalMemoryUsage });
};
