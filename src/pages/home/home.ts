import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { AdMobFreeBannerConfig, AdMobFree, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@IonicPage({
	name: 'home'
})
@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage implements OnInit {
	userProfile: any = null;
	balance: any = {};
	constructor(public navCtrl: NavController, private afAuth: AngularFireAuth,
		public admob: AdMobFree) {
this.showBanner();
	}
	ngOnInit() {
		//this.showBanner();
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.userProfile = user;
			} else {
				this.userProfile = null;
			}
		});
	}
	goToRipple() {
		this.navCtrl.push('claim-game');
	}
	goToInr() {
		this.navCtrl.push('claim-inr-game');
	}
	goToUsd() {
		this.navCtrl.push('claim-usd-game');
	}
	goToSupportPage(){
		this.navCtrl.push('support');
	}
	goToWatchVideo(){
		this.navCtrl.push('watch-video');
	}
	goToDailyBonus(){
		this.navCtrl.push('daily-bonus');
	}
	showBanner() {

	  let bannerConfig: AdMobFreeBannerConfig = {
isTesting: false, // Remove in production
	    autoShow: true,
	    id: "ca-app-pub-7368349917424686/1712580969"
	  };

	  this.admob.banner.config(bannerConfig);

	  this.admob.banner.prepare().then(() => {
	    // success
	  }).catch(e => console.log(e));

	}

	// launchInterstitial() {

	//   let interstitialConfig: AdMobFreeInterstitialConfig = {
	//     isTesting: false, // Remove in production
	//     autoShow: true,
	//     id: "ca-app-pub-7368349917424686/5497915409"
	//   };

	//   this.admob.interstitial.config(interstitialConfig);

	//   this.admob.interstitial.prepare().then(() => {
	//     // success
	//   });

	// }

}
