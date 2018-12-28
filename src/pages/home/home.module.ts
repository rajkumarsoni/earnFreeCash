import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
//import { LoginPage } from './login';
import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents:[
    HomePage
  ]

})
export class HomePageModule {}
