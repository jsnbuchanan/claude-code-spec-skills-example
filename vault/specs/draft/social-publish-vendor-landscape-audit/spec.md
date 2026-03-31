---
slug: social-publish-vendor-landscape-audit
created: 2026-03-30
tags: [spec, golden-circle, research]
---
# Social Publish Vendor Landscape Audit

## Why

Our social listing video platform needs reliable multi-platform video publishing (TikTok, Facebook, YouTube, Instagram) as a core capability. We've started integrating Zernio (formerly getLate.dev) but encountered friction — integration difficulty, odd behaviors, unclear team account support — and we're not confident we've done sufficient due diligence before betting our pre-launch product on it. Before we go to market, we need a rigorous, research-backed evaluation of the social publishing infrastructure landscape — including giving Zernio a fair reassessment alongside the best alternatives. A wrong foundation choice pre-launch becomes a costly migration post-launch, and we need this layer solid to eventually build our v1.1 differentiator: white-label analytics and comparative engagement stats.

The compound problem: choosing the wrong social publishing infrastructure pre-launch creates compounding technical debt — users can't publish effortlessly, we can't measure what works, and we can't prove our platform's distribution value.

This spec produces a decision framework, not an implementation. The output is a comprehensive vendor/solution evaluation — Zernio included — validated by quantitative signals from trusted sources, comparing SaaS providers (established + emerging), and open-source alternatives, tailored to a TypeScript/React Native (web-first) stack.

## How

Conduct a tiered landscape evaluation of social media publishing infrastructure using a structured methodology:

1. **Landscape Map** — Identify and categorize all significant players: established SaaS (industry giants), emerging SaaS (AI-forward startups), and self-hosted open-source projects
2. **Zernio Deep Investigation** — Full audit of getLate→Zernio rebrand (reasons, community sentiment, press), evaluated on the same criteria as all others, plus a trust/longevity assessment
3. **Requirement-Based Filtering** — Score all candidates against must-have criteria (TikTok/FB/YT/IG publishing, TypeScript/React Native SDK or API, white-label analytics roadmap) and nice-to-haves (comparative engagement stats, team accounts, AI features)
4. **Deep Dives on Top 3 Finalists** — Regardless of category, the 3 highest-scoring options get full evaluation: features, DX, security, pricing model, community health, and integration effort estimate
5. **Quantitative Validation** — Every finalist validated against trusted signals (balanced 50/50 DX vs. market): G2/Capterra ratings (excluding pay-to-play sites), Reddit developer sentiment, GitHub stars/activity, tech press coverage, Google Trends momentum, X/Twitter developer chatter, funding/revenue signals
6. **Decision Framework** — Comparison tables sorted by value (high→low) and risk (high→low), with a clear recommended option and runner-up

**Key trade-offs:**
- **Breadth over depth initially** — Map the landscape wide before going deep on finalists; the top 3 might not be who we expect
- **Research spec, not implementation** — Produces a decision, not code. Implementation spec follows separately
- **Zernio gets a fair shot** — It might emerge as the right choice after rigorous evaluation. We're validating, not replacing

### In Scope

- Landscape mapping of social media publishing API providers across 3 tiers: established SaaS, emerging/AI-forward SaaS, open-source self-hostable
- Zernio (formerly getLate.dev) deep investigation — rebrand reasons, community sentiment, press, current product evaluation
- Platform coverage assessment for each candidate: TikTok, Facebook, YouTube, Instagram publishing support
- Feature comparison across: multi-platform publish, scheduling, white-label analytics, comparative engagement stats, team accounts, webhook/event support, content format handling (video focus)
- DX evaluation for each candidate: TypeScript/JS SDK availability, React Native compatibility, API design quality, documentation quality, onboarding friction
- Security & compliance posture: OAuth flow quality, data handling, SOC2/GDPR status, token management
- Pricing model analysis: per-user, per-post, flat-rate, open-source (infrastructure cost estimate)
- Quantitative validation from trusted sources: G2/Capterra (non-pay-to-play), Reddit sentiment, GitHub activity, Google Trends, X/Twitter developer chatter, tech press, funding signals
- Comparison tables sorted by value (high→low) and risk (high→low)
- Clear recommendation per category + overall recommended provider
- Decision framework tailored to: TypeScript, React Native (web-first), pre-launch product

### Out of Scope

- Implementation plan or code — produces a decision, not an integration. Implementation follows as a separate spec
- Direct API testing or sandbox evaluation — evaluate based on documentation, community signals, and published capabilities
- Non-video content types — focused on video publishing; image/text-only publishing not evaluated
- Platforms beyond TikTok, Facebook, YouTube, Instagram — LinkedIn, X/Twitter, Pinterest etc. not in scope
- Pricing negotiation — identify pricing models but don't negotiate enterprise deals
- Mobile-native SDK evaluation — web-first; React Native mobile SDKs noted as a plus but not a gating criterion
- Analytics provider selection — white-label analytics is v1.1; assess whether providers support it, not how to build it

### Acceptance Criteria

