import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MapService {
    oneMapBaseUrl: String;
    oneMapApiRoutes: any;

    constructor(
        private http: Http
    ) {
        this.oneMapBaseUrl = "https://developers.onemap.sg";
        this.oneMapApiRoutes = {
            search: "/commonapi/search"
        }
    }

    searchForLocation(searchText) {
        return this.http.get(
            this.oneMapBaseUrl + this.oneMapApiRoutes.search +
            "?searchVal=" + searchText +
            "&returnGeom=Y" +
            "&getAddrDetails=Y" +
            "&pageNum=1"
        ).map(res => res.json());
    }
}