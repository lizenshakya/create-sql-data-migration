const fs = require('fs');
const xlsx = require('xlsx');

(() => {
  // Load the Excel file
  const workbook = xlsx.readFile('/Users/lizenshakya/Downloads/data1.xlsx'); // Replace 'data.xlsx' with your file name

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to an array of objects
  const data = xlsx.utils.sheet_to_json(sheet);

  // Define a function to generate MongoDB insert queries
  function generateMongoDBInsert(data) {
    if (!data || !data.length) return '';

    const collectionName = 'roomsavailableinhotels'; // Replace 'roomsavailableinhotels' with your collection name

    const insertQueries = data.map(row => {
        console.log(row)
      return {
        type: 'Standard',
        number: row['rooms'].toString(), // Assuming 'number' is a column in your Excel file
        description: `Room ${row['rooms']} is good`,
      };
    });

    return `db.${collectionName}.insert(${JSON.stringify(insertQueries)})`;
  }

  // Generate MongoDB insert queries
  const mongoDBInsertQueries = generateMongoDBInsert(data);

  // Write the generated MongoDB queries to a JSON file
  fs.writeFile('/Users/lizenshakya/Downloads/output.sql', mongoDBInsertQueries, err => {
    if (err) {
      console.error('Error writing MongoDB queries to file:', err);
      return;
    }
    console.log('MongoDB insert queries have been written to output.json');
  });
})();
