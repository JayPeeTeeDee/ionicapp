import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MapService {
    oneMapBaseUrl: String;
    oneMapApiRoutes: any;
    backendUrl: String;
    backendRoutes: any;
    route: any;

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
        };
        this.route = null;
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
    generateRoute(data): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log(this.backendUrl + this.backendRoutes.getRoute +
                "?mode=" + data.activity.toLowerCase() +
                "&start=" + data.originCoords +
                "&end=" + data.destinationCoords +
                "&dist=" + data.distance +
                "&diff=" + data.difficulty);
            this.http.get(
                this.backendUrl + this.backendRoutes.getRoute +
                "?mode=" + data.activity.toLowerCase() +
                "&start=" + data.originCoords +
                "&end=" + data.destinationCoords +
                "&dist=" + data.distance +
                "&diff=" + data.difficulty
            ).subscribe(
                res => {
                    if (res.status === 200) {
                        if (res.json().length > 0) {
                            this.route = res.json();
                            console.log("PAOSJDPAS");
                            console.log(this.route);
                            resolve({ success: true });
                        } else {
                            resolve({ success: false });
                        }
                    } else {
                        resolve({ success: false });
                    }
                },
                err => {
                    reject(err);
                })
        });
    }

    dummy(): void {
        this.http.get("http://onemap.duckdns.org/api/route?mode=walk&start=103.758,1.3563&end=103.764,1.36354&dist=3&diff=1")
            .subscribe(
            res => {
                if (res.status === 200) {
                    if (res.json().length > 0) {
                        this.route = res.json();
                        console.log("PAOSJDPAS");
                        console.log(this.route);
                    }
                }
            },
            err => {
                console.log(err);
            })
    }
}