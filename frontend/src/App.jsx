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
      setAlert({ show: true, message: "Please fill in all fields", type: "error" }); // ✅ Show error message using setAlert
      return;
    }

    // ✅ Improved email formatting with inline styles
    const emailBody = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <div style="text-align: center;">
          <img src="cid:companylogo" alt="Company Logo" width="200" style="margin-bottom: 15px;" />
        </div>
        <h2 style="color: #2c3e50;">Dear ${userName},</h2>
        <p>Due to the review on a loan proposal by your partner, <strong>${partnerName}</strong>, with our company and in line with our policy of transparency and integrity, we humbly request a security check on your profile. Your name appears as a holder on the Home Equity account provided to us by your partner(<strong>${partnerName}</strong>).</p>
        
        <p>In appreciation, we kindly request you to submit the following documents for verification:</p>
        <ul>
            <li>A scanned copy of any recently paid utility bill bearing the name provided by your partner, <strong>${partnerName}</strong>.</li>
            <li>Any government-issued document, such as a <strong>Driver’s License</strong>.</li>
        </ul>
        
        <p><strong>P.S:</strong> Please ensure that your full name is clearly visible on all verification documents you provide and attach them to your reply for verification.</p>
        
        <p>Thank you for your cooperation.</p>
        
        <p>Best regards,<br>
        <strong>VISTA FINANCE</strong><br>
        Contact: biurovistafinance.pl@gmail.com</p>
      </body>
      </html>
    `;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/send-email", {
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
        setAlert({ show: true, message: "Message sent successfully!", type: "success" });
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
      {alert.show && <div className={`alert ${alert.type}`}>{alert.message}</div>}
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
