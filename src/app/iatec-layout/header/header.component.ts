import { Component, Input, Output, EventEmitter, ViewChild, ContentChild, TemplateRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityModel, ProfileModel, NotificationModel, LanguageModel } from '../models';

@Component({
    selector: 'iatec-layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() logoURL: string;
    @Input() logoURLMobile: string;
    @Input() profile: ProfileModel;
    @Input() labelAccount: string;
    @Input() labelSignOut: string;
    @Input() labelNotifications: string;
    @Input() labelShowAll: string;
    @Input() labelEntity: string;
    @Input() labelLanguage: string;
    @Input() notifications: Array<NotificationModel>;
    @Input() pendingNotifications: number = 0;
    @Input() entities: Array<EntityModel>;
    @Input() currentEntity: EntityModel;
    @Input() languages: Array<LanguageModel>;
    @Input() currentLanguage: LanguageModel;

    @Output() menuChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() changeEntity: EventEmitter<EntityModel> = new EventEmitter<EntityModel>();
    @Output() account: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() signOut: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() clickNotification: EventEmitter<NotificationModel> = new EventEmitter<NotificationModel>();
    @Output() clickIconNotification: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() allNotifications: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() allEntities: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() clickLanguage: EventEmitter<LanguageModel> = new EventEmitter<LanguageModel>();

    @ContentChild('templateNotification') public templateNotification: TemplateRef<any>;
    @ContentChild('templateEntities') public templateEntities: TemplateRef<any>;

    constructor(public router: Router) {
    }

    public onMenuOpen(event: Event): void {
        let status = document.body.classList.toggle('menuOpen');
        localStorage.setItem('menuOpen', status ? 'true' : 'false');
        this.menuChange.emit(status);
    }

    public onSignOut(event: Event): void {
        this.signOut.emit(event);
    }

    public onAccount(event: Event): void {
        this.account.emit(event);
    }

    public onClickIconNotification(event: Event): void {
        if((this.notifications == null || this.notifications.length == 0) && this.pendingNotifications > 0){
            this.clickIconNotification.next(event);
        }
    }

    public onClickNotification(notificationModel: NotificationModel): void {
        this.clickNotification.emit(notificationModel);
    }

    public onAllNotifications(event: Event): void {
        this.allNotifications.emit(event);
    }


    public onSelectEntity(entity: EntityModel): void {
        this.changeEntity.next(entity);
    }

    public onAllEntities(event: Event): void {
        this.allEntities.emit(event);
    }

    public goHome(event: Event): void {
        this.router.navigateByUrl('/');
    }

    public onClickLanguage(item: LanguageModel): void {
        this.clickLanguage.next(item);
        document.querySelector('[aria-labelledby=dropdownMenuButtonM]').classList.toggle('show');
        document.querySelector('[aria-labelledby=dropdownMenuButton]').classList.toggle('show');
    }

    ngOnInit(): void {

        let id = 'dropdownMenuButton' 
        let lang = document.querySelector('#' + id); 
        lang.addEventListener('click', function (event) { 
            document.querySelector('[aria-labelledby=' + id + ']').classList.toggle('show'); 
            event.stopPropagation() 
        }); 

        let idM = 'dropdownMenuButtonM' 
        let langM = document.querySelector('#' + idM); 
        langM.addEventListener('click', function (event) { 
            document.querySelector('[aria-labelledby=' + idM + ']').classList.toggle('show'); 
            event.stopPropagation() 
        }); 
        // workaround to implements dropbutton inner dropdown
        // let lang = document.querySelectorAll(".ddMbutton");
        // for (var i = 0; i < lang.length; i++) {
        //     lang[i].addEventListener('click', function (event) {
        //         document.querySelector('[aria-labelledby=' + lang[i] +  ']').classList.toggle('show');
        //         event.stopPropagation()
        //     });
        // }
    }


}
