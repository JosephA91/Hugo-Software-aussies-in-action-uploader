import { app, BrowserWindow, Menu, ipcMain, dialog } from "electron";
import * as path from "path";
import buildMenu from "./lib/menu";
import formatFolderName from "./lib/format-folder-name";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

require("dotenv").config();

// Configure AWS with your access and secret key.
const { AWS_S3_ACCESS_KEY, AWS_S3_SECRET_KEY, AWS_S3_BUCKET_NAME } =
  process.env;

const s3Client = new S3Client({
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY,
    secretAccessKey: AWS_S3_SECRET_KEY,
  },
});

const dotenv = require("dotenv");

process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;
const menu = buildMenu({ app, isMac, isDev });

let mainWindow;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Aussies in Action Uploader",
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));
}

ipcMain.on("select-folder", (event) => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      if (!result.canceled) {
        event.reply("selected-folder", result.filePaths[0]);
      }
    });
});

ipcMain.on("upload-folder", async (event, folderPath, folderName) => {
  const formattedFolderName = formatFolderName({ folderName });

  // Create a new folder with the formatted name in S3 bucket
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${formattedFolderName}/`,
  };

  console.log(params);

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(data); // successful response
  } catch (err) {
    console.log(err); // an error occurred
  }
});

app.on("ready", () => {
  createWindow();

  mainWindow = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainWindow);

  mainWindow.on("menu-will-close", () => (mainWindow = null));
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
