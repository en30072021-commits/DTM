// ==============================
// ДАННЫЕ
// ==============================
let MODULE_SPECS = {
    "Транспак 6000x2440": { area: 14.64, perimeter: 16.88 },
    "Транспак 4880x2440": { area: 11.9072, perimeter: 14.64 },
};

let PRICES = {
    "Электрика": {
        "Розетка": { price: 150, unit: "шт", editable: true },
        "Кабель 2.5 мм²": { price: 40, unit: "м", editable: false },
        "Автомат 25А": { price: 400, unit: "шт", editable: false },
        "Кабельканал 25 мм": { price: 30, unit: "м", editable: false },
        "Кабель 2x1.5 мм²": { price: 25, unit: "м", editable: false },
        "Автомат 10А": { price: 300, unit: "шт", editable: false },
        "Выключатель": { price: 120, unit: "шт", editable: false },
        "Кабельканал 40 мм": { price: 45, unit: "м", editable: false },
        "Светильник LED": { price: 800, unit: "шт", editable: true },
        "Щит ВРУ пластиковый": { price: 2000, unit: "шт", editable: false },
    },
    "Окна и аксессуары": {
        "Окно ПВХ поворотно-откидное": { price: 6000, unit: "шт", editable: true },
        "Окно ПВХ поворотное": { price: 5500, unit: "шт", editable: true },
        "Окно ПВХ откидное": { price: 5000, unit: "шт", editable: true },
        "Слуховое окно ПВХ": { price: 7000, unit: "шт", editable: true },
        "Подоконник ПВХ": { price: 1200, unit: "шт", editable: false },
        "Жалюзи алюминиевые": { price: 800, unit: "шт", editable: false },
        "Москитная сетка": { price: 500, unit: "шт", editable: false },
    },
    "Двери": {
        "Дверь металлическая утеплённая (входная)": { price: 12000, unit: "шт", editable: true },
        "Дверь металлическая противопожарная внутренняя": { price: 10000, unit: "шт", editable: true },
        "Дверь металлическая двупольная": { price: 10000, unit: "шт", editable: true },
        "Дверь пластиковая внутренняя": { price: 4000, unit: "шт", editable: true },
        "Дверь сантехнической перегородки": { price: 3000, unit: "шт", editable: true },
        "Дверь для VIP-перегородок": { price: 5000, unit: "шт", editable: true },
    },
    "Сантехника": {
        "Унитаз с бачком": { price: 4000, unit: "шт", editable: true },
        "Умывальник керамический": { price: 2500, unit: "шт", editable: true },
        "Умывальник пластиковый": { price: 1800, unit: "шт", editable: true },
        "Смеситель на раковину": { price: 1800, unit: "шт", editable: true },
        "Смеситель на душ": { price: 2200, unit: "шт", editable: true },
        "Бойлер 50 л": { price: 8000, unit: "шт", editable: true },
        "Труба PPR": { price: 120, unit: "м", editable: true },
        "Труба канализационная": { price: 180, unit: "м", editable: true },
        "Сифон сантехнический": { price: 600, unit: "шт", editable: false },
        "Гибкая подводка": { price: 200, unit: "шт", editable: false },
        "Кран шаровой": { price: 350, unit: "шт", editable: false },
    },
    "Отделка": {
        "Плинтус": { price: 80, unit: "м", editable: true },
        "Линолеум": { price: 300, unit: "м²", editable: true },
        "Кондиционер": { price: 25000, unit: "шт", editable: true },
    },
    "Мебель и оборудование": {
        "Кровать двухъярусная": { price: 15000, unit: "шт", editable: true },
        "Стол обеденный": { price: 5000, unit: "шт", editable: true },
        "Стул": { price: 1200, unit: "шт", editable: true },
        "Шкаф двухстворчатый": { price: 8000, unit: "шт", editable: true },
    },
    "Безопасность и вспомогательное": {
        "Огнетушитель ОП-4": { price: 800, unit: "шт", editable: true },
        "Аптечка": { price: 600, unit: "шт", editable: true },
        "Заземление комплект": { price: 2000, unit: "шт", editable: false },
        "Видеокамера": { price: 3000, unit: "шт", editable: true },
        "Пожарная сигнализация (комплект)": { price: 12000, unit: "компл.", editable: true },
    }
};

