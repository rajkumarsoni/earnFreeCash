import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController, NavController } from 'ionic-angular';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import firebase from 'firebase';
import { AdMobFreeInterstitialConfig, AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { TotalBalance } from '../../interface/total-Balance.modal';
import { CurrentTime, ServerTime } from '../../interface/timings.interface';


// interface timeObj {
// 	demoTime: any;
// }
// interface cTimeObj {
// 	cTime: any;
// }
// interface yBalanceObj {
// 	totalBalane: any
// }

@IonicPage({
	name: 'claim-game'
})
@Component({
	selector: 'page-claim',
	templateUrl: 'claim.html',
})
export class ClaimPage {

	/** This variable is used for storing total balance of the user */
	totalBalance = {} as TotalBalance;

	/** This vaiable is used for storing random numbers. */
	randomNumber: number = 1;

	/** This variable is used to store balance stored in local storage */
	localStorageBalance: number = 0.000001;

	/** This variable is used to store current balcnce */
	usersCurrentBalance: number = 0.0002;

	/** This variable is used to store user profile. */
	userProfile: any = null;

	/** This variable is used to sotre balance comming from service. */
	balance = {} as TotalBalance;

	/** This variable is used to sotre subscriptions. */
	subscription: Subscription;

	/** This variable is used to store server time coming from service. */
	serverTime = {} as ServerTime;

	/** This variable is used to sotre current device time when click on claim button. */
	currentTime = {} as CurrentTime;

	/** @ignore */
	constructor(
		public loadingCtrl: LoadingController,
		private afAuth: AngularFireAuth,
		private alrtCtrl: AlertController,
		public admob: AdMobFree,
		public navCtrl: NavController
	) { }

	/** This method is used to claim money. */
	claimMoney() {
		this.showInterAds();
		this.retriveBalanceFromLocalStorage();
		let loader = this.loadingCtrl.create({
			content: "Please wait...",
		});
		loader.present();
		setTimeout(() => {
			this.storingBalanceToServer();
			loader.dismiss();
		}, 1000);
		this.storingButtonClickedTime();
	}

	/** This method is used to store balance to server. */
	storingBalanceToServer() {
		this.randomNumber = parseFloat((Math.random() * (0.004 - 0.001) + 0.001).toFixed(4));
		if (this.localStorageBalance > 0.0001) {
			this.localStorageBalance += this.randomNumber;
			this.totalBalance.totalBalance = this.localStorageBalance;
			window.localStorage.setItem("usersCurrentBalance", this.totalBalance.totalBalance);
		} else {
			this.usersCurrentBalance += this.randomNumber;
			this.totalBalance.totalBalance = this.usersCurrentBalance;
			window.localStorage.setItem("usersCurrentBalance", this.totalBalance.totalBalance);
		}
		this.afAuth.authState.subscribe(auth => {
			const userBalance: firebase.database.Reference = firebase.database().ref(`/balance/${auth.uid}`);
			userBalance.set({
				totalBalance: this.totalBalance.totalBalance
			})
		})
	}

	/** This method is used to store current button clicked time. */
	storingButtonClickedTime() {
		let date = new Date();
		this.afAuth.authState.subscribe(auth => {
			const buttonClickTime: firebase.database.Reference = firebase.database().ref(`/buttonClickedTime/${auth.uid}`);
			buttonClickTime.set({
				buttonClickedTime: (date.getTime()) + (5 * 60 * 1000)
			});
		})
	}

	/** This method is used to retrive balance from localstorage */
	retriveBalanceFromLocalStorage() {
		if (window.localStorage.getItem("usersCurrentBalance") !== 'undefined' && window.localStorage.getItem("usersCurrentBalance") !== 'null') {
			this.localStorageBalance = parseFloat(window.localStorage.getItem("usersCurrentBalance"));
		}
	}

	/** Angular lifecycle hook. */
	ngOnInit() {
		this.showInterAds();
		let loader = this.loadingCtrl.create({
			content: "Loading...",
		});
		loader.present();
		this.retriveDataFromFirebase();
		setTimeout(() => {
			loader.dismiss();
		}, 2000);
	}

	/** This method is used for generating timestamp. */
	setTimestamp() {
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const personRef: firebase.database.Reference = firebase.database().ref(`/currentTime/${data.uid}`);
				personRef.set({
					currentTime: firebase.database.ServerValue.TIMESTAMP
				})
			}
		})
	}

	/** This method is used to retive data from firebase. */
	retriveDataFromFirebase() {
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
		this.subscription = timer.subscribe(t => {
			this.setTimestamp();
		});
	}

	/** Ionic lifecycle hook. */
	async ionViewWillEnter() {
		this.showBannerAds();
		this.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				const abc: firebase.database.Reference = firebase.database().ref(`/currentTime/${data.uid}`);
				abc.on('value', snapshot => {
					this.serverTime = snapshot.val();
				});
				const personRef: firebase.database.Reference = firebase.database().ref(`/buttonClickedTime/${data.uid}`);
				personRef.on('value', personSnapshot => {
					this.currentTime = personSnapshot.val();
				});
			};
		});
	}



	/** This method is used to show banner ads. */
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

	/** This method is used to show interstitial ads. */
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
