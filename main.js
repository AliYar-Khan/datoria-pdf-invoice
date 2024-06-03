const puppeteer = require('puppeteer')

export default async ({ req, res }) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(req.body.htmlString, { waitUntil: 'load' })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=${req.body.invoiceName}.pdf`,
    'Content-Length': pdfBuffer.length
  })
  res.send(pdfBuffer)
}
