export class Message {
    readonly id: string
    readonly content: string
    readonly to: string
    readonly from: string
    readonly timestamp: number
    private _sentAt: Date = undefined


    constructor(id = "", content = "", to = "", from = "", timestamp = new Date(0)){
        this._sentAt = undefined
    }

}