const PDFDocument = require('pdfkit');

const invoiceService = {
  generateInvoice: (order, tenant) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        const PRIMARY_COLOR = '#059669'; // Emerald 600
        const TEXT_COLOR = '#1f2937'; // Gray 800
        const SECONDARY_TEXT_COLOR = '#6b7280'; // Gray 500
        const BORDER_COLOR = '#e5e7eb'; // Gray 200

        // Helper to format currency
        const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        // --- Header Section ---
        doc
            .fillColor(PRIMARY_COLOR)
            .fontSize(24)
            .font('Helvetica-Bold')
            .text(tenant?.name || 'CommerceHub', 50, 45)
            .fontSize(10)
            .text('INVOICE', 200, 50, { align: 'right' })
            .moveDown();

        // Divider
        doc.strokeColor(PRIMARY_COLOR).lineWidth(2).moveTo(50, 80).lineTo(550, 80).stroke();

        // --- Company & Order Details ---
        const customerTop = 100;

        // Column 1: From (Company)
        doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor(TEXT_COLOR)
            .text('From:', 50, customerTop)
            .font('Helvetica')
            .fillColor(SECONDARY_TEXT_COLOR)
            .text(tenant?.name || 'CommerceHub', 50, customerTop + 15)
            .text(tenant?.email || 'support@commercehub.com', 50, customerTop + 30)
            .text(tenant?.phone || '', 50, customerTop + 45);
        
        if (tenant?.contactInfo?.address) {
             const addr = tenant.contactInfo.address;
             doc.text(`${addr.street || ''}, ${addr.city || ''}`, 50, customerTop + 60, { width: 140 });
        }

        // Column 2: Bill To (Customer)
        doc
            .font('Helvetica-Bold')
            .fillColor(TEXT_COLOR)
            .text('Bill To:', 200, customerTop)
            .font('Helvetica')
            .fillColor(SECONDARY_TEXT_COLOR)
            .text(order.shippingAddress?.name || order.customer?.firstName + ' ' + order.customer?.lastName || 'Guest', 200, customerTop + 15)
            .text(order.shippingAddress?.email || order.customer?.email || '', 200, customerTop + 30)
            .text(order.shippingAddress?.phone || '', 200, customerTop + 45)
            .text(`${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}`, 200, customerTop + 60, { width: 160 })
            .text(`${order.shippingAddress?.state || ''} - ${order.shippingAddress?.zipCode || ''}`, 200, customerTop + 75);

        // Column 3: Order Details
        const orderDetailsX = 390;
        doc
            .font('Helvetica-Bold')
            .fillColor(TEXT_COLOR)
            .text('Order Details:', orderDetailsX, customerTop)
            .font('Helvetica')
            .fillColor(SECONDARY_TEXT_COLOR)
            .text(`Order #: ${order.orderNumber}`, orderDetailsX, customerTop + 15, { width: 160 })
            .text(`Date: ${formatDate(order.createdAt)}`, orderDetailsX, customerTop + 40) // Increased spacing
            .text(`Status: ${(order.status || 'Pending').toUpperCase()}`, orderDetailsX, customerTop + 55)
            .text(`Payment: ${(order.paymentMethod || 'COD').toUpperCase()}`, orderDetailsX, customerTop + 70);

        // --- Order Items Table ---
        let tableTop = 220;
        const itemCodeX = 50;
        const descriptionX = 100;
        const quantityX = 330;
        const priceX = 380;
        const totalX = 470;

        // Table Header
        doc
            .rect(50, tableTop, 500, 25)
            .fill(PRIMARY_COLOR)
            .stroke();
        
        doc
            .fontSize(10)
            .font('Helvetica-Bold')
            .fillColor('#ffffff')
            .text('#', itemCodeX + 5, tableTop + 7)
            .text('Item Description', descriptionX, tableTop + 7)
            .text('Qty', quantityX, tableTop + 7, { width: 40, align: 'center' })
            .text('Price', priceX, tableTop + 7, { width: 80, align: 'right' })
            .text('Total', totalX, tableTop + 7, { width: 70, align: 'right' });

        // Table Rows
        let y = tableTop + 25;
        doc.font('Helvetica').fontSize(10);

        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            const rowHeight = 30;
            
            // Zebra striping
            if (index % 2 === 1) {
                doc.rect(50, y, 500, rowHeight).fill('#f9fafb'); // Very light gray
            } else {
                doc.rect(50, y, 500, rowHeight).fill('#ffffff'); // White
            }
            
            // Bottom border for each row
            doc.moveTo(50, y + rowHeight).lineTo(550, y + rowHeight).strokeColor(BORDER_COLOR).lineWidth(0.5).stroke();

            doc.fillColor(TEXT_COLOR);
            doc.text(String(index + 1), itemCodeX + 5, y + 10);
            doc.text(item.name || 'Product', descriptionX, y + 10, { width: 220, lineBreak: false, ellipsis: true });
            doc.text(String(item.quantity), quantityX, y + 10, { width: 40, align: 'center' });
            doc.text(formatCurrency(item.price), priceX, y + 10, { width: 80, align: 'right' });
            doc.text(formatCurrency(item.total || item.price * item.quantity), totalX, y + 10, { width: 70, align: 'right' });

            y += rowHeight;
          });
        }
        
        // --- Totals Section ---
        let totalsY = y + 20;

        const drawTotalLine = (label, value, isBold = false, color = TEXT_COLOR) => {
            doc
                .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
                .fontSize(isBold ? 12 : 10)
                .fillColor(color)
                .text(label, 350, totalsY, { width: 100, align: 'right' })
                .text(value, 460, totalsY, { width: 80, align: 'right' });
            totalsY += 20;
        };

        drawTotalLine('Subtotal:', formatCurrency(order.subtotal));
        
        if (order.shippingCost > 0) {
            drawTotalLine('Shipping:', formatCurrency(order.shippingCost));
        }
        
        if (order.taxAmount > 0) {
            drawTotalLine('Tax:', formatCurrency(order.taxAmount));
        }
        
        if (order.discount > 0) {
            drawTotalLine('Discount:', `- ${formatCurrency(order.discount)}`, false, '#ef4444'); // Red for discount
        }

        // Divider line above Total
        doc.moveTo(350, totalsY).lineTo(550, totalsY).strokeColor(SECONDARY_TEXT_COLOR).lineWidth(0.5).stroke();
        totalsY += 10;

        // Grand Total Rectangle
        doc
            .rect(340, totalsY - 5, 210, 30)
            .fill(PRIMARY_COLOR);
            
        doc
            .font('Helvetica-Bold')
            .fontSize(14)
            .fillColor('#ffffff')
            .text('TOTAL:', 350, totalsY + 2, { width: 100, align: 'right' })
            .text(formatCurrency(order.total), 460, totalsY + 2, { width: 80, align: 'right' });

        // --- Footer ---
        const footerY = 730;
        doc
            .moveTo(50, footerY).lineTo(550, footerY).strokeColor(BORDER_COLOR).lineWidth(1).stroke()
            .fontSize(10)
            .fillColor(SECONDARY_TEXT_COLOR)
            .text('Thank you for your business!', 50, footerY + 15, { align: 'center' })
            .fontSize(8)
            .text('If you have any questions about this invoice, please contact support.', 50, footerY + 30, { align: 'center' })
            .text('This is a computer-generated invoice.', 50, footerY + 45, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = invoiceService;