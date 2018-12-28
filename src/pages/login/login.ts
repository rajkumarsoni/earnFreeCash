import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AppVersion } from '@ionic-native/app-version';
//import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
 
import firebase from 'firebase';
@IonicPage({
  name:'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  version:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private googlePlus: GooglePlus,
    private appVersion: AppVersion
    //private firebaseAnalytics: FirebaseAnalytics 
  ) {
      // this.firebaseAnalytics.logEvent('page_view', {page: "dashboard"})
      // .then((res: any) => console.log(res + "kenfoakdlfnaolkfnao"))
      // .catch((error: any) => console.error(error));
    this.appVersion.getVersionNumber().then((version)=>{
       this.version = version
     });
     console.log("V",this.version)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  gothohome(){
    this.navCtrl.setRoot('home');
  }
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

  gotoghar(){
    this.navCtrl.setRoot('home');
  }
   
}
