const PDFDocument = require('pdfkit');

const invoiceService = {
  generateInvoice: (order, tenant) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text(tenant?.name || 'NextGen Store', 50, 50);
        doc.fontSize(10).font('Helvetica').fillColor('#666666');

        if (tenant?.contactInfo?.email) {
          doc.text(tenant.contactInfo.email, 50, 80);
        }
        if (tenant?.contactInfo?.phone) {
          doc.text(tenant.contactInfo.phone, 50, 95);
        }
        if (tenant?.contactInfo?.address) {
          const addr = tenant.contactInfo.address;
          doc.text(`${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}`, 50, 110);
        }

        // Invoice Title
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#2563eb').text('INVOICE', 400, 50, { align: 'right' });

        // Invoice Details
        doc.fontSize(10).font('Helvetica').fillColor('#333333');
        doc.text(`Invoice #: ${order.invoiceNumber || order.orderNumber}`, 400, 80, { align: 'right' });
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 95, { align: 'right' });
        doc.text(`Order #: ${order.orderNumber}`, 400, 110, { align: 'right' });

        // Divider
        doc.moveTo(50, 140).lineTo(545, 140).strokeColor('#e5e7eb').stroke();

        // Bill To
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Bill To:', 50, 160);
        doc.fontSize(10).font('Helvetica').fillColor('#666666');

        const shipping = order.shippingAddress || {};
        doc.text(shipping.name || `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`, 50, 180);
        if (shipping.street) doc.text(shipping.street, 50, 195);
        if (shipping.city) doc.text(`${shipping.city}, ${shipping.state || ''} ${shipping.zipCode || ''}`, 50, 210);
        if (shipping.phone) doc.text(`Phone: ${shipping.phone}`, 50, 225);

        // Payment Info
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#333333').text('Payment:', 350, 160);
        doc.fontSize(10).font('Helvetica').fillColor('#666666');
        doc.text(`Method: ${order.paymentMethod || 'N/A'}`, 350, 180);
        doc.text(`Status: ${order.paymentStatus || 'Pending'}`, 350, 195);

        // Table Header
        const tableTop = 260;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff');

        // Header background
        doc.rect(50, tableTop - 5, 495, 25).fill('#2563eb');
        doc.fillColor('#ffffff');
        doc.text('#', 55, tableTop, { width: 30 });
        doc.text('Item', 85, tableTop, { width: 200 });
        doc.text('Qty', 290, tableTop, { width: 50, align: 'center' });
        doc.text('Price', 345, tableTop, { width: 80, align: 'right' });
        doc.text('Total', 435, tableTop, { width: 100, align: 'right' });

        // Table Rows
        let y = tableTop + 30;
        doc.font('Helvetica').fillColor('#333333');

        if (order.items && order.items.length > 0) {
          order.items.forEach((item, i) => {
            // Alternate row background
            if (i % 2 === 0) {
              doc.rect(50, y - 5, 495, 22).fill('#f9fafb');
              doc.fillColor('#333333');
            }

            doc.text(String(i + 1), 55, y, { width: 30 });
            doc.text(item.name || 'Product', 85, y, { width: 200 });
            doc.text(String(item.quantity), 290, y, { width: 50, align: 'center' });
            doc.text(`₹${(item.price || 0).toLocaleString('en-IN')}`, 345, y, { width: 80, align: 'right' });
            doc.text(`₹${(item.total || 0).toLocaleString('en-IN')}`, 435, y, { width: 100, align: 'right' });

            y += 25;
          });
        }

        // Totals
        y += 15;
        doc.moveTo(300, y).lineTo(545, y).strokeColor('#e5e7eb').stroke();
        y += 10;

        doc.fontSize(10).font('Helvetica');
        doc.text('Subtotal:', 350, y).text(`₹${(order.subtotal || 0).toLocaleString('en-IN')}`, 435, y, { width: 100, align: 'right' });
        y += 20;

        if (order.taxAmount > 0) {
          doc.text('Tax:', 350, y).text(`₹${(order.taxAmount || 0).toLocaleString('en-IN')}`, 435, y, { width: 100, align: 'right' });
          y += 20;
        }

        if (order.shippingCost > 0) {
          doc.text('Shipping:', 350, y).text(`₹${(order.shippingCost || 0).toLocaleString('en-IN')}`, 435, y, { width: 100, align: 'right' });
          y += 20;
        }

        if (order.discount > 0) {
          doc.fillColor('#10b981').text('Discount:', 350, y).text(`-₹${(order.discount || 0).toLocaleString('en-IN')}`, 435, y, { width: 100, align: 'right' });
          y += 20;
          doc.fillColor('#333333');
        }

        // Grand Total
        doc.moveTo(300, y).lineTo(545, y).strokeColor('#2563eb').lineWidth(2).stroke();
        y += 10;
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#2563eb');
        doc.text('TOTAL:', 350, y).text(`₹${(order.total || 0).toLocaleString('en-IN')}`, 420, y, { width: 115, align: 'right' });

        // Footer
        doc.fontSize(9).font('Helvetica').fillColor('#999999');
        doc.text('Thank you for your business!', 50, 750, { align: 'center', width: 495 });
        doc.text('This is a computer-generated invoice and does not require a signature.', 50, 765, { align: 'center', width: 495 });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = invoiceService;