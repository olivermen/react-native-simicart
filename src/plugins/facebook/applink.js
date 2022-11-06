import NavigationManager from '@helper/NavigationManager';

export function processAppLink(link, navigation) {
    if (!link.startsWith('http')) {
        let parts = link.split('?');
        let content = parts[0];
        let param = content.split('://');
        if (param[1].includes('category_id')) {
            let subParam = param[1].split('&');
            let cateID = subParam[0].split('=')[1];
            let hasChild = subParam[1].split('=')[1];
            if (hasChild == '1') {
                routeName = 'Category';
                params = {
                    categoryId: cateID,
                    categoryName: 'Facebook App Links',
                    showBack: false
                };
            } else {
                routeName = 'Products';
                params = {
                    categoryId: cateID,
                    categoryName: 'Facebook App Links',
                    showBack: false
                };
            }
            NavigationManager.openPage(navigation, routeName, params);
        } else if (param[1].includes('product_id')) {
            let productID = param[1].split('=')[1];
            NavigationManager.openPage(navigation, 'ProductDetail', {
                productId: productID,
                showBack: false
            });
        } else {
            return false;
        }
        return true;
    }
    return false;
}