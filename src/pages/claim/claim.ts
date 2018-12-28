import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, NavController } from 'ionic-angular';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { Subscription } from 'rxjs/Rx';
import { TotalBalance } from '../../modal/totalBalace.modal';
import { Observable } from 'rxjs/Rx';
import firebase from 'firebase';
import { AdMobFreeInterstitialConfig, AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';


interface timeObj {
	demoTime: any;
}
interface cTimeObj {
	cTime: any;
}
interface yBalanceObj {
	totalBalane: any
}

@IonicPage({
	name: 'claim-game'
})
@Component({
	selector: 'page-claim',
	templateUrl: 'claim.html',
})
export class ClaimPage {

	totalBalance = {} as TotalBalance;
	randomNumber: any = 1;
	localBalance: any = 0.000001;
	yourBalance: any = 0.0002;
	userProfile: any = null;
	balance = {} as yBalanceObj;
	sub: Subscription;
	diffTime = {} as cTimeObj;
	currentTime: any;
	tObj = {} as timeObj;
	date: Date;

	constructor(
		public loadingCtrl: LoadingController,
		private afAuth: AngularFireAuth,
		private alrtCtrl: AlertController,
		public admob: AdMobFree,
		public navCtrl: NavController
	) { }

	claimRipple(demoTime) {
		this.showInterAds();
		if (window.localStorage.getItem("yourBalance") !== 'undefined' && window.localStorage.getItem("yourBalance") !== 'null') {
			this.localBalance = parseFloat(window.localStorage.getItem("yourBalance"));
		}
		let loader = this.loadingCtrl.create({
			content: "Please wait...",
		});
		loader.present();
		setTimeout(() => {
			this.randomNumber = (Math.random() * (0.004 - 0.001) + 0.001).toFixed(4);
			this.presentAlert();
			if (this.localBalance > 0.0001) {
				this.localBalance += parseFloat(this.randomNumber);
				this.totalBalance.totalBalance = this.localBalance;
				window.localStorage.setItem("yourBalance", this.totalBalance.totalBalance);
			} else {
				this.yourBalance += parseFloat(this.randomNumber);
				this.totalBalance.totalBalance = this.yourBalance;
				window.localStorage.setItem("yourBalance", this.totalBalance.totalBalance);
			}
			this.afAuth.authState.subscribe(auth => {
				const yBalance: firebase.database.Reference = firebase.database().ref(`/balance/${auth.uid}`);
				yBalance.set({
					totalBalance: this.totalBalance.totalBalance
				})
			})
			loader.dismiss();
		}, 1000);
		// For storing current Date in server
		this.date = new Date();
		this.afAuth.authState.subscribe(auth => {
			const personRef: firebase.database.Reference = firebase.database().ref(`/demoTime/${auth.uid}`);
			personRef.set({
				demoTime: (this.date.getTime()) + (5 * 60 * 1000)
			});
		})
	}

	ngOnInit() {
		this.showInterAds();
		let loader = this.loadingCtrl.create({
			content: "Loading...",
		});
		loader.present();
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.userProfile = user;
			} else {
				this.userProfile = null;
			}
		});
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const abc: firebase.database.Reference = firebase.database().ref(`/balance/${data.uid}`);
				abc.on('value', snapshot => {
					this.balance = snapshot.val();

				})
			}
		});
		let timer = Observable.timer(1, 1000);
		this.sub = timer.subscribe(t => {
			this.setTimestamp();
		});
		setTimeout(() => {
			loader.dismiss();
		}, 2000);
	}
	setTimestamp() {
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const personRef: firebase.database.Reference = firebase.database().ref(`/currentTime/${data.uid}`);
				personRef.set({
					cTime: firebase.database.ServerValue.TIMESTAMP
				})
			}
		})
	}

	async ionViewWillEnter() {
		this.showBannerAds();
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const abc: firebase.database.Reference = firebase.database().ref(`/currentTime/${data.uid}`);
				abc.on('value', snapshot => {
					this.diffTime = snapshot.val();
				});
				const personRef: firebase.database.Reference = firebase.database().ref(`/demoTime/${data.uid}`);
				personRef.on('value', personSnapshot => {
					this.tObj = personSnapshot.val();
				});
			};
		});
	}

	presentAlert() {
		let alert = this.alrtCtrl.create({
			title: 'You have claimed',
			subTitle: this.randomNumber,
			buttons: ['ok'],
		});
		alert.present();
	}

	goToWithdraw(){
		this.navCtrl.push('withdraw');
	} 
	goToTransaction(){
		this.navCtrl.push('transaction-history');
	}

	// AdMob Ads Methods

	async showBannerAds() {
		const bannerConfig: AdMobFreeBannerConfig = {
			id: 'ca-app-pub-7368349917424686/8136698798',
			isTesting: false,
			autoShow: true
		}
		this.admob.banner.config(bannerConfig);
		try {
			const result = this.admob.banner.prepare();
			console.log("Ad" + result);
		} catch (e) {
			console.error(e);
		}
	}


	async showInterAds() {
	  const interAdsConfig: AdMobFreeInterstitialConfig = {
	    id: 'ca-app-pub-7368349917424686/1770069137',
	    isTesting: false,
	    autoShow: true
	  }
	  this.admob.interstitial.config(interAdsConfig);
	  try {
	    const result = this.admob.interstitial.prepare();
	    console.log("ad" + result);
	  } catch (e) {
	    console.error(e);
	  }
	}

}
