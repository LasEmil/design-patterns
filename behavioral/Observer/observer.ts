import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";
export const Observer = (): void => {
  class EmailClient {
    private static transporter: nodemailer.Transporter;
    private static client: EmailClient;
    constructor() {
      console.log("Creating transporter");
    }
    public static async getInstance() {
      if (EmailClient.client === undefined) {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        EmailClient.transporter = transporter;
        EmailClient.client = new EmailClient();
      }
      return EmailClient.client;
    }
    public async sendEmail(to: string, subject: string, content: string) {
      const info = await EmailClient.transporter.sendMail({
        from: "Emil Foo <emilfoo@example.com>",
        to,
        subject,
        html: content,
      });
      return info;
    }
  }

  interface EventListener {
    update: (context: Record<string, unknown>) => void;
  }
  enum Events {
    open,
    save,
  }

  class EventManager {
    private listeners: Record<string, Array<EventListener>>;
    constructor() {
      this.listeners = {};
      for (const event in Events) {
        this.listeners[event] = [];
      }
    }

    subscribe(eventType: Events, listener: EventListener) {
      this.listeners = {
        ...this.listeners,
        [eventType]: [...this.listeners[eventType], listener],
      };
    }

    unsubscribe(eventType: Events, listener: EventListener) {
      this.listeners = {
        ...this.listeners,
        [eventType]: [
          ...this.listeners[eventType].filter((item) => item != listener),
        ],
      };
    }

    notify(eventType: Events, context: Record<string, unknown>) {
      this.listeners[eventType].forEach((listener) => {
        listener.update(context);
      });
    }
    getSubscribers(eventType: Events) {
      return this.listeners[eventType];
    }
  }

  class Editor {
    events: EventManager;
    private fileName: string;

    constructor() {
      this.events = new EventManager();
    }

    openFile(filePath: string) {
      this.fileName = filePath;
      const filePathFull = path.join(__dirname, filePath);
      if (!fs.existsSync(filePathFull)) {
        fs.writeFileSync(filePathFull, "");
      }
      this.events.notify(Events.open, { path: filePath });
    }
    saveFile() {
      fs.writeFileSync(path.join(__dirname, this.fileName), "Editor content");
      this.events.notify(Events.save, { path: this.fileName });
    }
  }

  class LoggingListener implements EventListener {
    private logPath: string;
    private message: string;
    constructor(logFileName: string, message: string) {
      this.logPath = logFileName;
      this.message = message;
    }
    update(context: Record<string, unknown>) {
      const stream = fs.createWriteStream(path.join(__dirname, this.logPath));
      stream.write(
        `${new Date().toISOString()}: ${context.path}/ ${this.message}`
      );
      stream.end();
    }
  }

  class EmailAlertsListener implements EventListener {
    email: string;
    message: string;
    constructor(email: string, message: string) {
      this.email = email;
      this.message = message;
    }
    async update(context: Record<string, unknown>) {
      try {
        const emailClient = await EmailClient.getInstance();
        const info = await emailClient.sendEmail(
          "bar@example.com",
          "Update message",
          `<h1>New update:</h1><p><b>${new Date().toISOString()}: </b> ${
            context.path
          }/ ${this.message}</p>`
        );
        console.log(`Message sent: ${info.messageId}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      } catch (err) {
        console.log(err);
      }
    }
  }

  class Application {
    config() {
      const editor = new Editor();
      const logger = new LoggingListener(
        "log.txt",
        "Someone has opened the file"
      );
      editor.events.subscribe(Events.open, logger);

      const emailAlerts = new EmailAlertsListener(
        "admin@example.com",
        "Someone has changed the file"
      );
      editor.events.subscribe(Events.save, emailAlerts);

      console.log(editor.events.getSubscribers(Events.save));
      console.log(editor.events.getSubscribers(Events.open));
      editor.openFile("textFile.txt");
      editor.saveFile();
      editor.events.unsubscribe(Events.save, emailAlerts);
      setTimeout(() => {
        console.log("Save after a second");
        editor.saveFile();
      }, 1000);
    }
  }

  const app = new Application();
  app.config();
};
