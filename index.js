const container = document.querySelector("#container");
const createGridBtn = document.querySelector("#createGridBtn");
const clearBtn = document.querySelector("#clearBtn");
const downloadBtn = document.querySelector("#downloadBtn");
const colorPicker = document.querySelector("#colorPicker");
const rainbow = document.querySelector("#rainbow");
const eraser = document.querySelector("#eraser");
let drawState = false;

createGridBtn.addEventListener("click", (e) => {
	let isValid = false;
	while (!isValid) {
		let numberOfDivs = +prompt("Enter the size of the grid: ", 16);

		if (numberOfDivs == 0 || numberOfDivs < 0 || numberOfDivs > 100 || isNaN(numberOfDivs)) {
			alert("Invalid! Please enter a number between 1 and 100.");
			isValid = false;
		}
		else {
			isValid = true;
			container.replaceChildren();
			etchASketch(numberOfDivs);
		}
	}

	eraser.checked = false;
});

clearBtn.addEventListener("click", () => {
	const confirmation = confirm("Are you sure you want to clear the canvas?");

	if (confirmation) {
		const divs = document.querySelectorAll(".item");
		divs.forEach((div) => {
			div.style.backgroundColor = "";
		});
	}

	eraser.checked = false;
});

downloadBtn.addEventListener("click", () => {
	handleDownload();
});

function etchASketch(numberOfDivs) {
	for (let i = 1; i <= numberOfDivs * numberOfDivs; i++) {
		let div = document.createElement("div");

		div.classList = "item";
		div.style.flexBasis = `calc(100% / ${numberOfDivs})`;

		// Source - https://stackoverflow.com/a/4211930
		// Posted by alex, modified by community. See post 'Timeline' for change history
		// Retrieved 2026-07-16, License - CC BY-SA 3.0
		div.ondragstart = function () { return false; }; // to remove the drag ghost

		div.addEventListener("mousedown", (e) => {
			if (e.button === 0) {
				drawState = true;
			}
		});

		div.addEventListener("click", (e) => {
			addColor(e);
		});

		div.addEventListener("mousemove", (e) => {
			if (drawState) {
				addColor(e);
			}
		});

		div.addEventListener("mouseup", (e) => {
			if (e.button === 0) {
				drawState = false;
			}
		});

		container.appendChild(div);
	}
}

function addColor(e) {
	let selectedColor;

	if (rainbow.checked && !eraser.checked) {
		let rgbValue = rgb();

		selectedColor = rgbValue;
		colorPicker.value = rgbValue;
	}
	else {
		selectedColor = colorPicker.value;
	}

	if (eraser.checked) {
		selectedColor = "";
	}

	e.target.style.backgroundColor = selectedColor;
}

function rgb() {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);

	return `rgb(${r}, ${g}, ${b})`;
}

// Source - https://stackoverflow.com/a/77666766
// Posted by SmartDev
// Retrieved 2026-07-16, License - CC BY-SA 4.0

function handleDownload() {
  const divElement = document.querySelector("#container");

  html2canvas(divElement).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "Etch-a-Sketch.png";
    link.click();
  });
}