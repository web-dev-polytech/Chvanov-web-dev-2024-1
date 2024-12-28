import {
    categoryNamesDictionary,
    baseUrl, apiKey,
    dishesURI, ordersURI
} from './supplementary.js';


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
        document.querySelector('body').style.overflow = '';
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


function constructShowDialog(orderJSON, contentsDict, cost, deliveryTime) {
    // Create the section element
    const section = document.createElement('section');
    section.className = 'combo-checker';
    
    section.innerHTML = `
        <div class="dialog">
            <div class="dialog-heading-close">
                <h2 class="dialog-heading">Просмотр заказа</h2>
                <button class="dialog-close">
                    <img src="img/X Bootstrap Icon.svg">
                </button>
            </div>
            <hr>
            <div class="dialog-main">

            </div>
            <hr>
            <div class="dialog-bottom">
                <button id="dialog-ok-button"
                  class="dialog-bottom-button">
                    Ок
                </button>
            </div>
        </div>
    `;
    
    const dialogMain = section.querySelector('div.dialog-main');

    let comment = orderJSON.comment;
    if (!comment) {
        comment = 'Без комментариев';
    }
    
    dialogMain.innerHTML = `
        <section id="created_at-section" class="label-info-section">
            <div class="label-info">
                <p class="label-info-column">Дата оформления</p>
                <p id="created_at-info" class="label-info-column">${
    orderJSON.created_at.replace('T', ' ').slice(0, -3)
}
                </p>
            </div>
        </section>
        
        <h3 class="label-info-heading">Доставка</h3>
        <section id="delivery-section" class="label-info-section">
            <div class="label-info">
                <p class="label-info-column">Имя получателя</p>
                <p id="name-info"
                    class="label-info-column">${orderJSON.full_name}</p>
            </div>
            <div class="label-info">
                <p class="label-info-column">Адрес доставки</p>
                <p class="label-info-column">${orderJSON.delivery_address}</p>
            </div>
            <div class="label-info">
                <p class="label-info-column">Время доставки</p>
                <p class="label-info-column">${deliveryTime}</p>
            </div>
            <div class="label-info">
                <p class="label-info-column">Телефон</p>
                <p class="label-info-column">${orderJSON.phone}</p>
            </div>
            <div class="label-info">
                <p class="label-info-column">Email</p>
                <p class="label-info-column">${orderJSON.email}</p>
            </div>
        </section>

        <h3 class="label-info-heading">Комментарий</h3>
        <section id="comment-section" class="label-info-section">
            <p id="comment-text">${comment}</p>
        </section>

        <h3 class="label-info-heading">Состав заказа</h3>
        <section id="contents-section" class="label-info-section">
            
        </section>

        <h3 class="label-info-heading">
            Стоимость: <span id="order-cost">${cost}₽</span></h3>
    `;
    const contentsElement = 
        dialogMain.querySelector('section#contents-section');

    for (let category in contentsDict) {
        const categoryBlock = document.createElement('div');
        categoryBlock.classList.add("label-info");

        const translatedCategory = categoryNamesDictionary[category];
        const capitalizedTrCategory = translatedCategory.charAt(0).toUpperCase()
            + translatedCategory.slice(1).toLowerCase();
        
        categoryBlock.innerHTML = `
            <p class="label-info-column">${
    capitalizedTrCategory
}</p>
            <p id="${category}-info" class="label-info-column">
                ${contentsDict[category]["name"]}
                (${contentsDict[category]["price"]}₽)
            </p>
        `;
        contentsElement.appendChild(categoryBlock);
    }

    const dialogClose = section.querySelector('button.dialog-close');
    dialogClose.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });
    const cancelButton = section.querySelector('button#dialog-ok-button');
    cancelButton.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });

    // Append the section to the body or a specific parent element
    document.querySelector('body').prepend(section);
    document.querySelector('body').style.overflow = 'hidden';
}


