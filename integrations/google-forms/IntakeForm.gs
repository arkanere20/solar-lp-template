/**
 * QualityClickss — Solar client onboarding toolkit (Google Apps Script)
 * =====================================================================
 *
 * Two tools in one script:
 *
 *   createIntakeForm()        Run ONCE. Builds the client onboarding Google
 *                             Form + a linked responses Sheet in your Drive.
 *                             Reuse the same form link for every client.
 *
 *   createClientPhotoFolder() Run for EACH new client. Creates a shared
 *                             Google Drive folder with labelled sub-folders
 *                             (Logo, Banner, Team, Project 1, 2, 3 …) that
 *                             the client can upload into from their phone.
 *
 * HOW TO USE
 *  1. Go to https://script.google.com → New project.
 *  2. Delete the sample code, paste this whole file, click Save (💾).
 *  3. In the function dropdown at the top choose createIntakeForm → Run.
 *     The first time, Google asks for permission: Review permissions →
 *     choose your account → Advanced → "Go to … (unsafe)" → Allow.
 *     (It says "unsafe" only because you wrote the script yourself.)
 *  4. Open View → Logs (or the Execution log panel) for the links:
 *     the form link to send clients, the edit link, and the responses Sheet.
 *  5. For each new client: change CLIENT_NAME below, Save, choose
 *     createClientPhotoFolder → Run, and send the client the logged link.
 */

/** ← Change this before running createClientPhotoFolder for a new client. */
var CLIENT_NAME = 'Shree Ganesh Solar';

var AGENCY = 'QualityClickss';

// ─────────────────────────────────────────────────────────────────────────
// 1. Onboarding form
// ─────────────────────────────────────────────────────────────────────────

