/**
 * Abandoned Cart Recovery Email
 */

import { sendEmail } from './sendgrid';

interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

export async function sendAbandonedCartEmail(
  email: string,
  name: string,
  cartItems: CartItem[],
  cartTotal: number,
  sessionId: string
): Promise<boolean> {
  const checkoutUrl = `https://infiniteclothingstore.co.uk/cart?session=${sessionId}`;
  
  const itemsHtml = cartItems.map(item => `
    <tr>
      <td style="padding: 10px;">
        ${item.image ? `<img src="${item.image}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ''}
      </td>
      <td style="padding: 10px;">
        <strong>${item.productName}</strong><br/>
        ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `Color: ${item.color}` : ''}<br/>
        Qty: ${item.quantity}
      </td>
      <td style="padding: 10px; text-align: right;">
        £${((item.price * item.quantity) / 100).toFixed(2)}
      </td>
    </tr>
  `).join('');
  
  return sendEmail({
    to: email,
    subject: `${name}, you left something behind! 🛍️`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 15px 40px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .cart-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          .cart-table td { border-bottom: 1px solid #eee; }
          .total { font-size: 20px; font-weight: bold; color: #667eea; text-align: right; padding: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Don't Miss Out!</h1>
          </div>
          <div class="content">
            <p>Hey ${name},</p>
            <p>We noticed you left some amazing items in your cart at <strong>INF!NITE C107HING</strong>. They're still waiting for you!</p>
            
            <h3 style="color: #667eea;">Your Cart:</h3>
            <table class="cart-table">
              ${itemsHtml}
            </table>
            
            <div class="total">
              Total: £${(cartTotal / 100).toFixed(2)}
            </div>
            
            <p style="text-align: center;">
              <a href="${checkoutUrl}" class="button">Complete Your Purchase</a>
            </p>
            
            <p><strong>Why shop with us?</strong></p>
            <ul>
              <li>✨ Premium quality streetwear</li>
              <li>🚚 Fast & reliable shipping</li>
              <li>💯 100% satisfaction guarantee</li>
              <li>🎁 Exclusive designs you won't find anywhere else</li>
            </ul>
            
            <p>These items are popular and stock is limited. Complete your order now before they're gone!</p>
            
            <p>Stay infinite,<br>The INF!NITE C107HING Team</p>
          </div>
          <div class="footer">
            <p>This is a reminder about items you left in your cart.</p>
            <p>If you no longer wish to receive these emails, you can <a href="https://infiniteclothingstore.co.uk/unsubscribe">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hey ${name},
      
      We noticed you left some items in your cart at INF!NITE C107HING. They're still waiting for you!
      
      YOUR CART:
      ${cartItems.map(item => `
      - ${item.productName} ${item.size ? `(Size: ${item.size})` : ''} ${item.color ? `(Color: ${item.color})` : ''}
        Qty: ${item.quantity} - £${((item.price * item.quantity) / 100).toFixed(2)}
      `).join('\n')}
      
      Total: £${(cartTotal / 100).toFixed(2)}
      
      Complete your purchase: ${checkoutUrl}
      
      Why shop with us?
      - Premium quality streetwear
      - Fast & reliable shipping
      - 100% satisfaction guarantee
      - Exclusive designs you won't find anywhere else
      
      These items are popular and stock is limited. Complete your order now before they're gone!
      
      Stay infinite,
      The INF!NITE C107HING Team
    `,
  });
}
