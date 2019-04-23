import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    NgZone,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

export class MenuRootComponent implements ControlValueAccessor, OnDestroy {
    @Input() version: string = '';
    @Input() labelVersion: string;
    @Input() labelTermsOfUse: string = '';
    @Input() showLinkTermsUse: boolean = false;
    @Input() labelPlaceholder: string;
    @Input() labelFavorite: string;
    @Input() labelLoading: string;
    @Input() loading: boolean = false;
    @Input() parentId: number | string;
    @Input() iconClassLarge: string;

    @Output() clickMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickMenuEvent: EventEmitter<ItemEventInterface> = new EventEmitter<ItemEventInterface>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickTermsOfUse: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    @ViewChild(TreeMenuComponent) private treeMenuComponent: TreeMenuComponent;
    @ViewChild('favority') private favorite: MenuItemComponent;
    @ViewChild('inputSearch') private inputSearch: ElementRef;

    @ContentChild('templateMenuItem') public templateMenuItem: TemplateRef<any>;
    @ContentChild('templateFloatMain') public templateFloatMain: TemplateRef<any>;
    @ContentChild('') public templateFloatList: TemplateRef<any>;

    public value: Array<InternalMenuItemModel> = [];
    public keySearch: string = '';
    public menuItemSearch: Array<InternalMenuItemModel> = [];
    public menuItemFavorite: Array<InternalMenuItemModel> = [];
    public idRootFloatMenu: string | number;
    public favoriteItem: InternalMenuItemModel = <InternalMenuItemModel>{
        menuItemModel: <MenuItemModel>{
            title: this.labelFavorite || 'Favorite',
            iconClass: 'fas fa-star color-orange'
        }
    };

    private menuIndexSelected: number;
    private readonly arrowsUpAndDownEvent: EventListener;
    private readonly shortcutForSearch: EventListener;
    private reorganizeMenu: boolean = true;
    private propagateChange: any = () => {
    };

    constructor(
        private router: Router,
        private zone: NgZone,
        private elRef: ElementRef
    ) {
        this.router.events.subscribe(ev => {
            this.monitoringRouter(ev);
        });

        this.moveScroll();

        this.menuIndexSelected = -1;
        // Define callback for arrows event
        this.arrowsUpAndDownEvent = (ev: KeyboardEvent) => {
            switch (ev.key) {
                case 'ArrowUp':
                    if (this.menuIndexSelected >= 1 && this.menuItemSearch && this.menuIndexSelected < this.menuItemSearch.length) {
                        this.menuIndexSelected--;
                        this.moveScrollWithActive();
                    } else {
                        return;
                    }
                    this.menuItemSearch.forEach(item => {
                        if (item.menuItemModel.id === this.menuItemSearch[this.menuIndexSelected].menuItemModel.id) {
                            item.active = true;
                            try {
                                // (<HTMLElement>document.querySelector(`[data-menu-index="${this.menuIndexSelected}"]`)).focus();
                            } catch (e) {
                            }
                        } else {
                            item.active = false;
                        }
                    });
                    break;
                case 'ArrowDown':
                    if (this.menuItemSearch &&
                        (this.menuIndexSelected >= -1) &&
                        (this.menuIndexSelected < this.menuItemSearch.length - 1)
                    ) {
                        if (this.menuItemSearch[0].active && this.menuIndexSelected === -1) {
                            this.menuIndexSelected = 1;
                        } else {
                            this.menuIndexSelected++;
                            this.moveScrollWithActive();
                        }
                    } else {
                        return;
                    }
                    this.menuItemSearch.forEach(item => {
                        if (item.menuItemModel.id === this.menuItemSearch[this.menuIndexSelected].menuItemModel.id) {
                            item.active = true;
                            try {
                                // (<HTMLElement>document.querySelector(`[data-menu-index="${this.menuIndexSelected}"]`)).focus();
                            } catch (e) {
                            }
                        } else {
                            item.active = false;
                        }
                    });
                    break;
                case 'Enter':
                    if (this.keySearch && this.keySearch.trim() !== '' && this.menuIndexSelected !== -1) {
                        this.onClickSearch(<ItemEventInterface>{
                            mouseEvent: new MouseEvent('click'),
                            item: this.menuItemSearch[this.menuIndexSelected].menuItemModel
                        });
                    }
                    break;
            }
        };
        this.shortcutForSearch = (ev: KeyboardEvent) => {
            if (ev.ctrlKey && ev.shiftKey && (ev.key === 'f' || ev.key === 'F')) {
                if (localStorage.getItem('menuOpen') === 'false') {
                    try {
                        (<HTMLButtonElement>document.querySelector(`header.hidden-xs aside button.btn-menu`)).click();
                    } catch (e) {
                    }
                }
                // this.keySearch = '';
                this.inputSearch.nativeElement.select();
                this.inputSearch.nativeElement.focus();
            }
        };

        // Shortcut for search.
        this.zone.runOutsideAngular(() => {
            window.addEventListener('keyup', this.shortcutForSearch.bind(this));
        });

        // Arrows events.
        this.elRef.nativeElement.addEventListener('keydown', this.arrowsUpAndDownEvent.bind(this));
    }

