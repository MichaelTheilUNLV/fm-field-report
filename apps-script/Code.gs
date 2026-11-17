/**
 * FM Field Report – Gmail sender
 *
 * Receives a report from the FM Field Report phone app and emails it from
 * your own UNLV Gmail account: HTML body with the map and photos inline,
 * PDF report attached.
 *
 * Safety:
 *  - Every request must carry the secret code created by setup().
 *    The code lives only in this script's properties and on your phone.
 *  - Mail can only go to the addresses in ALLOWED_TO, or to you.
 *
 * Setup steps are in SETUP.md next to this file.
 */

// Who reports may be sent to (lower case). Your own address is always allowed, for testing.
const ALLOWED_TO = ['facilities_help_desk@unlv.edu'];

function setup() {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
    props.setProperty('SECRET', secret);
  }
  // Touch Gmail so the authorization prompt asks for send permission now.
  GmailApp.getAliases();
  Logger.log('Your secret code (paste into the app\'s Settings): ' + secret);
}

function doGet() {
  return json_({ ok: true, service: 'FM Field Report mailer' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || data.secret !== secret) return json_({ ok: false, error: 'bad_secret' });

    const me = Session.getEffectiveUser().getEmail().toLowerCase();
    const to = String(data.to || '').trim().toLowerCase();
    if (ALLOWED_TO.concat([me]).indexOf(to) === -1) return json_({ ok: false, error: 'recipient_not_allowed' });

    // Ignore a resend of a report that already went out (e.g. a retry after a dropped connection).
    const cache = CacheService.getScriptCache();
    const key = 'sent:' + String(data.reportId || '');
    if (data.reportId && cache.get(key)) return json_({ ok: true, duplicate: true });

    const toBlob = f => Utilities.newBlob(Utilities.base64Decode(f.b64), f.type, f.name);
    const inlineImages = {};
    (data.inline || []).forEach(f => { inlineImages[f.cid] = toBlob(f); });
    const attachments = (data.attachments || []).map(toBlob);

    const options = { htmlBody: data.html, inlineImages: inlineImages, attachments: attachments };
    if (data.fromName) options.name = String(data.fromName).slice(0, 80);
    GmailApp.sendEmail(to, String(data.subject || 'Facilities issue').slice(0, 200), String(data.text || ''), options);

    if (data.reportId) cache.put(key, '1', 6 * 60 * 60);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
