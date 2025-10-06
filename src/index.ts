import app from "./app";

class Server {
  private serverInstance: any;
  private childProcess: any = null;

  constructor(private port: number) {
    this.port = port;
  }

  public start() {
    this.serverInstance = app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });

    // Bind signals
    process.on("SIGINT", () => this.gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => this.gracefulShutdown("SIGTERM"));

    process.on("uncaughtException", this.handleUncaughtExceptions.bind(this));
    process.on("unhandledRejection", this.handleUnhandledRejections.bind(this));
  }

  private gracefulShutdown(signal: string): void {
    console.log(`\nReceived ${signal}. Shutting down server...`);

    this.serverInstance.close(() => {
      console.log("No new requests will be accepted.");

      if (this.childProcess) {
        this.childProcess.kill("SIGINT");
        console.log("Child process terminated.");
      }

      console.log("Server shutdown complete.");
      process.exit(0);
    });
  }

  private handleUncaughtExceptions(error: Error): void {
    console.error("Uncaught Exception:", error);
    process.exit(1);
  }

  private handleUnhandledRejections(reason: any, promise: Promise<any>): void {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
  }
}

const PORT = 5000;
const server = new Server(PORT);
server.start();
