# How to Re-parse Scripts Without Losing Mappings

The NUMERIC datatype parsing issue has been fixed, but your existing scripts still have the old parsed data. Follow these steps to re-parse your scripts **without losing any mappings**:

## Option 1: Browser Console (Easiest)

1. Open your app at http://localhost:3002/
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Copy and paste this entire script:

```javascript
// Re-parse all scripts with the new parser
(async function reparseAllScripts() {
  console.log('🔄 Re-parsing all scripts...');

  // Import parsers
  const { parsePostgreSQL, parseOracle, parseDBML } = await import('./src/utils/parsers.ts');

  // Load scripts
  const scripts = JSON.parse(localStorage.getItem('dm_tool_data') || '[]');

  if (scripts.length === 0) {
    console.log('❌ No scripts found');
    return;
  }

  console.log(`📋 Found ${scripts.length} script(s)`);

  // Re-parse each script
  scripts.forEach((script, index) => {
    console.log(`\n🔧 Re-parsing: ${script.name} (${script.type})`);

    try {
      let newData;
      switch (script.type) {
        case 'postgresql':
          newData = parsePostgreSQL(script.rawContent);
          break;
        case 'oracle':
          newData = parseOracle(script.rawContent);
          break;
        case 'dbml':
          newData = parseDBML(script.rawContent);
          break;
        default:
          console.log(`⚠️  Unknown type: ${script.type}`);
          return;
      }

      scripts[index] = {
        ...script,
        data: newData,
        updatedAt: Date.now()
      };

      console.log(`✅ Successfully re-parsed ${script.name}`);
    } catch (error) {
      console.error(`❌ Error re-parsing ${script.name}:`, error);
    }
  });

  // Save updated scripts
  localStorage.setItem('dm_tool_data', JSON.stringify(scripts));

  // Trigger reload
  window.dispatchEvent(new Event('storage'));

  console.log('\n✨ All scripts re-parsed! Refresh the page to see changes.');
  console.log('💡 Your mappings are preserved.');
})();
```

5. Press **Enter**
6. You should see messages like:
   ```
   🔄 Re-parsing all scripts...
   📋 Found 2 script(s)
   🔧 Re-parsing: PostgreSQL_Schema (postgresql)
   ✅ Successfully re-parsed PostgreSQL_Schema
   ✨ All scripts re-parsed! Refresh the page to see changes.
   💡 Your mappings are preserved.
   ```

7. **Refresh the page** (F5 or Ctrl+R)
8. Your NUMERIC types should now show correctly: `NUMERIC(7)`, `NUMERIC(13)`, `NUMERIC(5,2)`

## Option 2: Manual Re-parse (Per Script)

If you only want to re-parse specific scripts:

1. Open Developer Tools (F12) → Console tab
2. First, list your scripts:

```javascript
const scripts = JSON.parse(localStorage.getItem('dm_tool_data') || '[]');
scripts.forEach((s, i) => console.log(`${i}: ${s.name} (${s.id}) - ${s.type}`));
```

3. Find the index of the script you want to re-parse (e.g., `0` or `1`)

4. Re-parse that specific script:

```javascript
(async function() {
  const scriptIndex = 0; // Change this to your script's index

  const { parsePostgreSQL, parseOracle, parseDBML } = await import('./src/utils/parsers.ts');
  const scripts = JSON.parse(localStorage.getItem('dm_tool_data') || '[]');
  const script = scripts[scriptIndex];

  let newData;
  switch (script.type) {
    case 'postgresql':
      newData = parsePostgreSQL(script.rawContent);
      break;
    case 'oracle':
      newData = parseOracle(script.rawContent);
      break;
    case 'dbml':
      newData = parseDBML(script.rawContent);
      break;
  }

  scripts[scriptIndex] = { ...script, data: newData, updatedAt: Date.now() };
  localStorage.setItem('dm_tool_data', JSON.stringify(scripts));
  window.dispatchEvent(new Event('storage'));

  console.log('✅ Script re-parsed! Refresh the page.');
})();
```

5. Refresh the page

## What Gets Updated

✅ **Updated:**
- Column data types (NUMERIC, VARCHAR, etc.)
- All table structures
- Constraints and relationships

✅ **Preserved (NOT affected):**
- All your column mappings
- Mapping projects
- Table mappings
- Remarks and notes
- Type rules

## Verification

After re-parsing and refreshing:

1. Go to **Data Mapping** view
2. Look at your columns in the canvas
3. You should now see proper types like:
   - `NUMERIC(7)` instead of `NUMERIC(7`
   - `NUMERIC(13)` instead of `NUMERIC(13`
   - `NUMERIC(5,2)` instead of `NUMERIC(5,2`

## Troubleshooting

**Q: I see "Cannot find module './src/utils/parsers.ts'"**
- This is because Vite's HMR hasn't made the module available yet
- Try refreshing the page first, then run the script again

**Q: Nothing changed after refreshing**
- Make sure you see the "✅ Successfully re-parsed" messages
- Check that the script completed without errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Q: I lost my mappings!**
- This shouldn't happen - the script only updates the `data` field, not mappings
- Mappings are stored separately in `dm_tool_mapping_projects`
- If somehow affected, you can restore from Electron auto-save file (if running in Electron)