function checkSenitizeSendOrder(event, defaultDeliveryTime, orderId) {
    const form = event.target;
    const formData = new FormData(form);

    let bannerText = '';
    const deliveryTime = formData.get('delivery_time');
    if (
        formData.get('delivery_type') === 'by_time' 
        && !deliveryTime
    ) {
        bannerText = 'Укажите время доставки';
        createBanner(bannerText);
        return;
    }
    const nowDate = new Date();
    const [currentYear, currentMonth, currentDate] = [
        nowDate.getFullYear(),
        nowDate.getMonth(),
        nowDate.getDate(),
    ];
    const [storedHours, storedMinutes]
        = deliveryTime.split(':').map(Number);

    const deliveryDate = new Date(
        currentYear,
        currentMonth,
        currentDate,
        storedHours,
        storedMinutes
    );
    if (
        defaultDeliveryTime !== deliveryTime
        && formData.get('delivery_type') === 'by_time'
        && formData.get('delivery_time')
        && deliveryDate <= nowDate
    ) {
        bannerText = 'Выберите время позже настоящего';
        createBanner(bannerText);
        return;
    }
    const editOrderUrl = new URL(
        `${baseUrl}${ordersURI}/${orderId}?api_key=${apiKey}`
    );
    fetch(editOrderUrl, {method: 'PUT', body: formData})
        .then(response => {
            if (!response.ok) {
                if (
                    response.status === 404
                    || response.status === 422
                ) {
                    throw new Error(
                        `${response.status}
                            Ошибка обработки заказа. Попробуйте снова`
                    );
                } else if (response.status === 500) {
                    throw new Error(
                        `${response.status} Ошибка сервера. Попробуйте позже`
                    );
                } else {
                    throw new Error(
                        `${response.statusText} Неизвестная ошибка`
                    );
                }
            }
            return response.json();
        })
        .then(() => {
            bannerText = 'Заказ успешно изменён ✅';
            document.querySelector('section.combo-checker').remove();
            createBanner(bannerText, true);
        })
        .catch(error => {
            bannerText = error.message;
            createBanner(bannerText);
            console.error('Error:', error.message);
        });
}

function constructEditDialog(orderJSON, contentsDict, cost, deliveryTime) {
    // Create the section element
    const section = document.createElement('section');
    section.className = 'combo-checker';
    
    section.innerHTML = `
        <form id="edit-order" class="dialog"
          method="post" action="https://httpbin.org/post">
            <div class="dialog-heading-close">
                <h2 class="dialog-heading">Просмотр заказа</h2>
                <button class="dialog-close">
                    <img src="img/X Bootstrap Icon.svg">
                </button>
            </div>
            <hr>
            <div class="dialog-main">

            </div>
            <hr>
            <div class="dialog-bottom">
                <button id="dialog-cancel-button"
                  class="dialog-bottom-button">
                    Отмена
                </button>
                <button id="dialog-save-button"
                  type="submit" class="dialog-bottom-button save-button">
                    Сохранить
                </button>
            </div>
        </form>
    `;
    
    const dialogMain = section.querySelector('div.dialog-main');

    let comment = orderJSON.comment;
    if (!comment) {
        comment = '';
    }
    
    let rapidChecked = null;
    let byTimeChecked = null;
    if (orderJSON.delivery_type == "by_time"
      && orderJSON.hasOwnProperty('delivery_time')) {
        rapidChecked = '';
        byTimeChecked = 'checked';
    } else {
        rapidChecked = 'checked';
        byTimeChecked = '';
    }
    
    
    dialogMain.innerHTML = `
        <section id="created_at-section" class="label-info-section">
            <div class="label-info">
                <p class="label-info-column">Дата оформления</p>
                <p id="created_at-info" class="label-info-column">${
    orderJSON.created_at.replace('T', ' ').slice(0, -3)
}
                </p>
            </div>
        </section>
        
        <h3 class="label-info-heading">Доставка</h3>
        <section id="delivery-section" class="label-info-section">
            <div class="label-info">
                <label class="label-info-column" 
                  for="name">Имя</label>
                <input id="name" class="label-info-column input-form-item"
                  type="text" name="full_name" 
                  value="${orderJSON.full_name}" required>
            </div>
            <div class="label-info">
                <label class="label-info-column" for="address">
                    Адрес доставки
                </label>
                <input id="address" class="label-info-column input-form-item"
                  name="delivery_address"
                  type="text" value="${orderJSON.delivery_address}" required>
            </div>
            <div class="label-info">
                <legend class="label-info-column">Тип доставки</legend>
                <fieldset id="choose-time" class="label-info-column">
                    <input class="choose-time-option"
                      type="radio" id="rapid-delivery-option"
                      name="delivery_type" value="now" ${rapidChecked} required>
                    <label class="choose-time-option" 
                      for="rapid-delivery-option">
                        Как можно скорее
                    </label><br>
                    <input class="choose-time-option"
                      type="radio" id="bytime-delivery-option"
                      name="delivery_type" value="by_time" ${byTimeChecked}>
                    <label class="choose-time-option"
                      for="bytime-delivery-option">
                        К указанному времени
                    </label><br>
                </fieldset>
            </div>
            <div class="label-info">
                <label class="label-info-column"
                  for="delivery-time">Время доставки
                </label>
                <input type="time" id="delivery-time"
                  class="label-info-column input-form-item"
                  name="delivery_time" min="07:00" max="23:00" step="300"
                  value="${deliveryTime}">
            </div>
            <div class="label-info">
                <label class="label-info-column" for="phone">Телефон</label>
                <input id="phone" class="label-info-column input-form-item"
                  type="tel" name="phone" value="${orderJSON.phone}" required>
            </div>
            <div class="label-info">
                <label class="label-info-column" for="email">Email</label>
                <input id="email" class="label-info-column input-form-item"
                  type="email" name="email" value="${orderJSON.email}" required>
            </div>
        </section>

        <h3 class="label-info-heading">Комментарий</h3>
        <section id="comment-section" class="label-info-section">
            <textarea id="comment-text" class="input-form-item"
              name="comment" placeholder="Добавить комментарий">
${comment}</textarea>
        </section>

        <h3 class="label-info-heading">Состав заказа</h3>
        <section id="contents-section" class="label-info-section">
            
        </section>

        <h3 class="label-info-heading">
            Стоимость: <span id="order-cost">${cost}₽</span></h3>
    `;
    const contentsElement = 
        dialogMain.querySelector('section#contents-section');
    for (let category in contentsDict) {
        const categoryBlock = document.createElement('div');
        categoryBlock.classList.add("label-info");

        const translatedCategory = categoryNamesDictionary[category];
        const capitalizedTrCategory = translatedCategory.charAt(0).toUpperCase()
            + translatedCategory.slice(1).toLowerCase();
        
        categoryBlock.innerHTML = `
            <p class="label-info-column">${
    capitalizedTrCategory
}</p>
            <p id="${category}-info" class="label-info-column">
                ${contentsDict[category]["name"]}
                (${contentsDict[category]["price"]}₽)
            </p>
        `;
        contentsElement.appendChild(categoryBlock);
    }

    const dialogClose = section.querySelector('button.dialog-close');
    dialogClose.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });
    const cancelButton = section.querySelector('button#dialog-cancel-button');
    cancelButton.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });
    const orderForm = section.querySelector('form#edit-order');
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        checkSenitizeSendOrder(
            event,
            deliveryTime,
            orderJSON.id
        );
    });
    
    // Append the section to the body or a specific parent element
    document.querySelector('body').prepend(section);
    document.querySelector('body').style.overflow = 'hidden';
}


