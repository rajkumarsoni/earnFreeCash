import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WatchVideosPage } from './watch-video';

@NgModule({
  declarations: [
    WatchVideosPage,
  ],
  imports: [
    IonicPageModule.forChild(WatchVideosPage),
  ],
})
export class WatchVideoPageModule {}
