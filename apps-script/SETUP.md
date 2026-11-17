# Turn on automatic sending (one-time, about 5 minutes)

This sets up a small Google Apps Script that sends reports from **your own UNLV Gmail**.
The email has the map and photos in the message and the one-page PDF attached, and a
copy lands in your Sent folder.

Do this on a computer, signed in to your UNLV Google account.

## 1. Create the script
1. Go to <https://script.google.com> and click **New project**.
2. Click **Untitled project** at the top and name it `FM Field Report Mailer`.
3. Delete everything in the `Code.gs` editor, then paste in the full contents of
   [`Code.gs`](Code.gs) from this folder. Press **Ctrl+S** to save.

## 2. Create your secret code
1. In the toolbar's function menu, choose **setup**, then click **Run**.
2. Google asks you to authorize the script. Choose your UNLV account.
   - If you see "Google hasn't verified this app", click **Advanced**, then
     **Go to FM Field Report Mailer (unsafe)**. That warning appears for every personal script;
     this one is yours and only you run it.
   - Allow it to **send email as you**.
3. The **Execution log** at the bottom shows `Your secret code ... : xxxxxxxx`. Copy that code.

## 3. Publish it as a web app
1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. Click **Deploy**, then copy the **Web app URL** (it starts with `https://script.google.com/macros/s/`).

"Anyone" only means the phone app can reach it without a Google sign-in. Nothing is sent
unless the request carries your secret code, and it can only send to the help desk or to you.

If "Anyone" isn't offered (UNLV may limit it), stop here and use the app's normal
Share to email button. Automatic sending won't work without that option.

## 4. Connect the phone app
1. Open FM Field Report on your phone and tap the gear icon.
2. Paste the **Web app URL** into **Auto-send link** and the code into **Secret code**. Tap **Save**.
3. For a test, set **Send reports to** to your own UNLV address, do a report, and tap **Send now**.
4. When the test looks right, change **Send reports to** back to `facilities_help_desk@unlv.edu`.

## Changing things later
- **Allow another recipient:** add the address to `ALLOWED_TO` in the script, save, then
  **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**.
  The web app URL stays the same.
- **Change the secret code:** in the script go to **Project Settings → Script properties**,
  edit `SECRET`, and update it in the phone app.
- **Turn it off:** **Deploy → Manage deployments → Archive**.