async function deleteOrder(orderId, section) {
    const orderDeleteUrl = 
        `${baseUrl}${ordersURI}/${orderId}?api_key=${apiKey}`;
    try {
        const deleteResponse = await fetch(orderDeleteUrl, {method: 'DELETE'});
        if (!deleteResponse.ok) {
            throw new Error(`Order response status: ${deleteResponse.status}`);
        }
        section.remove();
        createBanner("Заказ успешно удалён ✅", true);

    } catch (error) {
        createBanner("Не удалось удалить заказ ❌");
        console.error(error);
    }
}

function constructDeleteDialog(orderJSON) {
    // Create the section element
    const section = document.createElement('section');
    section.className = 'combo-checker';
    
    section.innerHTML = `
        <div class="dialog">
            <div class="dialog-heading-close">
                <h2 class="dialog-heading">Редактирование заказа</h2>
                <button class="dialog-close">
                    <img src="img/X Bootstrap Icon.svg">
                </button>
            </div>
            <hr>
            <div class="dialog-main">
                <p>Вы уверены, что хотите удалить этот заказ?</p>
            </div>
            <hr>
            <div class="dialog-bottom">
                <button id="dialog-cancel-button"
                  class="dialog-bottom-button">
                    Отмена
                </button>
                <button id="dialog-delete-button"
                  class="dialog-bottom-button delete-button">
                    Да
                </button>
            </div>
        </div>
    `;
    const dialogClose = section.querySelector('button.dialog-close');
    dialogClose.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });
    const cancelButton = section.querySelector('button#dialog-cancel-button');
    cancelButton.addEventListener('click', () => {
        section.remove();
        document.querySelector('body').style.overflow = '';
    });
    const deleteOrderButton = section.querySelector(
        'button#dialog-delete-button'
    );
    deleteOrderButton.addEventListener('click', () => {
        deleteOrder(orderJSON.id, section);
    });
    // Append the section to the body or a specific parent element
    document.querySelector('body').prepend(section);
    document.querySelector('body').style.overflow = 'hidden';
}

