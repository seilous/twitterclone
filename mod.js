const fs = require('fs');
const path = require('path');

function getRandomDate(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTimestamp = Math.random() * (endDate - startDate) + startDate;
  return new Date(randomTimestamp);
}

function updateModificationDateRecursively(dirPath, startDate, endDate) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updateModificationDateRecursively(filePath, startDate, endDate);
      const randomDate = getRandomDate(startDate, endDate);
      fs.utimesSync(filePath, randomDate, randomDate);
    } else {
      const randomDate = getRandomDate(startDate, endDate);
      fs.utimesSync(filePath, randomDate, randomDate);
    }
  });
}

const parentDirectoryPath = __dirname; // Assuming the script is located in the parent directory
const startDate = '2023-01-01';
const endDate = '2023-01-30';

updateModificationDateRecursively(parentDirectoryPath, startDate, endDate);

console.log('Modification dates have been updated!');

