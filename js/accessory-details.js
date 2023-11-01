const form = document.getElementById("accessory-form");
const formId = document.getElementById("id");
const formLicensePlate = document.getElementById("license-plate");
const formRepairDate = document.getElementById("repair-date");
const formName = document.getElementById("name");
const formPrice = document.getElementById("price");
const formStatusDamaged = document.getElementById("status-damaged");
const formRepairStatus = document.getElementById("repair-status");
const btnSave = document.getElementById("save");
const tbody = document.getElementById("accessories");
const loading = document.getElementById("loading");
const pageNumber = document.getElementById("page");
const pageSize = document.getElementById("size");
const firstPage = document.getElementById("first-page");
const prevPage = document.getElementById("prev-page");
const nextPage = document.getElementById("next-page");
const lastPage = document.getElementById("last-page");
const formatter = new Intl.NumberFormat("vi-VN");

form.addEventListener("submit", async function (e) {
	e.preventDefault();
	await save();
	this.reset();
});

formPrice.addEventListener("input", function () {
	const price = this.value.replace(/[,.]/g, "");
	this.value = formatter.format(price);
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
	const url = new URL("http://localhost:8080/api/v1/accessories");
	url.search = new URLSearchParams(params).toString();
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		}
	});
	const page = await response.json();
	console.log(page);
	const accessories = page.content;
	console.log(accessories);

	showAccessories(accessories);
	updatePagination(page);
	hideLoading();
}

function showAccessories(accessories) {
	tbody.innerHTML = "";
	for (const accessory of accessories) {
		const row = tbody.insertRow();
		row.push(accessory.id);
		row.push(accessory.licensePlate);
		row.push(accessory.repairDate);
		row.push(accessory.name);
		row.push(formatter.format(accessory.price));
		row.push(accessory.statusDamaged);
		row.push(accessory.repairStatus);

		const btnEdit = createButton("🖊️ Edit", function () {
			formId.value = accessory.id;
			formLicensePlate.value = accessory.licensePlate;
			formRepairDate.value = accessory.repairDate;
			formName.value = accessory.name;
			formPrice.value = formatter.format(accessory.price);
			formStatusDamaged.value = accessory.statusDamaged;
			formRepairStatus.value = accessory.repairStatus;
		});
		const btnDelete = createButton("❌ Delete", function () {
			const confirmed = confirm("Do you want to delete this accessory?");
			if (confirmed) deleteById(accessory.id);
		});
		row.insertCell().append(btnEdit, btnDelete);
	}
}

async function deleteById(id) {
	showLoading();
	const url = `http://localhost:8080/api/v1/accessories/${id}`;
	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		}
	});
	console.log(`deleteById(${id}): ${response.ok}`);
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
	const id = formId.value;
	const url = id
		? `http://localhost:8080/api/v1/accessories/${id}`
		: "http://localhost:8080/api/v1/accessories";
	const method = id ? "PUT" : "POST";
	const response = await fetch(url, {
		method: method,
		headers: {
			"Accept-Language": "vi",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			licensePlate: formLicensePlate.value,
			repairDate: formRepairDate.value,
			name: formName.value,
			price: formPrice.value.replace(/[,.]/g, ""),
			statusDamaged: formStatusDamaged.value,
			repairStatus: formRepairStatus.value
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

	formLicensePlate.setAttribute("disabled", "");
	formRepairDate.setAttribute("disabled", "");
	formName.setAttribute("disabled", "");
	formPrice.setAttribute("disabled", "");
	formStatusDamaged.setAttribute("disabled", "");
	formRepairStatus.setAttribute("disabled", "");
	btnSave.setAttribute("disabled", "");
}

function hideLoading() {
	setTimeout(function () {
		loading.style.display = "none";

		formLicensePlate.removeAttribute("disabled");
		formRepairDate.removeAttribute("disabled");
		formName.removeAttribute("disabled");
		formPrice.removeAttribute("disabled");
		formStatusDamaged.removeAttribute("disabled");
		formRepairStatus.removeAttribute("disabled");
		btnSave.removeAttribute("disabled");
	}, Math.random() * 2000);
}
