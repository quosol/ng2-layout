import { Component, forwardRef, Input, ContentChildren, QueryList, ViewChildren, EventEmitter, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { MenuItemModel } from '../models';
import { InternalMenuItemModel } from '../models/internal-menu-item.model';
import { MenuItemComponent } from './menu-item.component';

@Component({
    selector: 'iatec-tree-menu',
    templateUrl: './tree-menu.component.html',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TreeMenuComponent), multi: true },
    ]
})

export class TreeMenuComponent implements ControlValueAccessor {

    private propagateChange: any = () => { };

    @ViewChildren(MenuItemComponent) private menuItemComponents: QueryList<MenuItemComponent>;
    @ViewChildren(TreeMenuComponent) private treeMenuComponents: QueryList<TreeMenuComponent>;

    public value: Array<InternalMenuItemModel>;

    @Input() parentId: number | string;
    @Input() templateMenuItem: TemplateRef<any>;
    @Output() showFloatMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    public onClick(item: MenuItemModel): void {
        this.menuItemComponents.forEach(mic => {
            if (mic.item.menuItemModel != item)
                mic.setActive(mic.item.menuItemModel == item);
        });

        this.treeMenuComponents.forEach(tree => {
            tree.menuItemComponents.forEach(mic => {
                if (!mic.getActive())
                    return;

                if (mic.item.menuItemModel != item)
                    mic.setActive(mic.item.menuItemModel == item);
            });
        });

        this.dispatchEvent(item);
    }

    public dispatchEvent(item: MenuItemModel): void {
        let ev = <MouseEvent>(event || window.event);
 
        if (item.target == null) {
            if(!(ev.clientX > 300))
                this.showFloatMenu.next(item);
        } else {
            this.clickMenu.next(item);
        }
    }

    public onClickFavorite(item: MenuItemModel): void {
        this.clickFavorite.next(item);
    }

    writeValue(value: any): void {
        if (value == null || value === undefined)
            return;

        this.value = value;
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