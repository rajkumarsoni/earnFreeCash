import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AppVersion } from '@ionic-native/app-version';

import firebase from 'firebase';
@IonicPage({
  name:'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  /** This variable is used to sotre version number of the app. */
  version:any;

  /** @ignore */
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private googlePlus: GooglePlus,
    private appVersion: AppVersion
  ) {
    this.appVersion.getVersionNumber().then((version)=>{
       this.version = version
     });
  }

  /** This method is used to naviagte to home page after login. */
  gotohome() {
    this.googlePlus.login({
      'webClientId': "890593505912-sgp5qsjvilvvnb018incs5od2hp5b308.apps.googleusercontent.com",
      'offilne': true
    }).then(res => {
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
        .then(success => {
          console.log("Firebase success: " + JSON.stringify(success));
          this.navCtrl.setRoot('home');
        })
        //.catch(error => this.presentAlert(error.message));
    }).catch(err => console.error("Error: ", err));
  }


}
