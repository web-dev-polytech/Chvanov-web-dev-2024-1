import {
    categoryNamesDictionary,
    categoryOrder,
    baseUrl, apiKey,
    dishesURI, ordersURI
} from './supplementary.js';
    

let total = 0;


function translateCategory(category) {
    if (!(category in categoryNamesDictionary)) return 'блюдо';
    return categoryNamesDictionary[category];
}
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function connectedWithGenderWordChosen(wordToMatch) {
    if (wordToMatch.endsWith('о')) return 'выбрано';
    return 'выбран';
}
function removeDishFromOrder(category) {
    const categoryOrderWrapper = 
        document.getElementById(`${category}-category-order-wrapper`);
    const formCategoryInput = categoryOrderWrapper.querySelector('input');
    formCategoryInput.value = '';

    const formCategoryText = categoryOrderWrapper.querySelector('p');
    const categoryTranslatedCap = 
        capitalizeFirstLetter(translateCategory(category));
    formCategoryText.textContent = 
    `${categoryTranslatedCap} не ${connectedWithGenderWordChosen(
        categoryTranslatedCap
    )}`;
}
function removeCard(event) {
    const card = event.target.parentElement;
    const category = 
        card.dataset.category;
    const dishPrice = 
        Number(card.querySelector(
            'p.add-to-card-description'
        ).textContent.replace('₽', ''));
    
    let updatedOrderDishes = JSON.parse(localStorage.getItem('orderDishes'));

    // delete card
    card.remove();
    // delete dish from order
    removeDishFromOrder(category);
    // change total amount
    total -= dishPrice;
    const orderTotal = document.querySelector('p#order-total');
    orderTotal.textContent = `${total}₽`;

    // delete from localStorage
    delete updatedOrderDishes[category];
    localStorage.setItem('orderDishes', JSON.stringify(updatedOrderDishes));
    const nothingSelectedText
        = document.querySelector('p.nothing-selected-text');
    const nothingSelectedOrderText
        = document.querySelector('p.empty-order-p-style');
    const cardList
        = document.querySelector('ul#card-list');

    // show nothing selected text
    if (!(Object.keys(updatedOrderDishes).length)) {
        nothingSelectedText.classList.remove('hide-element');
        nothingSelectedOrderText.classList.remove('hide-element');

        cardList.classList.add('hide-element');
    }
}
async function runCardFunctionality() {
    const main = document.querySelector('main');
    main.addEventListener('click', async (event) => {
        if (event.target.classList.contains('remove-button')) {
            removeCard(event);
        }
    });
}


