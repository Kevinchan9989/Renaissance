console.log('Testing require electron from project dir');
try {
  const electron = require('electron');
  console.log('electron module:', electron);
  console.log('typeof electron:', typeof electron);
  if (typeof electron === 'string') {
    console.log('electron is a PATH (wrong!):', electron);
  } else {
    console.log('Keys:', Object.keys(electron));
    const { app, BrowserWindow } = electron;
    console.log('app:', app);
    console.log('BrowserWindow:', BrowserWindow);
  }
} catch(e) {
  console.error('Error:', e.message);
}
