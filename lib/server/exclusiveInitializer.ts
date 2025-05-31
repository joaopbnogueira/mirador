import 'server-only';

type InitializationState = {
  [key: string]: any;
};

export class ExclusiveInitializer {
  private state: InitializationState = {};
  public constructor(private readonly name: string) {}
  public async exclusiveInit<T>(name: string, closure: () => Promise<T>) {
    if (this.state[`${name}_initialized`]) {
      return this.state[`${name}_value`];
    }

    await this.spinLock(name, true);

    if (this.state[`${name}_initialized`]) {
      return this.state[`${name}_value`];
    }

    this.info(`Initializing ${name} ...`);

    this.state[`${name}_value`] = await closure();

    this.info(`Initialized ${name}.`);

    this.state[`${name}_initializing`] = false;
    this.state[`${name}_initialized`] = true;

    return this.state[`${name}_value`];
  }

  private async spinLock(name: string, tryAcquire = false) {
    if (this.state[`${name}_initialized`]) {
      return;
    }

    if (!this.state[`${name}_initializing`] && tryAcquire) {
      this.state[`${name}_initializing`] = true;
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        if (counter > 300) {
          clearInterval(interval);
          reject(new Error(`${name} initialization timeout`));
        }
        if (!this.state[`${name}_initializing`]) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private info(message: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    console.info(new Date(), `[${this.name}]`, message, ...args);
  }
}