- [ ] **AC-1:** **Given** the social publishing API landscape, **When** the research is complete, **Then** a landscape map identifies at minimum 8 providers categorized into established SaaS (>=3), emerging/AI-forward SaaS (>=3), and open-source (>=2), each with platform coverage (TikTok, FB, YT, IG) documented.
- [ ] **AC-2:** **Given** Zernio (formerly getLate.dev) is a candidate, **When** the deep investigation is complete, **Then** the report includes: rebrand timeline and reasons (sourced), community sentiment summary (Reddit, forums, reviews), press/media coverage, current feature evaluation on the same criteria as all other candidates, and a trust/longevity risk assessment.
- [ ] **AC-3:** **Given** the full candidate list, **When** requirement-based filtering is applied, **Then** each candidate is scored against must-have criteria (4-platform video publishing, TypeScript/JS API access, analytics capability roadmap) and nice-to-haves (comparative stats, team accounts, AI features, white-labeling), with a clear pass/fail on must-haves.
- [ ] **AC-4:** **Given** the filtered candidates, **When** the top 3 finalists are selected, **Then** each finalist has a deep-dive section covering: feature matrix, DX assessment (SDK, docs, onboarding), security posture, pricing model with cost projection for 100/1K/10K users, and integration effort estimate for a TypeScript/React Native web-first stack.
- [ ] **AC-5:** **Given** each finalist, **When** quantitative validation is performed, **Then** each has documented scores/signals from at least 4 of these 6 trusted sources: G2/Capterra ratings, Reddit developer sentiment, GitHub stars/activity (if applicable), Google Trends data, X/Twitter developer mentions, and tech press coverage or funding signals.
- [ ] **AC-6:** **Given** all evaluation data, **When** the comparison tables are assembled, **Then** there is (a) a feature comparison table, (b) a pros/cons list per finalist sorted by value (high-to-low) and risk (high-to-low), and (c) a recommendation table with a single recommended provider per category and an overall recommended provider, with justification.
- [ ] **AC-7:** **Given** the complete research output, **When** delivered as a spec document, **Then** the report is structured with clear sections, all claims cite their source (URL or reference), and the decision framework is actionable — a reader can make a vendor selection based solely on this document.

### User Flows

**Happy Path: Decision-Maker Reviews Research**
1. Open the spec document
2. Read the landscape map to understand the full market
3. Review the Zernio deep investigation to validate or invalidate current concerns
4. Scan the requirement filter results to see which candidates passed must-haves
5. Read deep dives on the top 3 finalists for detailed comparison
6. Check quantitative validation scores to confirm community/market signals align
7. Review comparison tables (features, pros/cons sorted by value and risk)
8. Read the recommendation with justification
9. Make a vendor selection decision with confidence

**Error: No Clear Winner**
1. Follow happy path through step 6
2. Quantitative signals are mixed — no provider clearly dominates
3. Report surfaces this explicitly: "No clear winner — trade-offs between top 2"
4. Decision framework provides tiebreaker rubric based on stated priorities

**Error: Zernio Emerges as Best Option**
1. Follow happy path through step 5
2. Zernio scores highest; rebrand investigation reveals benign reasons
3. Report presents honestly: "Your current choice may be the right one"
4. Recommends specific next steps with Zernio

## What

### System Boundaries

- Web research tools (WebSearch, WebFetch) — primary data gathering
- Playwright CLI — browser automation for scraping provider sites, review platforms, pricing pages
- Spec document (this file) — output artifact with embedded verification links
- External sources: Provider websites, G2/Capterra, Reddit, GitHub, Google Trends, X/Twitter, tech press

### Feedback Harnesses

Every AC has an automated feedback loop. Manual feedback is exceptional and justified.

| AC | Fidelity | Layer(s) | Trigger | Observable Seam | Terminal Condition | Test Infra |
|----|----------|----------|---------|-----------------|-------------------|------------|
| AC-1 | live | e2e + external:web | Playwright + WebSearch navigate provider sites and directories | Page content, search results | >=8 providers with platform coverage confirmed. Source URLs in appendix | new — landscape scraper |
| AC-2 | live | e2e + external:web | Playwright visits Zernio.com, getLate.dev, reviews, Reddit; WebSearch for rebrand queries | Page content, reviews, threads | Rebrand timeline from >=2 sources, sentiment from >=2 platforms, feature matrix from docs | new — Zernio investigation |
| AC-3 | integration | backend + e2e | Parse document + cross-reference AC-1 data | Scoring matrix section | Every candidate scored, no empty cells | new — structure validator |
| AC-4 | live | e2e + external:web | Playwright visits finalist pricing, SDK docs, GitHub, security pages | Pricing tables, API docs, certifications | Each finalist deep-dive populated from live data. URLs in appendix | new — finalist scraper |
| AC-5 | live | e2e + external:web | Playwright + WebSearch: G2, Reddit, GitHub, Trends, X | Ratings, counts, trends | Each finalist has data from >=4 of 6 sources with numbers | new — signal scraper |
| AC-6 | isolated | backend | Parse deliverable for tables and sort order | Document tables | Tables present, correctly sorted, recommendation justified | new — table validator |
| AC-7 | manual | — | Human review with Verification Links appendix | Full document | Claims match sources, analysis fair, decision actionable | [manual] |

### External Dependencies

| Service | Functionality In Scope | Integration Status | Env Var | Est. Cost/Call | Test Budget |
|---------|----------------------|-------------------|---------|---------------|-------------|
| WebSearch (Claude Code) | Search queries | existing | None | Free | $0.00 |
| WebFetch (Claude Code) | Page fetching | existing | None | Free | $0.00 |
| Playwright CLI (skill) | Browser automation | existing | None | Free | $0.00 |
| G2.com | Review ratings | new — public, Playwright | None | Free | $0.00 |
| Reddit | Developer sentiment | new — public, WebSearch | None | Free | $0.00 |
| GitHub | Repo activity | new — public, WebFetch | None | Free | $0.00 |
| Google Trends | Interest comparison | new — public, Playwright | None | Free | $0.00 |

---

## Research Findings

> Research conducted 2026-03-30. All claims cite sources. See Verification Links appendix at end of document.

### 1. Landscape Map

#### Tier 1: Established SaaS (Industry Giants)

| Provider | Public Publishing API | TikTok | Facebook | YouTube | Instagram | Video | TS/JS SDK | Pricing |
|----------|----------------------|--------|----------|---------|-----------|-------|-----------|---------|
| **Hootsuite** | Gated (partner app directory only) | Yes | Yes | Yes | Yes | Yes | No | ~$99/mo SaaS; API requires partner agreement |
| **Buffer** | Yes (Beta) | Yes | Yes | Yes | Yes | Yes | No | Free-$100/mo/channel; API in beta, no analytics |
| **Sprout Social** | Yes (Advanced plan) | Yes | Yes | Yes | Yes | Yes | No | **$399/user/month** minimum for API |
| **Sendible** | No (SSO only) | — | — | — | — | — | — | White-label dashboard only |
| **Agorapulse** | Analytics-only API | — | — | — | — | — | — | Custom plans only |
| **SocialBee** | No public API | — | — | — | — | — | — | Zapier/Make integrations only |
| **Loomly** | No substantive API | — | — | — | — | — | — | Status API only |

