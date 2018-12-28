import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { AdMobFree } from '@ionic-native/admob-free';
import firebase from 'firebase';
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '../../node_modules/@ionic-native/google-plus';
import { AppVersion } from '@ionic-native/app-version';

export const config = {
  apiKey: "AIzaSyCDCJml69rSrYjbnheym1_XBxXWuPAiY7Y",
    authDomain: "earn-free-ripple.firebaseapp.com",
    databaseURL: "https://earn-free-ripple.firebaseio.com",
    projectId: "earn-free-ripple",
    storageBucket: "earn-free-ripple.appspot.com",
    messagingSenderId: "890593505912"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    AppVersion,
    AdMobFree,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}