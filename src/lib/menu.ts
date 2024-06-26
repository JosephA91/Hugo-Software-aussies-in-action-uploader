import { MenuItem } from "electron";

type MenuParams = {
  app: Electron.App;
  isMac: boolean;
  isDev: boolean;
};

const buildMenu = (params: MenuParams): MenuItem[] => {
  const { app, isMac, isDev } = params;

  return [
    ...(isMac ? [{ role: "appMenu" }] : []),
    {
      label: "File",
      submenu: [
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+W",
          click: () => app.quit(),
        },
      ],
    },
    ...(isDev
      ? [
          {
            label: "Developer",
            submenu: [
              { role: "reload" },
              { role: "forcereload" },
              { type: "separator" },
              { role: "toggledevtools" },
            ],
          },
        ]
      : []),
  ] as unknown as MenuItem[];
};
export default buildMenu;
