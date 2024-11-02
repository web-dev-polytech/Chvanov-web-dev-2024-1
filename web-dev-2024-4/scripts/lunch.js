import { dishes } from './dishes.js'

const category_names_dictionary = {
    'soup': 'суп',
    'main_course': 'главное блюдо',
    'beverages': 'напиток'
};

function construct_card(dish) {
    // Card itself
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);

    const cardContent = [];
    // Dish image
    const cardImg = document.createElement('img');
    cardImg.src = `img/${dish.image}`;
    cardImg.alt = dish.name;
    cardContent.push(cardImg);
    // Dish price
    const cardPrice = document.createElement('p');
    cardPrice.className = 'add-to-card-description';
    cardPrice.textContent = `${dish.price}₽`;
    cardContent.push(cardPrice);
    // Dish name
    const cardName = document.createElement('p');
    cardName.classList.add('add-to-card-description', 'add-to-card-name');
    cardName.textContent = dish.name;
    cardContent.push(cardName);
    // Dish weight
    const cardWeight = document.createElement('p');
    cardWeight.className = 'add-to-card-weight';
    cardWeight.textContent = dish.count;
    cardContent.push(cardWeight);

    // Card button
    const cardButton = document.createElement('button');
    cardButton.className = 'add-to-card-button';
    cardButton.textContent = 'Добавить';
    cardContent.push(cardButton);

    // Fill card with content
    cardContent.forEach(child => card.appendChild(child));
    
    return card;
}
function construct_section_header(category) {
    const dish_section_header = document.createElement('h2');
    dish_section_header.className = 'section-header';
    if (category in category_names_dictionary) dish_section_header.textContent = `Выберите ${category_names_dictionary[category]}`;
    else dish_section_header.textContent = 'Выберите блюдо';
    return dish_section_header;
}
function construct_cards_block() {
    const dish_cards_block = document.createElement('div');
    dish_cards_block.classList.add('dish-block', 'section-content-wrapper');

    return dish_cards_block
}
function construct_section(category) {
    const dish_section = document.createElement('section');
    dish_section.id = `${category}-dish-section`;

    // Construct section header
    const dish_section_header = construct_section_header(category);
    dish_section.appendChild(dish_section_header);

    // Construct empty block to insert dishes
    const dish_cards_block = construct_cards_block();
    dish_section.appendChild(dish_cards_block);

    return dish_section;
}
function construct_dishes_sections(dishes, parent_element) {
    for (const dish of dishes) {
        let category_section_id = `${dish.category}-dish-section`;
        let category_section = document.getElementById(category_section_id);

        if (category_section === null) {
            parent_element.prepend(construct_section(dish.category));
            category_section = document.getElementById(category_section_id);
        } 
        else {
            let dish_section_header = category_section.querySelector('h2.section-header');
            if (dish_section_header === null) {
                category_section.prepend(construct_section_header(dish.category))
            }
            let dish_block = category_section.querySelector('div.dish-block');
            if (dish_block === null) {
                category_section.append(construct_cards_block())
            }
        }
        let dish_block = category_section.querySelector('div.dish-block');
        dish_block.appendChild(construct_card(dish));
    }
}

function main() {
    const main = document.querySelector('main');
    dishes.sort((a, b) => a.name.localeCompare(b.name));
    construct_dishes_sections(dishes, main);
}

main();
