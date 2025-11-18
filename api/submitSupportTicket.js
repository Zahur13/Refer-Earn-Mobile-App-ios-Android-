const { db, FieldValue } = require("./_firebase-admin");
const { verifyAuth } = require("./_helpers");
const cors = require("./_cors");

module.exports = async (req, res) => {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📝 Support ticket API called");
    console.log("📝 Request headers:", req.headers);
    console.log("📝 Request body:", req.body);

    // Verify authentication
    let decodedToken;
    try {
      decodedToken = await verifyAuth(req);
      console.log("✅ User authenticated:", decodedToken.uid);
    } catch (authError) {
      console.error("❌ Auth error:", authError.message);
      return res.status(401).json({
        error: "Authentication failed. Please log in again.",
        details: authError.message,
      });
    }

    const userId = decodedToken.uid;
    const { userName, userEmail, userPhone, subject, message } = req.body;

    // Validate required fields
    if (!userName || !userEmail || !subject || !message) {
      return res.status(400).json({
        error: "Please fill all required fields",
        missing: {
          userName: !userName,
          userEmail: !userEmail,
          subject: !subject,
          message: !message,
        },
      });
    }

    // Validate field lengths
    if (subject.length > 100) {
      return res
        .status(400)
        .json({ error: "Subject too long (max 100 characters)" });
    }

    if (message.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message too long (max 1000 characters)" });
    }

    // Create ticket data
    const supportTicket = {
      userId: userId,
      userName: userName.trim(),
      userEmail: userEmail.trim().toLowerCase(),
      userPhone: userPhone ? userPhone.trim() : "",
      subject: subject.trim(),
      message: message.trim(),
      status: "PENDING",
      replies: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    console.log("📝 Creating ticket in Firestore...");

    // Add to Firestore
    const docRef = await db.collection("supportTickets").add(supportTicket);
    console.log("✅ Ticket created with ID:", docRef.id);

    // Try to send email notification (non-critical)
    try {
      console.log("📧 Sending email notification...");

      const formData = new URLSearchParams({
        _subject: `🆘 Support Request: ${subject.trim()}`,
        _template: "box",
        _captcha: "false",
        Name: userName.trim(),
        Email: userEmail.trim(),
        Phone: userPhone ? userPhone.trim() : "Not provided",
        Subject: subject.trim(),
        Message: message.trim(),
        TicketID: docRef.id,
      });

      const emailResponse = await fetch(
        "https://formsubmit.co/ajax/refernearnplatform@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: formData.toString(),
        }
      );

      if (emailResponse.ok) {
        console.log("✅ Email sent successfully");
      } else {
        console.log("⚠️ Email failed but ticket created");
      }
    } catch (emailError) {
      console.error("⚠️ Email error (non-critical):", emailError.message);
    }

    // Try to create admin notification (non-critical)
    try {
      console.log("🔔 Creating admin notification...");

      const adminSnapshot = await db
        .collection("users")
        .where("role", "==", "admin")
        .limit(1)
        .get();

      if (!adminSnapshot.empty) {
        const adminId = adminSnapshot.docs[0].id;

        await db.collection("notifications").add({
          userId: adminId,
          type: "SUPPORT_REQUEST",
          title: "New Support Request",
          message: `${userName} submitted: ${subject}`,
          read: false,
          ticketId: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        });

        console.log("✅ Admin notification created");
      } else {
        console.log("⚠️ No admin user found for notification");
      }
    } catch (notifError) {
      console.error(
        "⚠️ Notification error (non-critical):",
        notifError.message
      );
    }

    // Success response
    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully! Our support team will get back to you within 24 hours.",
      ticketId: docRef.id,
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    console.error("❌ Error stack:", error.stack);

    // Handle specific error types
    if (error.code === "permission-denied") {
      return res.status(403).json({
        error: "Permission denied. Please check Firestore security rules.",
      });
    }

    if (error.code === "unauthenticated" || error.message.includes("auth")) {
      return res.status(401).json({
        error: "Authentication failed. Please log in again.",
      });
    }

    // Generic error
    return res.status(500).json({
      error: "Failed to send message. Please try again later.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
