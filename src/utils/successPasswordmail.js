export function getPasswordChangedTemplate({ name: string }) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Changed</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        color: #51545e;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        padding: 20px;
        background-color: #f4f4f7;
      }
      .content {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #22c55e;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .body {
        padding: 30px;
        font-size: 16px;
        line-height: 1.5;
      }
      .button {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 24px;
        background-color: #22c55e;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #a8aaaf;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <div class="header">
          <h1>${name}</h1>
        </div>
        <div class="body">
          <p>Hi ${name},</p>
          <p>This is a confirmation that your password was successfully changed.</p>

          <p>&copy; ${new Date().getFullYear()} ${name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}
