export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:8080';
        this.setToken = this.setToken.bind(this);
        this.getToken = this.getToken.bind(this);
        this.logout = this.logout.bind(this);
        this.setExtend = this.setExtend.bind(this);
        this.loggedIn = this.loggedIn.bind(this);

        this.isReg = this.isReg.bind(this);
    }

    isReg() {
        const temp = this.getExtend();
            return temp;
    }

    loggedIn() {
        const token = this.getToken();
        return token;
    }

    setToken(idToken) {
        localStorage.setItem('id_token', idToken);
    }

    setExtend(exvalue) {
        localStorage.setItem('is_ex', exvalue);
    }

    getExtend() {
        return localStorage.getItem('is_ex');
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    logout() {
        localStorage.removeItem('is_ex');
        localStorage.removeItem('id_token');
    }
}