import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// const { version: appVersion } = require('../../../..');

import { GlobalCssComponent } from './global-css.component';
import { HeaderComponent } from './header/header.component';
import { MenuRootComponent } from './menu/menu-root.component';
import { MenuFloatComponent } from './menu/menu-float.component';
import { MenuItemComponent } from './menu/menu-item.component';
import { ContentComponent } from './content/content.component';
import { TreeMenuComponent } from './menu/tree-menu.component';

import { FilterMenuPipe, FilterMenuFavoritePipe } from './pipes';
import { RouterModule } from '@angular/router';
const { version: appVersion } = require('../package.json');

const myDirectives = [
    HeaderComponent,
    MenuRootComponent,
    MenuItemComponent,
    MenuFloatComponent,
    GlobalCssComponent,
    ContentComponent,
    TreeMenuComponent,

    //pipes
    FilterMenuPipe,
    FilterMenuFavoritePipe
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [
        myDirectives,
    ],
    exports: [
        myDirectives
    ]
})
export class IatecLayoutModule {
    constructor() {
        let version = appVersion;
        let dev_info_css = "font-size:25px; font-family: 'Oswald', sans-serif; color: black;";
        console.info("%cIA%cTec %c</> %cdeveloping with passion", dev_info_css, dev_info_css + "color: #1189CA;", "color: black;", "color: gray; font-family: arial, tahoma, verdana;");
        console.info("Current layout version: " + version + ", latest version: %c                ", "background-image: url('https://badge.fury.io/js/%40iatec%2Fng2-layout.svg'); background-repeat: no-repeat; background-postion: center; background-size: contain;");
    }
}