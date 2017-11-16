import { Pipe, PipeTransform } from '@angular/core';
import { InternalMenuItemModel } from '../models/internal-menu-item.model';


/**
 * @ngModule IatecLayoutModule
 * @whatItDoes Creates a new List with menu filtred just Favorite.
 * @howToUse `array_expression | filterMenuFavorite`
 * 
 * @stable
 */
@Pipe({ name: 'filterMenuFavorite', pure: false })
export class FilterMenuFavoritePipe implements PipeTransform {
    transform(arr: Array<InternalMenuItemModel>): Array<InternalMenuItemModel> {
        if (arr == null || typeof arr != 'object')
            return arr;

        return arr.filter( x => x.menuItemModel.isFavority );
    }
}