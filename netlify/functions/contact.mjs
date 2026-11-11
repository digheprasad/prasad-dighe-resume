const recipient = process.env.CONTACT_EMAIL || "digheprasad33@gmail.com";
const sender = process.env.RESEND_FROM_EMAIL;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxLengths = { name: 100, email: 254, subject: 150, message: 5000 };

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function jsonResponse(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export default async function contact(request) {
  if (request.method !== "POST") {
    return jsonResponse(405, { message: "Method not allowed." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { message: "Please submit a valid message." });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonResponse(400, { message: "Please submit a valid message." });
  }
  if (typeof body.website === "string" && body.website.trim()) {
    return jsonResponse(200, { message: "Thanks — your message has been received." });
  }

  const fields = {};
  for (const [field, maxLength] of Object.entries(maxLengths)) {
    const value = typeof body[field] === "string" ? body[field].trim() : "";
    if (!value || value.length > maxLength) {
      return jsonResponse(400, { message: `Please check the ${field} field.` });
    }
    fields[field] = value;
  }
  if (!emailPattern.test(fields.email)) {
    return jsonResponse(400, { message: "Please enter a valid email address." });
  }
  if (!process.env.RESEND_API_KEY || !sender) {
    console.error("Contact form email service is not configured.");
    return jsonResponse(503, { message: "The contact form is temporarily unavailable. Please email me directly instead." });
  }

  const subject = fields.subject.replace(/[\r\n]+/g, " ").slice(0, maxLengths.subject);
  const plainText = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Subject: ${subject}`,
    "",
    fields.message,
  ].join("\n");
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(fields.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(fields.email)}</p>`,
    `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>`,
    `<p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>`,
  ].join("");

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: fields.email,
        subject: `Portfolio message: ${subject}`,
        text: plainText,
        html,
      }),
    });
  } catch {
    console.error("Contact form email provider could not be reached.");
    return jsonResponse(502, { message: "Your message could not be sent. Please try again or email me directly." });
  }

  if (!response.ok) {
    console.error(`Contact form email provider returned ${response.status}.`);
    return jsonResponse(502, { message: "Your message could not be sent. Please try again or email me directly." });
  }

  return jsonResponse(200, { message: "Thanks — your message has been sent." });
}
