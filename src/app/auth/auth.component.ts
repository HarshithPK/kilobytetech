import { Observable, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import { AuthResponseData, AuthService } from './auth.service';

import { User } from './user.model';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
    email = 'prakhar@kilobytetech.com';
    password = '123456';
    user = new Subject<User>();

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {}

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        authObs = this.authService.login(email, password);

        authObs.subscribe((resData) => {
            console.log(resData);
            this.router.navigate(['/dashboard']);
        });
    }
}