**Key finding:** Of the 7 established players evaluated, only **3 expose publishing APIs** (Hootsuite, Buffer, Sprout Social), and none are suitable for embedding into a third-party product — Hootsuite gates behind partnerships, Buffer's API is in beta with no analytics, and Sprout Social costs $399/user/month. The established players are built for end-users managing their own accounts, not developers building publishing into products.

Sources: [Hootsuite Developer Portal](https://developer.hootsuite.com), [Buffer API Docs](https://buffer.com/developers/api), [Sprout Social API](https://support.sproutsocial.com/hc/en-us/articles/360045006152), [Sendible White Label](https://www.sendible.com/solutions/white-label-reseller-social-media-management), [Agorapulse API](https://support.agorapulse.com/en/articles/12417183), [SocialBee API FAQ](https://help.socialbee.com/hc/en-us/articles/29979123668375)

#### Tier 2: Emerging / API-First SaaS

| Provider | Founded | TikTok | FB | YT | IG | Video | TS/JS SDK | Pricing Model | Differentiator |
|----------|---------|--------|----|----|----|----|-----------|---------------|----------------|
| **Ayrshare** | 2015 | Yes | Yes | Yes | Yes | Yes ($149+ plan) | Node.js SDK (253 GitHub stars) | Per-profile: $149/mo (1 profile) to $599/mo (30+) | Most mature API-first provider, 13+ platforms |
| **Zernio/Late** | Unknown | Yes | Yes | Yes | Yes | Yes (all plans) | Node.js SDK | Per-post tiers: Free (20/mo), $19/mo (120), $299/mo (unlimited) | Cheapest entry, 14 platforms, video on free tier |
| **Outstand.so** | ~2024 | Yes | Yes | Yes | Yes | Yes | TS SDK | Pure usage: $0.50/acct/mo + $0.01/post | Lowest per-post cost, TypeScript-native, MCP support |
| **bundle.social** | ~2023 | Yes | Yes | Yes | Yes | Yes | REST API | From $20/mo, unlimited accounts | No per-account fees, 14+ platforms, 4GB uploads |
| **Post for Me** | ~2024 | Yes | Yes | Yes | Yes | Yes | REST API | $10/mo (1,000 posts), scales up | Cheapest overall, unlimited accounts/users/API keys |
| **Postproxy** | ~2024 | Yes | Yes | Yes | Yes | Yes | REST API | Per-post + profile groups | Publishing-only focus, MCP server, per-platform failure reporting |
| **Publer** | ~2019 | Yes | Yes | Yes | Yes | Yes | REST API (no SDK) | $21.60-$40/mo per channel (Business plan for API) | Video-specific workflows, competitor tracking |

Sources: [Ayrshare](https://www.ayrshare.com/), [Ayrshare Pricing](https://www.ayrshare.com/pricing/), [Zernio](https://zernio.com/), [getLate.dev](https://getlate.dev/), [Outstand.so](https://www.outstand.so), [bundle.social](https://bundle.social/), [Post for Me](https://www.postforme.dev), [Postproxy](https://postproxy.dev/), [Publer API](https://publer.com/docs)

#### Tier 3: Open-Source / Self-Hosted

| Project | GitHub Stars | License | Language | TikTok | FB | YT | IG | Video | API | Last Active |
|---------|-------------|---------|----------|--------|----|----|----|----|-----|-------------|
| **Postiz** | 27,706 | AGPL-3.0 | TypeScript (Next.js) | Yes | Yes | Yes | Yes | Yes | REST API | 2026-03-29 |
| **Mixpost** | 3,077 | MIT | PHP (Laravel) | Yes | Yes | Yes | Yes | Yes | Limited (UI-driven) | 2026-03-16 |
| **Socioboard 5.0** | 1,432 | Custom | JavaScript (Node.js) | **No** | Yes | Yes | Yes | Partial | REST API | 2026-01-30 |

**Key finding:** **Postiz is the only viable open-source option** that covers all 4 target platforms with video, exposes an API, and is written in TypeScript. It has 27.7k stars — more than most commercial competitors' combined GitHub presence. The AGPL license requires source disclosure for network-served modifications. Mixpost is well-maintained (MIT license) but is PHP-based with no headless API. Socioboard lacks TikTok support.

Sources: [Postiz GitHub](https://github.com/gitroomhq/postiz-app), [Mixpost GitHub](https://github.com/inovector/mixpost), [Socioboard GitHub](https://github.com/socioboard/Socioboard-5.0)

---

### 2. Zernio Deep Investigation

#### Rebrand Timeline

- **getLate.dev** was the original domain and brand name ("Late" / "LATE")
- **zernio.com** is the current domain and brand name ("Zernio")
- getLate.dev currently redirects to or mirrors Zernio content — both domains serve content simultaneously
- GitHub organizations exist under **both** names: `getlate-dev` / `getlatedev` (old) and `zernio-dev` (new), with repos showing the new name but URLs still resolving via old org paths
- npm package remains `@getlatedev/node` (v0.2.24) — not yet republished under the Zernio name
- The n8n community node repo is at `github.com/getlatedev/n8n-nodes-late` but displays as `zernio-dev/n8n-nodes-zernio`

**No public explanation for the rebrand was found.** No blog post, press release, or announcement explains why "Late" became "Zernio." This is unusual for a developer-facing product where trust and continuity matter.

Sources: [getLate.dev](https://getlate.dev/), [Zernio.com](https://zernio.com/), [Zernio docs at getLate domain](https://docs.getlate.dev/), [npm @getlatedev/node](https://www.npmjs.com/package/@getlatedev/node), [GitHub zernio-dev](https://github.com/zernio-dev), [GitHub getlatedev](https://github.com/getlatedev/)

#### Community Sentiment

- **Trustpilot:** 1 review total. The reviewer (self-described early adopter) is positive but notes "originally I encountered many posting errors, but over time have found the reliability of the platform continues to improve." This confirms integration instability.
- **Reddit:** **Zero mentions found** across all searches. For a developer-facing API product, this is a significant signal — no organic developer discussion exists.
- **G2:** No profile found.
- **Capterra:** No profile found.
- **Product Hunt:** Not found in searches.
- **Hacker News:** Not found in searches.
- **npm downloads:** ~4,008 total downloads for `@getlatedev/node` — very low for a production API SDK.

Sources: [Zernio Trustpilot](https://www.trustpilot.com/review/zernio.com), [npm @getlatedev/node](https://www.npmjs.com/package/@getlatedev/node)

#### Current Product Evaluation

| Criterion | Assessment |
|-----------|-----------|
| **Platform coverage** | 14 platforms including all 4 targets (TikTok, FB, YT, IG) — among the broadest |
| **Video publishing** | Included on all plans including free tier — better than Ayrshare ($149+ for video) |
| **SDK availability** | Node.js, Python, Go, Ruby, Java, PHP, .NET, Rust — most comprehensive SDK ecosystem |
| **Pricing** | Free (20 posts/mo), $19/mo (120 posts), $69/mo (600 posts), $299/mo (unlimited) |
| **API documentation** | Available at docs.getlate.dev / docs.zernio.com — standard REST API docs |
| **Team accounts** | Not clearly documented in public materials (user's original concern) |
| **White-label analytics** | Basic analytics API available; white-label not documented |
| **Comparative stats** | Not available |
| **MCP support** | Yes — Social Media MCP server documented |
| **Webhooks** | Not clearly documented |
| **SOC2/GDPR** | No compliance documentation found |

Sources: [Zernio API docs](https://docs.zernio.com/), [Zernio pricing (via getLate)](https://getlate.dev/social-media-api), [Zernio MCP](https://docs.zernio.com/resources/mcp), [Zernio platforms](https://docs.zernio.com/platforms)

#### Trust / Longevity Risk Assessment

| Signal | Finding | Risk Level |
|--------|---------|------------|
| Unexplained rebrand | No public rationale; repos still transitioning between org names | **High** |
| Community presence | Zero Reddit, HN, G2, Capterra, Product Hunt presence | **High** |
| npm adoption | ~4,008 total downloads — negligible | **High** |
| Trustpilot reviews | 1 review, confirms early reliability issues | **Medium** |
| SDK completeness | 8 language SDKs — ambitious for the apparent team size | **Medium** |
| Content marketing | Active blog with SEO-focused comparison articles (self-serving but shows investment) | **Low** |
| Platform coverage | 14 platforms, competitive with market leaders | **Low** |
| Pricing | Most affordable entry point in the market | **Low** |

**Assessment:** Zernio has a surprisingly comprehensive product feature set at an attractive price, but the community signals are extremely thin for a developer-facing API. The unexplained rebrand, zero organic community discussion, negligible npm downloads, and single Trustpilot review (which confirms early reliability issues) represent meaningful vendor risk for a pre-launch product. The product may be technically capable, but the lack of visible adoption raises questions about sustainability. **Your integration difficulties and concerns appear validated by the data, not contradicted.**

---

### 3. Requirement-Based Filtering

#### Must-Have Criteria

| Provider | 4-Platform Video (TT/FB/YT/IG) | TypeScript/JS API | Analytics Roadmap | **PASS** |
|----------|--------------------------------|-------------------|-------------------|----------|
| Hootsuite | Yes | REST only, gated | Dashboard only | **FAIL** — API not self-serve |
| Buffer | Yes | REST only, beta | No analytics API | **FAIL** — no analytics |
| Sprout Social | Yes | REST only | Yes | **FAIL** — $399/user/mo |
| **Ayrshare** | Yes | Node.js SDK | Yes (API) | **PASS** |
| **Zernio/Late** | Yes | Node.js SDK | Yes (basic) | **PASS** |
| **Outstand.so** | Yes | TypeScript SDK | Yes | **PASS** |
| **bundle.social** | Yes | REST API | Yes (unified) | **PASS** |
| Post for Me | Yes | REST API | Limited | **BORDERLINE** |
| Postproxy | Yes | REST API | Not documented | **BORDERLINE** |
| Publer | Yes | REST only (no SDK) | Yes (API) | **PASS** (no SDK) |
| **Postiz (OSS)** | Yes | TypeScript native | Yes | **PASS** |
| Mixpost (OSS) | Yes | PHP only | Yes | **FAIL** — no TS/JS |
| Socioboard (OSS) | No TikTok | JS | Yes | **FAIL** — no TikTok |

**6 providers passed all must-haves:** Ayrshare, Zernio/Late, Outstand.so, bundle.social, Publer, and Postiz.

#### Nice-to-Have Scoring (0-3 scale: 0=absent, 1=partial, 2=available, 3=excellent)

| Provider | Comparative Stats | Team Accounts | AI Features | White-Label | Webhooks | MCP | **Total /18** |
|----------|-------------------|---------------|-------------|-------------|----------|-----|---------------|
| **Ayrshare** | 0 | 2 (multi-profile) | 1 (auto-hashtags) | 1 (Launch+ plans) | 1 (Enterprise only) | 0 | **5** |
| **Zernio/Late** | 0 | 0 (not documented) | 0 | 0 | 0 | 2 (MCP server) | **2** |
| **Outstand.so** | 0 | 2 (usage-based) | 1 (MCP/AI agent support) | 0 | 2 (real-time) | 3 (Claude/Cursor native) | **8** |
| **bundle.social** | 0 | 3 (unlimited) | 1 (GPT/AI tool support) | 0 | 2 (documented) | 1 (REST API) | **7** |
| **Publer** | 1 (competitor tracking) | 2 (Business plan) | 1 (AI assistant) | 0 | 0 | 0 | **4** |
| **Postiz (OSS)** | 0 | 2 (self-hosted, unlimited) | 2 (built-in AI captions) | 3 (fully customizable) | 1 (extensible) | 0 | **8** |

---

### 4. Top 3 Finalist Deep Dives

Based on must-have pass + nice-to-have scores + community signals, the **top 3 finalists** are:

1. **Ayrshare** — highest community trust signals, most mature
2. **Outstand.so** — best DX + pricing model for scaling, highest nice-to-have score (tied)
3. **bundle.social** — best value for multi-account management, strong reviews

**Postiz** is evaluated separately as the recommended open-source option.
**Zernio** is evaluated in Section 2 above.

---

#### Finalist 1: Ayrshare (Recommended — Established API-First)

**Overview:** Founded 2015 by Geoffrey Bourne (New York). The longest-running developer-first social media API. Self-funded (no external funding found on Crunchbase).

**Feature Matrix:**

| Feature | Details |
|---------|---------|
| Platforms | 13+: IG, TikTok, FB, YT, X, LinkedIn, Pinterest, Reddit, Telegram, Google Business, Snapchat, Threads, Bluesky |
| Video publishing | Yes — requires Premium plan ($149/mo) or higher. Free tier: images only |
| Scheduling | Yes, timezone-aware |
| Analytics API | Yes, per-post and aggregate analytics |
| Comment management | Yes |
| Media optimization | Auto-resize for platform requirements |
| Multi-tenant | Yes — core architecture designed for platforms managing many user profiles |
| Webhooks | Enterprise plan only |

**DX Assessment:**
- **SDK:** Official Node.js SDK ([github.com/ayrshare/social-media-api](https://github.com/ayrshare/social-media-api), 253 stars). Supports CJS and ESM.
- **Docs:** "Top notch" per multiple reviews. Postman collection available.
- **Onboarding:** Self-serve signup, immediate API key. Developers report "first API call in minutes."
- **TypeScript:** SDK includes TypeScript type definitions.
- **React Native:** No specific React Native SDK, but REST API works with any HTTP client.

**Security Posture:**
- OAuth flow for social account connections
- No documented SOC2 or GDPR certification found
- API key authentication (Bearer token)

**Pricing at Scale:**

| Scale | Plan | Monthly Cost |
|-------|------|-------------|
| 1 profile (100 users) | Premium | $149/mo |
| 10 profiles (1K users) | Launch | $299/mo |
| 100 profiles (10K users) | Business | ~$599/mo + $1.99/additional profile |

**Integration Effort Estimate:** 1-2 weeks for basic publish flow. SDK is straightforward. Multi-tenant profile management adds ~1 week. Total: **2-3 weeks** for a TypeScript/React Native web-first stack.

**Limitations:**
- Video requires $149/mo minimum — no video on free tier
- Per-profile pricing compounds at scale (agencies managing 100+ profiles)
- Webhooks gated to Enterprise
- X/Twitter requires your own API credentials as of March 31, 2026
- @mention tagging requires user IDs (no @username lookup API)

Sources: [Ayrshare Pricing](https://www.ayrshare.com/pricing/), [Ayrshare Docs](https://www.ayrshare.com/docs/introduction), [Ayrshare GitHub](https://github.com/ayrshare/social-media-api), [Ayrshare Capterra](https://www.capterra.com/p/213297/Ayrshare/), [Ayrshare G2](https://www.g2.com/products/ayrshare-api/reviews), [Ayrshare Crunchbase](https://www.crunchbase.com/organization/ayrshare)

---

#### Finalist 2: Outstand.so (Recommended — Best DX + Scaling)

**Overview:** Newer entrant (~2024), positioned as the developer-first, TypeScript-native unified API. Claims 500+ companies in production.

**Feature Matrix:**

| Feature | Details |
|---------|---------|
| Platforms | 10+: X, LinkedIn, IG, FB, Threads, TikTok, YT, Bluesky, Pinterest, Google Business |
| Video publishing | Yes — all plans |
| Scheduling | Yes, timezone-aware |
| Analytics API | Yes, unified cross-platform |
| Normalized data model | Yes — consistent JSON shape across all platforms |
| Real-time webhooks | Yes — all plans |
| MCP integration | Native — Claude, Cursor, Windsurf |

**DX Assessment:**
- **SDK:** Official TypeScript SDK (also Python, Ruby, Go). TypeScript-first design.
- **Docs:** Available at [outstand.so/docs](https://www.outstand.so/docs/getting-started). Developer reports "first API call in under 5 minutes." However, independent review notes "sparse public documentation makes it harder to evaluate technical depth before signing up."
- **Onboarding:** Usage-based, no tier gates.
- **Architecture:** Built on Cloudflare Workers — 99.9% SLA, <200ms average latency.

**Security Posture:**
- No documented SOC2 or GDPR certification found
- Cloudflare-backed infrastructure (inherits Cloudflare security)

**Pricing at Scale:**

| Scale | Monthly Cost |
|-------|-------------|
| 10 accounts, 500 posts | $5 base + $5 accounts + $5 posts = **~$15/mo** |
| 100 accounts, 5,000 posts | $5 + $50 + $50 = **~$105/mo** |
| 1,000 accounts, 50,000 posts | $5 + $500 + $500 = **~$1,005/mo** |

**The per-post model ($0.01/post) is the lowest in the market.** At high volume, Outstand significantly undercuts per-profile models.

**Integration Effort Estimate:** 1 week for basic publish flow (TypeScript SDK aligns with your stack). Webhook integration: +2-3 days. Total: **1-2 weeks** for a TypeScript/React Native web-first stack.

**Limitations:**
- Newer company — less track record than Ayrshare
- "Sparse public documentation" noted by independent reviewers
- No documented automation integrations (n8n, Zapier) — API-only
- 500+ companies claimed but not independently verified
- White-label analytics not available

Sources: [Outstand.so](https://www.outstand.so), [Outstand Docs](https://www.outstand.so/docs/getting-started), [Outstand Blog — Cloudflare architecture](https://www.outstand.so/blog/globally-scalable-unified-social-media-api-cloudflare), [Outstand Blog — Journey](https://www.outstand.so/blog/our-journey-to-outstand), [Postproxy comparison](https://postproxy.dev/blog/best-social-media-scheduling-apis-compared/)

---

#### Finalist 3: bundle.social (Recommended — Best Multi-Account Value)

**Overview:** Founded ~2023. Positioned as the "no account limits" social media API. Featured on Hacker News Show HN.

**Feature Matrix:**

| Feature | Details |
|---------|---------|
| Platforms | 14+: IG, TikTok, FB, YT, X, LinkedIn, Pinterest, Reddit, Threads, Mastodon, Bluesky, Discord, Slack, Google Business |
| Video publishing | Yes — all plans, up to 4GB upload |
| Scheduling | Yes |
| Analytics API | Yes — unified/normalized metrics (views, impressions, likes, comments, shares, demographics) |
| Unlimited accounts | Yes — 1 to 10,000+ with no per-account charge |
| AI/GPT integration | REST API compatible with AI tools |
| No-code integrations | n8n, Zapier, Make |

**DX Assessment:**
- **SDK:** REST API (no dedicated TS SDK found). Documentation available.
- **Docs:** "Very easy to understand" per developer reviews. "Feature-complete" API.
- **Onboarding:** Free-forever plan available. All tiers include API access.
- **Bring Your Own Keys:** Developers can use their own social platform app credentials for full data control.

**Security Posture:**
- Bring-your-own-keys model (data control stays with developer)
- No documented SOC2 or GDPR certification found

**Pricing at Scale:**

| Scale | Estimated Monthly Cost |
|-------|----------------------|
| 10 accounts | ~$20/mo (free-forever or starter) |
| 100 accounts | ~$100/mo (no per-account surcharge) |
| 1,000+ accounts | Custom pricing |

**The unlimited-accounts model is uniquely valuable** for a platform where each user connects their own social accounts. No per-profile penalty for growth.

**Integration Effort Estimate:** 1-2 weeks for basic publish flow (REST API, no dedicated TS SDK adds minor overhead). Webhook + analytics: +1 week. Total: **2-3 weeks** for a TypeScript/React Native web-first stack.

**Limitations:**
- No dedicated TypeScript SDK (REST API only)
- Pricing specifics unclear between sources ($20/mo vs $100/mo discrepancy)
- Newer company, limited independent reviews
- White-label analytics not documented
- No MCP integration documented

Sources: [bundle.social](https://bundle.social/), [bundle.social HN Show HN](https://news.ycombinator.com/item?id=45734286), [bundle.social Trustpilot](https://www.trustpilot.com/review/bundle.social), [bundle.social Capterra](https://www.capterra.com/p/10035746/bundle-social/), [bundle.social GetApp](https://www.getapp.com/marketing-software/a/bundle-social/)

---

#### Open-Source Recommendation: Postiz

**Overview:** 27,706 GitHub stars. TypeScript (Next.js + Redis). AGPL-3.0 license. The most popular open-source social media management tool by a large margin.

**Feature Matrix:**

| Feature | Details |
|---------|---------|
| Platforms | 12+: FB, IG, YT, TikTok, X, LinkedIn, Reddit, Pinterest, Threads, Bluesky, Mastodon, Dribbble |
| Video publishing | Yes |
| AI features | Built-in AI caption/content generation |
| API | REST API for programmatic publishing |
| White-label | Fully customizable (you own the code) |
| Self-hosting | Docker Compose (PostgreSQL + Redis) |

**Pricing:** Free (self-hosted). Infrastructure cost: ~$20-50/mo for a small VPS with PostgreSQL + Redis.

**Limitations:**
- AGPL-3.0 license — must disclose source for network-served modifications
- Self-hosting ops burden (updates, security patches, infrastructure)
- 4 core contributors — bus factor risk
- 225 open issues (active but indicates backlog)

**When to choose Postiz:** Maximum control, zero per-user/post fees, white-label by default, and your team has DevOps capacity. Best for: long-term cost optimization or when vendor lock-in is unacceptable.

Sources: [Postiz GitHub](https://github.com/gitroomhq/postiz-app)

---

### 5. Quantitative Validation

| Signal | Ayrshare | Outstand.so | bundle.social | Zernio/Late | Postiz (OSS) |
|--------|----------|-------------|---------------|-------------|--------------|
| **G2** | Profile exists; reviews present | Not found | Not found | Not found | N/A |
| **Capterra** | 5.0/5 (4 reviews) | Not found | Listed | Not found | N/A |
| **Trustpilot** | Not found | Not found | Multiple positive reviews | 1 review (mixed — praises product, confirms early bugs) | N/A |
| **Reddit** | Mentioned in API comparison threads | Not found | Not found | **Zero mentions** | Mentioned in open-source threads |
| **GitHub** | 253 stars (Node.js SDK) | SDK available (stars not confirmed) | Listed on GitHub | SDKs exist (low stars) | **27,706 stars** |
| **npm** | Active package | TypeScript SDK published | REST API (no npm) | ~4,008 total downloads | N/A (self-hosted) |
| **Hacker News** | Mentioned in discussions | Not found | **Show HN post** | Not found | Mentioned |
| **Tech Press** | Listed on Postman, SaaS review sites | Blog content, Cloudflare case study | GetApp, SaaSWorthy | SEO blog content only | Featured in open-source roundups |
| **Funding** | Self-funded (Crunchbase profile, no rounds) | Unknown | Unknown | Unknown | Open-source project |
| **Signals (of 6)** | **5/6** | **3/6** | **4/6** | **2/6** | **4/6** (as OSS) |

**Key quantitative findings:**
- **Ayrshare has the strongest signal diversity** — present on G2, Capterra, GitHub, npm, Reddit discussions, and multiple review sites
- **Zernio has the weakest signals** of any commercial option — zero Reddit presence, no G2/Capterra, 1 Trustpilot review, negligible npm downloads
- **bundle.social's HN Show HN** is a genuine organic developer-community signal
- **Postiz's 27.7k GitHub stars** dwarf all commercial competitors combined

---

### 6. Decision Framework

#### Feature Comparison Table

| Feature | Ayrshare | Outstand | bundle.social | Zernio | Postiz (OSS) |
|---------|----------|----------|---------------|--------|--------------|
| All 4 target platforms | Yes | Yes | Yes | Yes | Yes |
| Video on entry plan | No ($149+) | Yes | Yes | Yes (free) | Yes |
| TypeScript SDK | Yes (Node.js) | Yes (native) | No (REST) | Yes (Node.js) | Yes (native) |
| Analytics API | Yes | Yes | Yes (unified) | Basic | Yes |
| White-label analytics | Partial (Launch+) | No | No | No | Yes (own code) |
| Comparative engagement | No | No | No | No | No |
| Team/multi-tenant | Yes | Yes | Yes (unlimited) | Not documented | Yes (self-hosted) |
| Webhooks | Enterprise only | Yes (all plans) | Yes | Not documented | Extensible |
| MCP support | No | Yes (native) | No | Yes | No |
| Scheduling | Yes | Yes | Yes | Yes | Yes |
| AI features | Auto-hashtags | AI agent support | GPT integration | None documented | AI captions |

**Note:** No provider offers comparative engagement stats (comparing platform content performance against user's other posts). This would need to be built as a custom analytics layer on top of any provider's analytics API.

#### Pros / Cons by Finalist (Sorted: Value high-to-low, Risk high-to-low)

**Ayrshare**

| Pros (by value) | Cons (by risk) |
|-----------------|----------------|
| Most mature API-first provider (since 2015) | Video requires $149/mo minimum — highest cost floor |
| Best community trust signals (G2, Capterra 5.0, Reddit mentions) | Per-profile pricing compounds at scale ($1.99/profile beyond plan) |
| Multi-tenant architecture purpose-built for platforms | X/Twitter requires your own API credentials (March 2026) |
| Official Node.js SDK with TypeScript definitions | No SOC2/GDPR certification documented |
| Comprehensive docs, Postman collection, fast onboarding | Webhooks gated to Enterprise plan |
| 13+ platforms including all 4 targets | Self-funded, no external investment (longevity question) |

**Outstand.so**

| Pros (by value) | Cons (by risk) |
|-----------------|----------------|
| Lowest per-post cost in market ($0.01/post) | Newer company, shorter track record |
| TypeScript-native SDK (aligns perfectly with your stack) | "Sparse public documentation" noted by independent reviews |
| Video on all plans, no tier gate | "500+ companies" claim not independently verifiable |
| Real-time webhooks on all plans (no enterprise gate) | No white-label analytics |
| Native MCP integration (Claude, Cursor) | No automation integrations (n8n, Zapier) |
| Cloudflare-backed infrastructure (99.9% SLA, <200ms) | No SOC2/GDPR certification documented |
| Consistent normalized data model across platforms | Less platform coverage (10 vs 13-14 for competitors) |

**bundle.social**

| Pros (by value) | Cons (by risk) |
|-----------------|----------------|
| Unlimited accounts — no per-profile penalty for growth | No dedicated TypeScript SDK (REST-only) |
| Broadest platform coverage (14+ including Discord, Slack) | Pricing unclear between sources ($20-$100/mo) |
| 4GB file uploads (highest limit found) | Newer company, limited track record |
| Bring-your-own-keys model (user data control) | No white-label analytics |
| Positive Trustpilot reviews from developers | No MCP integration |
| HN Show HN organic developer validation | No SOC2/GDPR certification documented |
| n8n, Zapier, Make integrations | Fewer independent reviews than Ayrshare |

#### Recommendation Table

| Category | Recommended | Runner-Up | Justification |
|----------|------------|-----------|---------------|
| **Overall (SaaS)** | **Ayrshare** | Outstand.so | Strongest trust signals, most proven at scale, multi-tenant architecture purpose-built for your use case. Higher cost floor but worth it for pre-launch risk reduction. |
| **Best DX + Scaling** | **Outstand.so** | Ayrshare | TypeScript-native, cheapest per-post, video on all plans, webhooks on all plans. Best fit for a TypeScript/React Native stack that needs to scale efficiently. |
| **Best Multi-Account Value** | **bundle.social** | Outstand.so | Unlimited accounts with no per-profile penalty. If your platform has many users each connecting multiple social accounts, this model avoids compounding costs. |
| **Open-Source** | **Postiz** | Mixpost | Only viable OSS option covering all 4 platforms in TypeScript. 27.7k stars, very active. AGPL license is the main trade-off. |
| **Budget Entry** | **Zernio/Late** | Post for Me | Cheapest SaaS entry ($19/mo with video), but thin community signals and unexplained rebrand create vendor risk. Suitable only if you accept the risk and can migrate later. |

#### Tiebreaker Rubric

If you're torn between the top 2:

| Your Priority | Choose | Why |
|---------------|--------|-----|
| Minimize vendor risk (pre-launch safety) | **Ayrshare** | Longest track record, most community validation |
| Minimize cost, maximize DX | **Outstand.so** | TypeScript-native, $0.01/post, video on all plans |
| Maximize user-account flexibility | **bundle.social** | Unlimited accounts, bring-your-own-keys |
| Maximum control, zero vendor lock-in | **Postiz (self-host)** | Own everything, but accept ops overhead |
| Validate fast, lowest entry cost | **Zernio** | $19/mo with video, but accept vendor risk |

---

### Overall Recommendation

**For your situation — pre-launch, TypeScript/React Native web-first, need to get it right the first time:**

**Start with Ayrshare** for the safest foundation. It's the most proven API-first provider with the strongest community signals. The $149/mo cost floor for video is real, but at pre-launch you need reliability and trust more than cost optimization.

**Watch Outstand.so closely** as your scaling option. If Outstand's track record solidifies over the next 6 months and their documentation improves, their TypeScript-native SDK + $0.01/post model could be the better long-term home. Consider migrating to Outstand when you hit scale where Ayrshare's per-profile pricing becomes painful.

**Keep Postiz in your back pocket** as the exit strategy. If any commercial vendor becomes untenable (pricing, reliability, sunset), Postiz gives you a fully self-hosted TypeScript option with zero per-user fees.

**On Zernio:** Your concerns are validated. The product has competitive features and the best entry pricing, but the thin community presence, unexplained rebrand, confirmed early reliability issues, and negligible adoption signals make it a risky foundation for a pre-launch product. It's not that Zernio is necessarily bad — it's that you can't verify it's good, and at pre-launch, that uncertainty is the risk.

---

## Appendix: Verification Links

Review these links to verify claims made in this document.

### Landscape Sources
- [Hootsuite Developer Portal](https://developer.hootsuite.com)
- [Buffer API Docs](https://buffer.com/developers/api)
- [Sprout Social API](https://support.sproutsocial.com/hc/en-us/articles/360045006152)
- [Sprout Social Pricing](https://sproutsocial.com/pricing/)
- [Sendible White Label](https://www.sendible.com/solutions/white-label-reseller-social-media-management)
- [Agorapulse API](https://support.agorapulse.com/en/articles/12417183)
- [SocialBee API FAQ](https://help.socialbee.com/hc/en-us/articles/29979123668375)

### API-First SaaS Providers
- [Ayrshare Homepage](https://www.ayrshare.com/)
- [Ayrshare Pricing](https://www.ayrshare.com/pricing/)
- [Ayrshare Documentation](https://www.ayrshare.com/docs/introduction)
- [Ayrshare GitHub SDK](https://github.com/ayrshare/social-media-api)
- [Ayrshare G2 Reviews](https://www.g2.com/products/ayrshare-api/reviews)
- [Ayrshare Capterra](https://www.capterra.com/p/213297/Ayrshare/)
- [Ayrshare Crunchbase](https://www.crunchbase.com/organization/ayrshare)
- [Outstand.so Homepage](https://www.outstand.so)
- [Outstand Documentation](https://www.outstand.so/docs/getting-started)
- [Outstand Cloudflare Architecture](https://www.outstand.so/blog/globally-scalable-unified-social-media-api-cloudflare)
- [bundle.social Homepage](https://bundle.social/)
- [bundle.social Hacker News](https://news.ycombinator.com/item?id=45734286)
- [bundle.social Trustpilot](https://www.trustpilot.com/review/bundle.social)
- [bundle.social Capterra](https://www.capterra.com/p/10035746/bundle-social/)
- [Post for Me Homepage](https://www.postforme.dev)
- [Post for Me FAQ](https://www.postforme.dev/faq)
- [Postproxy Homepage](https://postproxy.dev/)
- [Postproxy API Comparison](https://postproxy.dev/blog/best-social-media-scheduling-apis-compared/)
- [Publer API Docs](https://publer.com/docs)

### Zernio Investigation
- [Zernio Homepage](https://zernio.com/)
- [getLate.dev (original domain)](https://getlate.dev/)
- [Zernio API Documentation](https://docs.zernio.com/)
- [Zernio Trustpilot (1 review)](https://www.trustpilot.com/review/zernio.com)
- [npm @getlatedev/node](https://www.npmjs.com/package/@getlatedev/node)
- [GitHub zernio-dev org](https://github.com/zernio-dev)
- [GitHub getlatedev org](https://github.com/getlatedev/)
- [Zernio MCP Server](https://docs.zernio.com/resources/mcp)
- [Zernio Platforms](https://docs.zernio.com/platforms)
- [Late vs Ayrshare (self-published)](https://getlate.dev/ayrshare-vs-late)

### Open-Source
- [Postiz GitHub (27.7k stars)](https://github.com/gitroomhq/postiz-app)
- [Mixpost GitHub (3.1k stars)](https://github.com/inovector/mixpost)
- [Socioboard GitHub (1.4k stars)](https://github.com/socioboard/Socioboard-5.0)

### Quantitative Signals
- [Ayrshare G2 Profile](https://www.g2.com/products/ayrshare-api/reviews)
- [Ayrshare Capterra Reviews](https://www.capterra.com/p/213297/Ayrshare/)
- [Ayrshare Software Advice](https://www.softwareadvice.com/marketing/ayrshare-profile/)
- [bundle.social GetApp](https://www.getapp.com/marketing-software/a/bundle-social/)
- [Outstand Blog — Best Unified APIs (2026)](https://www.outstand.so/blog/best-unified-social-media-apis-for-devs)
- [Zernio Blog — API Comparison (2026)](https://zernio.com/blog/top-12-social-media-apis-for-developers)

### Third-Party Comparisons
- [Postproxy — Best Social Media Scheduling APIs Compared](https://postproxy.dev/blog/best-social-media-scheduling-apis-compared/)
- [Outstand — 10 Best Unified Social Media APIs (2026)](https://www.outstand.so/blog/best-unified-social-media-apis-for-devs)
- [Ayrshare — Top 10 Social Media APIs](https://www.ayrshare.com/top-10-social-media-apis-for-developers/)
- [AlternativeTo — Ayrshare Alternatives](https://alternativeto.net/software/ayrshare/)
