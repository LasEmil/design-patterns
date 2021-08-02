{
  /**
	#  Use the Facade pattern when you need to have a limited but straightforward
	interface to a complex subsystem.
 */
}
import path from "path";
import sharp from "sharp";

export const Facade = (): void => {
  class ImageConverterToPng {
    async convert(fileName: string, size: number): Promise<Buffer> {
      try {
        const convertedImage = await sharp(path.join(__dirname, fileName))
          .resize(size)
          .png()
          .toBuffer();

        return convertedImage;
      } catch (err) {
        console.log(err);
      }
    }
  }

  class Application {
    async main() {
      const convertor = new ImageConverterToPng();
      const newImage = await convertor.convert("./image.jpeg", 200);
      console.log(newImage.toString("hex").match(/../g).join(" "));
    }
  }

  new Application().main();
};
