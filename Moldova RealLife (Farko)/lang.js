const fs = require('fs')
const lang = process.argv[2] || 'en';
console.log("Switch lang to "+lang)
if(fs.existsSync('./src/shared/lang/default.ts')){
    fs.unlinkSync('./src/shared/lang/default.ts');
}
fs.writeFileSync('./src/shared/lang/default.ts', `export const DEFAULT_SELECTED_LANG = '${lang}' as any`);