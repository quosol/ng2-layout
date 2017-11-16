import { Pipe, PipeTransform } from '@angular/core';


/**
 * @ngModule IatecLayoutModule
 * @whatItDoes Creates a new List with menu filtred.
 * @howToUse `array_expression | filterMenu:key_id_model:id`
 * @description
 * This method dies soon after having built the new array, not being able to update without reloading the page.
 * 
 * @stable
 */
@Pipe({ name: 'filterMenu' })
export class FilterMenuPipe implements PipeTransform {
    transform(arr: Array<any>, key: string, id: number | string): Array<any> | any {
        if (arr == null || typeof arr != 'object')
            return arr;

        return arr.filter( x => x.menuItemModel[key] == id);
    }
}