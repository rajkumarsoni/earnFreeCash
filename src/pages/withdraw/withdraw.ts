import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AlertController, LoadingController, IonicPage, NavController } from 'ionic-angular';
import { OnInit } from '@angular/core/';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';
import { WalletAddress, usersBalance } from '../../interface/withdraw-module.interface';


@IonicPage({
  name: 'withdraw'
})
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage implements OnInit {

  /** This variable is used to store wallet address. */
  walletAddress = {} as WalletAddress;

  /** This variable is used to store withraw details */
  totalBalance = {} as usersBalance;

  /** @ignore */
  constructor(private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public admob: AdMobFree
  ) {
  }

  /** This method is used to present alert message after successful withdrawal. */
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Withdraw request accepted',
      subTitle: 'Withdraw request succesfully added and amount will be credit on your XRP Wallet address within 24 hours.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /** Angulae lifecycle hook */
  ngOnInit() {
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

  /** This method is used to request withdrawal */

  requestForWithdraw() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        const tBalance: firebase.database.Reference = firebase.database().ref(`/balance/${data.uid}`);
        tBalance.on('value', snapshot => {
          this.totalBalance = snapshot.val();
        });
        const yBalance: firebase.database.Reference = firebase.database().ref(`/withdrawRequest/${data.uid}`);
        yBalance.push({
          myBalance: this.totalBalance.totalBalance,
          withAdd: this.walletAddress.walletAddress,
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

  /** This method is used to naviagte to home page. */
  goToHome() {
    this.navCtrl.setRoot('home')
  }
}
