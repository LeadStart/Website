/* contact.js — submits the contact form to the app's /api/contact endpoint
   (proxied through the /app rewrite in vercel.json). Shows inline success
   or error feedback without a full page reload. */
(function () {
  'use strict';

  const form = document.querySelector('form.card[data-reveal]');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  const statusEl = document.createElement('div');
  statusEl.className = 'form-status';
  statusEl.setAttribute('role', 'status');
  statusEl.setAttribute('aria-live', 'polite');
  statusEl.style.cssText =
    'margin-top:16px;padding:12px 14px;border-radius:10px;font-size:14px;display:none;';
  if (submitBtn) submitBtn.insertAdjacentElement('afterend', statusEl);

  function showStatus(kind, message) {
    statusEl.textContent = message;
    statusEl.style.display = 'block';
    if (kind === 'success') {
      statusEl.style.background = '#ecfdf5';
      statusEl.style.color = '#065f46';
      statusEl.style.border = '1px solid #a7f3d0';
    } else {
      statusEl.style.background = '#fef2f2';
      statusEl.style.color = '#991b1b';
      statusEl.style.border = '1px solid #fecaca';
    }
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.innerHTML = 'Sending...';
    } else {
      submitBtn.innerHTML = originalBtnHtml;
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    statusEl.style.display = 'none';

    const fd = new FormData(form);
    const payload = {
      firstName: (fd.get('first-name') || '').toString().trim(),
      lastName: (fd.get('last-name') || '').toString().trim(),
      company: (fd.get('company') || '').toString().trim(),
      email: (fd.get('email') || '').toString().trim(),
      phone: (fd.get('phone') || '').toString().trim(),
      metro: (fd.get('metro') || '').toString().trim(),
      volume: (fd.get('volume') || '').toString().trim(),
      message: (fd.get('message') || '').toString().trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.company || !payload.email) {
      showStatus('error', 'Please fill in your name, company, and email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showStatus('error', data.error || 'Something went wrong. Please try again or call us directly.');
        setLoading(false);
        return;
      }

      form.reset();
      showStatus(
        'success',
        "Thanks — we got it. We'll be in touch within a few hours to set up a time.",
      );
    } catch (err) {
      showStatus('error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });
})();
