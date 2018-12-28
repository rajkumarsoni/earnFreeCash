import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from '../../../node_modules/angularfire2/auth';
import firebase from 'firebase';

@IonicPage({
  name:'support-history'
})
@Component({
  selector: 'page-support-history',
  templateUrl: 'support-history.html',
})
export class SupportHistoryPage implements OnInit {
  support:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afAuth: AngularFireAuth,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportHistoryPage');
  }

  ngOnInit(){
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        const abc: firebase.database.Reference = firebase.database().ref(`/support/${data.uid}`);
        abc.on('value', snapshot => {
          this.support = snapshot.val();
        });
      }
    });
  }
  goTosupport() {
    this.navCtrl.push('support')
  }
  goToHome(){
    this.navCtrl.setRoot('home')
  }
}
