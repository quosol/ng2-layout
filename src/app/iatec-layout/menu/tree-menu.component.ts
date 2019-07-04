import {Component, EventEmitter, forwardRef, Input, Output, QueryList, TemplateRef, ViewChildren} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {MenuItemModel} from '../models';
import {InternalMenuItemModel} from '../models/internal-menu-item.model';
import {MenuItemComponent} from './menu-item.component';
import {ItemEventInterface} from '../interface/item-event.interface';

@Component({
    selector: 'iatec-tree-menu',
    templateUrl: './tree-menu.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TreeMenuComponent),
            multi: true
        }
    ]
})
export class TreeMenuComponent implements ControlValueAccessor {
    private propagateChange: any = () => { };

    @ViewChildren(MenuItemComponent) private menuItemComponents: QueryList<MenuItemComponent>;
    @ViewChildren(TreeMenuComponent) private treeMenuComponents: QueryList<TreeMenuComponent>;

    public value: Array<InternalMenuItemModel>;

    @Input() parentId: number | string;
    @Input() templateMenuItem: TemplateRef<any>;
    @Output() showFloatMenu: EventEmitter<ItemEventInterface> = new EventEmitter<ItemEventInterface>();
    @Output() clickMenu: EventEmitter<ItemEventInterface> = new EventEmitter<ItemEventInterface>();
    @Output() clickFavorite: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();
    @Output() itemLostFocus: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    public onClick(itemEvent: ItemEventInterface): void {
        let item = itemEvent.item;
        this.menuItemComponents.forEach(mic => {
            if (!itemEvent.mouseEvent.ctrlKey && mic.item.menuItemModel != item)
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

        this.dispatchEvent(itemEvent);
    }

    public dispatchEvent(itemEvent: ItemEventInterface): void {
        let item = itemEvent.item;
        if (item.target == null) {
            if (!(itemEvent.mouseEvent.clientX > 300))
                this.showFloatMenu.next(itemEvent);
        } else {
            this.clickMenu.next(itemEvent);
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
        //throw new Error('Method not implemented.');
    }

    onFocusOutMenuItem(data: MenuItemModel): void {
        this.itemLostFocus.emit(data);
    }
}
