import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DailyBonusPage } from './daily-bonus';

@NgModule({
  declarations: [
    DailyBonusPage,
  ],
  imports: [
    IonicPageModule.forChild(DailyBonusPage),
  ],
})
export class DailyBonusPageModule {}
