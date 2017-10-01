/*
 * to replace/rename with planner component
*/

import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from 'ionic-angular';
import L from 'leaflet';

import { SearchModal } from './search-modal/search-modal';
import { MapService } from './map.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  center: any;
  map: any;
  maps: any;
  activityIcon: string;
  originData: any;
  destinationData: any;
  originMarker: any;
  destinationMarker: any;

  routePlannerOptions: any;

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public mapService: MapService,
    public toastCtrl: ToastController
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
    this.originMarker = null;
    this.destinationMarker = null;
  }

  presentLocationModal(purpose: string) {
    let text;
    if (purpose == 'origin') {
      text = this.routePlannerOptions.origin;
    } else {
      text = this.routePlannerOptions.destination;
    }
    if (text === "Earth" || text === "To the moon") {
      text = ""
    }
    let searchModal = this.modalCtrl.create(SearchModal, { 'params': { 'purpose': purpose, 'text': text } });
    searchModal.onDidDismiss(res => {
      if (res) {
        console.log(res);
        if (res.purpose == 'origin') {
          this.originData = res.data;
          this.routePlannerOptions.origin = this.originData.ADDRESS;
          this.addOriginPin(this.originData.LATITUDE, this.originData.LONGITUDE);
          this.routePlannerOptions.originCoords = this.originData.LONGITUDE + "," + this.originData.LATITUDE;
        } else {
          this.destinationData = res.data;
          this.routePlannerOptions.destination = this.destinationData.ADDRESS;
          this.addDestinationPin(this.destinationData.LATITUDE, this.destinationData.LONGITUDE);
          this.routePlannerOptions.destinationCoords = this.destinationData.LONGITUDE + "," + this.destinationData.LATITUDE;
        }
      }
    });
    searchModal.present();
  }

  showActivityPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Activity');

    alert.addInput({
      type: 'radio',
      label: 'Walk',
      value: 'Walk',
      checked: this.routePlannerOptions.activity === 'Walk'
    });

    alert.addInput({
      type: 'radio',
      label: 'Cycle',
      value: 'Cycle',
      checked: this.routePlannerOptions.activity === 'Cycle'
    });

    // alert.addInput({
    //   type: 'radio',
    //   label: 'Hiking',
    //   value: 'Hiking',
    //   checked: this.routePlannerOptions.activity === 'Hiking'
    // });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.routePlannerOptions.activity = data;
        this.updateIcon();
      }
    });

    alert.present();
  }

  showDifficultyPrompt() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Difficulty');

    alert.addInput({
      type: 'radio',
      label: '1',
      value: '1',
      checked: this.routePlannerOptions.difficulty === '1'
    });

    alert.addInput({
      type: 'radio',
      label: '2',
      value: '2',
      checked: this.routePlannerOptions.difficulty === '2'
    });

    alert.addInput({
      type: 'radio',
      label: '3',
      value: '3',
      checked: this.routePlannerOptions.difficulty === '3'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.routePlannerOptions.difficulty = data;
      }
    });

    alert.present();
  }

  showDistancePrompt(): void {
    const alert = this.alertCtrl.create({
      title: 'Distance (km)',
      inputs: [
        {
          name: 'distance',
          placeholder: this.routePlannerOptions.distance
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.routePlannerOptions.distance = data.distance;
          }
        }
      ]
    });
    alert.present();
  }

  private updateIcon(): void {
    if (this.routePlannerOptions.activity == "Cycling") {
      this.activityIcon = "bicycle";
    } else if (this.routePlannerOptions.activity == "Jogging") {
      this.activityIcon = "walk";
    } else {
      this.activityIcon = "trending-up";
    }
  }

  // reset with dummy data
  resetRoutePlanner(): void {
    this.routePlannerOptions = {
      origin: "Earth",
      destination: "To the moon",
      activity: "Walk",
      difficulty: "1",
      distance: "2.4"
    }
    this.updateIcon();
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

  //when both origin and destination are set
  displayRouteOnMap(): void {
    this.mapService.generateRoute(this.routePlannerOptions)
      .then(res => {
        console.log(res);
        if (res.success) {
          this.presentToast("Route successfully generated");
        } else {
          this.presentToast("Unable to generate route");
        }
      })
      .catch(err => {
        this.presentToast("Unable to generate route");
        console.log(err);
      })
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

  addOriginPin(lat, lng): void {
    if (this.originMarker) {
      this.map.removeLayer(this.originMarker);
    }
    this.originMarker = L.marker([lat, lng]).addTo(this.map);
  }

  addDestinationPin(lat, lng): void {
    if (this.destinationMarker) {
      this.map.removeLayer(this.destinationMarker);
    }
    this.destinationMarker = L.marker([lat, lng]).addTo(this.map);
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

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      cssClass: 'toaster-style',
      position: 'middle'
    });
    toast.present();
  }

  dummyInfo():void {
    console.log("dummy activated");
    this.mapService.dummy();
  }

}