// ==============================
// СОСТОЯНИЕ И ФУНКЦИИ
// ==============================
let state = {
    modules: { "Транспак 6000x2440": 0, "Транспак 4880x2440": 0 },
    inputs: {},
    settings: {
        useVat: JSON.parse(localStorage.getItem('useVat')) || false,
        vatRate: parseFloat(localStorage.getItem('vatRate')) || 20.0
    }
};

function ceil(x) {
    return Math.ceil(x);
}

function calculateTotals(modules) {
    let totalArea = 0.0;
    let totalPerimeter = 0.0;
    let totalCount = 0;

    for (const [mod, cnt] of Object.entries(modules)) {
        if (cnt > 0 && MODULE_SPECS[mod]) {
            totalArea += MODULE_SPECS[mod].area * cnt;
            totalPerimeter += MODULE_SPECS[mod].perimeter * cnt;
            totalCount += cnt;
        }
    }
    return [ceil(totalArea), ceil(totalPerimeter), totalCount];
}

function updateAllInputs() {
    // Обновляем модули из UI
    for (const mod of Object.keys(MODULE_SPECS)) {
        const input = document.querySelector(`.quantity-input[data-module="${mod}"]`);
        if (input) {
            state.modules[mod] = parseInt(input.value) || 0;
        }
    }

    const [area, perimeter, totalMods] = calculateTotals(state.modules);

    // Электрика - авторасчеты
    const sockets = state.inputs["Электрика||Розетка"] || 0;
    const lights = state.inputs["Электрика||Светильник LED"] || 0;

    updateInputValue("Электрика", "Кабель 2.5 мм²", ceil(7 * sockets), false);
    updateInputValue("Электрика", "Автомат 25А", ceil(sockets / 2), false);
    updateInputValue("Электрика", "Кабельканал 25 мм", ceil(2 * sockets + 2 * lights), false);
    updateInputValue("Электрика", "Кабель 2x1.5 мм²", ceil(8 * lights), false);
    updateInputValue("Электрика", "Автомат 10А", totalMods, false);
    updateInputValue("Электрика", "Выключатель", lights, false);
    updateInputValue("Электрика", "Кабельканал 40 мм", ceil(perimeter / 2), false);
    updateInputValue("Электрика", "Щит ВРУ пластиковый", totalMods, false);

    // Окна и аксессуары
    const totalWin = [
        "Окно ПВХ поворотно-откидное",
        "Окно ПВХ поворотное",
        "Окно ПВХ откидное",
        "Слуховое окно ПВХ"
    ].reduce((sum, w) => sum + (state.inputs[`Окна и аксессуары||${w}`] || 0), 0);

    ["Подоконник ПВХ", "Жалюзи алюминиевые", "Москитная сетка"].forEach(acc => {
        updateInputValue("Окна и аксессуары", acc, totalWin, false);
    });

    // Сантехника
    const toilets = state.inputs["Сантехника||Унитаз с бачком"] || 0;
    const sinksCer = state.inputs["Сантехника||Умывальник керамический"] || 0;
    const sinksPlast = state.inputs["Сантехника||Умывальник пластиковый"] || 0;
    const totalSinks = sinksCer + sinksPlast;

    updateInputValue("Сантехника", "Сифон сантехнический", totalSinks, false);
    updateInputValue("Сантехника", "Гибкая подводка", totalSinks * 2, false);
    updateInputValue("Сантехника", "Кран шаровой", toilets * 2, false);

    // Безопасность
    updateInputValue("Безопасность и вспомогательное", "Заземление комплект", totalMods > 0 ? 1 : 0, false);

    // Отделка
    updateInputValue("Отделка", "Линолеум", area, false);
    updateInputValue("Отделка", "Плинтус", perimeter, false);
    updateInputValue("Отделка", "Кондиционер", totalMods, false);

    updateSummaryDisplay();
    generateReport();
}

