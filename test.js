// Using Node.js to read the JSON file
const versionData = require('./versionData.json');

// Print specific version information
console.log("BACK4 v4.2 version:", versionData['v4.2'].version);
console.log("BACK4 v4.2 device:", versionData['v4.2'].device);
console.log("BACK4 v4.2 release date:", versionData['v4.2'].releaseDate);
console.log("BACK4 v4.2 security class:", versionData['v4.2'].securityClass);
console.log("BACK4 v4.2 update type:", versionData['v4.2'].updateType);
console.log("BACK4 v4.2 tags:", versionData['v4.2'].tags);
console.log("BACK4 v4.2 changes:", versionData['v4.2'].changes);
console.log("BACK4 v4.2 impacts:", versionData['v4.2'].impacts);
console.log("BACK4 v4.2 instructions:", versionData['v4.2'].instructions);
console.log("BACK4 v4.2 resolved issues:", versionData['v4.2'].resolvedIssues);
console.log("BACK4 v4.2 update risks:", versionData['v4.2'].updateRisks);
console.log("BACK4 v4.2 residual risks:", versionData['v4.2'].residualRisks);
console.log("BACK4 v4.2 installation steps:", versionData['v4.2'].installation.steps);
console.log("BACK4 v4.2 installation compatibility:", versionData['v4.2'].installation.compatibility);
console.log("BACK4 v4.2 support email:", versionData['v4.2'].support.email);
console.log("BACK4 v4.2 support phone:", versionData['v4.2'].support.phone);
console.log("BACK4 v4.2 support hours:", versionData['v4.2'].support.hours);

// Print all versions for a specific device type
console.log("\nAll BACK4 versions:");
Object.keys(versionData).forEach(key => {
  if (versionData[key].device === "BACK4") {
    console.log(`- ${versionData[key].version}: ${versionData[key].note_version || "No note available"}`);
  }
});

// Print all devices and their versions
console.log("\nAll devices and versions:");
const devices = {};
Object.keys(versionData).forEach(key => {
  const device = versionData[key].device;
  if (!devices[device]) {
    devices[device] = [];
  }
  devices[device].push(versionData[key].version);
});

Object.keys(devices).forEach(device => {
  console.log(`${device}: ${devices[device].join(", ")}`);
});

// If you want to use browser fetch API, comment out the code above and uncomment this code below
// when running in a browser environment:
/*
fetch('./versionData.json')
  .then(response => response.json())
  .then(data => {
    console.log("BACK4 v4.2 version:", data['v4.2'].version);
  })
  .catch(error => console.error('Error loading JSON:', error));
*/