function constructOrderOutput(parentElement) {
    const dishInputFormHeader = document.createElement('h3');
    dishInputFormHeader.classList.add('input-form-header');
    dishInputFormHeader.textContent = 'Ваш заказ';

    const emptyOrder = document.createElement('p');
    emptyOrder.textContent = 'Ничего не выбрано';
    emptyOrder.classList.add('empty-order-p-style');
    parentElement.prepend(emptyOrder);
    
    const orderWrapper = document.createElement('ul');
    orderWrapper.id = 'card-list';

    for (let category in categoryNamesDictionary) {
        const listElementWrapper = document.createElement('li');
        listElementWrapper.style.listStyleType = 'None';
        listElementWrapper.id = `${category}-category-order-wrapper`;

        const categoryTranslatedCap = 
            capitalizeFirstLetter(translateCategory(category));
        // Create label
        const categoryLabel = document.createElement('label');
        categoryLabel.classList.add('input-form-label');
        categoryLabel.style.fontWeight = 500;
        categoryLabel.setAttribute('for', `${category}-category-for-send`);
        categoryLabel.textContent = categoryTranslatedCap;
        // Create input
        const categoryInput = document.createElement('input');
        categoryInput.id = `${category}-category-for-send`;
        categoryInput.name = `${category.replace('-', '_')}_id`;
        categoryInput.type = 'hidden';
        categoryInput.value = null;
        // Text
        const categoryText = document.createElement('p');
        categoryText.textContent = 
            `${categoryTranslatedCap} не ${connectedWithGenderWordChosen(
                categoryTranslatedCap
            )}`;

        listElementWrapper.appendChild(categoryLabel);
        listElementWrapper.appendChild(categoryInput);
        listElementWrapper.appendChild(categoryText);

        orderWrapper.appendChild(listElementWrapper);
    }

    // Total header
    const orderTotalHeader = document.createElement('label');
    orderTotalHeader.for = 'order_total';
    orderTotalHeader.classList.add('input-form-label');
    orderTotalHeader.style.fontWeight = 550;
    orderTotalHeader.textContent = 'Стоимость заказа';
    // Total content
    const orderTotalContent = document.createElement('input');
    orderTotalContent.id = 'order_total';
    orderTotalContent.type = 'hidden';
    // Total text
    const orderTotalText = document.createElement('p');
    orderTotalText.id = 'order-total';
    orderTotalText.textContent = '0₽';
    orderTotalText.style.fontSize = '23px';

    orderWrapper.appendChild(orderTotalHeader);
    orderWrapper.appendChild(orderTotalContent);
    orderWrapper.appendChild(orderTotalText);
    
    orderWrapper.classList.toggle('hide-element');

    parentElement.prepend(orderWrapper);
    parentElement.prepend(dishInputFormHeader);
}
function createBanner(text, reload = false) {
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
        if (reload) {
            location.reload();
        }
    });
    
    // Append the paragraph and button to the banner
    banner.appendChild(paragraph);
    banner.appendChild(button);
    
    // Append the banner to the section
    section.appendChild(banner);
    
    // Append the section to the body or a specific parent element
    document.querySelector('div.wrapper').appendChild(section);
}

