import { Component, forwardRef, Input, ViewEncapsulation, EventEmitter, Output, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { MenuItemModel } from '../models';
import { InternalMenuItemModel } from '../models/internal-menu-item.model';
import { TreeMenuComponent } from './tree-menu.component';
import { MenuItemComponent } from './menu-item.component';
import { ItemEventInterface } from '../interface/item-event.interface';

@Component({
    selector: 'iatec-layout-menu',
    templateUrl: './menu-root.component.html',
    styleUrls: ['./menu-root.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MenuRootComponent), multi: true },
    ],
    encapsulation: ViewEncapsulation.None
})

export class MenuRootComponent implements ControlValueAccessor {
    private propagateChange: any = () => { };
    private reorganizeMenu: boolean = true;

    @Input() version: string = "";
    @Input() labelVersion: string;
    @Input() labelPlaceholder: string;
    @Input() labelFavorite: string;
    @Input() labelLoading: string;
    @Input() loading: boolean = false;
    @Input() parentId: number | string;
    @Input() iconClassLarge: string;

    @Output() clickMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    @ViewChild(TreeMenuComponent) private treeMenuComponent: TreeMenuComponent;
    @ViewChild('favority') private favorite: MenuItemComponent;
    @ContentChild('templateMenuItem') public templateMenuItem: TemplateRef<any>;
    @ContentChild('templateFloatMain') public templateFloatMain: TemplateRef<any>;
    @ContentChild('templateFloatList') public templateFloatList: TemplateRef<any>;

    public value: Array<InternalMenuItemModel> = [];
    public keySearch: string = "";
    public menuItemSearch: Array<InternalMenuItemModel> = [];
    public menuItemFavorite: Array<InternalMenuItemModel> = [];
    public idRootFloatMenu: string | number;
    public favoriteItem: InternalMenuItemModel = <InternalMenuItemModel>{
        menuItemModel: <MenuItemModel>{
            title: this.labelFavorite || 'Favorite',
            iconClass: 'fas fa-star color-orange'
        }
    }

    constructor(private router: Router) {
        this.router.events.subscribe(ev => {
            this.monitoringRouter(ev);
        });
    }

    private monitoringRouter(ev: NavigationEnd | any): void {
        if (!(ev instanceof NavigationEnd))
            return;

        if (this.reorganizeMenu) {
            let currentMenu = this.getMinRouterName(this.value, ev.url);
            if (currentMenu && !currentMenu.active && !currentMenu.semiActive) {
                this.resetMenusActive();
                this.setMenuParentsActive(this.value, currentMenu.menuItemModel.id);
            }
        }

        this.reorganizeMenu = true;
    }

    private resetMenusActive(exclude: MenuItemModel = null): void {
        if (this.value == null)
            return;

        this.value.filter(x => x.active || x.semiActive).forEach(x => {
            if (exclude == null || (exclude && x.menuItemModel.id != exclude.id)) {
                x.active = false;
                x.semiActive = false;
            }
        });
    }

    private setMenuParentsActive(arr: Array<InternalMenuItemModel>, id: string | number): void {
        let item = arr.find(x => x.menuItemModel.id == id);
        if (item) {
            item[item.menuItemModel.target == null ? 'active' : 'semiActive'] = true;

            if (item.menuItemModel.parentId != this.parentId)
                this.setMenuParentsActive(arr, item.menuItemModel.parentId);
        }
    }

    private getMinRouterName(arr: Array<InternalMenuItemModel>, url: string): InternalMenuItemModel {
        let urlArr = url.substr(1).replace(/;.*/g, '').split('/');
        let currentMenu: InternalMenuItemModel;
        for (let i = url.length; i > 0; i--) {
            currentMenu = arr.find(x => x.menuItemModel.target == urlArr.slice(0, i).join('/'));
            if (currentMenu)
                break;
        }

        return currentMenu;
    }

    private mRegex(value): string {
        let accents = {
            a: 'àáâãäåæ',
            c: 'ç',
            e: 'èéêëæ',
            i: 'ìíîï',
            n: 'ñ',
            o: 'òóôõöø',
            s: 'ß',
            u: 'ùúûü',
            y: 'ÿ'
        },
            chars = /[aceinosuy]/g;
        return value.replace(chars, function (c) {
            return '[' + c + accents[c] + ']';
        });
    }

    private closeFavorite(): void {
        if (this.favorite)
            this.favorite.setActive(false);
    }

    public filterMenu(event: Event): void {
        if (this.value == null || this.keySearch == null || this.keySearch.length == 0) {
            this.menuItemSearch = null;
            return;
        }

        try {
            let exp = new RegExp(this.mRegex(this.keySearch), "ig");
            this.menuItemSearch = this.value.filter(x => x.menuItemModel.target != null && exp.test(x.menuItemModel.title));
        } catch (ex) { }
    }

    public onClickMenu(itemEvent: ItemEventInterface): void {
        this.idRootFloatMenu = null;
        this.closeFavorite();
        this.clickMenu.next(itemEvent.item);
    }

    public onClickMenuFloat(item: MenuItemModel): void {
        this.resetMenusActive();
        this.setMenuParentsActive(this.value, item.id);
        this.onClickMenu(<ItemEventInterface>{ item: item });
    }

    public onClickSearch(itemEvent: ItemEventInterface): void {
        this.menuItemSearch = null;
        this.keySearch = "";
        this.onClickMenu(itemEvent);
        this.resetMenusActive();
        this.setMenuParentsActive(this.value, itemEvent.item.id);
    }

    public onClickFavorite(item: MenuItemModel): void {
        this.menuItemFavorite = this.value.filter(x => x.menuItemModel.isFavority);
        this.clickFavorite.next(item);
    }

    public onClickMyFavority(itemEvent: ItemEventInterface): void {
        this.reorganizeMenu = false;
        this.resetMenusActive();
        this.setMenuParentsActive(this.value, itemEvent.item.id);
        this.onClickMenu(itemEvent);
    }

    public onShowFloatMenu(itemEvent: ItemEventInterface): void {
        this.idRootFloatMenu = itemEvent.item.id;
        this.closeFavorite();
    }

    writeValue(value: Array<any>): void {
        if (value == null || value === undefined || typeof value != 'object')
            return;

        let imim = value.map(x => new InternalMenuItemModel(x));

        //Define active menu;
        this.resetMenusActive();
        let currentMenu = this.getMinRouterName(imim, this.router.url);

        if (currentMenu)
            this.setMenuParentsActive(imim, currentMenu.menuItemModel.id);

        this.value = imim;
        this.menuItemFavorite = this.value.filter(x => x.menuItemModel.isFavority);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        //throw new Error("Method not implemented.");
    }
}
