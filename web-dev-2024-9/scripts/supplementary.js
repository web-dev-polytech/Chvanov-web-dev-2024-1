let DEBUG = false;


export let baseUrl = undefined;
export const apiKey = 'ea3b214c-57f1-48a8-836f-6a2446e2c634';

export const dishesURI = '/labs/api/dishes';
export const ordersURI = '/labs/api/orders';

if (DEBUG) {
    baseUrl = 'http://lab8-api.std-900.ist.mospolytech.ru';
} else {
    baseUrl = 'https://edu.std-900.ist.mospolytech.ru';
}


export const categoryNamesDictionary = {
    'soup': 'суп',
    'main-course': 'главное блюдо',
    'salad': 'салат или стартер',
    'drink': 'напиток',
    'dessert': 'десерт'
};
export const kindsDictionary = {
    'veg': 'вегетарианское',
    'meat': 'мясное',
    'fish': 'рыбное',
    'cold': 'холодный',
    'hot': 'горячий',
    'small': 'маленькая порция',
    'medium': 'средняя порция',
    'large': 'большая порция'
};
export const categoryOrder = [
    'soup',
    'main-course',
    'salad',
    'drink',
    'dessert'
];

