export class Logger {
  private _isVerbose = false;
  private _isDebug = false;
  private _isLogEnabled = true;

  public setIsVerbose(enable: boolean): this {
    this._isVerbose = enable;
    return this;
  }

  public setIsDebug(enable: boolean): this {
    this._isDebug = enable;
    return this;
  }

  public enable(): this {
    this._isLogEnabled = true;
    return this;
  }

  public disable(): this {
    this._isLogEnabled = false;
    return this;
  }

  public log(msg: any): this {
    if (this._isLogEnabled) {
      console.log(msg);
    }
    return this;
  }

  public warn(msg: any): this {
    if (this._isLogEnabled) {
      console.warn(msg);
    }
    return this;
  }

  public error(msg: any): this {
    if (this._isLogEnabled) {
      console.error(msg);
    }
    return this;
  }

  public verbose(msg: any): this {
    if (this._isLogEnabled && (this._isVerbose || this._isDebug)) {
      console.log(msg);
    }
    return this;
  }

  public debug(msg: any): this {
    if (this._isLogEnabled && this._isDebug) {
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
