'use strict'; 
import {
    category_names_dictionary,
    kinds_dictionary,
    category_order
} from './supplementary.js';

let total = 0;
let orderCategories = {};

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


function construct_card(dish) {
    // Card itself
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
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

function construct_dishes_sections(dishes, parent_element) {
    let temp_sections_container = {};
    for (const dish of dishes) {
        let category_section_id = `${dish.category}-dish-section`;
        let category_kind = dish.kind;
        let category_section = document.getElementById(category_section_id);

        if (category_section === null) {
            parent_element.prepend(construct_section(dish.category));
            category_section = document.getElementById(category_section_id);
        } else {
            let dish_section_header = 
                category_section.querySelector('h2.section-header');
            let dish_section_filter = 
                category_section.querySelector('div.section-filter');
            let dish_block = category_section.querySelector('div.dish-block');
            if (dish_section_header === null) {
                category_section.append(
                    construct_section_header(dish.category)
                );
            }
            if (dish_section_filter === null) {
                category_section.append(construct_section_filter());
            }
            if (dish_block === null) {
                category_section.append(construct_cards_block());
            }
        }
        const dish_block = category_section.querySelector('div.dish-block');
        const section_filter = 
            category_section.querySelector('div.section-filter');
        
        const existing_filtering_option = 
            section_filter.querySelector(
                `button[data-kind="${category_kind}"]`
            );
        if (!(existing_filtering_option)) {
            section_filter.append(construct_filtering_option(category_kind));
        }

        dish_block.appendChild(construct_card(dish));
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
    // move form-block to the end of parent_element
    const order_form_section = document.querySelector('section#order-form');
    parent_element.append(order_form_section);
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
        
        const category_translated_cap = 
            capitalizeFirstLetter(translate_category(category));
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
        category_text.textContent = 
            `${category_translated_cap} не ${connected_with_gender_word_chosen(
                category_translated_cap
            )}`;

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
    orderCategories[category] = category;
    
    const form_category_input = category_order_wrapper.querySelector('input');
    form_category_input.value = card.dataset.dish;

    const form_category_text = category_order_wrapper.querySelector('p');
    const dish_name = card.querySelector('p.add-to-card-name').textContent;
    const dish_price = 
        card.querySelector('p.add-to-card-description').textContent;
    form_category_text.textContent = `${dish_name} ${dish_price}`;
}

function remove_from_order(card, category, category_order_wrapper) {
    delete orderCategories[category];

    const form_category_input = category_order_wrapper.querySelector('input');
    form_category_input.value = '';
    
    const category_translated_cap = 
        capitalizeFirstLetter(translate_category(category));
    const form_category_text = category_order_wrapper.querySelector('p');
    form_category_text.textContent = 
        `${category_translated_cap} не ${connected_with_gender_word_chosen(
            category_translated_cap
        )}`;
}

function work_with_card(event) {
    const card = event.target.parentElement;
    const category = 
        card.parentElement.parentElement.id.replace('-dish-section', '');
    const card_dish_price = 
        Number(card.querySelector(
            'p.add-to-card-description'
        ).textContent.replace('₽', ''));
    
    const active_card = card.parentElement.querySelector('div.chosen');
    const category_order_wrapper = 
        document.getElementById(`${category}-category-order-wrapper`);

    const order_wrapper = document.querySelector('ul#card-list');
    const empty_order_p_style = document.querySelector('p.empty-order-p-style');

    const order_total_content = document.querySelector('input#order_total');
    const order_total_text = order_wrapper.lastChild;

    // if active_card exists switch it to inactive
    if (active_card) {
        active_card.querySelector('button').textContent = 'Добавить';
        active_card.classList.toggle('chosen');

        const active_card_dish_price = 
            Number(active_card.querySelector(
                'p.add-to-card-description'
            ).textContent.replace('₽', ''));
        total -= active_card_dish_price;
        // Total recalculation
        order_total_text.textContent = `${total}₽`;
        // Exclude dish from order
        if (active_card == card) {
            remove_from_order(card, category, category_order_wrapper);
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


function createBanner(text) {
    // Create the section element
    const section = document.createElement('section');
    section.className = 'combo-checker';
    
    // Create the banner div
    const banner = document.createElement('div');
    banner.className = 'combo-checker-banner';
    banner.id = 'combo-checker';
    
    // Create the paragraph element for the text
    const paragraph = document.createElement('p');
    paragraph.className = 'combo-checker-banner-text';
    paragraph.textContent = text;
    
    // Create the button element
    const button = document.createElement('button');
    button.className = 'combo-checker-banner-button';
    button.id = 'combo-checker-banner-button';
    button.textContent = 'Окей 👌🏼';
    button.addEventListener('click', () => {
        section.remove();
    });
    
    // Append the paragraph and button to the banner
    banner.appendChild(paragraph);
    banner.appendChild(button);
    
    // Append the banner to the section
    section.appendChild(banner);
    
    // Append the section to the body or a specific parent element
    document.querySelector('div.wrapper').appendChild(section);
}

function validate_dishes(event) {
    const length = Object.keys(orderCategories).length;
    let correct = true;
    let bannerText = '';

    let soup_key = category_order[4];
    let main_course_key = category_order[3];
    let salad_key = category_order[2];
    let drink_key = category_order[1];
    let dessert_key = category_order[0];

    if (
        length === 0
    ) {
        correct = false;
        bannerText = 'Ничего не выбрано. Выберите блюда для заказа';
    } else if ((
        (
            soup_key in orderCategories
            && main_course_key in orderCategories
            && salad_key in orderCategories
        )
        || (
            soup_key in orderCategories
            && main_course_key in orderCategories
            && !(salad_key in orderCategories)
        )
        || (
            soup_key in orderCategories
            && !(main_course_key in orderCategories)
            && salad_key in orderCategories
        )
        || (
            !(soup_key in orderCategories)
            && main_course_key in orderCategories
            && salad_key in orderCategories
        )
        || (
            !(soup_key in orderCategories)
            && main_course_key in orderCategories
            && !(salad_key in orderCategories)
        ))
        && !(drink_key in orderCategories)
    ) {
        correct = false;
        bannerText = 'Выберите напиток';
    } else if (
        (drink_key in orderCategories
        || dessert_key in orderCategories)
        && !(main_course_key in orderCategories 
            || soup_key in orderCategories)
    ) {
        correct = false;
        bannerText = 'Выберите главное блюдо';
    } else if (
        soup_key in orderCategories
        && !(main_course_key in orderCategories 
            || salad_key in orderCategories)
    ) {
        correct = false;
        bannerText = 'Выберите главное блюдо или салат/стартер';
    } else if (
        salad_key in orderCategories
        && !(soup_key in orderCategories 
            || main_course_key in orderCategories)
    ) {
        correct = false;
        bannerText = 'Выберите суп или главное блюдо';
    }

    if (!(correct)) {
        event.preventDefault();
        createBanner(bannerText);
    }
}

function run_card_functionality() {
    const main = document.querySelector('main');
    // Enable cards actions
    const order_form_part = document.getElementById('order-form-part');
    const order_form_button = 
        document.querySelector('button.input-form-button[type="submit"]');
    
    order_form_button.addEventListener('click', validate_dishes);
    
    construct_order_output(order_form_part);
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
    let api = new URL('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');

    // Fetch dishes and construct sections
    fetch(api, {method: 'GET'})
        .then(response => response.json())
        .then(
            dishes => {
                dishes.sort((a, b) => a.name.localeCompare(b.name));
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