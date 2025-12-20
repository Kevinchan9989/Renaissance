// Debug: check what require.resolve returns
console.log('Script dir:', __dirname);
console.log('Process cwd:', process.cwd());
console.log('NODE_MODULES_BYPASS_ELECTRON:', process.env.NODE_MODULES_BYPASS_ELECTRON);

try {
  // This should resolve to Electron's internal module, not node_modules
  console.log('Attempting to require electron...');
  const resolved = require.resolve('electron');
  console.log('require.resolve("electron"):', resolved);
} catch (e) {
  console.log('require.resolve error:', e.message);
}

// Check if we're actually in Electron process
console.log('process.versions.electron:', process.versions.electron);
console.log('process.type:', process.type);

// Alternative way to check electron availability
if (process.versions.electron) {
  console.log('We ARE in Electron!');
} else {
  console.log('NOT in Electron process');
}
