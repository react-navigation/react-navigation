export class Logger {
  private isVerbose = false;
  private isDebug = false;
  private isLogEnabled = true;

  public setIsVerbose(enable: boolean): this {
    this.isVerbose = enable;
    return this;
  }

  public setIsDebug(enable: boolean): this {
    this.isDebug = enable;
    return this;
  }

  public enable(): this {
    this.isLogEnabled = true;
    return this;
  }

  public disable(): this {
    this.isLogEnabled = false;
    return this;
  }

  public log(msg: any): this {
    if (this.isLogEnabled) {
      console.log(msg);
    }
    return this;
  }

  public warn(msg: any): this {
    if (this.isLogEnabled) {
      console.warn(msg);
    }
    return this;
  }

  public error(msg: any): this {
    if (this.isLogEnabled) {
      console.error(msg);
    }
    return this;
  }

  public verbose(msg: any): this {
    if (this.isLogEnabled && (this.isVerbose || this.isDebug)) {
      console.log(msg);
    }
    return this;
  }

  public debug(msg: any): this {
    if (this.isLogEnabled && this.isDebug) {
      console.log(msg);
    }
    return this;
  }
}

interface IGetLoggerParams {
  isVerbose?: boolean;
  isDebug?: boolean;
}

let logger: Logger;
export default function getLogger(params?: IGetLoggerParams): Logger {
  if (!logger) {
    logger = new Logger();
  }

  if (params) {
    logger.setIsVerbose(params.isVerbose || false);
    logger.setIsDebug(params.isDebug || false);
  }

  return logger;
}
