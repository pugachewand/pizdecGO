export interface ILogger {
    LogInfo: (id: string, message: string, args?: any[]) => void;
    LogWarn: (id: string, message: string, args?: any[]) => void;
    LogError: (id: string, message: string, args?: any[]) => void;
}
