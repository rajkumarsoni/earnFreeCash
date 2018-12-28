import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AlertController, LoadingController, IonicPage, NavController } from 'ionic-angular';
import { OnInit } from '@angular/core/';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

interface yBalanceObj {
  totalBalance: any,
  withdrawRequestAdd: any
}
interface WalletAdd {
  walletAddress: any;
}
export interface Wallet {  
  walletAddress: string;
}
@IonicPage({
  name:'withdraw'
})
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage implements OnInit {
  wallet = {} as Wallet;
  address : any;
  walletAddress = {} as WalletAdd;
  totalBalance = {} as yBalanceObj;
  balance: any;

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
      title: 'Withdraw request accepted',
      subTitle: 'Withdraw request succesfully added and amount will be credit on your XRP Wallet address within 24 hours.',
      buttons: ['Dismiss']
    });
    alert.present();

  }
  ngOnInit() {
    this.showBanner();
   let loader = this.loadingCtrl.create({
      content: "Loading...",
    });
    loader.present();
   
    setTimeout(() => {
      this.afAuth.authState.subscribe(data => {
        if (data && data.email && data.uid) {
          const abc: firebase.database.Reference = firebase.database().ref(`/balance/${data.uid}`);
          abc.on('value', snapshot => {
            this.totalBalance = snapshot.val();
          });
        }
      });
      loader.dismiss();
    }, 2000);
  }
  ionViewWillLoad() {
  }
  requestForWithdraw(walletForm) {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        const tBalance: firebase.database.Reference = firebase.database().ref(`/balance/${data.uid}`);
        tBalance.on('value', snapshot => {
          this.totalBalance = snapshot.val();
        });
        const yBalance: firebase.database.Reference = firebase.database().ref(`/withdrawRequest/${data.uid}`);
        yBalance.push({
          myBalance: this.totalBalance.totalBalance,
          withAdd: this.wallet.walletAddress,
          cTime: firebase.database.ServerValue.TIMESTAMP
        });
        const yBalanceZ: firebase.database.Reference = firebase.database().ref(`/balance/${data.uid}`);
        yBalanceZ.set({
          totalBalance: 0
        });
        window.localStorage.removeItem("yourBalance");
      }
    });
    this.presentAlert();
  }
  
  withdrawHistory() {
    this.navCtrl.push('transaction-history')
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
