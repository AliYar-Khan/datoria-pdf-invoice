const puppeteer = require('puppeteer')

export default async ({ req, res }) => {
  try {
    const { htmlString, filename = 'document.pdf' } = req.body;

    // Validate input
    if (!htmlString) {
      return res.status(400).json({
        error: 'HTML string is required',
        message: 'Please provide htmlString in the request body'
      });
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(htmlString, { 
      waitUntil: ['load', 'networkidle0'] 
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for file download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length
    });

    // Send the PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
}
