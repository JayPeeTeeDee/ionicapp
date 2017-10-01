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
      "30 Hills Conquered",
      "100km Covered"
    ];
    this.unreadAchievements = [
      "50 Hills Conquered",
      "20 Routes Completed"
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
