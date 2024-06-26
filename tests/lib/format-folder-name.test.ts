import formatFolderName from "../../src/lib/format-folder-name";

describe("formatFolderName", () => {
  it("should format the folder name correctly", () => {
    const params = {
      folderName: "  Test Folder Name!  ",
    };

    const result = formatFolderName(params);

    expect(result).toBe("test-folder-name");
  });

  it("should format the folder name correctly for numbers", () => {
    const params = {
      folderName: "Rottnest swim 2024",
    };

    const result = formatFolderName(params);

    expect(result).toBe("rottnest-swim-2024");
  });

  it("should return an empty string if the folder name is empty", () => {
    const params = {
      folderName: "   ",
    };

    const result = formatFolderName(params);

    expect(result).toBe("");
  });
});
