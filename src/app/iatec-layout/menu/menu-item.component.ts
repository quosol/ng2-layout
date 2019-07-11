import {Component, EventEmitter, HostListener, Input, Output, TemplateRef} from '@angular/core';
import {MenuItemModel} from '../models';
import {InternalMenuItemModel} from '../models/internal-menu-item.model';
import {ItemEventInterface} from '../interface/item-event.interface';
import {MenuItemHelper} from '../helpers/menu-item.helper';
import {KeyEnum} from '../enumerators/key.enum';

@Component({
    selector: 'iatec-menu-item',
    template: `
        <li [attr.id]="item?.menuItemModel?.id" (click)="onClick(item, $event)" [ngClass]="{ active: item.active, 'semi-active': item.semiActive }">
            <a [attr.title]="item?.menuItemModel?.title">
                <i *ngIf="!template" [ngClass]="item?.menuItemModel?.iconClass"></i> <span *ngIf="!template">{{ item?.menuItemModel?.title }}</span>
                <ng-template *ngIf="template" ngFor [ngForOf]="[item?.menuItemModel]" [ngForTemplate]="template"></ng-template>
                <i *ngIf="item?.menuItemModel?.target" class='fas fa-star favorite' [class.active]='item?.menuItemModel?.isFavority' title='Favorite' (click)="onFavorite(item, $event)"></i>
            </a>
            <ng-content></ng-content>
        </li>
    `,
    styles: [`:host:focus { outline: none; }`]
})
export class MenuItemComponent {
    @Input() item: InternalMenuItemModel;
    @Input() template: TemplateRef<any>;

    @Output() clickMenu: EventEmitter<ItemEventInterface> = new EventEmitter<ItemEventInterface>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() focusOutMenuItem: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    private withFocusEvent: boolean;

    public setActive(status: boolean = true): void {
        this.item.active = status;
        if (!status)
            this.item.semiActive = false;
    }

    public getActive(): boolean {
        return this.item.active;
    }

    public onClick(item: InternalMenuItemModel, ev: MouseEvent): void {
        ev.stopPropagation();
        if (ev.clientX > 300 && item.menuItemModel.target == null) {
            this.setActive(!this.item.active);
        } else if (!ev.ctrlKey) {
            this.item.semiActive = true;
        }
        this.clickMenu.next(<ItemEventInterface>{ mouseEvent: ev, item: item.menuItemModel });
    }

    public onFavorite(item: InternalMenuItemModel, ev: MouseEvent): void {
        ev.stopPropagation();
        item.menuItemModel.isFavority = !item.menuItemModel.isFavority;
        this.clickFavorite.next(item.menuItemModel);
    }

    @HostListener('focusin')
    focusIn(): void {
        this.withFocusEvent = true;
        this.item.semiActive = true;
    }

    @HostListener('focusout', ['$event'])
    focusOut(ev: FocusEvent): void {
        ev.stopPropagation();
        if (!ev.target || (ev.target && (<HTMLElement>ev.target).nodeName !== 'IATEC-MENU-ITEM')) {
            this.setActive(false);
            if (this.withFocusEvent) {
                this.focusOutMenuItem.emit(this.item.menuItemModel);
            }
        }
    }

