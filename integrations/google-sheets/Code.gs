/**
 * QualityClickss — Solar lead → Google Sheet web app
 * ---------------------------------------------------
 * ONE deployment serves ALL client landing pages. Each lead lands in a tab
 * named after the client id (client.config.ts → id), e.g. "sunrise-demo".
 * New client? Nothing to change here — the tab is created on its first lead.
 *
 * Accepts both:
 *   1. Leads from the site's /api/leads route (JSON)          ← recommended
 *   2. Netlify Forms "Outgoing webhook" notifications (JSON)  ← alternative
 *
 * SETUP (once, ~5 minutes)
 *  1. Create a Google Sheet, e.g. "Solar Leads — All Clients".
 *  2. Extensions → Apps Script → paste this file over Code.gs → Save.
 *  3. Project Settings (gear) → Script Properties → add (all optional):
 *       TOKEN          a long random string; also set it as GOOGLE_SHEETS_TOKEN
 *                      on every Netlify site. Blocks junk posts.
 *       NOTIFY_EMAILS  default email(s) for new-lead alerts, comma separated.
 *       NOTIFY_<id>    per-client override, e.g. NOTIFY_sunrise-demo =
 *                      owner@sunrisesolar.in  (use "none" to switch off)
 *  4. Deploy → New deployment → type "Web app"
 *       Execute as: Me      Who has access: Anyone
 *     Authorise, then copy the Web app URL (ends in /exec).
 *  5. On each Netlify site: Site configuration → Environment variables →
 *       GOOGLE_SHEETS_WEBHOOK_URL = <the /exec URL>
 *       GOOGLE_SHEETS_TOKEN       = <same TOKEN as step 3, if set>
 *     then Deploys → Trigger deploy.
 *  6. Run testSetup() once from the editor to see a sample row appear.
 *
 * After editing this script, use Deploy → Manage deployments → Edit →
 * Version: New version, so the same URL keeps working.
 */

var HEADERS = [
  'Received at (IST)', 'Name', 'Mobile', 'City / PIN', 'Monthly bill (₹)',
  'Property type', 'Est. system (kW)', 'Status', 'Notes',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'Landing page', 'Submitted at (UTC)', 'Source',
];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('TOKEN');

    var lead, source;
    if (body.payload && body.payload.data) {
      // Netlify Forms outgoing webhook
      var d = body.payload.data;
      lead = {
        client: d.client || body.payload.site_url || 'netlify',
        name: d.name, mobile: d.mobile, location: d.location,
        monthlyBill: d['monthly-bill'], propertyType: d['property-type'],
        estimatedSystemKw: d['estimated-system-kw'],
        landingPage: d['landing-page'], submittedAt: d['submitted-at'],
        utm_source: d.utm_source, utm_medium: d.utm_medium,
        utm_campaign: d.utm_campaign, utm_term: d.utm_term,
        utm_content: d.utm_content, gclid: d.gclid,
      };
      source = 'netlify-webhook';
      // Netlify webhooks can't send our token; pass it as ?token= in the URL.
      if (token && (e.parameter || {}).token !== token) return json({ error: 'unauthorised' });
    } else {
      lead = body;
      source = 'site';
      if (token && body.token !== token) return json({ error: 'unauthorised' });
    }

    if (!lead.mobile || !lead.name) return json({ error: 'missing name or mobile' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = sheetFor(String(lead.client || 'leads'));
      sheet.appendRow([
        Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm'),
        lead.name, "'" + lead.mobile, lead.location, num(lead.monthlyBill),
        lead.propertyType, num(lead.estimatedSystemKw), 'New', '',
        lead.utm_source, lead.utm_medium, lead.utm_campaign, lead.utm_term,
        lead.utm_content, lead.gclid, lead.landingPage, lead.submittedAt, source,
      ].map(function (v) { return v === undefined || v === null ? '' : v; }));
    } finally {
      lock.releaseLock();
    }

    notify(props, lead);
    return json({ ok: true });
  } catch (err) {
    return json({ error: String(err) });
  }
}

/** Health check: open the /exec URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'solar-leads' });
}

function sheetFor(clientId) {
  var name = clientId.replace(/[\[\]\*\/\\\?:]/g, '-').slice(0, 90);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold').setBackground('#073527').setFontColor('#ffffff');
    // Status dropdown for the sales team.
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Contacted', 'Site visit', 'Quoted', 'Won', 'Lost', 'Junk'], true)
      .build();
    sheet.getRange(2, 8, 5000, 1).setDataValidation(rule);
    sheet.setColumnWidths(1, 9, 140);
  }
  return sheet;
}

function notify(props, lead) {
  var to = props.getProperty('NOTIFY_' + lead.client) || props.getProperty('NOTIFY_EMAILS');
  if (!to || to === 'none') return;
  var wa = 'https://wa.me/91' + String(lead.mobile).replace(/\D/g, '').slice(-10);
  MailApp.sendEmail({
    to: to,
    subject: 'New solar enquiry: ' + lead.name + ' (' + (lead.location || '') + ')',
    htmlBody:
      '<p><b>' + esc(lead.name) + '</b> just asked for a solar quote.</p>' +
      '<p>Mobile: <a href="tel:+91' + esc(lead.mobile) + '">' + esc(lead.mobile) + '</a> · ' +
      '<a href="' + wa + '">WhatsApp</a><br>City / PIN: ' + esc(lead.location) +
      '<br>Monthly bill: ₹' + esc(lead.monthlyBill) + '<br>Property: ' + esc(lead.propertyType) +
      '<br>Suggested system: ' + esc(lead.estimatedSystemKw) + ' kW</p>' +
      '<p style="color:#666">Campaign: ' + esc(lead.utm_campaign || '—') + '</p>' +
      '<p><b>Call within 5 minutes — fast follow-up wins most solar deals.</b></p>',
  });
}

function testSetup() {
  var res = doPost({
    parameter: {},
    postData: { contents: JSON.stringify({
      client: 'test', name: 'Test Lead', mobile: '9876543210', location: '416416',
      monthlyBill: 2500, propertyType: 'Independent house', estimatedSystemKw: 2.5,
      token: PropertiesService.getScriptProperties().getProperty('TOKEN') || '',
    }) },
  });
  Logger.log(res.getContent());
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function num(v) { var n = Number(v); return isNaN(n) || v === '' || v == null ? '' : n; }
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
