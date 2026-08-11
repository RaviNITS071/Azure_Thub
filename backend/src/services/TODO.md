# backend/src/services

TODO
- [ ] adapters/TenderSourceAdapter.js — abstract interface (fetchList, fetchDetail, normalize) that every
      portal adapter must implement — DO NOT skip this, it's the whole point of easy V2 expansion
- [ ] adapters/JKTenderAdapter.js — first concrete implementation for the J&K portal
- [ ] ai.service.js — builds prompts, calls OpenAI, validates response shape with Joi/Yup before saving
- [ ] ocr.service.js — pdf-parse first, falls back to tesseract.js only when extracted text is empty
- [ ] cache.service.js — thin wrapper around ioredis get/set with JSON serialize + TTL helpers
- [ ] matching.service.js — deterministic scoring engine (category/eligibility/experience/turnover/
      location/size weighted score), tag "High Match" above 85%
- [ ] notification.service.js — creates in-app notification docs + triggers email if configured
