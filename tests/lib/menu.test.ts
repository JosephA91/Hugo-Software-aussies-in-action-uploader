import buildMenu from "../../src/lib/menu";
import { MenuItem } from "electron";

describe("buildMenu", () => {
  it("should build the menu correctly", () => {
    const params = {
      app: {} as Electron.App,
      isMac: true,
      isDev: false,
    };

    const result = buildMenu(params);

    expect(result).toBeInstanceOf(Array);
    expect(result[0]).toHaveProperty("role", "appMenu");
    expect(result[1]).toHaveProperty("label", "File");
  });
});
