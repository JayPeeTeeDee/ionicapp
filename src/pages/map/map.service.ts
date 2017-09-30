import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MapService {
    oneMapBaseUrl: String;
    oneMapApiRoutes: any;
    backendUrl: String;
    backendRoutes: any;

    constructor(
        private http: Http
    ) {
        this.oneMapBaseUrl = "https://developers.onemap.sg";
        this.oneMapApiRoutes = {
            search: "/commonapi/search"
        };
        this.backendUrl = "http://onemap.duckdns.org";
        this.backendRoutes = {
            getRoute: "/api/route"
        }
    }

    searchForLocation(searchText) {
        return new Promise((resolve, reject) => {
            this.http.get(
                this.oneMapBaseUrl + this.oneMapApiRoutes.search +
                "?searchVal=" + searchText +
                "&returnGeom=Y" +
                "&getAddrDetails=Y" +
                "&pageNum=1"
            ).subscribe(
                res => {
                    if (res.status === 200) {
                        let result = res.json();
                        resolve(result.results);
                    }
                },
                err => {
                    reject(err);
                })
        });
    }

    // /api/route?mode={mode}&start={start}&end={end}&dist={distance}&diff={difficulty}
    generateRoute(data) {
        return new Promise((resolve, reject) => {
            console.log(this.backendUrl + this.backendRoutes.getRoute +
                "?mode=" + data.activity +
                "&start=" + data.originCoords +
                "&end=" + data.destinationCoords +
                "&dist=" + data.distance +
                "&diff=" + data.difficulty);
            this.http.get(
                this.backendUrl + this.backendRoutes.getRoute +
                "?mode=" + data.activity +
                "&start=" + data.originCoords +
                "&end=" + data.destinationCoords +
                "&dist=" + data.distance +
                "&diff=" + data.difficulty
            ).subscribe(
                res => {
                    if (res.status === 200) {
                        let result = res.json();
                        resolve(result.results);
                    }
                },
                err => {
                    reject(err);
                })
        });
    }
}