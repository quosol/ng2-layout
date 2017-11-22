import { Component, ViewEncapsulation } from '@angular/core';
import { MenuItemModel } from './iatec-layout/models/index';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public menus: Array<MenuItemModel> = [
    <MenuItemModel>{ id: 0, title: "Todo" },
    <MenuItemModel>{ id: 1, title: "Menu 1", parentId: 0 },
    <MenuItemModel>{ id: 2, title: "Sub Menu 1", parentId: 1, target: "énois" },
    <MenuItemModel>{ id: 3, title: "Menu 2", parentId: 0, target: "énoisdnv" },    
  ]

  public onClickMenu(e): void {
    console.info(e)
  }
  public onClickFavorite(e): void {}
}
