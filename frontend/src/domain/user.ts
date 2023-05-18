export class User {
    readonly id: string
    readonly username: string
    readonly email: string
    readonly topics: Map<string, boolean>
    readonly createdTopics: Map<string, boolean>

    constructor(){
        this.id = "";
        this.username = "";
        this.email = "";
        this.topics = new Map<string, boolean>();
        this.createdTopics = new Map<string, boolean>();
    }
}