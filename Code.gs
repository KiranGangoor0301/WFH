function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Use specific spreadsheet by ID
    const SPREADSHEET_ID = "13ytotZpCm8lIRjctVR2Kaa3G5wJU_HOMWOGe1soXjzM"; // Add your spreadsheet ID here
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Responses") || ss.getActiveSheet();

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Work Type",
        "IP Address",
        "Latitude",
        "Longitude",
        "Location Address",  // New column
        "City",             // New column
        "State",           // New column
        "Country"          // New column
      ]);
    }

    // Prepare the row data with location details
    const location = data.location || {};
    const details = location.details || {};
    
    const rowData = [
      data.timestamp,
      data.name,
      data.email,
      data.workType,
      data.ipAddress,
      location.latitude,
      location.longitude,
      location.address || 'Not available',
      details.city || details.town || details.village || 'Not available',
      details.state || 'Not available',
      details.country || 'Not available'
    ];

    // Append the data to the sheet
    sheet.appendRow(rowData);

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Data saved successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile("viewer")
    .setTitle("WFH Tracking Data Viewer")
    .setFaviconUrl("https://www.google.com/images/favicon.ico");
}

function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data;
}