function updateInputValue(category, item, value, isUserModified = true) {
    const key = `${category}||${item}`;
    const price = PRICES[category]?.[item]?.price || 0;
    const editable = PRICES[category]?.[item]?.editable ?? true;
    const maxVal = PRICES[category][item].unit === "м" || PRICES[category][item].unit === "м²" ? 500 : 100;
    const clampedValue = Math.max(0, Math.min(maxVal, value));

    if (isUserModified || editable) {
        state.inputs[key] = clampedValue;
    } else {
        // Автообновление не перезаписывает пользовательское значение
        if (!state.inputs.hasOwnProperty(key) || editable) {
            state.inputs[key] = clampedValue;
        }
    }

    const input = document.querySelector(`[data-category="${category}"][data-item="${item}"]`);
    if (input) {
        input.value = state.inputs[key];
        const costLabel = input.parentElement.querySelector('.cost-label');
        if (costLabel) {
            const total = state.inputs[key] * price;
            costLabel.textContent = `${total.toLocaleString()} ₽`;
            if (!isUserModified && !editable) {
                costLabel.classList.add('auto');
            } else {
                costLabel.classList.remove('auto');
            }
        }
    }
}

function updateSummaryDisplay() {
    const summaryContent = document.getElementById('summaryContent');
    let html = '';

    const mods = state.modules;
    const totalMods = Object.values(mods).reduce((a, b) => a + b, 0);

    if (totalMods > 0) {
        html += '<p><b>Модули:</b></p>';
        for (const [mod, cnt] of Object.entries(mods)) {
            if (cnt > 0 && MODULE_SPECS[mod]) {
                html += `<p>• ${mod} — <b>${cnt}</b> шт</p>`;
            }
        }
        const [area, perim] = calculateTotals(mods);
        html += `<p><b>Площадь:</b> ${area} м²</p>`;
        html += `<p><b>Периметр:</b> ${perim} м</p>`;
        html += '<br>';
    }

    let hasItems = false;
    for (const [key, value] of Object.entries(state.inputs)) {
        if (value > 0) {
            const [cat, name] = key.split('||');
            const unit = PRICES[cat]?.[name]?.unit || '';
            html += `<p>• ${name} — <b>${value}</b> ${unit}</p>`;
            hasItems = true;
        }
    }

    if (!hasItems && totalMods === 0) {
        html = '<p><i>Ничего не добавлено</i></p>';
    } else {
        let totalCost = 0;
        for (const [key, value] of Object.entries(state.inputs)) {
            const [cat, name] = key.split('||');
            const price = PRICES[cat]?.[name]?.price || 0;
            totalCost += value * price;
        }

        html += '<br>';
        html += `<p><b>Итого без НДС:</b> ${totalCost.toLocaleString()} ₽</p>`;

        if (state.settings.useVat) {
            const vat = totalCost * state.settings.vatRate / 100;
            const totalWithVat = totalCost + vat;
            html += `<p><b>НДС (${state.settings.vatRate}%):</b> ${vat.toLocaleString()} ₽</p>`;
            html += `<p><b>Итого с НДС:</b> ${totalWithVat.toLocaleString()} ₽</p>`;
        }
    }

    summaryContent.innerHTML = html;
}