function constructOrder(orderJSON, contentsDict, contents, cost, orderIndex) {
    let timeCreated = orderJSON.created_at.replace('T', ' ');
    timeCreated = timeCreated.slice(0, -3);
    
    let deliveryTime = "";
    if (orderJSON.hasOwnProperty("delivery_type") 
      && orderJSON["delivery_type"] === "by_time") {
        deliveryTime = orderJSON["delivery_time"].slice(0, -3);
    } else {
        deliveryTime = "Как можно скорее<br>(с 07:00 до 23:00)";
    }
    const row = document.createElement('tr');
    row.id = `${orderIndex}-order`;
    row.className = 'table-row';

    row.innerHTML = `
        <td class="table-cell">${orderIndex}</td>
        <td class="table-cell">${timeCreated}</td>
        <td class="table-cell align-text-left wide-cell">${contents}</td>
        <td class="table-cell">${cost}₽</td>
        <td class="table-cell">${deliveryTime}</td>
        <td class="table-cell actions-cell">
            <div class="cell-actions-wrapper">
                <button id="view-order" 
                  class="view-order order-table-action-button">
                    <img src="img/order_action_icons/Eye Icon.svg">
                </button>
                <button id="edit-order"
                  class="edit-order order-table-action-button">
                    <img src="img/order_action_icons/Pencil Icon.svg">
                </button>
                <button id="delete-order"
                    class="delete-order order-table-action-button">
                    <img src="img/order_action_icons/Trash Icon.svg">
                </button>
            </div>
        </td>
    `;
    // show order function
    row.querySelector('#view-order').addEventListener(
        'click', () => constructShowDialog(
            orderJSON, contentsDict, cost, deliveryTime
        )
    );
    // edit order function
    row.querySelector('#edit-order').addEventListener(
        'click', () => constructEditDialog(
            orderJSON, contentsDict, cost, deliveryTime
        )
    );
    // delete order function
    row.querySelector('#delete-order').addEventListener(
        'click', () => constructDeleteDialog(orderJSON)
    );

    return row;
}

function dishesIdList(order) {
    const result = [];
    for (let key in order) {
        if (order.hasOwnProperty(key) && key.toLowerCase().includes('id')) {
            const categoryKey = key.replace("_id", "").replace("_", "-");
            if (categoryKey in categoryNamesDictionary) {
                const dishId = order[key];
                if (dishId !== null) {
                    result.push(dishId);
                }
            }
        }
    }
    return result;
}
async function createAppendOrderRow(
    orderJSON, dishes, parentElement, orderIndex
) {
    let cost = 0;
    let contents = "";
    let contentsDict = {};
    const dishesIdListVar = dishesIdList(orderJSON);
    for (let dishId of dishesIdListVar) {
        if (dishId === null) continue;

        let dish = dishes[dishId - 1];
        let dishFields = {
            "name": dish.name,
            "price": dish.price
        };

        contentsDict[dish.category] = {"name": dish.name, "price": dish.price};

        cost += dishFields['price'];
        contents = `${dishFields['name']}, ` + contents;
    }
    contents = contents.slice(0, -2);

    const orderRow = constructOrder(
        orderJSON, contentsDict, contents, cost, orderIndex
    );

    parentElement.appendChild(orderRow);
}

async function fetchOrders() {
    const orderUrl = `${baseUrl}${ordersURI}?api_key=${apiKey}`;
    const dishesUrl = `${baseUrl}${dishesURI}?api_key=${apiKey}`;
    try {
        const orderResponse = await fetch(orderUrl, {method: 'GET'});
        const dishesResponse = await fetch(dishesUrl, {method: 'GET'});
        if (!(orderResponse.ok && dishesResponse.ok)) {
            throw new Error(`Order response status: ${orderResponse.status}
                \nDishes response status: ${dishesResponse.status}`);
        }
        const orders = await orderResponse.json();
        const dishes = await dishesResponse.json();

        const parentElement = document.querySelector('#orders-table > tbody');

        // Create rows for orders
        let len = orders.length;
        for (let i = 0; i < len; i++) {
            let orderJSON = orders[len - (i + 1)];
            await createAppendOrderRow(orderJSON, dishes, parentElement, i + 1);
        }
    } catch (error) {
        console.error(error);
    }
}


function runOrdersPageFunctionality() {
    fetchOrders();
}

runOrdersPageFunctionality();