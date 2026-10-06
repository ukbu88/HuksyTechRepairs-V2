# Unresolved business facts

Everything the site needs from Husky before it can state it. Each item is a TODO in `src/config/business.ts` (or where noted). Until supplied, the site omits the fact; nothing is invented (Canon §29, §32).

## Required before launch (`launch` profile)

| Fact | Where it goes | Config field |
|---|---|---|
| Trading name / legal name / ABN | Footer, policies, JSON-LD | `legalName`, `abn` |
| Public address, drop-off point, or "non-public" | Contact, footer, LocalBusiness JSON-LD | `addressPolicy`, `address` |
| Phone | Header/footer contact, click-to-call | `phone` |
| Public email | Contact, privacy requests | `publicEmail` |
| Opening / support hours | Contact, JSON-LD | `openingHours` |
| Drop-off availability and process | Enquiry logistics step, repair pages | `dropOff` |
| Diagnostic fee policy | Motherboard FAQ, repair terms, confirmation page | `diagnosticFeePolicy` |
| Quote approval rule (exact wording) | Repair pages, repair terms | `quoteApprovalRule` |
| Parts categories and definitions | Repair pages, repair terms | `partsCategories` |
| Warranty terms by repair type | Repair pages, repair terms | `warrantyTerms` |
| Data handling / backup guidance | Repair pages, privacy policy, repair terms | `dataHandlingGuidance` |
| Production domain | Canonicals, sitemap, OG | env `NEXT_PUBLIC_SITE_URL` |
| Credentials | Enquiries | env `DATABASE_URL`, `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO`, `ENQUIRY_NOTIFY_FROM` |
| GrapheneOS compatible-device records, dated against the official list (`src/content/privacy-devices.ts`); which hardware modifications Husky performs (`HARDWARE_MODIFICATIONS_CONFIRMED`) | `/privacy/devices`, `/privacy` | content file |
| Privacy policy review (retention period, request contact) | `/policies/privacy` | `src/content/policies.ts` + page text |
| Repair terms review (collection window, uncollected devices, liability) | `/policies/repair-terms` | `src/content/policies.ts` + page text |
| Photos | Every `ImageSlot` | `docs/SHOT_LIST.md` → `public/photos/` |

## Wanted for launch, not blocking

| Fact | Where it goes | Config field |
|---|---|---|
| About story (Luke / Husky background, real facts only) | `/about` (unpublished until supplied) | `about` |
| Real repair cases (anonymised) | Case-file cards | `cases` |
| Social links | JSON-LD `sameAs` | `social` |
| Logo / wordmark from an illustrator | `public/brand/*.svg` | file swap |

## Before enabling a flagged division

| Division | Needed |
|---|---|
| Business / Schools / Trade partners | Trade escalation model (`tradeEscalationModel`); any real operational promises (none are made today); business invoicing/payment terms |
| Recycling | Recycling partners/process, battery handling, data-destruction process, any trade-in credit |
| Knowledge | First real article from a real repair |
| Refurbished / builder | Real inventory records, confirmed grade criteria and reference photos, warranty/returns policy, payment/checkout provider |
| Repair tracking | An operational process that updates `enquiries.status` at each handoff |
| Pickup | Service area, fees, scheduling rules |
| Mail-in | Mail-in address, shipping/insurance process, packing instructions |

## Deliberately not promised anywhere

Same-day or guaranteed turnaround, response times, SLAs, loan devices, volume capacity, anonymity/untraceability, specific environmental outcomes, certifications. If any of these become true and supportable, they are added as facts, not as copy.