function generateReport() {
    const itemsByCategory = {};
    for (const [key, value] of Object.entries(state.inputs)) {
        if (value <= 0) continue;
        const [cat, name] = key.split('||');
        if (!PRICES[cat]?.[name]) continue;

        if (!itemsByCategory[cat]) itemsByCategory[cat] = [];
        itemsByCategory[cat].push({
            name: name,
            qty: value,
            unit: PRICES[cat][name].unit,
            price: PRICES[cat][name].price
        });
    }

    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: 'Segoe UI', sans-serif; 
                background: #f8fafc; 
                color: #2c3e50; 
                line-height: 1.6; 
                margin: 0; 
                padding: 20px; 
            }
            .container { 
                max-width: 1000px; 
                margin: 0 auto; 
                background: white; 
                padding: 32px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
                border-radius: 16px;
                border: 1px solid #e2e8f0;
            }
            h2 { 
                text-align: center; 
                color: #2c3e50; 
                margin-bottom: 28px; 
                font-size: 26px;
                border-bottom: 2px solid #edf2f7;
                padding-bottom: 16px;
            }
            h3 { 
                color: #2c3e50; 
                margin: 24px 0 16px 0; 
                font-size: 18px;
                padding-bottom: 6px;
                border-bottom: 1px dashed #edf2f7;
            }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 24px; 
                font-size: 14px;
            }
            th, td { 
                padding: 12px 14px; 
                text-align: left; 
                border-bottom: 1px solid #edf2f7; 
            }
            th { 
                background: #f8fafc;
                color: #2c3e50;
                font-weight: 600;
            }
            td:nth-child(4), td:nth-child(5) { 
                text-align: right; 
                font-family: 'Courier New', monospace;
                font-weight: 600;
            }
            .total { 
                font-weight: bold; 
                background: #f1f2f6;
                color: #2c3e50;
            }
            .grand-total { 
                text-align: right; 
                font-size: 20px; 
                font-weight: bold; 
                margin-top: 28px; 
                padding-top: 20px; 
                border-top: 2px solid #e74c3c;
                color: #2c3e50;
            }
            .module-info {
                background: #f8fafc;
                padding: 16px;
                border-radius: 10px;
                margin-bottom: 24px;
                font-weight: 600;
                color: #2c3e50;
                border: 1px solid #edf2f7;
            }
            .footer-note {
                margin-top: 28px;
                padding-top: 16px;
                border-top: 1px solid #edf2f7;
                color: #7f8c8d;
                font-style: italic;
                text-align: center;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
    <div class="container">
    <h2>СМЕТА ПО МОДУЛЬНЫМ ЗДАНИЯМ<br>ООО «ДТМ»</h2>
    `;

    html += '<div class="module-info">Модули:<br>';
    for (const [mod, cnt] of Object.entries(state.modules)) {
        if (cnt > 0 && MODULE_SPECS[mod]) {
            html += `— ${mod}: <b>${cnt}</b> шт.<br>`;
        }
    }
    const [area, perim] = calculateTotals(state.modules);
    html += `— Площадь: <b>${area}</b> м²<br>`;
    html += `— Периметр: <b>${perim}</b> м<br>`;
    html += '</div>';

    html += "<hr style='border: none; border-top: 1px solid #edf2f7; margin: 24px 0;'>";

    let grandTotal = 0;
    for (const [cat, items] of Object.entries(itemsByCategory)) {
        const catTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
        grandTotal += catTotal;
        html += `<h3>${cat}</h3><table>`;
        html += "<tr><th>Наименование</th><th>Кол-во</th><th>Ед. изм.</th><th>Цена</th><th>Стоимость</th></tr>";
        for (const item of items) {
            const cost = item.qty * item.price;
            html += `<tr><td>${item.name}</td><td>${item.qty}</td><td>${item.unit}</td><td>${item.price.toFixed(2)}</td><td>${cost.toFixed(2)}</td></tr>`;
        }
        html += `<tr class="total"><td colspan="4">Итого по категории:</td><td>${catTotal.toFixed(2)}</td></tr>`;
        html += "</table>";
    }

    html += `<div class="grand-total">Общая стоимость без НДС: ${grandTotal.toFixed(2)} руб.</div>`;

    if (state.settings.useVat) {
        const vatAmount = grandTotal * state.settings.vatRate / 100;
        const totalWithVat = grandTotal + vatAmount;
        html += `<div class="grand-total">НДС (${state.settings.vatRate}%): ${vatAmount.toFixed(2)} руб.</div>`;
        html += `<div class="grand-total">Общая стоимость с НДС: ${totalWithVat.toFixed(2)} руб.</div>`;
    }

    html += '<div class="footer-note">Сформировано в ООО «ДТМ». Все цены указаны в рублях РФ.</div>';
    html += "</div></body></html>";

    document.getElementById('detailedReport').innerHTML = html;

    let summaryHtml = `
    <h3>Краткая сводка проекта — ООО «ДТМ»</h3>
    <p><b>Модули:</b> ${Object.values(state.modules).reduce((a, b) => a + b, 0)} шт</p>
    <p><b>Площадь:</b> ${area} м²</p>
    <p><b>Периметр:</b> ${perim} м</p>
    <p><b>Общая стоимость без НДС:</b> <span style='color:#2c3e50; font-weight:bold;'>${grandTotal.toFixed(2)} руб.</span></p>
    `;

    if (state.settings.useVat) {
        const vatAmount = grandTotal * state.settings.vatRate / 100;
        const totalWithVat = grandTotal + vatAmount;
        summaryHtml += `<p><b>НДС (${state.settings.vatRate}%):</b> ${vatAmount.toFixed(2)} руб.</p>`;
        summaryHtml += `<p><b>Общая стоимость с НДС:</b> <span style='color:#2c3e50; font-weight:bold;'>${totalWithVat.toFixed(2)} руб.</span></p>`;
    }

    document.getElementById('summaryReport').innerHTML = summaryHtml;
}

function goToStep(index) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`step${index}`).classList.add('active');
    document.querySelector(`[data-step="${index}"]`).classList.add('active');
}

function populateDynamicStep(stepId, categories) {
    const container = document.getElementById(`${stepId}-content`);
    container.innerHTML = '';
    const [area, perimeter, totalMods] = calculateTotals(state.modules);

    categories.forEach(cat => {
        const group = document.createElement('div');
        group.className = 'category-group';
        group.innerHTML = `<legend>${cat}</legend>`;
        const groupDiv = document.createElement('div');

        for (const [itemName, itemData] of Object.entries(PRICES[cat])) {
            const key = `${cat}||${itemName}`;
            const unit = itemData.unit;
            const maxVal = unit === "м" || unit === "м²" ? 500 : 100;
            const isAuto = !itemData.editable;

            let defaultValue = 0;
            if (cat === "Электрика") {
                const sockets = state.inputs["Электрика||Розетка"] || 0;
                const lights = state.inputs["Электрика||Светильник LED"] || 0;
                if (itemName === "Кабель 2.5 мм²") defaultValue = ceil(7 * sockets);
                else if (itemName === "Автомат 25А") defaultValue = ceil(sockets / 2);
                else if (itemName === "Кабельканал 25 мм") defaultValue = ceil(2 * sockets + 2 * lights);
                else if (itemName === "Кабель 2x1.5 мм²") defaultValue = ceil(8 * lights);
                else if (itemName === "Автомат 10А") defaultValue = totalMods;
                else if (itemName === "Выключатель") defaultValue = lights;
                else if (itemName === "Кабельканал 40 мм") defaultValue = ceil(perimeter / 2);
                else if (itemName === "Щит ВРУ пластиковый") defaultValue = totalMods;
            } else if (cat === "Окна и аксессуары") {
                const totalWin = [
                    "Окно ПВХ поворотно-откидное",
                    "Окно ПВХ поворотное",
                    "Окно ПВХ откидное",
                    "Слуховое окно ПВХ"
                ].reduce((sum, w) => sum + (state.inputs[`Окна и аксессуары||${w}`] || 0), 0);
                if (["Подоконник ПВХ", "Жалюзи алюминиевые", "Москитная сетка"].includes(itemName)) {
                    defaultValue = totalWin;
                }
            } else if (cat === "Сантехника") {
                const toilets = state.inputs["Сантехника||Унитаз с бачком"] || 0;
                const sinksCer = state.inputs["Сантехника||Умывальник керамический"] || 0;
                const sinksPlast = state.inputs["Сантехника||Умывальник пластиковый"] || 0;
                const totalSinks = sinksCer + sinksPlast;
                if (itemName === "Сифон сантехнический") defaultValue = totalSinks;
                else if (itemName === "Гибкая подводка") defaultValue = totalSinks * 2;
                else if (itemName === "Кран шаровой") defaultValue = toilets * 2;
            } else if (cat === "Безопасность и вспомогательное") {
                if (itemName === "Заземление комплект") defaultValue = totalMods > 0 ? 1 : 0;
            } else if (cat === "Отделка") {
                if (itemName === "Линолеум") defaultValue = area;
                else if (itemName === "Плинтус") defaultValue = perimeter;
                else if (itemName === "Кондиционер") defaultValue = totalMods;
            }

            const currentValue = state.inputs[key] !== undefined ? state.inputs[key] : defaultValue;
            state.inputs[key] = currentValue; // Ensure state is initialized

            const row = document.createElement('div');
            row.className = 'input-row';
            row.innerHTML = `
                <label>${itemName}:</label>
                <div class="quantity-control">
                    <button class="btn-minus" data-category="${cat}" data-item="${itemName}">−</button>
                    <input type="number" class="quantity-input" data-category="${cat}" data-item="${itemName}" min="0" max="${maxVal}" value="${currentValue}">
                    <button class="btn-plus" data-category="${cat}" data-item="${itemName}">+</button>
                    <span class="cost-label ${isAuto ? 'auto' : ''}" data-category="${cat}" data-item="${itemName}">${(currentValue * itemData.price).toLocaleString()} ₽ ${isAuto ? '(авто)' : ''}</span>
                </div>
            `;
            groupDiv.appendChild(row);
        }
        group.appendChild(groupDiv);
        container.appendChild(group);
    });
}

// ==============================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация
    updateAllInputs();
    renderModules();

    // Навигация
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const step = parseInt(btn.dataset.step);
            goToStep(step);
        });
    });

    // Навигация по шагам
    document.getElementById('next0').addEventListener('click', () => goToStep(1));
    document.getElementById('back1').addEventListener('click', () => goToStep(0));
    document.getElementById('next1').addEventListener('click', () => goToStep(2));
    document.getElementById('back2').addEventListener('click', () => goToStep(1));
    document.getElementById('next2').addEventListener('click', () => goToStep(3));
    document.getElementById('back3').addEventListener('click', () => goToStep(2));
    document.getElementById('next3').addEventListener('click', () => goToStep(4));
    document.getElementById('back4').addEventListener('click', () => goToStep(3));
    document.getElementById('next4').addEventListener('click', () => goToStep(5));
    document.getElementById('back5').addEventListener('click', () => goToStep(4));
    document.getElementById('next5').addEventListener('click', () => goToStep(6));
    document.getElementById('back6').addEventListener('click', () => goToStep(5));

    // Динамическое заполнение шагов 2-6
    populateDynamicStep('step1', ['Электрика']);
    populateDynamicStep('step2', ['Окна и аксессуары', 'Двери']);
    populateDynamicStep('step3', ['Сантехника']);
    populateDynamicStep('step4', ['Отделка', 'Мебель и оборудование']);
    populateDynamicStep('step5', ['Безопасность и вспомогательное']);

    // Обработчики для +/- и ввода
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-minus')) {
            if (e.target.dataset.module) {
                const mod = e.target.dataset.module;
                const input = e.target.nextElementSibling;
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    input.value = val - 1;
                    state.modules[mod] = input.value;
                    updateAllInputs();
                }
            } else {
                const cat = e.target.dataset.category;
                const item = e.target.dataset.item;
                const input = e.target.nextElementSibling;
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    input.value = val - 1;
                    updateInputValue(cat, item, input.value, true);
                }
            }
        }
        if (e.target.classList.contains('btn-plus')) {
            if (e.target.dataset.module) {
                const mod = e.target.dataset.module;
                const input = e.target.previousElementSibling;
                const maxVal = 50;
                let val = parseInt(input.value) || 0;
                if (val < maxVal) {
                    input.value = val + 1;
                    state.modules[mod] = input.value;
                    updateAllInputs();
                }
            } else {
                const cat = e.target.dataset.category;
                const item = e.target.dataset.item;
                const input = e.target.previousElementSibling;
                const maxVal = PRICES[cat][item].unit === "м" || PRICES[cat][item].unit === "м²" ? 500 : 100;
                let val = parseInt(input.value) || 0;
                if (val < maxVal) {
                    input.value = val + 1;
                    updateInputValue(cat, item, input.value, true);
                }
            }
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            if (e.target.dataset.module) {
                const mod = e.target.dataset.module;
                const maxVal = 50;
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > maxVal) val = maxVal;
                e.target.value = val;
                state.modules[mod] = val;
                updateAllInputs();
            } else {
                const cat = e.target.dataset.category;
                const item = e.target.dataset.item;
                const maxVal = PRICES[cat][item].unit === "м" || PRICES[cat][item].unit === "м²" ? 500 : 100;
                let val = parseInt(e.target.value) || 0;
                if (val < 0) val = 0;
                if (val > maxVal) val = maxVal;
                e.target.value = val;
                updateInputValue(cat, item, e.target.value, true);
            }
        }
    });

    // Настройки
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('useVatCheckbox').checked = state.settings.useVat;
        document.getElementById('vatRateInput').value = state.settings.vatRate;
        document.getElementById('settingsModal').classList.add('active');
    });

    document.getElementById('closeSettingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
    });

    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        state.settings.useVat = document.getElementById('useVatCheckbox').checked;
        state.settings.vatRate = parseFloat(document.getElementById('vatRateInput').value) || 20.0;
        localStorage.setItem('useVat', JSON.stringify(state.settings.useVat));
        localStorage.setItem('vatRate', state.settings.vatRate.toString());
        document.getElementById('settingsModal').classList.remove('active');
        updateAllInputs();
    });

    document.getElementById('openCatalogBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
        loadCatalogTree();
        document.getElementById('catalogModal').classList.add('active');
    });

    // Каталог
    document.getElementById('closeCatalogBtn').addEventListener('click', () => {
        document.getElementById('catalogModal').classList.remove('active');
    });

    document.getElementById('refreshCatalogBtn').addEventListener('click', loadCatalogTree);

    document.getElementById('addCatalogItemBtn').addEventListener('click', () => {
        const catSelect = document.getElementById('itemCategorySelect');
        catSelect.innerHTML = '';
        for (const cat of Object.keys(PRICES)) {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            catSelect.appendChild(opt);
        }
        document.getElementById('addItemTitle').textContent = 'Новая позиция';
        document.getElementById('itemNameInput').value = '';
        document.getElementById('itemUnitInput').value = '';
        document.getElementById('itemPriceInput').value = '';
        document.getElementById('addItemModal').classList.add('active');
        currentEditItem = null;
        currentEditCategory = null;
    });

    document.getElementById('removeCatalogItemBtn').addEventListener('click', () => {
        const selected = document.querySelector('.tree-item.selected');
        if (!selected || selected.classList.contains('tree-item-header')) {
            alert('Выберите позицию для удаления.');
            return;
        }
        const path = selected.dataset.path.split('||');
        const category = path[0];
        const name = path[1];
        if (confirm(`Удалить "${name}" из категории "${category}"?`)) {
            delete PRICES[category][name];
            loadCatalogTree();
        }
    });

    let currentEditItem = null;
    let currentEditCategory = null;

    document.getElementById('catalogTree').addEventListener('dblclick', (e) => {
        const itemEl = e.target.closest('.tree-item-child');
        if (itemEl) {
            const path = itemEl.dataset.path.split('||');
            const category = path[0];
            const name = path[1];
            const data = PRICES[category][name];

            currentEditItem = name;
            currentEditCategory = category;

            const catSelect = document.getElementById('itemCategorySelect');
            catSelect.innerHTML = '';
            for (const cat of Object.keys(PRICES)) {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                if (cat === category) opt.selected = true;
                catSelect.appendChild(opt);
            }
            catSelect.disabled = true;

            document.getElementById('addItemTitle').textContent = 'Редактировать позицию';
            document.getElementById('itemNameInput').value = name;
            document.getElementById('itemUnitInput').value = data.unit;
            document.getElementById('itemPriceInput').value = data.price;
            document.getElementById('addItemModal').classList.add('active');
        }
    });

    document.getElementById('saveItemBtn').addEventListener('click', () => {
        const name = document.getElementById('itemNameInput').value.trim();
        const unit = document.getElementById('itemUnitInput').value.trim();
        const price = parseFloat(document.getElementById('itemPriceInput').value) || 0;
        const category = document.getElementById('itemCategorySelect').value;

        if (!name) {
            alert('Наименование не может быть пустым.');
            return;
        }

        if (currentEditItem && currentEditItem !== name) {
            if (PRICES[category][name]) {
                alert(`Позиция "${name}" уже существует в категории "${category}".`);
                return;
            }
            delete PRICES[currentEditCategory][currentEditItem];
        }

        if (!PRICES[category][name]) {
            PRICES[category][name] = { price, unit, editable: true };
        } else {
            PRICES[category][name].price = price;
            PRICES[category][name].unit = unit;
        }

        document.getElementById('addItemModal').classList.remove('active');
        loadCatalogTree();
        // Пересоздаем динамические шаги
        populateDynamicStep('step1', ['Электрика']);
        populateDynamicStep('step2', ['Окна и аксессуары', 'Двери']);
        populateDynamicStep('step3', ['Сантехника']);
        populateDynamicStep('step4', ['Отделка', 'Мебель и оборудование']);
        populateDynamicStep('step5', ['Безопасность и вспомогательное']);
        updateAllInputs();
    });

    document.getElementById('cancelItemBtn').addEventListener('click', () => {
        document.getElementById('addItemModal').classList.remove('active');
    });

    // Добавление модулей
    document.getElementById('addModuleBtn').addEventListener('click', () => {
        document.getElementById('moduleNameInput').value = '';
        document.getElementById('moduleAreaInput').value = '';
        document.getElementById('modulePerimeterInput').value = '';
        document.getElementById('addModuleModal').classList.add('active');
    });

    document.getElementById('cancelModuleBtn').addEventListener('click', () => {
        document.getElementById('addModuleModal').classList.remove('active');
    });

    document.getElementById('saveModuleBtn').addEventListener('click', () => {
        const name = document.getElementById('moduleNameInput').value.trim();
        const area = parseFloat(document.getElementById('moduleAreaInput').value) || 0;
        const perimeter = parseFloat(document.getElementById('modulePerimeterInput').value) || 0;

        if (!name) {
            alert('Наименование не может быть пустым.');
            return;
        }
        if (area <= 0 || perimeter <= 0) {
            alert('Площадь и периметр должны быть положительными числами.');
            return;
        }
        if (MODULE_SPECS[name]) {
            alert(`Модуль "${name}" уже существует.`);
            return;
        }

        MODULE_SPECS[name] = { area, perimeter };
        state.modules[name] = 0;
        document.getElementById('addModuleModal').classList.remove('active');
        renderModules();
        updateAllInputs();
    });

    // Отчет
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab + 'Tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
        const content = document.getElementById('detailedReport').innerHTML;
        const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Смета_ООО_ДТМ.html';
        link.click();
    });
});

function renderModules() {
    const container = document.getElementById('modulesGrid');
    container.innerHTML = '';

    for (const [mod, count] of Object.entries(state.modules)) {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.dataset.module = mod;
        card.innerHTML = `
            <h3>${mod}</h3>
            <p>${MODULE_SPECS[mod].area} м² • ${MODULE_SPECS[mod].perimeter} м</p>
            <div class="quantity-control">
                <button class="btn-minus" data-module="${mod}">−</button>
                <input type="number" class="quantity-input" data-module="${mod}" min="0" max="50" value="${count}">
                <button class="btn-plus" data-module="${mod}">+</button>
                <span class="cost-label" data-module="${mod}">0 ₽</span>
            </div>
        `;
        container.appendChild(card);
    }
}

function loadCatalogTree() {
    const container = document.getElementById('catalogTree');
    container.innerHTML = '';
    for (const [category, items] of Object.entries(PRICES)) {
        const catHeader = document.createElement('div');
        catHeader.className = 'tree-item';
        catHeader.innerHTML = `<div class="tree-item-header" onclick="this.nextElementSibling.classList.toggle('hidden')">${category}</div>`;
        const catChildren = document.createElement('div');
        catChildren.className = 'tree-item-children';

        for (const [name, data] of Object.entries(items)) {
            const childItem = document.createElement('div');
            childItem.className = 'tree-item-child';
            childItem.dataset.path = `${category}||${name}`;
            childItem.innerHTML = `
                <span>${name}</span>
                <span>${data.unit} | ${data.price.toFixed(2)} ₽</span>
            `;
            catChildren.appendChild(childItem);
        }
        catHeader.appendChild(catChildren);
        container.appendChild(catHeader);
    }
}