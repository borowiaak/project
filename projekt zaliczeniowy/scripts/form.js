const $nameInput = document.getElementById('name');
const $financingInputs = document.querySelectorAll('input[type="radio"]');
const $financingLeasing = document.getElementById('leasing');
const $financingCash = document.getElementById('cash');
const $accessoriesCheckbox = document.querySelectorAll('input[type="checkbox"]');
const $rimsCheckbox = document.getElementById('rims');
const $leatherSeatsCheckbox = document.getElementById('leater_seats');
const $ambilightCheckbox = document.getElementById('ambilight');
const $warrantyCheckbox = document.getElementById('warranty');
const $orderButton = document.getElementById('order');
const $loginError = document.getElementById('login_error');
const $returnButton = document.getElementById('returnButton');

// POBRANY NAGŁÓWEK ORAZ CENA Z MAINSCREEN.HTML
const $carHeading = document.getElementById('selected_car_heading');
const $carFinalPrice = document.getElementById('final_price');

const selectedCarHeading = localStorage.getItem('heading');
const selectedCarPrice = localStorage.getItem('price');
const carPrice = changePriceToNumber(selectedCarPrice);

$carHeading.textContent = selectedCarHeading;
$carFinalPrice.textContent = formatPrice(carPrice);

function changePriceToNumber(priceText) {
	return Number(priceText.replace(/\D/g, ''));
}

function formatPrice(price) {
	return price.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
}

// ZAZNACZONA METODA PŁATNOŚCI
const financingRadios = document.querySelectorAll('.form__data-financing-checked');

function saveSelectedFinancing() {
	const selectedFinancing = Array.from(financingRadios).find(radio => radio.checked).nextElementSibling.textContent;
	localStorage.setItem('selectedFinancing', selectedFinancing);
}

$orderButton.addEventListener('click', () => {
	if (Array.from(financingRadios).some(radio => radio.checked)) {
		saveSelectedFinancing();
		window.location.href = 'orderedScreen.html';
	}
});

// DATA DOSTAWY + 14 DNI
const today = new Date();
const deliveryDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();

document.getElementById('dateDelivery').innerHTML = deliveryDate;

// POBRANIE DATY DOSTAWY NA STRONĘ Z PODZIĘKOWANIEM
$orderButton.addEventListener('click', function () {
	localStorage.setItem('deliveryDate', deliveryDate);
	window.location.href = 'orderedScreen.html';
});

// AKCESORIA - DODANIE + DODANIE CENY DO PODSTAWOWEJ CENY AUTA
const finalPriceElement = document.getElementById('final_price');

function updateFinalPrice() {
	let finalPrice = carPrice;
	if ($rimsCheckbox.checked) {
		finalPrice += 12000;
	}
	if ($leatherSeatsCheckbox.checked) {
		finalPrice += 8000;
	}
	if ($ambilightCheckbox.checked) {
		finalPrice += 3500;
	}
	if ($warrantyCheckbox.checked) {
		finalPrice += 5000;
	}

	finalPriceElement.textContent = formatPrice(finalPrice);
	localStorage.setItem('finalPrice', finalPrice);
}

$rimsCheckbox.addEventListener('click', updateFinalPrice);
$leatherSeatsCheckbox.addEventListener('click', updateFinalPrice);
$ambilightCheckbox.addEventListener('click', updateFinalPrice);
$warrantyCheckbox.addEventListener('click', updateFinalPrice);

updateFinalPrice();

// ZAPAMIĘTANIE DANYCH
$nameInput.addEventListener('input', () => {
	if ($nameInput.value !== '') {
		localStorage.setItem('name', $nameInput.value);
	}
});

$financingInputs.forEach(radio => {
	radio.addEventListener('change', () => {
		localStorage.setItem('selectedRadio', radio.id);
	});
});

$accessoriesCheckbox.forEach(function (checkbox) {
	checkbox.addEventListener('change', function (event) {
		localStorage.setItem(event.target.id, event.target.checked);
	});
});

