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

	/** This variable is used to store userprofile. */
	userProfile: any = null;

	/** This variable is used to store balance. */
	balance: any = {};

	/** @ignore */
	constructor(
		public navCtrl: NavController,
		private afAuth: AngularFireAuth,
		public admob: AdMobFree) {
	}

	/**
	 * Angular lifecycle hook.
	 */
	ngOnInit() {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.userProfile = user;
			} else {
				this.userProfile = null;
			}
		});
	}

	/** This method is used to navigate to claim money page. */
	goToClaimPage() {
		this.navCtrl.push('claim-game');
	}

}
