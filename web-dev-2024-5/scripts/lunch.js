'use strict'; 
import { dishes } from './dishes.js'


const category_names_dictionary = {
    'soup': 'суп',
    'main_course': 'главное блюдо',
    'beverages': 'напиток'
};

let total = 0;

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

function translate_category(category) {
    if (!(category in category_names_dictionary)) return 'блюдо';
    return category_names_dictionary[category];
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function connected_with_gender_word_chosen(word_to_match) {
    if (word_to_match.endsWith('о')) return 'выбрано';
    return 'выбран';
}

function construct_section_header(category) {
    const dish_section_header = document.createElement('h2');
    dish_section_header.className = 'section-header';
    dish_section_header.textContent = `Выберите ${translate_category(category)}`;
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

function fetch_dishes() {
    const main = document.querySelector('main');
    dishes.sort((a, b) => a.name.localeCompare(b.name));
    construct_dishes_sections(dishes, main);
}


function construct_order_output(parent_element) {
    const dish_input_form_header = document.createElement('h3');
    dish_input_form_header.classList.add('input-form-header');
    dish_input_form_header.textContent = 'Ваш заказ';

    const empty_order = document.createElement('p');
    empty_order.textContent = 'Ничего не выбрано';
    empty_order.classList.add('empty-order-p-style');
    parent_element.prepend(empty_order);
    
    const dish_sections = document.querySelectorAll('section.dish-section');
    
    const order_wrapper = document.createElement('ul');
    order_wrapper.id = 'card-list';

    dish_sections.forEach((section) => {
        const category = section.id.replace("-dish-section", "");
        const list_element_wrapper = document.createElement('li');
        list_element_wrapper.style.listStyleType = 'None';
        list_element_wrapper.id = `${category}-category-order-wrapper`;
        
        const category_translated_cap = capitalizeFirstLetter(translate_category(category));
        // Create label
        const category_label = document.createElement('label');
        category_label.classList.add('input-form-label');
        category_label.style.fontWeight = 500;
        category_label.setAttribute('for', `${category}-category-for-send`);
        category_label.textContent = category_translated_cap;
        // Create input
        const category_input = document.createElement('input');
        category_input.id = `${category}-category-for-send`;
        category_input.name = category;
        category_input.type = 'hidden';
        category_input.value = '';
        // Text
        const category_text = document.createElement('p');
        category_text.textContent = `${category_translated_cap} не ${connected_with_gender_word_chosen(category_translated_cap)}`;

        list_element_wrapper.appendChild(category_label);
        list_element_wrapper.appendChild(category_input);
        list_element_wrapper.appendChild(category_text);

        order_wrapper.appendChild(list_element_wrapper);
    });
    // Total header
    const order_total_header = document.createElement('label');
    order_total_header.for = 'order_total';
    order_total_header.classList.add('input-form-label');
    order_total_header.style.fontWeight = 550;
    order_total_header.textContent = 'Стоимость заказа';
    // Total content
    const order_total_content = document.createElement('input');
    order_total_content.id = 'order_total';
    order_total_content.name = 'order_total';
    order_total_content.type = 'hidden';
    order_total_content.value = '';
    // Total text
    const order_total_text = document.createElement('p');
    order_total_text.textContent = '0₽';
    order_total_text.style.fontSize = '23px';

    order_wrapper.appendChild(order_total_header);
    order_wrapper.appendChild(order_total_content);
    order_wrapper.appendChild(order_total_text);
    
    order_wrapper.classList.toggle('hide-element');
    parent_element.prepend(order_wrapper);
    parent_element.prepend(dish_input_form_header);
}

function add_to_order(card, category, category_order_wrapper) {
    const form_category_input = category_order_wrapper.querySelector('input');
    form_category_input.value = card.dataset.dish;

    const form_category_text = category_order_wrapper.querySelector('p');
    const dish_name = card.querySelector('p.add-to-card-name').textContent;
    const dish_price = card.querySelector('p.add-to-card-description').textContent;
    form_category_text.textContent = `${dish_name} ${dish_price}`;
}

function remove_from_order(card, category, category_order_wrapper) {
    const form_category_input = category_order_wrapper.querySelector('input');
    form_category_input.value = '';
    
    const category_translated_cap = capitalizeFirstLetter(translate_category(category));
    const form_category_text = category_order_wrapper.querySelector('p');
    form_category_text.textContent = `${category_translated_cap} не ${connected_with_gender_word_chosen(category_translated_cap)}`;
}

function work_with_card(event) {
    const card = event.target.parentElement;
    const category = card.parentElement.parentElement.id.replace('-dish-section', '');
    const card_dish_price = Number(card.querySelector('p.add-to-card-description').textContent.replace('₽', ''));
    
    const active_card = card.parentElement.querySelector('div.chosen');
    const category_order_wrapper = document.getElementById(`${category}-category-order-wrapper`);

    const order_wrapper = document.querySelector('ul#card-list');
    const empty_order_p_style = document.querySelector('p.empty-order-p-style');

    const order_total_content = document.querySelector('input#order_total');
    const order_total_text = order_wrapper.lastChild;

    // if active_card exists switch it to inactive
    if (active_card) {
        active_card.querySelector('button').textContent = 'Добавить';
        active_card.classList.toggle('chosen');

        const active_card_dish_price = Number(active_card.querySelector('p.add-to-card-description').textContent.replace('₽', ''));
        total -= active_card_dish_price;
        // Total recalculation
        order_total_text.textContent = `${total}₽`;
        // Exclude dish from order
        if (active_card == card) {
            remove_from_order(card, category, category_order_wrapper)
            if (!(total)) {
                order_wrapper.classList.add('hide-element');
                empty_order_p_style.classList.remove('hide-element');
            }
            return;
        }
    }
    card.querySelector('button').textContent = 'Добавлено';
    card.classList.toggle('chosen');
    // Add dish to order
    add_to_order(card, category, category_order_wrapper);
    total += card_dish_price;
    order_total_content.value = total;
    // Total recalculation
    order_total_text.textContent = `${total}₽`;
    
    if (total && order_wrapper.classList.contains('hide-element')) {
        order_wrapper.classList.remove('hide-element');
        empty_order_p_style.classList.add('hide-element');
    }
    
}

function validate_dishes(event) {
    if (!(total)) {
        event.preventDefault();
        alert('Выберите блюда, которые хотите заказать');
    }
}

function run_order_functionality() {
    const main = document.querySelector('main');
    // Enable cards actions
    const order_form_part = document.getElementById('order-form-part');
    const order_form = document.querySelector('form#order');
    
    order_form.addEventListener('submit', validate_dishes);
    
    construct_order_output(order_form_part);
    main.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-card-button')) {
            work_with_card(event);
        }
    });
}


fetch_dishes();
run_order_functionality();