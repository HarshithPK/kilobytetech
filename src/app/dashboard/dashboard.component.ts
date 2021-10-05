import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { DxiColumnModule } from 'devextreme-angular/ui/nested';

export interface DataResponse {
    records: any[];
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    userData: {
        email: string;
        _token: string;
        _id: string;
        role: {};
    } = JSON.parse(localStorage.getItem('userData')!);

    headers = new HttpHeaders();

    constructor(private http: HttpClient) {}

    clientData: any[] = [];
    clientList: any[] = [];

    ngOnInit(): void {
        console.log(this.userData);
        console.log(this.userData._token);
        this.headers = this.headers.append(
            'Authorization',
            this.userData._token
        );

        const url = 'http://hmaapi.kilobytetech.com/users?pageNo=1&size=20';

        this.http
            .get<DataResponse>(url, { headers: this.headers })
            .subscribe((resData) => {
                let updatedClientList: [][] = [];
                this.clientData = resData.records;
                console.log(this.clientData);
                this.clientData.forEach((element) => {
                    if (element.address) {
                        updatedClientList.push(element);
                    }
                });
                this.processData(updatedClientList);
            });
    }

    processData(clients: any[]) {
        let clientsList: any[] = [];
        clients.forEach((client) => {
            let _client = {};

            if (client.assignedMembers.length !== 0) {
                _client = {
                    clientId: client.clientID,
                    companyName: client.companyName,
                    creationDate: client.createdAt,
                    assignedMember: client.assignedMembers[0].name,
                };

                clientsList.push(_client);
            } else {
                _client = {
                    clientId: client.clientID,
                    companyName: client.companyName,
                    creationDate: client.createdAt,
                    assignedMember: 'None',
                };

                clientsList.push(_client);
            }
        });
        console.log(clientsList);
        this.clientList = clientsList;
    }
}
