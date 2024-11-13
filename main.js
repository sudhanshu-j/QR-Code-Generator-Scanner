// Select the "Generate" section button from the DOM
const generateSecBtn = document.querySelector(".generate-btn");

// Select the "Scanner" section button from the DOM
const scannerSecBtn = document.querySelector(".scanner-btn");

// Event listener to show the generator section when the "Generate" button is clicked
generateSecBtn.addEventListener("click", () => {
  // Add "active" class to the generate button to highlight it
  generateSecBtn.classList.add("active");

  // Remove "active" class from the scanner button
  scannerSecBtn.classList.remove("active");

  // Hide the scanner section
  document.querySelector(".scanner").style.display = "none";

  // Show the generator section
  document.querySelector(".generator").style.display = "block";
});

// Event listener to show the scanner section when the "Scanner" button is clicked
scannerSecBtn.addEventListener("click", () => {
  // Remove "active" class from the generate button
  generateSecBtn.classList.remove("active");

  // Add "active" class to the scanner button to highlight it
  scannerSecBtn.classList.add("active");

  // Show the scanner section
  document.querySelector(".scanner").style.display = "block";

  // Hide the generator section
  document.querySelector(".generator").style.display = "none";
});

// Variables for QR Code generation
const generatorSection = document.querySelector(".generator");
const generateBtn = generatorSection.querySelector(".gene-btn");
const qrInput = generatorSection.querySelector("#input-text");
const qrImage = generatorSection.querySelector(".QR-img");
const downloadButton = generatorSection.querySelector(".btn-link");

// Variable to store the generated QR code URL
let imgURL = "";

// Event listener to generate QR code when the "Generate" button is clicked
generateBtn.addEventListener("click", () => {
  // Get the value from the QR input field
  let qrValue = qrInput.value;

  // If the input is empty or only spaces, do nothing
  if (!qrValue.trim()) return;

  // Change the button text to indicate QR code is being generated
  generateBtn.textContent = "Generating QR Code...";

  // Create the QR code image URL using the QR code API with the user input
  imgURL = ` https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrValue}`;

  // Set the QR image source to the generated URL
  qrImage.src = imgURL;

  // When the QR code image has loaded, reset the button text and show the generator section
  qrImage.addEventListener("load", () => {
    generateBtn.innerHTML = `
    <i class="ri-ai-generate"></i> 
     Generate QR code`;

    // Add the "active" class to the generator section to show it
    generatorSection.classList.add("active");
  });
});

// Event listener to handle QR code download when the "Download" button is clicked
downloadButton.addEventListener("click", () => {
  // If there is no QR code URL, do nothing
  if (!imgURL) return;

  // Call the fetchImage function to download the image
  fetchImage(imgURL);
});

// Function to fetch the image and trigger the download
function fetchImage(url) {
  fetch(url) // Fetch the QR code image from the generated URL
    .then((res) => res.blob()) // Convert the response to a blob (binary data)
    .then((file) => {
      // Create an object URL from the blob for the file
      let tempFile = URL.createObjectURL(file);

      // Get the filename from the URL (QR code image filename)
      let file_name = url.split("/").pop().split(".")[0];

      // Get the file extension from the content type of the file
      let ext = file.type.split("/")[1];

      // Call the download function to trigger the download
      download(tempFile, file_name, ext);
    })
    .catch(() => (imgURL = "")); // If there is an error, reset imgURL to an empty string
}

// Function to trigger the download of the image
function download(tempFile, file_name, ext) {
  // Create an anchor element programmatically
  let a = document.createElement("a");

  // Set the href to the temporary file URL
  a.href = tempFile;

  // Set the download attribute with the filename and extension
  a.download = `${file_name}.${ext}`;

  // Append the anchor to the body
  document.body.appendChild(a);

  // Programmatically click the anchor to start the download
  a.click();

  // Remove the anchor element after downloading
  a.remove();

  // Reset the imgURL variable after the download is complete
  imgURL = "";
}

// Event listener for input changes in the QR code text field
qrInput.addEventListener("input", () => {
  // If the input is empty, remove the "active" class from the generator section
  if (!qrInput.value.trim()) {
    return generatorSection.classList.remove("active");
  }
});

// Scanner Section Logic

// Variables for scanner section
const scannerSection = document.querySelector(".scanner");
const cameraIcon = scannerSection.querySelector(".ri-camera-fill");
const stopIcon = scannerSection.querySelector(".ri-stop-circle-fill");
const formEl = scannerSection.querySelector(".scanner-form");
const inputEl = formEl.querySelector("#file-input");
const paraEl = formEl.querySelector(".para");
const imgEl = formEl.querySelector(".scanner-img");
const videoEl = formEl.querySelector(".scanner-video");
const contentEl = formEl.querySelector(".content");
const textareaEl = scannerSection.querySelector(".text-area");
const copyBtn = scannerSection.querySelector(".copy-btn");
const closeBtn = scannerSection.querySelector(".close-btn");

