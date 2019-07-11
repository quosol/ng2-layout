export class MenuItemHelper {
    static getNextParent(el: HTMLElement): HTMLElement | undefined {
        if (el.nextElementSibling) {
            return <HTMLElement>el.nextElementSibling;
        } else {
            const nextParent = this.getPrevParent(el, 'IATEC-MENU-ITEM');
            return nextParent ? this.getNextParent(nextParent) : undefined;
        }
    }

    static getPrevParent(elIRef: HTMLElement, elRequired: string): HTMLElement | null {
        let element = elIRef;
        while (element.parentNode) {
            element = <HTMLElement>element.parentNode;
            if (element.nodeName === elRequired) {
                break;
            }
            if (element.nodeName === 'NAV' && element.id === 'navMenuRoot') {
                return null;
            }
        }
        return element;
    }

    static setFocusToSearchInput(): void {
        const search = document.querySelectorAll('input[id="inputSearchId"]');
        if (search.length > 1) {
            (<HTMLInputElement>search[1]).select();
            (<HTMLInputElement>search[1]).focus();
        } else if (search.length === 1) {
            (<HTMLInputElement>search[0]).select();
            (<HTMLInputElement>search[0]).focus();
        }
    }
}
