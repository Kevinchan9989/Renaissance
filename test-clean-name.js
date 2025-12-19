function cleanName(str) {
  return str ? str.replace(/["`\[\]]/g, '').trim() : '';
}

console.log('Input: "uuid"');
console.log('Output:', cleanName('"uuid"'));
console.log('Expected: uuid');
