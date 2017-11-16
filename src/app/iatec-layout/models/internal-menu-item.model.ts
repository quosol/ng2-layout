import { MenuItemModel } from "./menu-item.model";

export class InternalMenuItemModel {
    public active: boolean = false;
    public semiActive: boolean = false;
    public menuItemModel: MenuItemModel;

    constructor(mim: MenuItemModel){
        this.menuItemModel = mim;
    }
}