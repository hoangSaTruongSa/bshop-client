const form = document.getElementById("car-create-form");
const formLicensePlate = document.getElementById("license-plate");
const formRepairDate = document.getElementById("repair-date");
const formCustomerName = document.getElementById("customer-name");
const formCatalog = document.getElementById("catalog");
const formCarMaker = document.getElementById("car-maker");
const btnSave = document.getElementById("save");

form.addEventListener("submit", async e => {
	e.preventDefault();
	await save();
	form.reset();
});

const [today] = new Date().toISOString().split("T");
formRepairDate.value = today;
formRepairDate.setAttribute("max", today);

async function save() {
	showLoading();
	const response = await fetch("http://localhost:8080/api/v1/cars", {
		method: "POST",
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
	hideLoading();
}

function showLoading() {
	formLicensePlate.setAttribute("disabled", "");
	formRepairDate.setAttribute("disabled", "");
	formCustomerName.setAttribute("disabled", "");
	formCatalog.setAttribute("disabled", "");
	formCarMaker.setAttribute("disabled", "");
	btnSave.setAttribute("disabled", "");
}

function hideLoading() {
	setTimeout(function () {
		formLicensePlate.removeAttribute("disabled");
		formRepairDate.removeAttribute("disabled");
		formCustomerName.removeAttribute("disabled");
		formCatalog.removeAttribute("disabled");
		formCarMaker.removeAttribute("disabled");
		btnSave.removeAttribute("disabled");
	}, Math.random() * 2000);
}
