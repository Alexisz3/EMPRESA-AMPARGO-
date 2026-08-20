---
name: ampargo-content
description: Write, translate, or review any public-facing copy for the AMPARGO website — headlines, section text, service descriptions, CTAs, form labels, error messages, alt text, page titles and meta descriptions, FAQ, testimonials. Use this whenever the task touches src/messages/en.json or src/messages/es.json, whenever the user asks to add trust signals, badges, guarantees, "licensed and insured", years of experience, reviews, before/after, service areas, or business hours, and whenever new marketing copy is being written. AMPARGO is a real contractor with legally sensitive unverified claims, so check what is approved before writing anything a customer will read.
---

# AMPARGO Content

AMPARGO is a real remodeling contractor in Houston. Copy on this site is a commercial representation by a real business, and an invented credential is not a placeholder — it is a false advertising claim a homeowner may rely on when handing over a house and a deposit. Texas regulates contractor licensing and insurance claims. That is why this project separates *what the client confirmed* from *what may be published*.

## Check the source of truth first

`docs/client-confirmed-information.md` is authoritative, and `docs/decisions.md` ADR-017 states the rule: confirmation is not authorization. Several facts are confirmed as true but still lack the exact terms, evidence, or approved wording needed to state them publicly.

Read that file before writing any claim about the business. Never fill a gap by inference, by looking at what competitors say, or by softening a claim until it sounds safe.

### Currently forbidden in public copy

Do not publish these, in either language, in any phrasing:

- "Licensed & Insured", "Fully Insured", license or policy numbers, any credential claim
- Warranty duration, coverage, exclusions, or the word "guarantee" applied to work
- "Free Estimates" as a blanket claim. The approved internal wording is narrower: initial estimate free, additional estimates or revisions may cost — and what counts as a revision is still undefined, so it stays unpublished
- Financing availability
- Service areas beyond Houston, Texas
- Business hours, a corporate email address, or a response-time guarantee
- Testimonials, star ratings, review counts
- Before/After comparisons — no verified matched pairs of the same space exist yet
- Any statement implying permits are unnecessary

If a design calls for one of these — and trust-badge rows and testimonial sections always do — build the layout with the approved material instead, and note the gap for the client. Do not ship the section with invented content and a plan to swap it later; that content reaches production.

### Approved and usable

Houston, Texas as the service area. Remodeling and construction, residential and commercial. Electrical and plumbing performed in-house. AMPARGO purchases and coordinates materials. AMPARGO can work with external architects or designers on complex projects. AMPARGO can assist with permits when required. Joe Andrade `(832) 794-0720` and Mario Parra `(832) 652-4660`, both primary contacts — never present one as *the* contact. The real project photography in `public/images`.

The strongest available trust signal is the work itself. Lead with the photographs and specific project detail rather than badges, which is also what `docs/brand.md` asks for.

## Voice

Confident and direct, homeowner-first, specific over grand. A homeowner deciding who to let into their house wants to know what will happen and what it costs them to ask. Say what the visitor gets and what the next step is.

Avoid the register that reads as filler: "craftsmanship excellence", "your dream home awaits", "we take pride in". Prefer the concrete — what kind of work, where, what the process is.

Every page pushes toward one action: requesting an estimate. Make that path obvious without repeating the same CTA sentence in every section.

## Bilingual is authored, not translated

Spanish-speaking homeowners in Houston are a primary audience, not an afterthought, and mechanical translation reads as exactly that. Write natural Spanish that carries the same intent, not word-for-word English.

- Use **usted**, consistently. The existing copy does, and it matches how a homeowner expects a contractor to address them.
- Wordplay and rhythm rarely survive. The English hero splits "Transforming Spaces. / Building What Matters." across lines; the Spanish is "Transformamos espacios. / Construimos lo que importa." — same weight, different structure. Recast rather than transpose.
- Keep the phone numbers, "Houston, TX", and the AMPARGO name identical across languages.
- Spanish runs 15–25% longer. Where a string sits in a tight slot — a button, a nav item, a badge — check the rendered result at 375px width, not the JSON.

## Message file mechanics

`src/messages/en.json` and `src/messages/es.json` must hold identical key sets. A key in one and not the other throws at render in that locale. Add to both in the same edit, then verify:

```bash
node -e "const e=require('./src/messages/en.json'),s=require('./src/messages/es.json');
const f=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v!==null?f(v,p+k+'.'):[p+k]);
const a=f(e),b=f(s);console.log('only EN:',a.filter(k=>!b.includes(k)),'only ES:',b.filter(k=>!a.includes(k)))"
```

Namespaces mirror components (`Hero`, `Services`, `QuotePage`). Keep new keys in the namespace of the component that renders them. Where copy is split across elements for a visual effect, the split belongs in the message file as an array — line breaks fall in different places in Spanish.

Alt text is content, not decoration: it lives in the message files, describes the specific work shown, and gets written in both languages.

## Metadata

Every page needs a unique localized title and meta description under the `Metadata` namespace. Titles carry the `%s | AMPARGO` template. Descriptions state the service and the market — Houston is the term that has to appear, since local search is the point. Write the Spanish description for how a Spanish-speaking Houston homeowner actually searches, rather than translating the English one.

## Before you call it done

Confirm both files have matching keys, view both languages rendered at mobile width, and check every factual claim you wrote against `docs/client-confirmed-information.md`. If you introduced a claim that file doesn't cover, remove it and add the question to that file's pending inputs instead — an unanswered question in a doc costs nothing, and a false claim on a contractor's website is the expensive kind of mistake.
