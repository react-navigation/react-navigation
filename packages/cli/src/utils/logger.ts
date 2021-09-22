export class Logger {
  private _isVerbose = false;
  private _isDebug = false;

  public setIsVerbose(enable: boolean): this {
    this._isVerbose = enable;
    return this;
  }

  public setIsDebug(enable: boolean): this {
    this._isDebug = enable;
    return this;
  }

  public log(msg: any): this {
    console.log(msg);
    return this;
  }

  public warn(msg: any): this {
    console.warn(msg);
    return this;
  }

  public error(msg: any): this {
    console.error(msg);
    return this;
  }

  public verbose(msg: any): this {
    if (this._isVerbose || this._isDebug) {
      console.log(msg);
    }
    return this;
  }

  public debug(msg: any): this {
    if (this._isDebug) {
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
    logger.setIsVerbose(params.isVerbose);
    logger.setIsDebug(params.isDebug);
  }

  return logger;
}
