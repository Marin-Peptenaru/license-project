export class Topic {
    readonly id: string
    readonly title: string
    readonly admin: string
    readonly public: boolean

    constructor(){
        this.id = "";
        this.title = "";
        this.admin = "";
        this.public = false;
    }
}