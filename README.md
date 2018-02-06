[![npm version](https://badge.fury.io/js/%40iatec%2Fng2-layout.svg)](https://badge.fury.io/js/%40iatec%2Fng2-layout)

# LayoutIATec

## Installation

IATec layout runs on angular 2 and is available as an NPM package. You can install @iatec/ng2-layout
in your project's directory as usual:

```bash
$ npm install --save @iatec/ng2-layout
```

## Example
### Template 
#### Global layout
```
<iatec-layout-css></iatec-layout-css>
```
#### Header
```
<iatec-layout-header 
    logoURL="assets/images/logo.png"
    [profile]="profile"
    [entities]="entityListService.items"
    [currentEntity]="session.entity"
    (changeEntity)="onChangeEntity($event)"
    (allEntities)="onAllEntities($event)"
    [notifications]="notifications"
    (allNotifications)="onAllNotification($event)"
    (clickNotification)="onClickNotification($event)"
    (account)="onClickAccount($event)"
    (signOut)="onClickSignOut($event)"
    [languages]="languages"
    [currentLanguage]="selectedLanguage"
    (clickLanguage)="onClickLanguage($event)"
    >
    <!-- Custom template -->    
    <!-- <ng-template #templateNotification let-item>{{ item | json }}</ng-template> -->
    <!-- <ng-template #templateEntities></ng-template> -->
</iatec-layout-header>
```
#### Menu
```
<iatec-layout-menu 
    [loading]="loadingMenu" 
    [ngModel]="menus"
    [parentId]="1"
    (clickMenu)="onClickMenu($event)"
    (clickFavorite)="onClickFavorite($event)"
    version="1.0.0"
>
<!-- Custom menu template -->
<!-- <ng-template #templateMenuItem let-item>
        <i [class]="item.iconClass"></i> {{item.title}} <span class="badge">{{item.id}}</span>    
</ng-template>  -->
</iatec-layout-menu>
```
#### Menu
```
<iatec-layout-content [loading]="loading">
    <router-outlet></router-outlet>
</iatec-layout-content>
```
### TypeScript (.ts)
```
 import { IatecLayoutModule } from '@iatec/ng2-layout';
```

Add in your module
```
 @NgModule({   
   imports: [
    IatecLayoutModule,
   ]
 })
```
