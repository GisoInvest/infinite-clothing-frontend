/**
 * SendGrid Email Integration
 * 
 * Sends transactional and marketing emails via SendGrid API
 */

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: {
    email: string;
    name: string;
  };
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@infiniteclothingstore.co.uk';
  
  if (!apiKey) {
    console.error('[SendGrid] API key not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: Array.isArray(options.to) 
            ? options.to.map(email => ({ email }))
            : [{ email: options.to }],
        }],
        from: options.from || {
          email: fromEmail,
          name: 'INF!NITE C107HING',
        },
        subject: options.subject,
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
          ...(options.text ? [{
            type: 'text/plain',
            value: options.text,
          }] : []),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[SendGrid] Failed to send email:', error);
      return false;
    }

    console.log('[SendGrid] Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('[SendGrid] Error sending email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name?: string, discountCode?: string): Promise<boolean> {
  const displayName = name || 'there';
  
  return sendEmail({
    to: email,
    subject: `Welcome to INF!NITE C107HING${discountCode ? ' - Your 10% Discount Inside!' : '!'}`,
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
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .discount-code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .code { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to INF!NITE C107HING!</h1>
          </div>
          <div class="content">
            <p>Hey ${displayName},</p>
            <p>Thank you for subscribing to our newsletter! You're now part of the INF!NITE C107HING community.</p>
            ${discountCode ? `
            <div class="discount-code">
              <p style="margin: 0 0 10px 0; font-size: 18px;">🎉 Your Exclusive Welcome Gift 🎉</p>
              <p class="code">${discountCode}</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Use this code at checkout for <strong>10% OFF</strong> your first order!</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Valid for 30 days • One-time use</p>
            </div>
            ` : ''}
            <p>Here's what you can expect:</p>
            <ul>
              <li>🎨 Exclusive early access to new collections</li>
              <li>💰 Special subscriber-only discounts</li>
              <li>📰 Latest streetwear trends and styling tips</li>
              <li>🎁 Surprise giveaways and promotions</li>
            </ul>
            <a href="https://infiniteclothingstore.co.uk" class="button">Shop Now</a>
            <p>Stay infinite,<br>The INF!NITE C107HING Team</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to INF!NITE C107HING newsletter.</p>
            <p>If you no longer wish to receive these emails, you can <a href="https://infiniteclothingstore.co.uk/unsubscribe">unsubscribe</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to INF!NITE C107HING!
      
      Hey ${displayName},
      
      Thank you for subscribing to our newsletter! You're now part of the INF!NITE C107HING community.
      ${discountCode ? `
      
      🎉 YOUR EXCLUSIVE WELCOME GIFT 🎉
      
      Discount Code: ${discountCode}
      
      Use this code at checkout for 10% OFF your first order!
      Valid for 30 days • One-time use
      ` : ''}
      
      Here's what you can expect:
      - Exclusive early access to new collections
      - Special subscriber-only discounts
      - Latest streetwear trends and styling tips
      - Surprise giveaways and promotions
      
      Visit us at: https://infiniteclothingstore.co.uk
      
      Stay infinite,
      The INF!NITE C107HING Team
    `,
  });
}

export async function sendBlogNotification(
  subscribers: string[],
  blogPost: {
    title: string;
    excerpt: string;
    slug: string;
    coverImage?: string;
  }
): Promise<boolean> {
  const postUrl = `https://infiniteclothingstore.co.uk/blog/${blogPost.slug}`;
  
  return sendEmail({
    to: subscribers,
    subject: `New Blog Post: ${blogPost.title}`,
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
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .cover-image { width: 100%; max-width: 600px; height: auto; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Blog Post</h1>
          </div>
          <div class="content">
            <h2>${blogPost.title}</h2>
            ${blogPost.coverImage ? `<img src="${blogPost.coverImage}" alt="${blogPost.title}" class="cover-image" />` : ''}
            <p>${blogPost.excerpt}</p>
            <a href="${postUrl}" class="button">Read More</a>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to INF!NITE C107HING newsletter.</p>
            <p><a href="https://infiniteclothingstore.co.uk/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPromotionalEmail(
  subscribers: string[],
  campaign: {
    subject: string;
    content: string;
  }
): Promise<boolean> {
  return sendEmail({
    to: subscribers,
    subject: campaign.subject,
    html: campaign.content,
  });
}
