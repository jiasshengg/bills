let appState = {
    numberOfPeople: 0,
    people: [],
    items: []
};

let pplCounter = 0;
let itemCounter = 0;

document.addEventListener('DOMContentLoaded', function () {
    function updateAppState() {
        const pplInputs = document.querySelectorAll('#pplList input[data-field="name"]');
        const itemInputs = document.querySelectorAll('#itemsList .item-input-group');
        appState.people = [];
        appState.items = [];
        appState.numberOfPeople = 0;

        pplInputs.forEach(input => {
            const name = input.value.trim();
            if (name) {
                appState.people.push(name);
                appState.numberOfPeople++;
            }
        });


        itemInputs.forEach(itemDiv => {
            const nameInput = itemDiv.querySelector('input[data-field="name"]');
            const priceInput = itemDiv.querySelector('input[data-field="price"]');
            const personCheckboxes = itemDiv.querySelectorAll('input[data-field="person"]:checked');

            if (nameInput && priceInput) {
                const itemName = nameInput.value.trim();
                const itemPrice = parseFloat(priceInput.value)

                const selectedPeople = Array.from(personCheckboxes).map(cb =>
                    appState.people[parseInt(cb.dataset.personIndex)]
                ).filter(person => person);

                if (itemName || itemPrice > 0 || selectedPeople.length > 0) {
                    appState.items.push({
                        name: itemName,
                        price: itemPrice,
                        people: selectedPeople
                    });
                }
            }

        })

        const submitBtn = document.querySelector('#submit-ppl-btn');
        const remainingPeople = document.querySelectorAll('#pplList .item-input-group').length;

        if (submitBtn && remainingPeople === 0) {
            submitBtn.remove();
        }

        const calculateBtn = document.querySelector('#calculate-btn');
        const itemFormsCount = document.querySelectorAll('#itemsList .item-input-group').length;

        if (itemFormsCount > 0 && !calculateBtn) {
            const newCalculateBtn = document.createElement('button');
            newCalculateBtn.id = 'calculate-btn';
            newCalculateBtn.className = 'calculate-btn';
            newCalculateBtn.textContent = 'Calculate Fees';
            newCalculateBtn.addEventListener('click', calculateFee);

            const itemsContainer = document.querySelector('#itemsContainer');
            itemsContainer.appendChild(newCalculateBtn);
        } else if (itemFormsCount === 0 && calculateBtn) {
            calculateBtn.remove();
        }
    }

    document.querySelector('#add-ppl-btn').addEventListener('click', addPplInput);
    document.querySelector('#add-item-btn').addEventListener('click', addItemInput);
    document.querySelector('#back-to-step1').addEventListener('click', backToStep1);

    function addPplInput() {
        const pplList = document.querySelector('#pplList');
        pplCounter++;

        const pplDiv = document.createElement('div');
        pplDiv.className = 'item-input-group';
        pplDiv.dataset.pplId = pplCounter;
        pplDiv.style.cssText = `
            margin-top: 20px;
            margin-bottom: 20px;
            margin-left: 25%;
            margin-right: 25%;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 10px;
            align-items: center;
            margin: 15px;
        `;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Name of Person';
        nameInput.required = true;
        nameInput.dataset.field = 'name';

        nameInput.addEventListener('input', updateAppState);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';

        removeBtn.addEventListener('click', () => {
            pplDiv.remove();
            updateAppState();
        });

        headerDiv.appendChild(nameInput);
        headerDiv.appendChild(removeBtn);
        pplDiv.appendChild(headerDiv);

        pplList.appendChild(pplDiv);

        const existingSubmitBtn = document.querySelector('#submit-ppl-btn');
        if (!existingSubmitBtn) {
            const submitBtn = document.createElement('button');
            submitBtn.id = 'submit-ppl-btn';
            submitBtn.textContent = 'Submit';

            submitBtn.addEventListener('click', function () {
                const emptyInputs = document.querySelectorAll('#pplList input[data-field="name"]');
                let hasEmpty = false;

                emptyInputs.forEach(input => {
                    if (!input.value.trim()) {
                        hasEmpty = true;
                        input.style.borderColor = '#f44336';
                    } else {
                        input.style.borderColor = '#ddd';
                    }
                });

                if (hasEmpty) {
                    alert('Please fill in all names before proceeding');
                    return;
                }

                updateAppState();

                document.querySelector('#step1').classList.add('hidden');
                document.querySelector('#step3').classList.remove('hidden');
            });

            pplList.parentNode.appendChild(submitBtn);
        }

        updateAppState();
    }

    function backToStep1() {
        document.querySelector('#step3').classList.add('hidden');
        document.querySelector('#step1').classList.remove('hidden');

        document.querySelector('#itemsList').innerHTML = '';
        document.querySelector('#summary').classList.add('hidden');
        appState.items = [];
        itemCounter = 0;

        updateAppState();
    }

    function addItemInput() {
        const itemsList = document.querySelector('#itemsList');
        itemCounter++;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-input-group';
        itemDiv.dataset.itemId = itemCounter;
        itemDiv.style.cssText = `
            margin-top: 20px;
            margin-bottom: 20px;
            margin-left: 20%;
            margin-right: 20%;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
        `;

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = `
            display: grid;
            grid-template-columns: 2fr 1fr auto;
            gap: 10px;
            align-items: center;
            overflow: hidden;
            margin: 15px;
        `;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Item name';
        nameInput.required = true;
        nameInput.dataset.field = 'name';

        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.step = '0.01';
        priceInput.placeholder = 'Price';
        priceInput.required = true;
        priceInput.dataset.field = 'price';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';

        removeBtn.addEventListener('click', () => {
            itemDiv.remove();
            updateAppState();
        });

        headerDiv.appendChild(nameInput);
        headerDiv.appendChild(priceInput);
        headerDiv.appendChild(removeBtn);

        const peopleDiv = document.createElement('div');

        const peopleTitle = document.createElement('h5');
        peopleTitle.textContent = 'Who used this Item ?';
        peopleDiv.appendChild(peopleTitle);

        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'checkbox-group';

        appState.people.forEach((person, index) => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `item-${itemCounter}-person-${index}`;
            checkbox.dataset.personIndex = index;
            checkbox.dataset.field = 'person';
            checkbox.addEventListener('change', updateAppState);

            const label = document.createElement('label');
            label.textContent = person;
            label.setAttribute('for', `item-${itemCounter}-person-${index}`);

            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            checkboxGroup.appendChild(checkboxItem);
        });

        peopleDiv.appendChild(checkboxGroup);

        itemDiv.appendChild(headerDiv);
        itemDiv.appendChild(peopleDiv);

        itemsList.appendChild(itemDiv);

        nameInput.addEventListener('input', updateAppState);
        priceInput.addEventListener('input', updateAppState);

        updateAppState();
    }

    function calculateFee() {
        updateAppState();

        let hasErrors = false;

        if (appState.items.length === 0) {
            alert('Please add at least one item before calculating');
            return;
        }

        appState.items.forEach((item, index) => {
            if (!item.name.trim()) {
                alert(`Item ${index + 1} needs a name`);
                hasErrors = true;
            }
            if (!item.price || item.price <= 0) {
                alert(`Item "${item.name}" needs a valid price`);
                hasErrors = true;
            }
            if (item.people.length === 0) {
                alert(`Item "${item.name}" needs at least one person selected`);
                hasErrors = true;
            }
        });

        if (hasErrors) {
            return;
        }

        const personTotals = {};
        appState.people.forEach(person => {
            personTotals[person] = 0;
        });

        appState.items.forEach(item => {
            const costPerPerson = item.price / item.people.length;
            item.people.forEach(person => {
                personTotals[person] += costPerPerson;
            });
        });

        displaySummary(personTotals);
    }

    function displaySummary(personTotals) {
        const summaryContent = document.querySelector('#summaryContent');
        const totalBill = Object.values(personTotals).reduce((sum, amount) => sum + amount, 0);

        let summaryHTML = `<div style="margin-bottom: 20px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0;">Total Bill: ${totalBill.toFixed(2)}</h4>
        </div>`;

        summaryHTML += '<div><h4>How much each person pays:</h4>';

        Object.entries(personTotals).forEach(([person, amount]) => {
            summaryHTML += `
                <div style="display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; font-size: 1.1em;">
                    <span><strong>${person}:</strong></span>
                    <span><strong>${amount.toFixed(2)}</strong></span>
                </div>
            `;
        });

        summaryHTML += '</div>';

        summaryContent.innerHTML = summaryHTML;
        document.querySelector('#summary').classList.remove('hidden');
    }
});
