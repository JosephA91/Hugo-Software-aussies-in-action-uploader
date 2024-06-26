// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const { ipcRenderer } = require("electron");

const selectFolder = document.getElementById(
  "select-folder"
) as HTMLButtonElement;
const uploadButton = document.getElementById(
  "upload-button"
) as HTMLButtonElement;
const folderPathElement = document.getElementById(
  "folder-path"
) as HTMLButtonElement;
const clearFolderPath = document.getElementById(
  "clear-folder-path"
) as HTMLButtonElement;
const folderPathInput = document.getElementById(
  "destination-folder"
) as HTMLInputElement;

selectFolder.addEventListener("click", () => {
  ipcRenderer.send("select-folder");
});

clearFolderPath.addEventListener("click", () => {
  folderPathElement.textContent = "";
  uploadButton.disabled = true;
  clearFolderPath.disabled = true;
});

folderPathInput.addEventListener("input", () => {
  if (
    folderPathInput.value.trim() !== "" &&
    folderPathElement.textContent.trim() !== ""
  ) {
    uploadButton.disabled = false;
    clearFolderPath.disabled = false;
  } else {
    uploadButton.disabled = true;
    clearFolderPath.disabled = true;
  }
});

ipcRenderer.on("selected-folder", (event, path) => {
  folderPathElement.textContent = path;

  if (
    folderPathInput.value.trim() !== "" &&
    folderPathElement.textContent.trim() !== ""
  ) {
    uploadButton.disabled = false;
    clearFolderPath.disabled = false;
  } else {
    uploadButton.disabled = true;
    clearFolderPath.disabled = true;
  }
});

uploadButton.addEventListener("click", () => {
  const folderPath = folderPathElement.textContent;
  const folderName = folderPathInput.value;

  if (folderPath.trim() === "" || folderName.trim() === "") {
    return;
  }

  folderPathElement.textContent = "";
  folderPathInput.value = "";

  ipcRenderer.send("upload-folder", folderPath, folderName);
});
