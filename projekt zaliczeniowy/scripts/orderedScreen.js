// POBRANA NAZWY AUTA
const $orderedCarNameElement = document.getElementById('orderedCarName');
const $orderedCarName = localStorage.getItem('heading');

$orderedCarNameElement.textContent = $orderedCarName;

// POBRANY OBRAZ
const $orderedCarPhoto = document.getElementById('orderedCarPhoto');
const $carImage = localStorage.getItem('carImage');
if ($carImage) {
	$orderedCarPhoto.setAttribute('src', $carImage);
}

//POBRANA DATA DOSTAWY
const $orderedDateDeliveryElement = document.getElementById('orderedDateDelivery');
const $orderedDeliveryDate = localStorage.getItem('deliveryDate');

$orderedDateDeliveryElement.textContent = $orderedDeliveryDate;

// POBRANE ZAZNACZONE INPUTY
const $orderedAccessories = document.getElementById('orderedAccessories');
const $orderedCarPrice = document.getElementById('orderedCarPrice');

function displaySelectedAccessories() {
	const $selectedAccessories = JSON.parse(localStorage.getItem('selectedAccessories')) || [];
	const $accessoriesPrice = JSON.parse(localStorage.getItem('$')) || 0;
	let accessoriesText = '';

	if ($selectedAccessories.length > 0) {
		for (let i = 0; i < $selectedAccessories.length; i++) {
			accessoriesText += $selectedAccessories[i];
			if (i !== $selectedAccessories.length - 1) {
				accessoriesText += ', ';
			}
		}
	} else {
		accessoriesText = 'Nie wybrano żadnego akcesorium';
	}

	const $finalPrice = JSON.parse(localStorage.getItem('finalPrice'));
	$orderedAccessories.textContent = accessoriesText;
	$orderedCarPrice.textContent = formatPrice($finalPrice + $accessoriesPrice);
}

displaySelectedAccessories();

// POBRANA ZAZNACZONA METODA PŁATNOŚCI
const $orderedPaymentMethod = document.getElementById('orderedPaymentMethod');

function displaySelectedFinancing() {
	const $selectedFinancing = localStorage.getItem('selectedFinancing');
	if ($selectedFinancing) {
		$orderedPaymentMethod.textContent = $selectedFinancing;
	}
}

displaySelectedFinancing();

//POWRÓT DO GŁÓWNEJ STRONY
const $returnToFirstPage = document.getElementById('firstPageBtn');

function goToFirstPage() {
	window.location.href = 'mainScreen.html';
}

$returnToFirstPage.addEventListener('click', goToFirstPage);
