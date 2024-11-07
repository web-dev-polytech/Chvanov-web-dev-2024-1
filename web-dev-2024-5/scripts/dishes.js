export const category_names_dictionary = {
    'soup': 'суп',
    'main_course': 'главное блюдо',
    'salads_starters': 'салат или стартер',
    'beverages': 'напиток',
    'desserts': 'десерт'
};
export const kinds_dictionary = {
    'veg': 'вегетарианское',
    'meat': 'мясное',
    'seafood': 'рыбное',
    'cool': 'холодный',
    'hot': 'горячий',
    'small': 'маленькая порция',
    'medium': 'средняя порция',
    'large': 'большая порция'
};
export const category_order = [
    'soup',
    'main_course',
    'salads_starters',
    'beverages',
    'desserts'
];
export const dishes = [
    {
        keyword: 'gazpacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'soups/gazpacho.jpg',
        kind: 'veg'
    },
    {
        keyword: 'mushroom_soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'soups/mushroom_soup.jpg',
        kind: 'veg'
    },
    {
        keyword: 'norwegian_soup',
        name: 'Норвежский суп',
        price: 270,
        category: 'soup',
        count: '330 г',
        image: 'soups/norwegian_soup.jpg',
        kind: 'seafood'
    },
    {
        keyword: 'ramen',
        name: 'Рамён',
        price: 375,
        category: 'soup',
        count: '425 г',
        image: 'soups/ramen.jpg',
        kind: 'meat'
    },
    {
        keyword: 'tomyum',
        name: 'Том ям с креветками',
        price: 650,
        category: 'soup',
        count: '500 г',
        image: 'soups/tomyum.jpg',
        kind: 'seafood'
    },
    {
        keyword: 'chicken',
        name: 'Куриный суп',
        price: 330,
        category: 'soup',
        count: '350 г',
        image: 'soups/chicken.jpg',
        kind: 'meat'
    },

    {
        keyword: 'chickencutletsandmashedpotatoes',
        name: 'Котлеты из курицы с картофельным пюре',
        price: 225,
        category: 'main_course',
        count: '280 г',
        image: 'main_course/chickencutletsandmashedpotatoes.jpg',
        kind: 'meat'
    },
    {
        keyword: 'fishrice',
        name: 'Рыбная котлета с рисом и спаржей',
        price: 320,
        category: 'main_course',
        count: '270 г',
        image: 'main_course/fishrice.jpg',
        kind: 'seafood'
    },
    {
        keyword: 'shrimppasta',
        name: 'Паста с креветками',
        price: 340,
        category: 'main_course',
        count: '280 г',
        image: 'main_course/shrimppasta.jpg',
        kind: 'seafood'
    },
    {
        keyword: 'friedpotatoeswithmushrooms1',
        name: 'Жареная картошка с грибами',
        price: 150,
        category: 'main_course',
        count: '250 г',
        image: 'main_course/friedpotatoeswithmushrooms1.jpg',
        kind: 'veg'
    },
    {
        keyword: 'lasagna',
        name: 'Лазанья',
        price: 385,
        category: 'main_course',
        count: '310 г',
        image: 'main_course/lasagna.jpg',
        kind: 'veg'
    },
    {
        keyword: 'pizza',
        name: 'Пицца Маргарита',
        price: 470,
        category: 'main_course',
        count: '450 г',
        image: 'main_course/pizza.jpg',
        kind: 'meat'
    },

    {
        keyword: 'saladwithegg',
        name: 'Корейский салат с овощами и яйцом',
        price: 330,
        category: 'salads_starters',
        count: '250 г',
        image: 'salads_starters/saladwithegg.jpg',
        kind: 'veg'
    },
    {
        keyword: 'caesar',
        name: 'Цезарь с цыпленком',
        price: 370,
        category: 'salads_starters',
        count: '220 г',
        image: 'salads_starters/caesar.jpg',
        kind: 'meat'
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'salads_starters',
        count: '235 г',
        image: 'salads_starters/caprese.jpg',
        kind: 'veg'
    },
    {
        keyword: 'tunasalad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'salads_starters',
        count: '250 г',
        image: 'salads_starters/tunasalad.jpg',
        kind: 'seafood'
    },
    {
        keyword: 'frenchfries1',
        name: 'Картофель фри с соусом Цезарь',
        price: 280,
        category: 'salads_starters',
        count: '235 г',
        image: 'salads_starters/frenchfries1.jpg',
        kind: 'veg'
    },
    {
        keyword: 'frenchfries2',
        name: 'Картофель фри с соусом Цезарь',
        price: 260,
        category: 'salads_starters',
        count: '235 г',
        image: 'salads_starters/frenchfries2.jpg',
        kind: 'veg'
    },

    {
        keyword: 'orangejuice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/orangejuice.jpg',
        kind: 'cool'
    },
    {
        keyword: 'applejuice',
        name: 'Яблочный сок',
        price: 90,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/applejuice.jpg',
        kind: 'cool'
    },
    {
        keyword: 'carrotjuice',
        name: 'Морковный сок',
        price: 110,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/carrotjuice.jpg',
        kind: 'cool'
    },
    {
        keyword: 'cappuccino',
        name: 'Капучино',
        price: 180,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/cappuccino.jpg',
        kind: 'hot'
    },
    {
        keyword: 'greentea',
        name: 'Зеленый чай',
        price: 100,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/greentea.jpg',
        kind: 'hot'
    },
    {
        keyword: 'tea',
        name: 'Зеленый чай',
        price: 90,
        category: 'beverages',
        count: '300 мл',
        image: 'beverages/tea.jpg',
        kind: 'hot'
    },

    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'desserts',
        count: '300 г',
        image: 'desserts/baklava.jpg',
        kind: 'medium'
    },
    {
        keyword: 'checheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'desserts',
        count: '125 г',
        image: 'desserts/checheesecake.jpg',
        kind: 'small'
    },
    {
        keyword: 'chocolatecheesecake',
        name: 'Шоколадный чизкейк',
        price: 240,
        category: 'desserts',
        count: '125 г',
        image: 'desserts/chocolatecheesecake.jpg',
        kind: 'small'
    },
    {
        keyword: 'chocolatecake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'desserts',
        count: '140 г',
        image: 'desserts/chocolatecake.jpg',
        kind: 'small'
    },
    {
        keyword: 'donuts',
        name: 'Пончики (3 штук)',
        price: 410,
        category: 'desserts',
        count: '350 г',
        image: 'desserts/donuts.jpg',
        kind: 'medium'
    },
    {
        keyword: 'donuts2',
        name: 'Пончики (6 штук)',
        price: 650,
        category: 'desserts',
        count: '700 г',
        image: 'desserts/donuts2.jpg',
        kind: 'large'
    }
];