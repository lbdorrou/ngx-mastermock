export interface Mastermock {
    registerEndpoints(): { [urls: string]: Function };
}
