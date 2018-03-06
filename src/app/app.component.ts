import { Component, ViewEncapsulation } from '@angular/core';
import { MenuItemModel } from './iatec-layout/models/index';
import { EntityModel, ProfileModel, NotificationModel, LanguageModel } from './iatec-layout/models';
import { InternalMenuItemModel } from './iatec-layout/models/internal-menu-item.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    profile: ProfileModel = new ProfileModel();
    entities: Array<EntityModel> = [];
    currentEntity: EntityModel = new EntityModel();
    notifications: Array<NotificationModel> = [];
    languages: Array<LanguageModel> = [];
    selectedLanguage: LanguageModel = new LanguageModel();
    loadingMenu: boolean = false;
    menus: Array<InternalMenuItemModel> = [];
    parentId: number = 1;

    constructor(){
        this.profile.email = 'teste@iatec.com';
        this.profile.firstName = 'IATec';
        this.profile.imgURL = 'https://lh3.googleusercontent.com/oKsgcsHtHu_nIkpNd-mNCAyzUD8xo68laRPOfvFuO0hqv6nDXVNNjEMmoiv9tIDgTj8=w170'
        this.profile.lastName = 'Test'
        this.profile.username = 'iatec.test';

        let entity: EntityModel = new EntityModel();
        entity.codeEntity = 'IATec';
        entity.id = 0;
        entity.name = 'IATec Entity Test';

        this.entities.push(entity);
        this.currentEntity = {...entity};

        let notification: NotificationModel = new NotificationModel();
        notification.id = 0;
        notification.description = 'Notification 01';
        notification.imgURL = '';
        notification.size = '10';
        notification.title = 'Notification 01';

        this.notifications.push(notification);
    }
}
