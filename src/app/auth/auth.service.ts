import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from './user.model';

export interface AuthResponseData {
    token: string;
    email: string;
    role: {};
    _id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    user = new BehaviorSubject<User>(null!);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    login(email: string, password: string) {
        const url = 'http://hmaapi.kilobytetech.com/auth/login';

        return this.http
            .post<AuthResponseData>(url, { email: email, password: password })
            .pipe(
                tap((resData) => {
                    console.log(resData.token);
                    this.handleAuthentication(
                        resData.token,
                        resData.email,
                        resData.role,
                        resData._id
                    );
                })
            );
    }

    autoLogin() {
        const userData: {
            email: string;
            token: string;
            _id: string;
            role: {};
        } = JSON.parse(localStorage.getItem('userData')!);

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.token,
            userData._id,
            userData.role
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);

            const expirationDuration = 3600000;

            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null!);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    handleAuthentication(token: string, email: string, role: {}, _id: string) {
        const user = new User(email, token, _id, role);
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));

        this.autoLogout(3600000);
    }
}
