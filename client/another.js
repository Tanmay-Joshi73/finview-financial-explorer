const fs = require("fs")
const PdfParse = require("pdf-parse")

const buffer = fs.readFileSync("sample-text.pdf")
console.log(buffer)
PdfParse(buffer)
  .then((data) => {
    const text = data.text

    // Regular expression pattern to match transaction details
    const transactionRegex =
      /(\w{3} \d{1,2}, \d{4})\n(\d{1,2}:\d{2} [AP]M)\n(DEBIT|CREDIT)₹(\d+)(.*?)\nTransaction ID (\w+)\nUTR No\. (\d+)(?:\n.*?)*?\nPaid by\n(.*?)(?=\n\w{3} \d{1,2}, \d{4}|$)/gs

    const transactions = []
    let match

    while ((match = transactionRegex.exec(text)) !== null) {
      transactions.push({
        date: match[1],
        time: match[2],
        type: match[3],
        amount: match[4],
        data: match[5].trim(),
        transaction_Id: match[6],
        UTR: match[7],
        paid_By: match[8],
      })
    }

    console.log(transactions)
  })
  .catch((err) => {
    console.log(err)
  })