window.addEventListener('load', () => {
	$nameInput.value = localStorage.getItem('name') || '';

	const radioValue = localStorage.getItem('selectedRadio');
	if (radioValue) {
		const selectedRadio = document.getElementById(radioValue);
		if (selectedRadio) {
			selectedRadio.checked = true;
		}
	}

	$accessoriesCheckbox.forEach(checkbox => {
		const checked = localStorage.getItem(checkbox.id) === 'true';
		checkbox.checked = checked;
	});

	const savedFinalPrice = localStorage.getItem('finalPrice');
	if (savedFinalPrice) {
		finalPriceElement.textContent = formatPrice(Number(savedFinalPrice));
	}

	updateFinalPrice();

	const loginErrorShown = localStorage.getItem('loginError') === 'true';
	if (loginErrorShown) {
		$loginError.style.display = 'block';
		$orderButton.disabled = true;
	}
});

// ZAPAMIĘTANIE ZAZNACZONYCH INPUTÓW
const checkboxes = document.querySelectorAll('.form__data-accessory-checked');

function saveSelectedAccessories() {
	const selectedAccessories = Array.from(checkboxes)
		.filter(checkbox => checkbox.checked)
		.map(checkbox => checkbox.nextElementSibling.textContent.trim());
	localStorage.setItem('selectedAccessories', JSON.stringify(selectedAccessories));
	localStorage.setItem('accessoriesPrice', JSON.stringify(accessoriesPrice));
}

$orderButton.addEventListener('click', () => {
	if (Array.from(checkboxes).some(checkbox => checkbox.checked)) {
		updateFinalPrice();
		saveSelectedAccessories();
		window.location.href = 'orderedScreen.html';
	} else {
		localStorage.removeItem('selectedAccessories');
		window.location.href = 'orderedScreen.html';
	}
});

// PRZYCISK "ZAMÓW" - WALIDACJA IMIENIA I NAZWISKA ORAZ FINANSOWANIA ORAZ CZYSZCZENIE ZAPISANYCH DANYCH
$orderButton.addEventListener('click', function () {
	let inputValue = $nameInput.value.trim();
	let nameParts = inputValue.split(' ');

	if (nameParts.length < 2 || nameParts[0].length < 1) {
		$loginError.style.display = 'block';
		localStorage.setItem('loginError', 'true');
		return;
	}

	if (!$financingLeasing.checked && !$financingCash.checked) {
		$loginError.style.display = 'block';
		localStorage.setItem('loginError', 'true');
		return;
	}

	$loginError.style.display = 'none';

	localStorage.removeItem('loginError');
	localStorage.removeItem('name');
	localStorage.removeItem('selectedRadio');

	$accessoriesCheckbox.forEach(checkbox => {
		localStorage.removeItem(checkbox.id);
	});

	$nameInput.value = '';
	$financingInputs.forEach(radio => (radio.checked = false));
	$accessoriesCheckbox.forEach(checkbox => (checkbox.checked = false));

	window.location.href = 'orderedScreen.html';
});

// WALIDACJA PRZY KAŻDEJ ZMIANIE
$nameInput.addEventListener('input', () => {
	validateForm();
});

$financingInputs.forEach(radio => {
	radio.addEventListener('change', () => {
		validateForm();
	});
});

$accessoriesCheckbox.forEach(function (checkbox) {
	checkbox.addEventListener('change', function (event) {
		validateForm();
	});
});

function validateForm() {
	let inputValue = $nameInput.value.trim();
	let nameParts = inputValue.split(' ');

	if (nameParts.length < 2 || nameParts[0].length < 1) {
		$loginError.style.display = 'block';
		localStorage.setItem('loginError', 'true');
		$orderButton.disabled = true;
		return;
	}

	if (!$financingLeasing.checked && !$financingCash.checked) {
		$loginError.style.display = 'block';
		localStorage.setItem('loginError', 'true');
		$orderButton.disabled = true;
		return;
	}

	$loginError.style.display = 'none';
	$orderButton.disabled = false;
	localStorage.removeItem('loginError');
}

//POWRÓT DO WYBORY
function returnBtn() {
	$accessoriesCheckbox.forEach(checkbox => {
		if (checkbox.checked) {
			localStorage.removeItem(checkbox.id);
		}
	});
	window.location.href = 'mainScreen.html';
}

$returnButton.addEventListener('click', returnBtn);
