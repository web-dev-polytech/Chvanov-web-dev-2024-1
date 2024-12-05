'use strict'; 
import {
    category_names_dictionary,
    kinds_dictionary,
    category_order
} from './supplementary.js';

// Uncomment for debuging
const DEBUG = true;

let total = 0;


function translate_category(category) {
    if (!(category in category_names_dictionary)) return 'блюдо';
    return category_names_dictionary[category];
}

function construct_card(dish) {
    // Card itself
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-dish_id', dish.id);
    card.setAttribute('data-kind', dish.kind);

    const cardContent = [];
    // Dish image
    const cardImg = document.createElement('img');
    cardImg.src = dish.image;
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
function construct_filtering_option(kind) {
    const filtering_option = document.createElement('button');
    filtering_option.classList.add('section-filter-option');
    filtering_option.textContent = kinds_dictionary[kind];

    filtering_option.setAttribute('data-kind', kind);

    return filtering_option;
}

function construct_section_header(category) {
    const dish_section_header = document.createElement('h2');
    dish_section_header.className = 'section-header';
    const elem_text = `Выберите ${translate_category(category)}`;
    dish_section_header.textContent = elem_text;
    return dish_section_header;
}
function construct_section_filter() {
    const filter = document.createElement('div');
    filter.classList.add('section-filter');
    
    return filter;
}
function construct_cards_block() {
    const dish_cards_block = document.createElement('div');
    dish_cards_block.classList.add('dish-block', 'section-content-wrapper');

    return dish_cards_block;
}

function construct_section(category) {
    const dish_section = document.createElement('section');
    dish_section.id = `${category}-dish-section`;
    dish_section.classList.add('dish-section');

    // Construct section header
    const dish_section_header = construct_section_header(category);
    dish_section.appendChild(dish_section_header);
    
    // Construct section filter
    const dish_section_filter = construct_section_filter();
    dish_section.appendChild(dish_section_filter);

    // Construct empty block to insert dishes
    const dish_cards_block = construct_cards_block();
    dish_section.appendChild(dish_cards_block);

    return dish_section;
}

function comboCorrect(orderDishes, orderDishesLength) {
    const soup_key = category_order[4];
    const main_course_key = category_order[3];
    const salad_key = category_order[2];
    const drink_key = category_order[1];
    const dessert_key = category_order[0];

    if (
        orderDishesLength === 0
    ) {
        console.log(1);
        return false;
    } else if ((
        (
            soup_key in orderDishes
            && main_course_key in orderDishes
            && salad_key in orderDishes
        )
        || (
            soup_key in orderDishes
            && main_course_key in orderDishes
            && !(salad_key in orderDishes)
        )
        || (
            soup_key in orderDishes
            && !(main_course_key in orderDishes)
            && salad_key in orderDishes
        )
        || (
            !(soup_key in orderDishes)
            && main_course_key in orderDishes
            && salad_key in orderDishes
        )
        || (
            !(soup_key in orderDishes)
            && main_course_key in orderDishes
            && !(salad_key in orderDishes)
        ))
        && !(drink_key in orderDishes)
    ) {
        console.log(2);
        return false;
    } else if (
        (drink_key in orderDishes
        || dessert_key in orderDishes)
        && !(main_course_key in orderDishes 
            || soup_key in orderDishes)
    ) {
        console.log(3); 
        return false;
    } else if (
        soup_key in orderDishes
        && !(main_course_key in orderDishes 
            || salad_key in orderDishes)
    ) {
        console.log(4);
        return false;
    } else if (
        salad_key in orderDishes
        && !(soup_key in orderDishes 
            || main_course_key in orderDishes)
    ) {
        console.log(5);
        return false;
    }
    return true;
}

function construct_dishes_sections(dishes, parent_element) {
    let temp_sections_container = {};
    const orderDishes = JSON.parse(localStorage.getItem('orderDishes'));
    const orderDishesLength = Object.keys(orderDishes).length;

    // fetching and constructing all cards
    for (const dish of dishes) {
        let category_section_id = `${dish.category}-dish-section`;
        let category_kind = dish.kind;
        let category_section = document.getElementById(category_section_id);

        // construct sections if not exist
        if (category_section === null) {
            parent_element.prepend(construct_section(dish.category));
            category_section = document.getElementById(category_section_id);
        }
        const dish_block = category_section.querySelector('div.dish-block');
        const section_filter = 
            category_section.querySelector('div.section-filter');
        
        // gradually fill filtering options
        const existing_filtering_option = 
            section_filter.querySelector(
                `button[data-kind="${category_kind}"]`
            );
        if (!(existing_filtering_option)) {
            section_filter.append(construct_filtering_option(category_kind));
        }

        let card = construct_card(dish);
        if (card.dataset.dish_id == orderDishes[dish.category]) {
            card.classList.add('chosen');
            card.querySelector('button').textContent = 'Добавлено';
            total += Number(dish.price);
        }
        dish_block.appendChild(card);
        temp_sections_container[dish.category] = category_section;
    }
    category_order.reverse().forEach((section_category) => {
        parent_element.prepend(temp_sections_container[section_category]);
        delete temp_sections_container[section_category];
    });
    
    for (let section_category in temp_sections_container) {
        parent_element.append(temp_sections_container[section_category]);
        delete temp_sections_container[section_category];
    }
    const bottomBarButton = document.querySelector('.bottom-bar-button');
    bottomBarButton.addEventListener('click', () => {
        if (!(bottomBarButton.classList.contains('button-inactive'))) {
            window.location.href = "order.html";
        }
    });
    if (orderDishesLength) {
        const bottomBar = document.querySelector('.bottom-bar');
        bottomBar.classList.remove("hide-element");

        const totalPriceTag = document.querySelector(".bottom-bar-total-price");
        totalPriceTag.textContent = total;
        console.log(orderDishes);
        if (comboCorrect(orderDishes, orderDishesLength)) {
            bottomBarButton.classList.remove('button-inactive');
        }
    }
}

function work_with_card(event) {
    const card = event.target.parentElement;
    const id = card.dataset.dish_id;
    const category = 
        card.parentElement.parentElement.id.replace('-dish-section', '');
    const card_dish_price = 
        Number(card.querySelector(
            'p.add-to-card-description'
        ).textContent.replace('₽', ''));
    
    const active_card = card.parentElement.querySelector('div.chosen');
    
    let updatedOrderDishes = JSON.parse(localStorage.getItem('orderDishes'));
    let updatedOrderDishesLength = Object.keys(updatedOrderDishes).length;

    const bottomBar = document.querySelector('.bottom-bar');    
    const bottomBarButton = bottomBar.querySelector('.bottom-bar-button');
    const totalPriceTag = document.querySelector(".bottom-bar-total-price");

    // if active_card exists switch it to inactive
    if (active_card) {
        active_card.querySelector('button').textContent = 'Добавить';
        active_card.classList.toggle('chosen');

        const active_card_dish_price = 
            Number(active_card.querySelector(
                'p.add-to-card-description'
            ).textContent.replace('₽', ''));
        total -= active_card_dish_price;
        
        if (active_card == card) {
            delete updatedOrderDishes[category];
            localStorage
                .setItem('orderDishes', JSON.stringify(updatedOrderDishes));
            updatedOrderDishesLength = Object.keys(updatedOrderDishes).length;
            if (!(comboCorrect(updatedOrderDishes, updatedOrderDishesLength))) {
                bottomBarButton.classList.add('button-inactive');
            }
            if (!(updatedOrderDishesLength)) {
                bottomBar.classList.add("hide-element");
            }
            totalPriceTag.textContent = total;
            return;
        }
    }
    card.querySelector('button').textContent = 'Добавлено';
    card.classList.toggle('chosen');

    total += card_dish_price;
    totalPriceTag.textContent = total;
    
    updatedOrderDishes[category] = id;
    localStorage.setItem('orderDishes', JSON.stringify(updatedOrderDishes));

    updatedOrderDishesLength = Object.keys(updatedOrderDishes).length;
    if (updatedOrderDishesLength) {
        bottomBar.classList.remove("hide-element");
    }
    if (comboCorrect(updatedOrderDishes, updatedOrderDishesLength)) {
        bottomBarButton.classList.remove('button-inactive');
    }
}

function unfilter_all(category_section) {
    for (const card of category_section.children) {
        if (card.classList.contains('filter-card')) {
            card.classList.remove('filter-card');
        }
    }
}

function filter_cards_by_kind(category_section, kind) {
    for (const card of category_section.children) {
        if (card.dataset.kind === kind) {
            card.classList.remove('filter-card');
        } else {
            card.classList.add('filter-card');
        }
    }
}

function filter_dishes(event) {
    const filter_option = event.target;
    const active_filter_option = 
        filter_option.parentElement.querySelector(
            'button.filter-option-chosen'
        );
    const category_section = 
        filter_option.parentElement.parentElement.querySelector(
            'div.dish-block'
        );

    const category = 
        filter_option.parentElement.parentElement.id.replace(
            '-dish-section', ''
        );
    const kind = filter_option.dataset.kind;

    filter_option.classList.add('filter-option-chosen');

    // if active_filter_option exists switch it to inactive
    if (active_filter_option) {
        active_filter_option.classList.toggle('filter-option-chosen');

        // Show all cards in category
        if (active_filter_option == filter_option) {
            // show all cards
            unfilter_all(category_section, kind);
            // remove_from_order(card, category, category_order_wrapper)
            return;
        }
    }
    filter_cards_by_kind(category_section, kind);
}


function run_card_functionality() {
    const main = document.querySelector('main');
    // Enable cards actions
    main.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-card-button')) {
            work_with_card(event);
        }
    });
}
function run_filter_functionality() {
    const main = document.querySelector('main');
    main.addEventListener('click', (event) => {
        if (event.target.classList.contains('section-filter-option')) {
            filter_dishes(event);
        }
    });
}

function run_shopping() {
    run_filter_functionality();
    run_card_functionality();
}

function fetchDishes() {
    const main = document.querySelector('main');

    let url = undefined;
    if (DEBUG) {
        url = 'http://lab8-api.std-900.ist.mospolytech.ru/labs/api/dishes';
    } else {
        url = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
    }
    let api = new URL(url);
    // Fetch dishes and construct sections
    fetch(api, {method: 'GET', api_key: 'ea3b214c-57f1-48a8-836f-6a2446e2c634'})
        .then(response => response.json())
        .then(
            dishes => {
                dishes.sort((a, b) => a.name.localeCompare(b.name));
                if (!(localStorage.getItem('orderDishes'))) {
                    const orderDishes = {};
                    localStorage
                        .setItem('orderDishes', JSON.stringify(orderDishes));
                }
                construct_dishes_sections(dishes, main);
                const comboSamples = document.querySelector('#combo-samples');
                main.prepend(comboSamples);
                
                run_shopping();
            }
        );
}

function runLunchPageFunctionality() {
    fetchDishes();
}
runLunchPageFunctionality();