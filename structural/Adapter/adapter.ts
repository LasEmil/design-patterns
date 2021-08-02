import { promises as fs } from "fs";
import path from "path";
export const Adapter = async (): Promise<void> => {
  class TranslationConsumer {
    translations: TranslationProvider;
    constructor(translations: TranslationProvider) {
      this.translations = translations;
    }
    async getTranslation(key: string) {
      const translationsContent = JSON.parse(
        await this.translations.sendTranslations()
      );
      const theTranslation = translationsContent[key] ?? key;
      return theTranslation;
    }
  }

  class TranslationProvider {
    fileName: string;
    constructor(fileName: string) {
      this.fileName = fileName;
    }

    async sendTranslations() {
      const filePath = path.join(__dirname, this.fileName);
      const fileContents = await fs.readFile(filePath, { encoding: "utf-8" });
      return fileContents;
    }
  }

  class PropertiesToJsonAdapter extends TranslationProvider {
    translationsProvider: TranslationProvider;
    constructor(prop: TranslationProvider) {
      super(prop.fileName);
      this.translationsProvider = prop;
    }
    async sendTranslations() {
      const original = await super.sendTranslations();
      const arrayOfProperties = original.split("\n");
      const objectTranslations = {};
      arrayOfProperties.forEach((item) => {
        const [key, value] = item.split("=");
        objectTranslations[key] = value;
      });
      return JSON.stringify(objectTranslations);
    }
  }

  const provider = new TranslationProvider("translations.properties");

  // const consumer = new TranslationConsumer(provider);
  // const translation = consumer.getTranslation(
  //   "baseGroup.PDJPDG1-svrMessageLogger.isLogging"
  // );
  const TranslationAdapter = new PropertiesToJsonAdapter(provider);
  const adaptedConsumer = new TranslationConsumer(TranslationAdapter);
  const translation = await adaptedConsumer.getTranslation(
    "baseGroup.PDJPDG1-svrMessageLogger.filterNames"
  );
  console.log(translation);
};
