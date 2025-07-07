export function getResetPasswordTemplate(
    userName,
    otp,
    expiresIn = "10 minutes",
) {
    return `<!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <title>Reset Your Password</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body {
        background-color: #f4f4f7;
        color: #51545e;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .email-wrapper {
        width: 100%;
        background-color: #f4f4f7;
        padding: 20px;
      }
      .email-content {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 5px;
        overflow: hidden;
      }
      .email-header {
        background-color: #3869d4;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .email-body {
        padding: 30px;
      }
      .otp-code {
        display: block;
        width: fit-content;
        margin: 20px auto;
        padding: 15px 25px;
        background-color: #f0f4ff;
        color: #3869d4;
        font-size: 24px;
        font-weight: bold;
        border-radius: 5px;
        letter-spacing: 4px;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #3869d4;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #a8aaaf;
      }
    </style>
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table class="email-content" cellpadding="0" cellspacing="0">
            <!-- Header -->
            <tr>
              <td class="email-header">
                <h1>Your App Name</h1>
              </td>
            </tr>
  
            <!-- Body -->
            <tr>
              <td class="email-body">
                <p>Hi ${userName || "there"},</p>
                <p>You recently requested to reset your password. Use the code below to complete your request. This code will expire in <strong>${expiresIn}</strong>.</p>
                <span class="otp-code">${otp}</span>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>Thanks,<br/>The Your App Team</p>
                <a href="https://shivmandirlalpur.netlify.app/change-password" class="button">Change your password</a>
              </td>
            </tr>
  
        //     <!-- Footer -->
        //     <tr>
        //       <td class="footer">
        //         <p>Your App Inc., 1234 Main Street, Somewhere, 12345</p>
        //         <p><a href="https://yourapp.example.com/unsubscribe">Unsubscribe</a> • <a href="https://yourapp.example.com/support">Support</a></p>
        //       </td>
        //     </tr>
        //   </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}