function createIntakeForm() {
  var form = FormApp.create('Solar Landing Page — Client Onboarding | ' + AGENCY);
  form
    .setDescription(
      'Tell us about your business once, and we will build a high-converting landing page ' +
      'for your Google Ads.\n\n' +
      '⏱ About 15 minutes. Fill in what you can — anything you skip, we will ask about on a quick call.\n' +
      '📷 Photos are NOT uploaded here. We will send you a separate Google Drive link with ' +
      'ready-made folders for them.'
    )
    .setProgressBar(true)
    .setCollectEmail(false)
    .setAllowResponseEdits(true)
    .setConfirmationMessage(
      'Thank you — we have received your details! ✅\n\n' +
      'Next: (1) we review everything and call you if something is missing, ' +
      '(2) we send you a preview link of your landing page, ' +
      '(3) after your approval we connect your domain and start your Google Ads.'
    );

  var mobile = FormApp.createTextValidation()
    .setHelpText('Please enter a 10-digit mobile number, e.g. 9822012345')
    .requireTextMatchesPattern('^[6-9][0-9]{9}$')
    .build();
  var url = FormApp.createTextValidation()
    .setHelpText('Please paste a full link starting with https://')
    .requireTextIsUrl()
    .build();
  var email = FormApp.createTextValidation()
    .setHelpText('Please enter a valid email address')
    .requireTextIsEmail()
    .build();

  // Helpers keep the question list readable.
  function text(title, help, required, validation) {
    var q = form.addTextItem().setTitle(title).setRequired(!!required);
    if (help) q.setHelpText(help);
    if (validation) q.setValidation(validation);
    return q;
  }
  function para(title, help, required) {
    var q = form.addParagraphTextItem().setTitle(title).setRequired(!!required);
    if (help) q.setHelpText(help);
    return q;
  }
  function dropdown(title, choices, help, required) {
    var q = form.addListItem().setTitle(title).setChoiceValues(choices).setRequired(!!required);
    if (help) q.setHelpText(help);
    return q;
  }
  function section(title, help) {
    var p = form.addPageBreakItem().setTitle(title);
    if (help) p.setHelpText(help);
  }
  function heading(title, help) {
    var h = form.addSectionHeaderItem().setTitle(title);
    if (help) h.setHelpText(help);
  }

  // ── 1 Business ─────────────────────────────────────────────────────────
  heading('1 · Your business', 'This builds trust with homeowners. Only share numbers you can back up.');
  text('Business name', 'Exactly as customers should see it', true);
  text('Year started', 'e.g. 2018', false,
    FormApp.createTextValidation().setHelpText('Enter a year like 2018')
      .requireNumberBetween(1980, 2035).build());
  text('Homes / projects completed', 'e.g. 350+');
  text('Total capacity installed', 'e.g. 1.2 MW or 800 kW');
  text('PM Surya Ghar vendor / DISCOM empanelment number', 'Leave blank if not registered');
  text('GSTIN', '15-character number, if registered');
  text('Panel brands you install', 'e.g. Waaree, Adani, Tata Power Solar');
  text('Inverter brands you install', 'e.g. Growatt, Solis, Sungrow');
  text('Warranty you offer', 'e.g. Panels 25-yr performance · Inverter 8 yrs · Workmanship 5 yrs');
  para('Certifications / awards / memberships', 'One per line, e.g. ISO 9001:2015, MNRE-approved components');
  para('Why should a homeowner choose you over other installers?',
    '3–5 points in your own words — local team, in-house installers, fast subsidy, free maintenance, etc.', true);
  text('Current offer for customers', 'e.g. Free site survey, easy EMI, free 1-year cleaning');
  form.addCheckboxItem()
    .setTitle('Which customers do you serve?')
    .setChoiceValues(['Residential homes', 'Housing societies', 'Commercial / shops', 'Industrial', 'Agriculture / solar pumps']);
  form.addMultipleChoiceItem()
    .setTitle('Do you offer hybrid / battery backup systems?')
    .setChoiceValues(['Yes', 'No']);

  // ── 2 Contact ──────────────────────────────────────────────────────────
  section('2 · Contact details', 'These appear on the page as tap-to-call and WhatsApp buttons.');
  text('Number for customer calls', '10 digits — someone must answer during business hours', true, mobile);
  text('WhatsApp number', '10 digits', true, mobile);
  text('Email(s) to receive new lead alerts', 'Separate multiple emails with commas', true);
  text('Email shown on the website', '', false, email);
  para('Office address', '', true);
  text('Google Maps link of the office', 'Google Maps → Share → Copy link', false, url);
  text('Working hours', 'e.g. Mon–Sat, 9:30 AM – 7:00 PM');
  text('Google Business Profile link', 'So visitors can read your Google reviews', false, url);

  // ── 3 Service area ─────────────────────────────────────────────────────
  section('3 · Service area', 'We target your Google Ads to these places and mention them on the page.');
  text('Main city', '', true);
  dropdown('State', [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
    'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Other',
  ], '', true);
  text('Electricity company (DISCOM) in your area',
    'e.g. MSEDCL, BESCOM, PGVCL, TNPDCL, BSES Rajdhani', true);
  text('Average electricity rate for homes (₹ per unit)', 'Optional — we use about ₹8–9 if blank', false,
    FormApp.createTextValidation().setHelpText('Enter a number like 8.5')
      .requireNumberBetween(2, 25).build());
  para('Cities, towns or areas you serve', 'Most important first, separated by commas', true);

  // ── 4 Brand ────────────────────────────────────────────────────────────
  section('4 · Logo & brand colours',
    'Upload your logo in the Google Drive folder we send you (folder "1 Logo"). ' +
    'No logo yet? Skip — we will make a clean text logo from your business name.');
  text('Main brand colour', 'Colour name or code, e.g. "dark green" or #0b4633. Leave blank and we will pick from your logo.');
  text('Highlight colour (used for buttons)', 'e.g. "yellow" or #ffc629. Leave blank and we will pick from your logo.');
  text('Existing website (if any)', '', false, url);
  text('Facebook / Instagram page link');

  // ── 5 Projects ─────────────────────────────────────────────────────────
  section('5 · Completed projects',
    'Real projects from your area convert best. Add up to 3. ' +
    'Put each project\'s photos in the MATCHING Drive folder ("4 Project 1", "5 Project 2", "6 Project 3").');
  [1, 2, 3].forEach(function (n) {
    heading('Project ' + n, n === 1 ? 'e.g. Vishrambag, Sangli · 3 kW · Independent house · Aug 2026' : '');
    text('Project ' + n + ' — area / locality');
    text('Project ' + n + ' — system size (kW)');
    text('Project ' + n + ' — property type', 'Independent house, bungalow, society, shop…');
    text('Project ' + n + ' — completed (month & year)');
  });

  // ── 6 Reviews & videos ─────────────────────────────────────────────────
  section('6 · Customer reviews & videos',
    'Genuine reviews only — e.g. copied from your Google reviews, with the customer\'s permission.');
  [1, 2, 3].forEach(function (n) {
    heading('Review ' + n);
    text('Review ' + n + ' — customer name', n === 1 ? 'e.g. Rahul P.' : '');
    text('Review ' + n + ' — area & system size', n === 1 ? 'e.g. Miraj · 3 kW' : '');
    para('Review ' + n + ' — review text');
    dropdown('Review ' + n + ' — star rating', ['5', '4', '3']);
  });
  form.addMultipleChoiceItem()
    .setTitle('Are these reviews genuine, and are the customers OK with them being shown on the website?')
    .setChoiceValues(['Yes', 'No / not sure']);
  para('YouTube video links',
    'Customer testimonials, installation walkthroughs, project videos. One link per line — ' +
    'normal YouTube, youtu.be or Shorts links all work. Add a short title after each link if you like, ' +
    'e.g. "https://youtu.be/abc… – Mr. Patil, 5 kW, Sangli".');

  // ── 7 Photos ───────────────────────────────────────────────────────────
  section('7 · Photos',
    'We will send you a Google Drive link with these ready-made folders. Just open it and drop photos in:\n\n' +
    '1 Logo\n2 Main banner – your best installation photo\n3 Team at work\n' +
    '4 Project 1 · 5 Project 2 · 6 Project 3 (matching section 5)\n7 Extra – certificates, office, anything else\n\n' +
    'Tips: original photos (not WhatsApp-forwarded), daylight, landscape, sharp. ' +
    'No customer faces without permission.');
  form.addMultipleChoiceItem()
    .setTitle('About your photos')
    .setChoiceValues([
      'I have good photos and will upload them to the Drive folder',
      'I will send them on WhatsApp as documents (uncompressed)',
      'I don\'t have good photos — please use professional stock images for now',
    ]);

  // ── 8 Ads & domain ─────────────────────────────────────────────────────
  section('8 · Ads, domain & anything else');
  dropdown('Do you own a domain for this page?',
    ['Yes — I will share access', 'No — please suggest / buy one', 'Use a free link for now']);
  text('Domain name (if any)', 'e.g. sunrisesolar.in');
  text('Google Ads account ID (if you have one)', '10 digits like 123-456-7890');
  dropdown('Monthly ad budget you have in mind',
    ['Under ₹15,000', '₹15,000 – ₹30,000', '₹30,000 – ₹60,000', 'Above ₹60,000']);
  para('Common questions customers ask you', 'We may add these to the FAQ section');
  para('Anything else we should know?');
  text('Your name', '', true);
  text('Your mobile number', '', true, mobile);
  form.addCheckboxItem()
    .setTitle('Confirmation')
    .setChoiceValues(['The information above is accurate, and we have the right to use the logo, photos, videos and reviews shared.'])
    .setRequired(true);

  // Responses → a Sheet, both kept in one Drive folder.
  var sheet = SpreadsheetApp.create('Client Onboarding — Responses | ' + AGENCY);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
  var folder = DriveApp.createFolder(AGENCY + ' — Client Onboarding');
  DriveApp.getFileById(form.getId()).moveTo(folder);
  DriveApp.getFileById(sheet.getId()).moveTo(folder);

  Logger.log('✅ Form created.');
  Logger.log('SEND THIS LINK TO CLIENTS: ' + form.shortenFormUrl(form.getPublishedUrl()));
  Logger.log('Edit the form:             ' + form.getEditUrl());
  Logger.log('Responses sheet:           ' + sheet.getUrl());
  Logger.log('Drive folder:              ' + folder.getUrl());
  Logger.log('Tip: in the form, Responses tab → ⋮ → "Get email notifications for new responses".');
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Per-client photo folder
// ─────────────────────────────────────────────────────────────────────────

var PHOTO_FOLDERS = [
  ['1 Logo', 'Your logo — PNG with transparent background or SVG is best.'],
  ['2 Main banner - best installation photo', 'ONE wide photo of a finished rooftop installation on a nice home. Sunrise/sunset light is great.'],
  ['3 Team at work', 'Your team installing panels on a roof — uniforms and safety gear if possible.'],
  ['4 Project 1', 'Photos of Project 1 from the form (section 5).'],
  ['5 Project 2', 'Photos of Project 2 from the form (section 5).'],
  ['6 Project 3', 'Photos of Project 3 from the form (section 5).'],
  ['7 Extra - certificates, office, anything else', 'Certificates, awards, your office or shop, close-ups of panels and inverters.'],
];

function createClientPhotoFolder() {
  if (!CLIENT_NAME || CLIENT_NAME === 'Shree Ganesh Solar') {
    Logger.log('ℹ️ Change CLIENT_NAME at the top of the script to the client\'s business name, Save, and run again.');
    return;
  }

  var parent = getOrCreateFolder_(DriveApp.getRootFolder(), AGENCY + ' — Client Photos');
  var root = parent.createFolder(CLIENT_NAME + ' — Website photos');
  root.setDescription('Upload your photos into the matching folders. Thank you! — ' + AGENCY);
  PHOTO_FOLDERS.forEach(function (f) {
    root.createFolder(f[0]).setDescription(f[1]);
  });

  // Anyone with the link can upload. (Drive needs them signed in to any Google
  // account to upload — every Android phone already is.)
  try {
    root.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  } catch (e) {
    Logger.log('⚠️ Could not turn on link sharing automatically (' + e + '). ' +
      'Open the folder → Share → General access → "Anyone with the link" → Editor.');
  }

  Logger.log('✅ Folder created for ' + CLIENT_NAME);
  Logger.log('SEND THIS LINK TO THE CLIENT: ' + root.getUrl());
  Logger.log('\nWhatsApp message you can copy:\n\n' +
    'Hi! Please upload your photos to this Google Drive folder: ' + root.getUrl() + '\n' +
    'It has separate folders — Logo, Main banner, Team, Project 1/2/3 and Extra. ' +
    'Just open the right folder and tap + to upload. Please send original photos ' +
    '(not WhatsApp-forwarded) taken in daylight. Thank you! — ' + AGENCY);
}

function getOrCreateFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
