import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AlertController, LoadingController, IonicPage, NavController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

export interface support {
  supportMsg: string;
}
@IonicPage({
  name: 'support'
})
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
  support = {} as support;

  constructor(private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public admob: AdMobFree
  ) {
    this.launchInterstitial();
   }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Support messgae accepted',
      subTitle: 'Your support reqest is submitted successfully and we will be get back to you within 24hr.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  ngOnInit() {
    this.showBanner();
  }
  ionViewWillLoad() {
  }
  submitRequest() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        const yBalance: firebase.database.Reference = firebase.database().ref(`/support/${data.uid}`);
        yBalance.push({
          message: this.support.supportMsg,
          cTime: firebase.database.ServerValue.TIMESTAMP
        });
      }
    });
    this.presentAlert();
  }
  supportHistory() {
    this.navCtrl.push('support-history')
  }
  goToHome(){
    this.navCtrl.setRoot('home')
  }

  showBanner() {

	  let bannerConfig: AdMobFreeBannerConfig = {
	    isTesting: false, // Remove in production
	    autoShow: true,
	    id: "ca-app-pub-7368349917424686/1137865894"
	  };

	  this.admob.banner.config(bannerConfig);

	  this.admob.banner.prepare().then(() => {
	    // success
	  }).catch(e => console.log(e));

	}

	launchInterstitial() {

	  let interstitialConfig: AdMobFreeInterstitialConfig = {
	    isTesting: false, // Remove in production
	    autoShow: true,
	    id: "ca-app-pub-7368349917424686/9916296624"
	  };

	  this.admob.interstitial.config(interstitialConfig);

	  this.admob.interstitial.prepare().then(() => {
	    // success
	  });

	}
}