    ngOnDestroy(): void {
        window.removeEventListener('keyup', this.shortcutForSearch);
        this.elRef.nativeElement.removeEventListener('keydown', this.arrowsUpAndDownEvent);
    }

    private moveScrollWithActive() {
        const nav = document.getElementById('navMenuRoot');
        if (nav) {
            const li = nav.children[0].children[this.menuIndexSelected].children[0] as any;
            if (li) {
                li.scrollIntoViewIfNeeded(false);
            }
        }
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

    public setMenuParentsActive(arr: Array<InternalMenuItemModel>, id: string | number): void {
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

    public filterDownMenu(ev: KeyboardEvent): void {
        if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
            ev.preventDefault();
            return;
        }
    }

    public filterUpMenu(ev: KeyboardEvent): void {
        if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown' || ev.key === 'Enter' || ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
            if (ev.key === 'Enter' && this.menuItemSearch && this.menuItemSearch.length && this.keySearch &&
                this.keySearch.length > 0 && this.menuItemSearch[0].active === true) {
                this.onClickSearch({
                    mouseEvent: new MouseEvent('click'),
                    item: this.menuItemSearch[0].menuItemModel
                });
            }
            return;
        }

        if (this.value == null || this.keySearch == null || this.keySearch.length === 0) {
            this.menuItemSearch = null;
            return;
        }

        try {
            this.menuIndexSelected = -1;
            const exp = new RegExp(this.mRegex(this.keySearch.toLowerCase()));
            this.menuItemSearch = this.value.filter(x => {
                x.active = false;
                return (x.menuItemModel.target != null) && exp.test(x.menuItemModel.title.toLowerCase());
            });
            if (this.menuItemSearch && this.menuItemSearch.length && this.keySearch && this.keySearch.length > 0) {
                this.menuItemSearch[0].active = true;
                document.getElementById('navMenuRoot').scrollTop = 0;
            }
        } catch (ex) {
        }
    }

    public onClickMenu(itemEvent: ItemEventInterface): void {
        this.idRootFloatMenu = null;
        this.closeFavorite();
        this.clickMenu.next(itemEvent.item);
        this.onClickMenuEvent(itemEvent);
    }

    public onClickMenuEvent(itemEvent: ItemEventInterface): void {
        this.clickMenuEvent.next(itemEvent);
    }

    public onClickMenuFloat(item: ItemEventInterface): void {
        this.resetMenusActive();
        this.setMenuParentsActive(this.value, item.item.id);
        this.onClickMenu(item);
    }

    public onClickSearch(itemEvent: ItemEventInterface): void {
        this.menuItemSearch = null;
        this.keySearch = '';
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

    public onClickTermsOfUse(): void {
        this.clickTermsOfUse.emit();
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
        // throw new Error("Method not implemented.");
    }

    private moveScroll() {
        (Element.prototype as any).scrollIntoViewIfNeeded = function (centerIfNeeded) {
            'use strict';

            function makeRange(start, length) {
                return { 'start': start, 'length': length, 'end': start + length };
            }

            function coverRange(inner, outer) {
                if (
                    false === centerIfNeeded ||
                    (outer.start < inner.end && inner.start < outer.end)
                ) {
                    return Math.max(
                        inner.end - outer.length,
                        Math.min(outer.start, inner.start)
                    );
                }
                return (inner.start + inner.end - outer.length) / 2;
            }

            function makePoint(x, y) {
                return {
                    'x': x,
                    'y': y,
                    'translate': function translate(dX, dY) {
                        return makePoint(x + dX, y + dY);
                    }
                };
            }

            function absolute(elem, pt) {
                while (elem) {
                    pt = pt.translate(elem.offsetLeft, elem.offsetTop);
                    elem = elem.offsetParent;
                }
                return pt;
            }

            let target = absolute(this, makePoint(0, 0)),
                extent = makePoint(this.offsetWidth, this.offsetHeight),
                elem = this.parentNode,
                origin;

            while (elem instanceof HTMLElement) {
                // Apply desired scroll amount.
                origin = absolute(elem, makePoint(elem.clientLeft, elem.clientTop));
                elem.scrollLeft = coverRange(
                    makeRange(target.x - origin.x, extent.x),
                    makeRange(elem.scrollLeft, elem.clientWidth)
                );
                elem.scrollTop = coverRange(
                    makeRange(target.y - origin.y, extent.y),
                    makeRange(elem.scrollTop, elem.clientHeight)
                );

                // Determine actual scroll amount by reading back scroll properties.
                target = target.translate(-elem.scrollLeft, -elem.scrollTop);
                elem = elem.parentNode;
            }
        };

    }
}
