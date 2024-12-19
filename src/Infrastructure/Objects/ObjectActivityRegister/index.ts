
export class ObjectActivityRegister {
    private _lastPosActivityUpdate: Date = new Date(Date.now() - 1000 * 60 * 10)

    public constructor() {
        this.updatePosActivity = this.updatePosActivity.bind(this)
    }

    public get LastPosActivityUpdate() {
        return this._lastPosActivityUpdate
    }

    public updatePosActivity() {
        this._lastPosActivityUpdate = new Date()
    }
}
