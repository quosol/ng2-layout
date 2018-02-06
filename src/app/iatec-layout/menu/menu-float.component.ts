import { Component, forwardRef, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { MenuItemModel, FloatMenuItemModel } from '../models';
import { InternalMenuItemModel } from '../models/internal-menu-item.model';

@Component({
    selector: 'iatec-menu-float',
    templateUrl: './menu-float.component.html',
    styleUrls: ['./menu-float.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MenuFloatComponent),
            multi: true
        }
    ]
})
export class MenuFloatComponent implements ControlValueAccessor {
    private propagateChange: any = () => { };
    public value: Array<InternalMenuItemModel>;
    public rootId: number | string;
    public typeMenu: string = 'box-large';
    public items: Array<FloatMenuItemModel> = [];
    public breadcrumbItems: Array<MenuItemModel> = [];

    @Input() labelFavorite: string;
    @Input() favorites: Array<InternalMenuItemModel>;
    @Input() parentId: number | string;
    @Input()
    set id(value: string | number) {
        if (value == null || this.value == null || !this.value.find(x => x.menuItemModel.id == value)) {
            this.onClose(null);
            return;
        }

        this.rootId = value;
        this.render();
    }
    @Input() iconClassLarge: string;
    @Input() layoutMain: TemplateRef<any>;
    @Input() layoutList: TemplateRef<any>;

    @Output() idChange: EventEmitter<string | number> = new EventEmitter<string | number>();
    @Output() clickMenu: EventEmitter<MenuItemModel> = new EventEmitter<MenuItemModel>();

    private render(): void {
        let filter = this.value.filter(x => x.menuItemModel.parentId == this.rootId);
        this.items = filter.map(x => {
            let mflm = new FloatMenuItemModel(x.menuItemModel);
            let childrens = this.value.filter(y => y.menuItemModel.parentId == x.menuItemModel.id).map(n => n.menuItemModel);
            if (childrens.length > 3) {
                childrens = childrens.slice(0, 3);
                childrens.push(<MenuItemModel>{ title: '...' });
            }
            mflm.childrens = childrens;
            return mflm;
        });
        this.breadcrumbItems = this.getMenuTreeParents(this.rootId).reverse();
        document.body.classList.add('menu-float-active');
    }

    private getMenuTreeParents(id: number | string): Array<MenuItemModel> {
        let items = this.value.filter(x => x.menuItemModel.id == id).map(m => m.menuItemModel);
        if (items.length > 0 && items[0].parentId != null)
            items = items.concat(this.getMenuTreeParents(items[0].parentId));

        return items;
    }

    public loadFavorite(): void {
        this.items = this.favorites.map(x => new FloatMenuItemModel(x.menuItemModel));
    }

    public setRootId(item: MenuItemModel, event: MouseEvent): void {
        event.stopPropagation();

        if (item.target == null) {
            this.idChange.emit(item.id);
        } else {
            this.clickMenu.next(item);
            this.onClose(event);
        }
    }

    public onClose(event: Event): void {
        if (event != null) {
            this.idChange.next(null);
            return;
        }
        document.body.classList.remove('menu-float-active');
    }

    public changeTypeMenu(value: string): void {
        this.typeMenu = value;
    }

    writeValue(value: any): void {
        if (value == null)
            return;

        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState?(isDisabled: boolean): void {
        // throw new Error('Method not implemented.');
    }
}