// Event listener to open the file input when the scanner form is clicked
formEl.addEventListener("click", () => {
  // Simulate a click on the file input
  inputEl.click();
});

// Event listener to handle file input change (when a user uploads a QR code file)
inputEl.addEventListener("change", (e) => {
  let file = e.target.files[0]; // Get the first file uploaded
  if (!file) return; // If no file is selected, exit

  // Call the fetchRequest function to send the file for QR scanning
  fetchRequest(file);
});

// Function to send the file to the QR server for decoding
function fetchRequest(file) {
  let formData = new FormData(); // Create a FormData object to send the file
  formData.append("file", file); // Append the file to the FormData object

  // Set the scanning message
  paraEl.textContent = "Scanning QR Code...";

  formEl.style.pointerEvents = "none";

  // Send a POST request to the QR code API for reading the QR code
  fetch(`http://api.qrserver.com/v1/read-qr-code/`, {
    method: "POST",
    body: formData, // Attach the file data in the request body
  })
    .then((res) => res.json()) // Parse the response as JSON
    .then((result) => {
      let text = result[0].symbol[0].data; // Get the decoded text from the response

      if (!text) {
        // If no text was found, display an error message
        return (paraEl.textContent = "Couldn't Scan QR Code");
      }

      // Show the scanner section and update the form to display the scanned QR code image
      scannerSection.classList.add("active");
      formEl.classList.add("active-img");

      // Display the scanned image
      imgEl.src = URL.createObjectURL(file);

      // Display the decoded text in the textarea
      textareaEl.textContent = text;
    });
}

// Copy to Clipboard Functionality

// Event listener for copying the text from the scanner textarea
copyBtn.addEventListener("click", () => {
  let text = textareaEl.textContent; // Get the text from the textarea

  // Use the Clipboard API to copy the text to the clipboard
  navigator.clipboard.writeText(text).then(
    () => {
      // If successful, change the copy button text to "Copied!"
      copyBtn.textContent = "Copied!";

      // After 2 seconds, revert the button text back to "Copy"
      setTimeout(() => {
        copyBtn.innerHTML = ` 
        Copy
        <i class="ri-file-copy-line"></i>`;
      }, 2000);
    },
    () => {
      // If copying fails, show an error message on the button
      copyBtn.textContent = "Failed to copy!";
    }
  );
});

// Close Scanner Section

// Event listener for closing the scanner section when the close button is clicked
closeBtn.addEventListener("click", () => {
  // Hide the scanner section and reset form and message
  scannerSection.classList.remove("active");
  formEl.classList.remove("active-img");
  paraEl.textContent = "Upload QR or Video QR code to Scan";

  // Stop any ongoing video scanning session
  stopRecording();
});

// Camera Setup for Scanning QR Codes

let scanner;

// Event listener for starting the camera when the camera icon is clicked
cameraIcon.addEventListener("click", () => {
  // Hide the camera icon and show the scanning message
  cameraIcon.style.display = "none";
  paraEl.textContent = "Scanning QR Code...";

  // Initialize the Instascan scanner to use the video element
  scanner = new Instascan.Scanner({
    video: videoEl, // Use the video element to display the camera feed
    mirror: true, // Mirror the camera feed (optional)
  });

  // Get the list of available cameras (front and back)
  Instascan.Camera.getCameras()
    .then((cameras) => {
      if (cameras.length > 0) {
        // If cameras are available, start the scanner using the first camera
        scanner.start(cameras[0]).then(() => {
          // Add the "active-video" class to show the video scanning UI
          formEl.classList.add("active-video");

          // Show the stop icon to stop the camera
          stopIcon.style.display = "inline-block";

          // Disable interactions with the form while scanning
          formEl.style.pointerEvents = "none";
        });
      } else {
        // If no cameras are found, display an error message
        paraEl.textContent =
          "No cameras found. Please check your camera settings.";
      }
    })
    .catch((err) => console.log("Error: " + err));

  // Event listener for scanning QR code from the camera feed
  scanner.addListener("scan", (c) => {
    // When a QR code is scanned, display the scanner section and show the scanned text
    scannerSection.classList.add("active");
    textareaEl.textContent = c; // Display the scanned QR code data
  });
});

// Function to stop the camera and reset the UI
function stopRecording() {
  // Show the camera icon and hide the stop icon
  cameraIcon.style.display = "inline-block";
  stopIcon.style.display = "none";

  // Stop the scanner if it is active
  if (scanner) scanner.stop();

  // Remove the active video class and reset form interactions
  formEl.classList.remove("active-video");
  scannerSection.classList.remove("active");
  formEl.style.pointerEvents = "all";

  // Reset the message in the form
  paraEl.textContent = "Upload QR or Video QR code to Scan";
}

// Event listener to stop the camera scanning when the stop icon is clicked
stopIcon.addEventListener("click", stopRecording);