    @HostListener('keydown', ['$event'])
    keydown(ev: KeyboardEvent): void {
        ev.stopPropagation();
        const target = (<HTMLElement>ev.target);
        let focusEl: any = null;
        // NOTE: Use if statement for browsers compatibility. (key for new browsers and keyCode for old browsers)
        if ((ev.key && ev.key === 'ArrowDown') || ev.keyCode === KeyEnum.DOWN_ARROW) {
            if ((<HTMLElement>ev.target).firstElementChild.classList.contains('active')) {
                focusEl = (<HTMLElement>ev.target).firstElementChild.lastElementChild.firstElementChild.firstElementChild;
            } else if (target.nextElementSibling) {
                focusEl = target.nextElementSibling;
            } else {
                const parent = MenuItemHelper.getPrevParent(target, 'IATEC-MENU-ITEM');
                focusEl = parent ? MenuItemHelper.getNextParent(parent) : undefined;
            }
            if (focusEl) {
                this.item.semiActive = false;
                focusEl.focus({preventScroll: false});
                (<any>focusEl).scrollIntoViewIfNeeded(false);
            }
            return;
        }
        if ((ev.key && ev.key === 'ArrowUp') || ev.keyCode === KeyEnum.UP_ARROW) {
            if (target.previousElementSibling) {
                const parentOpen = target.previousElementSibling.querySelectorAll('iatec-menu-item > li[id].active');
                if (parentOpen && parentOpen.length > 0) {
                    const lastParentOpen = parentOpen[parentOpen.length - 1];
                    focusEl = lastParentOpen.lastElementChild.firstElementChild.lastElementChild;
                    const nextParentFromOpened = parentOpen[parentOpen.length - 1].parentElement.nextElementSibling;
                    if (nextParentFromOpened && nextParentFromOpened !== ev.target) {
                        const parentList = MenuItemHelper.getPrevParent(
                            MenuItemHelper.getPrevParent(focusEl, 'IATEC-TREE-MENU'),
                            'IATEC-TREE-MENU'
                        );
                        focusEl = parentList.lastElementChild;
                        if (parentList.lastElementChild.nextElementSibling) {
                            const parentOfParentList = MenuItemHelper.getPrevParent(parentList, 'IATEC-TREE-MENU');
                            if (parentOfParentList) {
                                focusEl = parentOfParentList.lastElementChild;
                            }
                        }
                    }
                    if (focusEl) {
                        this.item.semiActive = false;
                        focusEl.focus({preventScroll: false});
                        (<any>focusEl).scrollIntoViewIfNeeded(false);
                    }
                    return;
                }
                focusEl = target.previousElementSibling;
            } else {
                focusEl = MenuItemHelper.getPrevParent(target, 'IATEC-MENU-ITEM');
            }
            if (focusEl) {
                this.item.semiActive = false;
                focusEl.focus({preventScroll: false});
                (<any>focusEl).scrollIntoViewIfNeeded(false);
            }
            return;
        }
        if ((ev.key && ev.key === 'ArrowRight') || ev.keyCode === KeyEnum.RIGHT_ARROW) {
            if (target.firstElementChild.lastElementChild.nodeName === 'UL') {
                this.item.active = true;
            }
            return;
        }
        if ((ev.key && ev.key === 'ArrowLeft') || ev.keyCode === KeyEnum.LEFT_ARROW) {
            if (target.firstElementChild.lastElementChild.nodeName === 'UL' && target.firstElementChild.classList.contains('active')) {
                this.item.active = false;
                this.item.semiActive = true;
            }
            return;
        }
        if ((ev.key && ev.key === 'Enter') || ev.keyCode === KeyEnum.ENTER) {
            if (!this.item.menuItemModel.target) {
                this.item.active = !this.item.active;
            }
            this.item.semiActive = true;
            this.clickMenu.emit(<ItemEventInterface>{mouseEvent: <any>{ctrlKey: false, clientX: 150}, item: this.item.menuItemModel});
            return;
        }
        if ((ev.key && ev.key === 'Escape') || ev.keyCode === KeyEnum.ESCAPE) {
            this.withFocusEvent = false;
            MenuItemHelper.setFocusToSearchInput();
            return;
        }
        if ((ev.key && ev.key === 'Tab') || ev.keyCode === KeyEnum.TAB) {
            ev.preventDefault();
            return;
        }
        if ((ev.key && ev.key.toUpperCase() === 'F') || ev.keyCode === KeyEnum.F) {
            if (ev.ctrlKey && ev.shiftKey) {
                this.withFocusEvent = false;
                MenuItemHelper.setFocusToSearchInput();
            }
            return;
        }
    }
}
