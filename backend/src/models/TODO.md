# backend/src/models — Mongoose schemas

TODO (one file per collection, all with timestamps: true)
- [ ] User.js, Organization.js, OrganizationMember.js
- [ ] CompanyProfile.js, CompanyDocument.js
- [ ] Tender.js, TenderDocument.js, TenderRequirement.js
- [ ] TenderUpdate.js, Corrigendum.js
- [ ] Bid.js, BidRequirement.js, BidDocument.js
- [ ] Task.js, Comment.js, Notification.js
- [ ] AiAnalysis.js, AiQuestion.js
- [ ] AuditLog.js, SourcePortal.js, SyncJob.js
- [ ] Add `organizationId: { type: ObjectId, index: true, required: true }` to every tenant-scoped model
      (bids, bidRequirements, bidDocuments, tasks, comments, notifications)
- [ ] Add the two required compound indexes on Tender: { sourcePortal, sourceTenderId } unique,
      { state, district, closingDate }, and { category, closingDate }
- [ ] For document chunks (future RAG prep): store documentId, page, section, chunk, sourceText fields
      on TenderDocument / CompanyDocument as needed
