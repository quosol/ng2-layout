import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'iatec-layout-css',
    template: `<!-- IATec CSS -->`,
    styleUrls: ['./global-css.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GlobalCssComponent {
    constructor(){
        if(localStorage.getItem('menuOpen') == 'true' || localStorage.getItem('menuOpen') == null)
            document.body.classList.add("menuOpen");        
    }
}