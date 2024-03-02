let xliffContent = ""; // Global variable to store XLIFF content
let editedTranslations = {}; // Object to store edited translations

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect, false);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    xliffContent = event.target.result;
    parseXLIFF(xliffContent);
    validateXLIFF(xliffContent);
  };
  reader.readAsText(file);
}

function parseXLIFF(xliffContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xliffContent, "application/xml");

  const sourceLanguage = xmlDoc.documentElement.getAttribute("source-language");
  const targetLanguage = xmlDoc.documentElement.getAttribute("target-language");

  const transUnits = xmlDoc.getElementsByTagName("trans-unit");
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `<p>Source Language: ${sourceLanguage}</p>`;
  outputDiv.innerHTML += `<p>Target Language: ${targetLanguage}</p>`;
  outputDiv.innerHTML += "<h2>Translations</h2>";

  for (let i = 0; i < transUnits.length; i++) {
    const sourceText =
      transUnits[i].getElementsByTagName("source")[0].textContent;
    const targetText =
      transUnits[i].getElementsByTagName("target")[0].textContent;
    const transUnitId = transUnits[i].getAttribute("id");

    outputDiv.innerHTML += `<div id="transUnit${transUnitId}">
                                            <p>Source: ${sourceText}</p>
                                            <textarea id="targetText${transUnitId}" rows="4" cols="50">${targetText}</textarea>
                                            <hr>
                                        </div>`;

    // Store initial translations in the editedTranslations object
    editedTranslations[transUnitId] = targetText;
  }
}

document.getElementById("saveButton").addEventListener("click", saveChanges);

function saveChanges() {
  const outputDiv = document.getElementById("output");
  Object.keys(editedTranslations).forEach((transUnitId) => {
    const targetText = document.getElementById(
      `targetText${transUnitId}`
    ).value;
    editedTranslations[transUnitId] = targetText;
    outputDiv.querySelector(
      `#transUnit${transUnitId} p`
    ).textContent = `Source: ${transUnitId}`;
    outputDiv.querySelector(`#transUnit${transUnitId} textarea`).value =
      targetText;
  });
}

document
  .getElementById("downloadButton")
  .addEventListener("click", downloadXLIFF);

function downloadXLIFF() {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xliffContent, "application/xml");
  const transUnits = xmlDoc.getElementsByTagName("trans-unit");

  for (let i = 0; i < transUnits.length; i++) {
    const transUnitId = transUnits[i].getAttribute("id");
    if (editedTranslations.hasOwnProperty(transUnitId)) {
      const targetText = editedTranslations[transUnitId];
      transUnits[i].getElementsByTagName("target")[0].textContent = targetText;
    }
  }

  const updatedXLIFFContent = new XMLSerializer().serializeToString(xmlDoc);
  const blob = new Blob([updatedXLIFFContent], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "edited_file.xliff";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

function validateXLIFF(xliffContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xliffContent, "application/xml");
  const transUnits = xmlDoc.getElementsByTagName("trans-unit");
  const errors = [];
  for (let i = 0; i < transUnits.length; i++) {
    const sourceText =
      transUnits[i].getElementsByTagName("source")[0].textContent;
    const targetText =
      transUnits[i].getElementsByTagName("target")[0].textContent;
    const transUnitId = transUnits[i].getAttribute("id");
    if (!sourceText) {
      errors.push(`Trans-unit ${transUnitId} is missing source text.`);
    }
    if (!targetText) {
      errors.push(`Trans-unit ${transUnitId} is missing target text.`);
    }
  }
  if (errors.length > 0) {
    console.error("XLIFF validation errors:");
    errors.forEach((error) => console.error(error));
  } else {
    console.log("XLIFF validation successful.");
  }
}
