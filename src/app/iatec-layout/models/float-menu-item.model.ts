import { MenuItemModel } from "./menu-item.model";

export class FloatMenuItemModel extends MenuItemModel {
    public childrens: Array<MenuItemModel> = [];

    constructor(item: MenuItemModel){
        super();
        this.id = item.id;
        this.iconClass = item.iconClass;
        this.isFavority = item.isFavority;
        this.parentId = item.parentId;
        this.target = item.target;
        this.title = item.title;
    }
}