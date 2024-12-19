import { ILogger } from "Core/Logger/ILogger";
import { action, makeObservable, observable } from 'mobx';
import { IPosTerminalLinkWithBankErrorProvider } from '../../../Core/PosTerminalLinkWithBankErrorProvider/IPosTerminalLinkWithBankErrorProvider';
import { restartPosTerminalAsync } from '../RemoteCommandProvider/RestartPosTerminal';
import Config from 'react-native-config';

export class PosTerminalLinkWithBankErrorProvider implements IPosTerminalLinkWithBankErrorProvider {
    private _connectionErrorCount = 0


    private readonly ModuleName = this.constructor.name
    private readonly _logger: ILogger


    public constructor(logger: ILogger) {
        this._logger = logger
        makeObservable({
            _connectionErrorCount: observable,
            setConnectionErrorCount: action,
        })
        this._logger.LogInfo(this.ModuleName, `Created ${this.constructor.name}`)
    }
    get connectionErrorCount() {
        return this._connectionErrorCount
    }
    setConnectionErrorCount = (count: number) => {
        this._connectionErrorCount = count
    }

    // Увеличивает на 1 счетчик попыток непрерывных ошибок связи
    incrementConnectionErrorCount = () => {
        this.setConnectionErrorCount(this.connectionErrorCount + 1)
        console.log('_connectionErrorCount после set', this.connectionErrorCount)
        if(this.connectionErrorCount >= Number(Config.RESTART_POS_TERMINAL_INVALID_LINK_CHECKS_COUNT)) {
            console.log('Attempts already reached the limit::', this.connectionErrorCount)
            setTimeout(async () => {
                await restartPosTerminalAsync()
            }, Number(Config.RESTART_POS_TERMINAL_OPERATION_TIMEOUT))
        }
    }

    // Очищает счетчик попыток непрерывных ошибок связи
    cleanConnectionErrorCount = () => {
        this.setConnectionErrorCount(0)
        console.log('_connectionErrorCount clean', this.connectionErrorCount)
    }
}
