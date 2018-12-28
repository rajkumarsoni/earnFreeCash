import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import firebase from 'firebase';

@IonicPage({
  name:'transaction-history'
})
@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html',
})
export class TransactionHistoryPage {
  transaction:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportHistoryPage');
  }

  ngOnInit(){
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        const abc: firebase.database.Reference = firebase.database().ref(`/withdrawRequest/${data.uid}`);
        abc.on('value', snapshot => {
          this.transaction = [];
          snapshot.forEach(withSnap => {
            this.transaction.push(withSnap.val());
            return false;
          })
         // this.transaction = snapshot.val();
        });
      }
    });
  }
  
  goToWithdraw() {
    this.navCtrl.push('withdraw')
  }
  goToHome(){
    this.navCtrl.setRoot('home')
  }
}