import { Component } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  unreadAchievements: any;
  achievements: any;
  username: string;

  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
  }

  ngOnInit(): void {
    this.username = "John Alpaca";
    this.achievements = [
      {
          name: "It begins with a single step",
          description: "Travelled 1m"
      },
      {
          name: "8 mile",
          description: "Travelled 8 miles"
      },
      {
          name: "Century",
          description: "Travelled 100km"
      },
      {
          name: "Taking off the training wheels",
          description: "Completed a beginner route"
      },
      {
          name: "Whoa, we're halfway there",
          description: "Completed an intermediate route"
      },
      {
          name: "Veni, Vidi, Vici",
          description: "Completed an advanced route"
      },
      {
          name: "Stairway to Heaven",
          description: "Completed 10km worth of climbs"
      },
      {
          name: "Are we there yet?",
          description: "Travelled non-stop for 1 hour"
      },
      {
          name: "Speed Devil",
          description: "Attained a speed of 30km/h"
      },
      {
          name: "A way of life",
          description: "Completed 100 routes"
      },
    ];
    this.unreadAchievements = [
    ];
  }

  presentToast() {
    if (this.unreadAchievements.length > 0) {
      let message = this.unreadAchievements[0];
      this.unreadAchievements.shift();
      this.achievements.push(message);
      let toast = this.toastCtrl.create({
        message: 'Achievement unlocked: ' + message,
        duration: 3000,
        cssClass: 'toaster-style',
        position: 'top'
      });
      toast.present();
    }
  }

  showNamePrompt(): void {
    const alert = this.alertCtrl.create({
      title: 'Name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Enter your name'
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
          text: 'Done',
          handler: data => {
            this.username = data.name;
          }
        }
      ]
    });
    alert.present();
  }
}
