import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'หน้าหลัก',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'รายการยืม-คืน',
      url: '/list-permit-stock',
      icon: 'list'
    },
    {
      title: 'ทะเบียนวัสดุ-ครุภัณฑ์',
      url: '/list-stock',
      icon: 'list'
    },
    {
      title: 'ตั้งค่า',
      url: '/setting',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
