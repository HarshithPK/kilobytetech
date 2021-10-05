export class User {
    constructor(
        public email: string,
        public _token: string,
        public id: string,
        public roles: {}
    ) {}

    get token() {
        return this._token;
    }
}
