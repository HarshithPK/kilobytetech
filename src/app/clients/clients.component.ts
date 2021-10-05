import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface DataResponse {
    records: any[];
}

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
    selectedFile: File = null!;

    userData: {
        email: string;
        _token: string;
        _id: string;
        role: {};
    } = JSON.parse(localStorage.getItem('userData')!);

    defaultImage = 'https://static.thenounproject.com/png/140281-200.png';

    clientData: any[] = [];

    headers = new HttpHeaders();

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
        console.log(this.userData);

        this.headers = this.headers.append(
            'Authorization',
            this.userData._token
        );

        const url =
            'http://hmaapi.kilobytetech.com/documents?clientId=5f60e62502392e786fa4ae95';

        this.http
            .get<DataResponse>(url, { headers: this.headers })
            .subscribe((resData) => {
                console.log(resData);
                console.log(resData.records);

                resData.records.forEach((element) => {
                    if (element.folder.length !== 0) {
                        console.log(element.folder[0].preview);
                    }
                });

                this.clientData = resData.records;
            });
    }

    onFileSelected(event: any) {
        console.log(event);
        this.selectedFile = <File>event.target.files[0];

        this.uploadDocument();
    }

    uploadDocument() {
        this.router.navigate(['/clients']);

        this.headers = this.headers.append(
            'Authorization',
            this.userData._token
        );
        const fd = new FormData();
        fd.append('pdf', this.selectedFile, this.selectedFile.name);
        this.http
            .post(
                'http://hmaapi.kilobytetech.com/documents/5f7feb5e28c6d9c2c8183f41',
                fd,
                { headers: this.headers }
            )
            .subscribe((res) => {
                console.log(res);
            });
    }
}
