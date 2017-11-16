import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { MenuItemModel } from '../models';
import { InternalMenuItemModel } from '../models/internal-menu-item.model';
import { TreeMenuComponent } from './tree-menu.component';

@Component({
    selector: 'iatec-menu-item',
    template: `
        <li [attr.id]="item?.menuItemModel?.id" (click)="onClick(item)" [ngClass]="{active: item.active, 'semi-active': item.semiActive}" >
            <a [attr.title]="item?.menuItemModel?.title">
                <i *ngIf="!template" [ngClass]="item?.menuItemModel?.iconClass"></i> <span *ngIf="!template">{{item?.menuItemModel?.title}}</span>
                <ng-template *ngIf="template" ngFor [ngForOf]="[item?.menuItemModel]" [ngForTemplate]="template"></ng-template>
                <i *ngIf="item?.menuItemModel?.target" class='fa fa-star favorite' [class.active]='item?.menuItemModel?.isFavority' title='Favorite' (click)="onFavorite(item)"></i>
            </a>
            <ng-content></ng-content>
        </li>
    `,
    styles: [``]
})

export class MenuItemComponent {   
    @Input() item: InternalMenuItemModel;
    @Input() template: TemplateRef<any>;

    @Output() clickMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    public setActive(status: boolean = true): void {
        this.item.active = status;
        if (!status)
            this.item.semiActive = false;
    }

    public getActive(): boolean {
        return this.item.active;
    }

    public onClick(item: InternalMenuItemModel): void {
        let ev = <MouseEvent>(event || window.event);
        ev.stopPropagation();

        if (ev.clientX > 300 && item.menuItemModel.target == null) {
            this.setActive(!this.item.active);
        } else
            this.item.semiActive = true;
            
        this.clickMenu.next(item.menuItemModel);
    }

    public onFavorite(item: InternalMenuItemModel): void {
        event.stopPropagation();
        item.menuItemModel.isFavority = !item.menuItemModel.isFavority;
        this.clickFavorite.next(item.menuItemModel);
    }
}