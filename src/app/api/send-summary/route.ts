import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;

  if (!resendKey || !notifyEmail) {
    return NextResponse.json(
      { error: "Email not configured" },
      { status: 500 }
    );
  }

  const resend = new Resend(resendKey);

  try {
    const { markdown, date } = (await request.json()) as {
      markdown: string;
      date: string;
    };

    // Convert markdown to simple HTML for email
    const htmlBody = markdown
      .replace(/^# (.+)$/gm, "<h1 style='font-size:24px;font-weight:700;margin:24px 0 8px'>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2 style='font-size:18px;font-weight:600;margin:20px 0 8px'>$1</h2>")
      .replace(/^\*\*(.+?)\*\*/gm, "<strong>$1</strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.+)$/gm, "<li style='margin:4px 0'>$1</li>")
      .replace(/^\d+\. (.+)$/gm, "<li style='margin:4px 0'>$1</li>")
      .replace(/\| (.+) \|/g, (match) => {
        const cells = match.split("|").filter(Boolean).map((c) => c.trim());
        return `<tr>${cells.map((c) => `<td style='padding:6px 12px;border:1px solid #E5E5E5'>${c}</td>`).join("")}</tr>`;
      })
      .replace(/\|[-|]+\|/g, "")
      .replace(/^---$/gm, "<hr style='border:none;border-top:1px solid #E5E5E5;margin:24px 0'>")
      .replace(/\n/g, "<br>");

    const html = `
      <div style="font-family:Inter,-apple-system,sans-serif;max-width:640px;margin:0 auto;color:#000">
        <div style="background:#F7F2EA;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="margin:0;font-size:20px;font-weight:700">
            Studio <span style="color:#D11338;font-weight:300">AI</span>
          </h1>
          <p style="margin:4px 0 0;color:#6B7280;font-size:14px">Résumé de session brainstorm — ${date}</p>
        </div>
        <div style="padding:32px;background:#fff;border:1px solid #E5E5E5;border-top:none;border-radius:0 0 12px 12px">
          ${htmlBody}
        </div>
        <p style="text-align:center;color:#6B7280;font-size:12px;margin-top:16px">
          Généré par Studio AI — Intact Financial Corporation
        </p>
      </div>
    `;

    await resend.emails.send({
      from: "Studio AI <notifications@alloleo.com>",
      to: notifyEmail,
      subject: `Studio AI — Résumé brainstorm ${date}`,
      html,
      text: markdown,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Email failed" },
      { status: 500 }
    );
  }
}
