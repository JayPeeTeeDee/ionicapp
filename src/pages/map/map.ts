/*
 * to replace/rename with planner component
*/

import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import L from 'leaflet';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  center: any;
  map: any;
  maps: any;

  routePlannerOptions: any;

  constructor(
    public loadingCtrl: LoadingController
  ) {
    // Could load night map if app used at night
    this.maps = {
      osm: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      default: "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
      night: "https://maps-{s}.onemap.sg/v3/Night/{z}/{x}/{y}.png"
    }
  }

  ngOnInit(): void {
    this.initMap();
    this.resetRoutePlanner();
  }

  resetRoutePlanner(): void {
    this.routePlannerOptions = {
      origin: "Earth",
      destination: "To the moon",
      activity: "Cycling",
      difficulty: "ezpz",
      distance: "2.4km"
    }
  }

  initMap(): void {
    // From OneMap API docs
    this.center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    this.map = L.map('map').setView([this.center.x, this.center.y], 12);
    let basemap = L.tileLayer(this.maps.default, {
      detectRetina: true,
      attribution: 'Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>',
      maxZoom: 18,
      minZoom: 11
    });

    let attribution = this.map.attributionControl;
    attribution.setPrefix('<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;" />');
    this.map.setMaxBounds([[1.56073, 104.1147], [1.16, 103.502]]);
    basemap.addTo(this.map);
  }

  test(): void {
    console.log("div clicked");
  }

  setUserOrigin(): void {
    this.displayRouteOnMap();
  }

  setUserDestination(): void {
    this.displayRouteOnMap();
  }

  //when both origin and destination are set
  displayRouteOnMap(): void {
    ;
  }

  centerMapOnLocation(): void {
    /*
     * Can call either fitBounds or panTo
     * http://leafletjs.com/reference-1.2.0.html#map-methods-for-modifying-map-state
     */
  }

  showUserLocation(): void {
    ;
  }

  // Should take in an array of lat lngs
  plotLine(): void {
    // create a red polyline from an array of LatLng points
    let latlngs = [
      [1.397885, 103.747982],
      [1.396462, 103.747663],
      [1.396416, 103.747582],
      [1.396294, 103.747524],
      [1.396212, 103.747536],
      [1.396189, 103.74754],
      [1.394518, 103.746673],
      [1.393819, 103.746179],
      [1.393792, 103.746212],
      [1.393429, 103.746489],
      [1.393149, 103.746872],
      [1.391704, 103.747063],
      [1.391618, 103.747037],
      [1.391464, 103.746632],
      [1.391128, 103.74661],
      [1.391125, 103.746484]
    ];
    let polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map);
    // zoom the map to the polyline
    this.map.fitBounds(polyline.getBounds());
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

}
