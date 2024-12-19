import { NativeLoggerAdapter } from "../../../Adapter/NativeLoggerAdapter";

export enum LogLevel {
	Debug,
	Info,
	Warning,
	Error,
}
class LogListener {
	private _logLevel = LogLevel.Debug;
	constructor() {

	}
	private loggerService = new NativeLoggerAdapter()
	public enableConsoleCapture() {
		// __inspectorLog is an undocumented feature of React Native
		// that allows to intercept calls to console.debug/log/warn/error
		global.__inspectorLog = this._handleLog;
	}
	debug(msg: string) {
		this.write(LogLevel.Debug, msg);
	}

	info(msg: string) {
		this.write(LogLevel.Info, msg);
	}

	warn(msg: string) {
		this.write(LogLevel.Warning, msg);
	}

	error(msg: string) {
		this.write(LogLevel.Error, msg);
	}

	write(level: LogLevel, msg: string) {
		if (this._logLevel <= level) {
			this.loggerService.writeLog(level, msg);
		}
	}
	private _handleLog = (level: string, msg: string) => {
		switch (level) {
			case "debug":
				this.debug(msg);
				break;
			case "log":
				this.info(msg);
				break;
			case "warning":
				this.warn(msg);
				break;
			case "error":
				this.error(msg);
				break;
		}
	};
	// this.enableConsoleCapture();

}
export const FileLogger = new LogListener()
