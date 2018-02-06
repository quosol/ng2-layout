import { Component, Input } from '@angular/core';

@Component({
    selector: 'iatec-layout-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css']
})
export class ContentComponent {
    @Input() loading: boolean = false;

}
