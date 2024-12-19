import { ILogger } from "Core/Logger/ILogger";

export class AppLogger implements ILogger {
	public LogInfo(id: string, message: string, args?: any[] | undefined): void {
		if (AppLogger.canOutputLog()) {
			AppLogger.log(console.log, id, message, args)
		}
	}

	public LogWarn(id: string, message: string, args?: any[]): void {
		if (AppLogger.canOutputLog()) {
		    AppLogger.log(console.warn ?? console.log, id, message, args);
		}
	}

	public LogError(id: string, message: string, args?: any[]): void {
		AppLogger.log(console.error ?? console.log, id, message, args);
	}

	private static canOutputLog() {
		return true
	}

	private static log(logMethod: (message: string, args?: any[]) => void, id: string, message: string, args?: any[]) {
        args && args.length
            ? logMethod(`${new Date().toString()}, ${id ? `${id} => ` : ''}${message}`, args)
            : logMethod(`${new Date().toString()}, ${id ? `${id} => ` : ''}${message}`);
	}
}
