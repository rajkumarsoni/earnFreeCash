import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, NavController } from 'ionic-angular';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { Subscription } from 'rxjs/Rx';
import { TotalBalance } from '../../modal/totalBalace.modal';
import { Observable } from 'rxjs/Rx';
import firebase from 'firebase';
import { AdMobFreeInterstitialConfig, AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';


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
	name: 'watch-video'
})
@Component({
	selector: 'page-claim',
	templateUrl: 'watch-video.html',
})
export class WatchVideosPage {

	totalBalance = {} as TotalBalance;
	randomNumber: any = 1;
	localInrBalance: any = 0.000001;
	yourUsdBalance: any = 0.0002;
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
		// private adMobFree: AdMobFree
	) { }

	claimRipple(demoTime) {
		//this.launchInterstitial();
		if (window.localStorage.getItem("yourUsdBalance") !== 'undefined' && window.localStorage.getItem("yourUsdBalance") !== 'null') {
			this.localInrBalance = parseFloat(window.localStorage.getItem("yourUsdBalance"));
		}
		let loader = this.loadingCtrl.create({
			content: "Please wait...",
		});
		loader.present();
		 this.showInterAds();
		setTimeout(() => {
			this.randomNumber = (Math.random() * (35 - 22) + 22).toFixed(0);
			this.presentAlert();
			if (this.localInrBalance > 0.0001) {
				this.localInrBalance += parseFloat(this.randomNumber);
				this.totalBalance.totalBalance = this.localInrBalance;
				window.localStorage.setItem("yourUsdBalance", this.totalBalance.totalBalance);
			} else {
				this.yourUsdBalance += parseFloat(this.randomNumber);
				this.totalBalance.totalBalance = this.yourUsdBalance;
				window.localStorage.setItem("yourUsdBalance", this.totalBalance.totalBalance);
			}
			this.afAuth.authState.subscribe(auth => {
				const yBalance: firebase.database.Reference = firebase.database().ref(`/usdBalance/${auth.uid}`);
				yBalance.set({
					totalBalance: this.totalBalance.totalBalance
				})
			})
			loader.dismiss();
		}, 1000);
		// For storing current Date in server
		this.date = new Date();
		this.afAuth.authState.subscribe(auth => {
			const personRef: firebase.database.Reference = firebase.database().ref(`/WatchVideoUsdDemoTime/${auth.uid}`);
			personRef.set({
				demoTime: (this.date.getTime()) + (60 * 60 * 1000)
			});
		})
	}
	
	ngOnInit() {
		this.showBannerAds();
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
				const abc: firebase.database.Reference = firebase.database().ref(`/usdBalance/${data.uid}`);
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
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const abc: firebase.database.Reference = firebase.database().ref(`/currentTime/${data.uid}`);
				abc.on('value', snapshot => {
					this.diffTime = snapshot.val();
				});
				const personRef: firebase.database.Reference = firebase.database().ref(`/WatchVideoUsdDemoTime/${data.uid}`);
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


	// AdMob Ads Methods

	async showBannerAds() {
	  const bannerConfig: AdMobFreeBannerConfig = {
	    id: 'ca-app-pub-7368349917424686/2034912579',
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
	  const interAdsConfig: AdMobFreeRewardVideoConfig = {
	    id: 'ca-app-pub-7368349917424686/6533662803',
	    isTesting: false,
	    autoShow: true
	  }
	  this.admob.rewardVideo.config(interAdsConfig);
	  try {
	    const result = this.admob.rewardVideo.prepare();
	    console.log("ad" + result);
	  } catch (e) {
	    console.error(e);
	  }
	}

	goToWithdraw(){
		this.navCtrl.push('withdraw-usd');
	} 
	goToTransaction(){
		this.navCtrl.push('transaction-usd-history');
	}
	goToHome(){
		this.navCtrl.setRoot('home')
	  }
}
