import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { MapService } from '../map.service';

@Component({
  selector: 'search-modal',
  templateUrl: 'search-modal.html'
})
export class SearchModal {
  options: any;
  results: any;
  purpose: string;
  text: string;

  constructor(
    params: NavParams,
    public viewCtrl: ViewController,
    public mapService: MapService
  ) {
    this.options = params.get('params');
    this.purpose = this.options.purpose;
    this.text = this.options.text;

  }

  ngOnInit(): void {
  }

  search(ev: any): void {
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.mapService.searchForLocation(val)
        .then(data => {
          this.results = data;
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  // should return a location object back to the user
  dismiss(data) {
    let payload = {
      'purpose': this.purpose,
      'data': data
    }
    this.viewCtrl.dismiss(payload); //pass into dismiss()
  }
}
