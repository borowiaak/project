const $brandCars = document.getElementById('cars');
const $selectedMercedes = document.getElementById('car_mercedes');
const $selectedAudi = document.getElementById('car_audi');
const $selectedPorsche = document.getElementById('car_porsche');
const $buttons = document.querySelectorAll('.offers__option-btn');

// WYBÓR MARKI WEDŁUG LISTY
function selectedBrand() {
	let selectedBrandCar = $brandCars.value;

	$selectedMercedes.style.display = 'none';
	$selectedAudi.style.display = 'none';
	$selectedPorsche.style.display = 'none';

	if (selectedBrandCar === 'mercedes') {
		$selectedMercedes.style.display = 'block';
	} else if (selectedBrandCar === 'audi') {
		$selectedAudi.style.display = 'block';
	} else if (selectedBrandCar === 'porsche') {
		$selectedPorsche.style.display = 'block';
	}
}

// PRZEKIEROWANIE DO FORMULARZA WRAZ Z NAGŁÓWKIEM DANEGO AUTA
for (let i = 0; i < $buttons.length; i++) {
	$buttons[i].addEventListener('click', function () {
		const headingText = this.parentElement.querySelector('.offers__option-heading').textContent;
		const priceText = this.parentElement.querySelector('.offers__option-details:last-of-type').textContent;

		const priceNumber = changePriceToNumber(priceText);
		localStorage.setItem('heading', headingText);
		localStorage.setItem('price', priceNumber);
		window.location.href = 'form.html';
	});
}

function changePriceToNumber(priceText) {
	return Number(priceText.replace());
}

// POBRANIE OBRAZU DLA STRONY Z PODZIĘKOWANIEM ZA ZAKUP
$buttons.forEach(button => {
	button.addEventListener('click', () => {
		const imageUrl = button.parentElement.previousElementSibling.getAttribute('src');
		localStorage.setItem('carImage', imageUrl);
	});
});

// FOOTER = AKTUALNY ROK
const date = new Date();
const year = date.getFullYear();
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
	currentYearElement.innerHTML = year;
}
