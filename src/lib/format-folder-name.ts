type folderParams = {
  folderName: string;
};

export default function formatFolderName(params: folderParams) {
  const { folderName } = params;

  return folderName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
}
