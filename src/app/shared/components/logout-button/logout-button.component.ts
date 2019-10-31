import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavController, MenuController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-logout-button',
  template: `
    <ion-buttons>
      <ion-button (click)="logout()">
        <ion-icon name="exit" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-buttons>
  `,
})
export class LogoutButtonComponent implements OnInit {

  @Input() menu: string;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private overlayService: OverlayService,
    private menuController: MenuController
  ) { }

  async ngOnInit(): Promise<void> {
    if(!(await this.menuController.isEnabled(this.menu))){
      this.menuController.enable(true, this.menu);
    }
  }

  async logout(): Promise<void> {
    await this.overlayService.alert({
      message: 'Você quer realmente sair?',
      buttons: [
        {
          text: 'Sim',
          handler: async () => {
            await this.authService.logout();
            await this.menuController.enable(false, this.menu);
            this.navController.navigateRoot('/login');
          }
        },
        'Não'
      ]
    })
  }

}
