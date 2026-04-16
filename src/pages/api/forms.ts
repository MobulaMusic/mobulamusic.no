import type { APIRoute } from 'astro';
import { addSubmission } from '../../lib/content';
import { Resend } from 'resend';
import crypto from 'node:crypto';

export const prerender = false;

const resend = new Resend(process.env.RESEND_API_KEY);

function buildNotificationHtml(formName: string, data: Record<string, string>): string {
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;border-bottom:1px solid #eee">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${v}</td></tr>`)
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a1a1a">Ny henvendelse: ${formName}</h2>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="margin-top:24px;color:#666;font-size:13px">Sendt fra kontaktskjemaet på mobulamusic.no</p>
    </div>`;
}

function buildConfirmationHtml(firstName: string, lang: string): string {
  if (lang === 'en') {
    return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a1a1a">Thank you for your inquiry, ${firstName}!</h2>
      <p>We have received your message and will get back to you as soon as possible, usually within 1–2 business days.</p>
      <p>In the meantime, feel free to check out our website: <a href="https://mobulamusic.no/en">mobulamusic.no</a></p>
      <p>Best regards,<br><strong>Mobula Music</strong><br>
      <a href="tel:+4792039045">+47 920 39 045</a><br>
      <a href="mailto:post@mobulamusic.com">post@mobulamusic.com</a></p>
    </div>`;
  }

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a1a1a">Takk for din henvendelse, ${firstName}!</h2>
      <p>Vi har mottatt meldingen din og vil ta kontakt med deg så snart som mulig, vanligvis innen 1–2 virkedager.</p>
      <p>I mellomtiden kan du gjerne ta en titt på nettsiden vår: <a href="https://mobulamusic.no">mobulamusic.no</a></p>
      <p>Med vennlig hilsen,<br><strong>Mobula Music</strong><br>
      <a href="tel:+4792039045">+47 920 39 045</a><br>
      <a href="mailto:post@mobulamusic.com">post@mobulamusic.com</a></p>
    </div>`;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const data: Record<string, string> = {};
  let formName = 'ukjent';
  let lang = 'no';

  for (const [k, v] of form.entries()) {
    if (k === '_form') { formName = String(v); continue; }
    if (k === '_redirect') {
      if (String(v).includes('/en/')) lang = 'en';
      continue;
    }
    if (k === '_lang') { lang = String(v); continue; }
    data[k] = String(v);
  }

  await addSubmission({
    id: crypto.randomUUID(),
    form: formName,
    data,
    createdAt: new Date().toISOString(),
  });

  // Forward to CRM webhook if configured
  const webhookUrl = process.env.PUBLIC_CRM_WEBHOOK_URL || '';
  if (webhookUrl) {
    const submissions = Object.entries(data).map(([k, v]) => ({ label: k, value: v }));
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { formName, submissions } }),
    }).catch(err => console.error('CRM webhook failed:', err));
  }

  const customerEmail = data.email || data.Email || '';
  const firstName = data.fornavn || data.Fornavn || data.firstName || 'der';

  // Send emails in the background — don't block the redirect
  if (process.env.RESEND_API_KEY) {
    const emails: Promise<unknown>[] = [];

    // 1. Notification to Mobula Music
    emails.push(
      resend.emails.send({
        from: 'Mobula Music <noreply@mobulamusic.com>',
        to: ['post@mobulamusic.com'],
        subject: `Ny henvendelse: ${formName}`,
        html: buildNotificationHtml(formName, data),
      })
    );

    // 2. Confirmation to the customer
    if (customerEmail) {
      const subject = lang === 'en'
        ? 'We have received your inquiry — Mobula Music'
        : 'Vi har mottatt din henvendelse — Mobula Music';

      emails.push(
        resend.emails.send({
          from: 'Mobula Music <noreply@mobulamusic.com>',
          to: [customerEmail],
          replyTo: 'post@mobulamusic.com',
          subject,
          html: buildConfirmationHtml(firstName, lang),
        })
      );
    }

    // Fire and forget — log errors but don't fail the form submission
    Promise.allSettled(emails).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`Email ${i} failed:`, r.reason);
        }
      });
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
