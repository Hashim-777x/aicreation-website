const recipient = 'hello@aicreation.pro';
for (const form of document.querySelectorAll<HTMLFormElement>('[data-contact-form], [data-brief-form]')) {
  const status = form.querySelector<HTMLElement>('.form-status')!;



  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.dataset.state = 'error';
      status.textContent = 'Please complete the required fields.';
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const subject = `Project enquiry — ${value('brand') || value('name')}`.replace(/[\r\n]/g,' ');
    const fields = [
      ['Name', 'name'], ['Email', 'email'], ['Brand / website', 'brand'],
      ['Interested in', 'interest'], ['Timeline', 'timeline'], ['Budget range', 'budget'],
      ['Reference link', 'reference'],
    ];
    const lines = fields.filter(([, key]) => value(key)).map(([label, key]) => `${label}: ${value(key)}`);
    const body = ['Hello AIcreation.pro,', '', 'I would like to discuss a project.', '', ...lines, '', 'Project brief:', value('brief'), '', `Thank you,`, value('name')].join('\r\n');
    const appUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.dataset.state = 'ready';
    const mobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    status.textContent = 'Review and send your draft in the compose window.';

    if (mobileDevice) {
      window.location.href = appUrl;
    } else {
      const compose = window.open(gmailUrl, '_blank');
      if (compose) compose.opener = null;
      else window.location.href = gmailUrl;
    }
  });
  form.addEventListener('input', () => {

    status.textContent = '';
    delete form.dataset.state;
  });
}
export {};