function validateDishes(event) {
    const orderDishes = JSON.parse(localStorage.getItem('orderDishes'));
    const length = Object.keys(orderDishes).length;

    let correct = true;
    let bannerText = '';

    const soup_key = categoryOrder[0];
    const main_course_key = categoryOrder[1];
    const salad_key = categoryOrder[2];
    const drink_key = categoryOrder[3];
    const dessert_key = categoryOrder[4];

    if (
        length === 0
    ) {
        correct = false;
        bannerText = 'Ничего не выбрано. Выберите блюда для заказа';
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
        correct = false;
        bannerText = 'Выберите напиток';
    } else if (
        (drink_key in orderDishes
        || dessert_key in orderDishes)
        && !(main_course_key in orderDishes 
            || soup_key in orderDishes)
    ) {
        correct = false;
        bannerText = 'Выберите главное блюдо';
    } else if (
        soup_key in orderDishes
        && !(main_course_key in orderDishes 
            || salad_key in orderDishes)
    ) {
        correct = false;
        bannerText = 'Выберите главное блюдо или салат/стартер';
    } else if (
        salad_key in orderDishes
        && !(soup_key in orderDishes 
            || main_course_key in orderDishes)
    ) {
        correct = false;
        bannerText = 'Выберите суп или главное блюдо';
    }

    if (!(correct)) {
        event.preventDefault();
        createBanner(bannerText);
    }
}
function clearOrder(event = null) {
    const orderForm = document.querySelector('form#order');
    localStorage.setItem('orderDishes', JSON.stringify({}));
    orderForm.reset();
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function checkSenitizeSend(event) {
    event.preventDefault(); // Prevent the default form submission

    let bannerText = '';

    const form = event.target;
    const subscribeCheckbox = form.querySelector('input[name="subscribe"]');
    if (subscribeCheckbox && subscribeCheckbox.checked) {
        subscribeCheckbox.value = true;
    }
    const formData = new FormData(form);

    // chack if the time (if required) exists
    if (
        formData.get('delivery_type') === 'by_time' 
        && !formData.get('delivery_time')
    ) {
        bannerText = 'Укажите время доставки';
        createBanner(bannerText);
        return;
    }
    // Send the form data to the server using fetch
    const sendOrderUrl = new URL(
        `${baseUrl}${ordersURI}?api_key=${apiKey}`
    );
    fetch(sendOrderUrl, {method: 'POST', body: formData})
        .then(response => {
            if (!response.ok) {
                if (response.status === 422) {
                    throw new Error(
                        'Ошибка обработки заказа. Попробуйте снова'
                    );
                } else if (response.status === 404) {
                    throw new Error(
                        'Ошибка при отправки заказа. Попробуйте снова'
                    );
                } else if (response.status === 500) {
                    throw new Error(
                        'Ошибка сервера. Попробуйте позже'
                    );
                } else {
                    throw new Error(
                        `Неизвестная ошибка: ${response.statusText}`
                    );
                }
            }
            return response.json();
        })
        .then(() => {
            bannerText = 'Ваш заказ успешно оформлен';
            createBanner(bannerText, true);
            clearOrder();
        })
        .catch(error => {
            bannerText = error.message;
            createBanner(bannerText);
            console.error('Error:', error.message);
        });
}
async function createOrderPart() {
    const orderForm = document.querySelector('form#order');
    const orderFormPart = document.getElementById('order-form-part');
    const orderFormSendButton = 
        document.querySelector('button.input-form-button[type="submit"]');
    const orderFormResetButton = 
        document.querySelector('button.input-form-button[type="reset"]');
        
    orderFormSendButton.addEventListener('click', validateDishes);
    orderForm.addEventListener('submit', checkSenitizeSend);
    orderFormResetButton.addEventListener('click', () => {
        clearOrder();
        location.reload();
    });
    
    constructOrderOutput(orderFormPart);
}


function constructCard(dish) {
    // Card itself
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-category', dish.category);
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
    cardButton.classList.add('add-to-card-button', 'remove-button');
    cardButton.textContent = 'Удалить';
    cardContent.push(cardButton);

    // Fill card with content
    cardContent.forEach(child => card.appendChild(child));
    
    return card;
}
function addDishToOrder(dish) {
    const categoryOrderWrapper = 
        document.getElementById(`${dish.category}-category-order-wrapper`);
    const formCategoryInput = categoryOrderWrapper.querySelector('input');
    formCategoryInput.value = dish.id;

    const formCategoryText = categoryOrderWrapper.querySelector('p');
    formCategoryText.textContent = `${dish.name} ${dish.price}₽`;
}
async function fetchOrderDishes() {
    if (!(localStorage.getItem('orderDishes'))) {
        const orderDishes = {};
        localStorage
            .setItem('orderDishes', JSON.stringify(orderDishes));
    }
    let orderDishes = JSON.parse(localStorage.getItem('orderDishes'));
    const nothingSelectedText
        = document.querySelector('p.nothing-selected-text');
    const nothingSelectedOrderText
        = document.querySelector('p.empty-order-p-style');
    const cardList
        = document.querySelector('ul#card-list');

    if (Object.keys(orderDishes).length) {
        nothingSelectedText.classList.add('hide-element');
        nothingSelectedOrderText.classList.add('hide-element');

        cardList.classList.remove('hide-element');
    }

    const orderDishesBlock
        = document.querySelector('div.dish-block.section-content-wrapper');
    const orderTotal = cardList.querySelector('p#order-total');

    for (let category in orderDishes) {
        let dishUrl = new URL(
            `${baseUrl}${dishesURI}/${orderDishes[category]}?api_key=${apiKey}`
        );
        fetch(dishUrl, {method: 'GET'})
            .then(response => response.json())
            .then(
                (dish) => {
                    orderDishesBlock.appendChild(constructCard(dish));
                    addDishToOrder(dish);

                    total += dish.price;
                    orderTotal.textContent = `${total}₽`;
                }
            );
    }
}


function runOrderPageFunctionality() {
    runCardFunctionality();
    createOrderPart();

    fetchOrderDishes();
}
runOrderPageFunctionality();
