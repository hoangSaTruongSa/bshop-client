const form = document.getElementById("car-update-form");
const formId = document.getElementById("id");
const formLicensePlate = document.getElementById("license-plate");
const formRepairDate = document.getElementById("repair-date");
const formCustomerName = document.getElementById("customer-name");
const formCatalog = document.getElementById("catalog");
const formCarMaker = document.getElementById("car-maker");
const btnSave = document.getElementById("save");
const tbody = document.getElementById("cars");
const loading = document.getElementById("loading");
const pageNumber = document.getElementById("page");
const pageSize = document.getElementById("size");
const firstPage = document.getElementById("first-page");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const lastPage = document.getElementById("last-page");

form.addEventListener("submit", async function (e) {
	e.preventDefault();
	await save();
	this.reset();
});

pageSize.addEventListener("change", findAll);

const [today] = new Date().toISOString().split("T");
formRepairDate.value = today;
formRepairDate.setAttribute("max", today);

findAll();

async function findAll() {
	showLoading();
	const params = {
		page: pageNumber.value,
		size: pageSize.value
	};
	const url = new URL("http://localhost:8080/api/v1/cars");
	url.search = new URLSearchParams(params).toString();
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		}
	});
	const page = await response.json();
	const cars = page.content;
	console.log(cars);

	showCars(cars);
	updatePagination(page);
	hideLoading();
}

function showCars(cars) {
	tbody.innerHTML = "";
	for (const car of cars) {
		const row = tbody.insertRow();
		row.push(car.licensePlate);
		row.push(car.repairDate);
		row.push(car.customerName);
		row.push(car.catalog);
		row.push(car.carMaker);

		const btnEdit = createButton("🖊️ Edit", function () {
			formLicensePlate.value = car.licensePlate;
			formRepairDate.value = car.repairDate;
			formCustomerName.value = car.customerName;
			formCatalog.value = car.catalog;
			formCarMaker.value = car.carMaker;
		});
		const btnDelete = createButton("❌ Delete", function () {
			const confirmed = confirm("Do you want to delete this car?");
			if (confirmed) deleteById(car);
		});
		row.insertCell().append(btnEdit, btnDelete);
	}
}

async function deleteById(car) {
	showLoading();
	const response = await fetch("http://localhost:8080/api/v1/cars", {
		method: "DELETE",
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			licensePlate: car.licensePlate,
			repairDate: car.repairDate
		})
	});
	console.log(`deleteById(${car.licensePlate}, ${car.repairDate}): ${response.ok}`);
	if (response.ok) await findAll();
	hideLoading();
}

function updatePagination({ first, last, pageable, totalPages }) {
	const currentPage = pageable.pageNumber + 1;
	pageNumber.value = currentPage;
	pageSize.value = pageable.pageSize;
	if (first) {
		firstPage.setAttribute("disabled", "");
		prevPage.setAttribute("disabled", "");
	} else {
		firstPage.removeAttribute("disabled");
		prevPage.removeAttribute("disabled");
	}
	if (last) {
		nextPage.setAttribute("disabled", "");
		lastPage.setAttribute("disabled", "");
	} else {
		nextPage.removeAttribute("disabled");
		lastPage.removeAttribute("disabled");
	}
	pageNumber.onchange = function () {
		if (this.value < 1 || this.value > totalPages) {
			this.value = currentPage;
		}
		findAll();
	};
	firstPage.onclick = function () {
		pageNumber.value = 1;
		findAll();
	};
	prevPage.onclick = function () {
		pageNumber.value = currentPage - 1;
		findAll();
	};
	nextPage.onclick = function () {
		pageNumber.value = currentPage + 1;
		findAll();
	};
	lastPage.onclick = function () {
		pageNumber.value = totalPages;
		findAll();
	};
}

async function save() {
	showLoading();
	const response = await fetch("http://localhost:8080/api/v1/cars", {
		method: "PUT",
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			licensePlate: formLicensePlate.value,
			repairDate: formRepairDate.value,
			customerName: formCustomerName.value,
			catalog: formCatalog.value,
			carMaker: formCarMaker.value
		})
	});
	const json = await response.json();
	console.log(json);
	await findAll();
	hideLoading();
}

function createButton(text, click) {
	const btn = document.createElement("button");
	const node = document.createTextNode(text);
	btn.appendChild(node);
	btn.addEventListener("click", click);
	return btn;
}

HTMLTableRowElement.prototype.push = function (data) {
	const node = document.createTextNode(data);
	this.insertCell().appendChild(node);
};

function showLoading() {
	loading.style.display = "flex";

	formCustomerName.setAttribute("disabled", "");
	formCatalog.setAttribute("disabled", "");
	formCarMaker.setAttribute("disabled", "");
	btnSave.setAttribute("disabled", "");
}

function hideLoading() {
	setTimeout(function () {
		loading.style.display = "none";

		formCustomerName.removeAttribute("disabled");
		formCatalog.removeAttribute("disabled");
		formCarMaker.removeAttribute("disabled");
		btnSave.removeAttribute("disabled");
	}, Math.random() * 2000);
}
