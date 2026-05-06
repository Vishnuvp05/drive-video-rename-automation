function renameDriveVideos() {
  const sheetId = "1HiAvwILkXV5ftjQEwcT8vybJ4OLKW6bgnx9uy81nwFo";

  const MAIN_LINK_COL = 5;     // Column E
  const MISTAKE_LINK_COL = 8;  // Column H

  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheets = spreadsheet.getSheets();

  sheets.forEach(sheet => {
    const lastRow = sheet.getLastRow();

    for (let row = 2; row <= lastRow; row++) {
      const idValue = sheet.getRange(row, 1).getDisplayValue().trim(); // Column A

      const rawCategory = sheet.getRange(row, 4).getDisplayValue().trim(); // Column D
      const categoryMatch = rawCategory.match(/^[A-Za-z]\d+/);
      const category = categoryMatch ? categoryMatch[0] : rawCategory;

      const yesNo = sheet.getRange(row, 7).getDisplayValue().trim(); // Column G

      if (!idValue || !category || !yesNo) continue;

      // Rename main file from Column E
      const mainLink = getLinkFromCell(sheet.getRange(row, MAIN_LINK_COL));
      if (mainLink) {
        const mainName = `${idValue}_${yesNo}_${category}`;
        renameFileFromLink(mainLink, mainName, sheet.getName(), row);
      }

      // If mistake is Yes, rename extra file from Column H
      if (yesNo.toLowerCase() === "yes") {
        const mistakeLink = getLinkFromCell(sheet.getRange(row, MISTAKE_LINK_COL));

        if (mistakeLink) {
          const mistakeName = `${idValue}_${category}`;
          renameFileFromLink(mistakeLink, mistakeName, sheet.getName(), row);
        }
      }
    }
  });
}

function renameFileFromLink(link, newName, sheetName, row) {
  const fileId = extractFileId(link);

  if (!fileId) {
    Logger.log("No file ID found | Sheet: " + sheetName + " | Row: " + row + " | Link: " + link);
    return;
  }

  try {
    const file = DriveApp.getFileById(fileId);
    file.setName(newName);

    Logger.log("Renamed | Sheet: " + sheetName + " | Row: " + row + " | " + newName);
  } catch (error) {
    Logger.log("Failed | Sheet: " + sheetName + " | Row: " + row + " | Error: " + error.message);
  }
}

function getLinkFromCell(range) {
  const richText = range.getRichTextValue();

  if (richText) {
    const url = richText.getLinkUrl();
    if (url) return url;

    const runs = richText.getRuns();
    for (let i = 0; i < runs.length; i++) {
      const runUrl = runs[i].getLinkUrl();
      if (runUrl) return runUrl;
    }
  }

  return range.getDisplayValue();
}

function extractFileId(url) {
  const text = String(url);

  let match = text.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  match = text.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  match = text.match(/[-\w]{25,}/);
  if (match) return match[0];

  return null;
}
