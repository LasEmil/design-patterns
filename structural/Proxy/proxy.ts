import fs from "fs";
import fetch from "node-fetch";
import path from "path";

export const Proxy = (): void => {
  interface Dictionary {
    setLanguage?: (lang: string) => unknown;
    getResult: (word: string) => Promise<Record<string, string>>;
  }

  class DictionaryClass implements Dictionary {
    language: string;
    setLanguage(lang: string) {
      this.language = lang;
      return this;
    }
    async getResult(word: string) {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/${this.language}/${word}`
        );
        const json = await response.json();
        if (json.title === "No Definitions Found") {
          throw new Error(`Error! ${json.title}`);
        }
        return json;
      } catch (err) {
        throw new Error("Error! Calling api failed");
      }
    }
  }

  class CachedDictionaryProxy implements Dictionary {
    private service: DictionaryClass;
    private wordCache: Record<string, unknown>;
    needReset: boolean;
    private cachePath: string;

    constructor(service: DictionaryClass) {
      this.service = service;
      this.init();
    }
    init() {
      try {
        this.cachePath = path.join(__dirname, "cache.json");
        const cacheExists = this.cacheExists(this.cachePath);
        if (cacheExists) {
          this.wordCache = JSON.parse(
            fs.readFileSync(this.cachePath, { encoding: "utf-8" })
          );
        } else {
          this.wordCache = {};
          fs.writeFileSync(this.cachePath, JSON.stringify({}));
        }
      } catch (err) {
        throw new Error("Error! Couldn't access the cache");
      }
    }
    async getResult(word: string) {
      try {
        if ((this.wordCache && !this.wordCache[word]) || this.needReset) {
          console.log(`Reading word ${word} from service`);
          const result = await this.service.getResult(word);
          this.wordCache[word] = result;
          fs.writeFileSync(this.cachePath, JSON.stringify(this.wordCache));
          return result;
        }
        console.log(`Reading word ${word} from cache`);
        return this.wordCache[word];
      } catch (err) {
        throw new Error("Error! Problem with getting a result");
      }
    }
    cacheExists(path: string) {
      return fs.existsSync(path);
    }
  }
  class DictionaryManager {
    protected service: Dictionary;
    constructor(service: Dictionary) {
      this.service = service;
    }

    getWord(word: string) {
      return this.service.getResult(word);
    }
  }

  class Application {
    async init() {
      const dictService = new DictionaryClass().setLanguage("en_US");
      const proxy = new CachedDictionaryProxy(dictService);
      const manager = new DictionaryManager(proxy);
      const wordInfo = await manager.getWord("programming");

      console.log(wordInfo);
    }
  }
  new Application().init();
};
