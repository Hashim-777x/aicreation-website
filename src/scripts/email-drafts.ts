const arabic = document.documentElement.lang === 'ar';
const recipient = 'hello@aicreation.pro';
for (const form of document.querySelectorAll<HTMLFormElement>('[data-contact-form], [data-brief-form]')) {
  const status = form.querySelector<HTMLElement>('.form-status')!;



  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.dataset.state = 'error';
      status.textContent = arabic ? 'يرجى إكمال الحقول المطلوبة.' : 'Please complete the required fields.';
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? '').trim();
    const subject = `${arabic ? 'استفسار عن مشروع' : 'Project enquiry'} — ${value('brand') || value('name')}`.replace(/[\r\n]/g,' ');
    const fields = [
      ['Name', 'name'], ['Email', 'email'], ['Brand / website', 'brand'],
      ['Interested in', 'interest'], ['Timeline', 'timeline'], ['Budget range', 'budget'],
      ['Reference link', 'reference'],
    ];
    const labels: Record<string,string> = {'Name':'الاسم','Email':'البريد الإلكتروني','Brand / website':'العلامة / الموقع','Interested in':'الخدمة المطلوبة','Timeline':'المدة','Budget range':'الميزانية','Reference link':'الرابط المرجعي'};
    const lines = fields.filter(([, key]) => value(key)).map(([label, key]) => `${arabic ? labels[label] : label}: ${value(key)}`);
    const body = [arabic ? 'مرحبًا AIcreation.pro،' : 'Hello AIcreation.pro,', '', arabic ? 'أرغب في مناقشة مشروع.' : 'I would like to discuss a project.', '', ...lines, '', arabic ? 'موجز المشروع:' : 'Project brief:', value('brief'), '', arabic ? 'شكرًا،' : 'Thank you,', value('name')].join('\r\n');
    const appUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.dataset.state = 'ready';
    const mobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      || (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    status.textContent = arabic ? 'راجع مسودتك وأرسلها من نافذة البريد.' : 'Review and send your draft in the compose window.';

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
