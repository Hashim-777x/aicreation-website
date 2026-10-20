# Arabic terminology and layout review

The site uses Modern Standard Arabic. Translate the function and intended meaning in context; do not translate isolated words without considering the service.

| English term | Arabic used | Context |
| --- | --- | --- |
| AI made | صُنع بالذكاء الاصطناعي | Production method |
| Human directed | بتوجيه بشري | Creative direction, not literal driving or management |
| AI agents | وكلاء الذكاء الاصطناعي | Software agents; distinguished from AI assistant: المساعد الذكي |
| Workflow | سير العمل | A sequence of business tasks |
| Creative brief | الموجز الإبداعي | Definition of a creative project |
| Project brief | موجز المشروع | Client enquiry form |
| Social enquiry | استفسار عبر قنوات التواصل | A question arriving through social channels, not an enquiry about society |
| Channel variations | نسخ مخصّصة للقنوات | Content versions for different distribution channels |
| Human review | المراجعة البشرية | Review, distinct from approval: الاعتماد البشري |
| Property lead | عميل محتمل للعقارات | A prospective property customer |
| Art direction | التوجيه الفني | Visual direction |
| Timeline | الإطار الزمني | Requested delivery timeframe |

Project names are translated creative titles, not claims about clients. The copy and legal pages have not been certified by a native professional editor; no zero-error guarantee is claimed.

Terminology references:
- https://learn.microsoft.com/ar-sa/agents/ (وكلاء الذكاء الاصطناعي and أتمتة سير العمل)
- https://learn.microsoft.com/ar-sa/training/paths/develop-ai-agents-azure/

Clipping regression: scripts/check-arabic.mjs runs with normal motion enabled, scrolls downward and upward, and moves the pointer to both viewport edges. Prior reduced-motion-only testing missed the reversed RTL spread direction. Arabic hero horizontal motion must point inward at the initial scroll position. Do not reverse/mirror the actual photograph.

Run after building and starting a production preview. SITE_URL chooses the preview URL; CHROMIUM_PATH optionally chooses a local Chrome executable. The audit also checks heading width, RTL and JavaScript errors across Arabic pages, and checks the reduced-motion fallback separately.
