import fs from "fs";
import PdfParse from "pdf-parse";
const file = fs.readFileSync('sample-text.pdf');
PdfParse(file).then(data => {
    console.log(data.info);
}).catch(err => {
    console.log(err);
});
