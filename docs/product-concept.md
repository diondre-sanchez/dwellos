# Home Digital Twin

> Original concept doc, moved here from [`diondre-sanchez/idea-lab`](https://github.com/diondre-sanchez/idea-lab)'s `app_ideas/home-digital-twin.md` now that DwellOS is an active project rather than just an idea. See [`architecture.md`](architecture.md) for the technical decisions made from this concept.

Working names: DwellOS / HouseMind

## Product thesis

Give every physical asset in a home its own digital identity and AI expert, grounded in the exact documentation, warranty information, maintenance history, and lifecycle of that item.

This is not intended to be another generic home-maintenance checklist. The long-term goal is to create a digital operating system for the home: a persistent, structured record of the home's systems and assets with an intelligence layer that can answer questions, surface maintenance, preserve history, and help homeowners make better repair/replacement decisions.

## Problem

Homeowners typically have appliance manuals, receipts, warranty records, installer information, model numbers, service notes, and maintenance schedules scattered across paper files, email, manufacturer websites, photo libraries, calendars, and memory.

When something fails, the homeowner often has to:

- Find the make/model or serial number.
- Locate the correct manual.
- Search through dozens or hundreds of pages.
- Determine whether the issue is covered by warranty.
- Remember whether the same problem happened before.
- Find the correct replacement part or service provider.
- Reconstruct the maintenance history.

Most of this information already exists. The problem is that it is fragmented and difficult to use when it matters.

## Core experience

A homeowner creates a home, adds rooms/systems, and registers assets such as:

- HVAC equipment
- Water heaters
- Refrigerators
- Dishwashers
- Washers and dryers
- Microwaves and ovens
- Garage doors/openers
- Plumbing fixtures
- Electrical equipment
- Generators
- Lawn equipment
- Networking/smart-home equipment
- TVs and electronics
- Roofing/flooring/paint information
- Other serviceable household assets

Each asset becomes a persistent record containing its identity, documents, maintenance, warranty, service history, and AI context.

### Example asset record — Samsung Washer

Manufacturer, Model, Serial number, Room/location, Purchase date, Purchase price, Retailer, Installer, Warranty start/end dates, Owner's manual, Installation guide, Service documentation, Receipt, Photos, Replacement parts, Maintenance schedule, Completed maintenance, Repair/service history, Notes, Lifecycle status, AI manual intelligence.

The flagship capability is not simply storing a manual. It is making the manual conversational.

A user should be able to open an asset and ask questions such as:

- "What does error E24 mean?"
- "How do I clean this filter?"
- "What clearance does this model require?"
- "Can I use aluminum foil in this microwave?"
- "What replacement filter does this unit need?"
- "How do I reset this appliance?"
- "What maintenance does the manufacturer recommend this year?"
- "Does the manual say I can repair this myself?"

The AI should retrieve information from the exact documentation associated with that asset, rather than answering generically.

## Response requirements

Whenever possible, AI answers should:

- Ground responses in the asset's exact documentation.
- Cite the manual/document and page or section used.
- Distinguish manufacturer guidance from general advice.
- Incorporate the home's maintenance/service history when relevant.
- Identify warranty implications.
- Avoid improvising hazardous repair procedures.
- Clearly recommend qualified service when documentation indicates professional service is required.

### Example

Instead of:

> E24 usually indicates a drainage problem.

The application could provide:

> Your Bosch dishwasher model XYZ lists E24 as a drainage-system fault. The manufacturer recommends checking the filter, drain hose, and pump cover in that order. Your service history shows the drain hose was replaced eight months ago, so the filter and pump cover are reasonable first checks. See Owner's Manual, p. 42.

That combination of manufacturer documentation + exact asset identity + homeowner history is a primary differentiator.

## MVP

The first useful version should remain intentionally narrow.

**Core hierarchy:** User → Home → Room/System → Asset

### MVP capabilities

**Authentication and household creation** — Create an account. Create a home. Create rooms/locations or home systems.

**Asset inventory** — Add/edit/archive an asset. Manufacturer, model, serial number, location, purchase information, warranty dates, and notes.

**Document storage** — Upload manuals, receipts, warranty documents, installation guides, photos, and related files. Associate documents with the correct asset.

**Manual/document ingestion** — Extract text from supported documents. Preserve document/page metadata. Chunk and index content for retrieval.

**Asset-specific AI Q&A** — Ask questions about an asset. Retrieve relevant documentation. Generate grounded answers. Provide document/page citations when available.

**Maintenance scheduling** — Create recurring maintenance activities. Support manufacturer-recommended and user-defined schedules. Mark maintenance complete and calculate next due date.

**Service history** — Record repair/service date, provider, notes, cost, documents, and outcome.

**Warranty tracking** — Store warranty terms and expiration dates. Surface upcoming expiration dates.

### Initial data model

See [`../prisma/schema.prisma`](../prisma/schema.prisma) for the implemented version. Original sketch:

- **Home**: ID, Owner/household ID, Name, Address (optional / privacy-sensitive), Build year, Home type, Notes
- **Room / Location**: ID, Home ID, Name, Type, Notes
- **Asset**: ID, Home ID, Room/location ID, Category, Manufacturer, Product name, Model number, Serial number, Purchase date, Purchase price, Retailer, Installer, Installation date, Warranty start, Warranty expiration, Expected service life, Lifecycle status, Notes
- **Document**: ID, Asset ID, Document type, Original filename, Storage location, Source, Upload date, Parsed/indexed status, Page count, Metadata
- **Maintenance plan**: ID, Asset ID, Task, Interval, Source (manufacturer/user/system), Source document/page, Last completed, Next due, Notes
- **Service event**: ID, Asset ID, Date, Service provider, Problem, Resolution, Cost, Warranty claim status, Parts replaced, Notes, Attachments

### High-level architecture (original sketch)

See [`architecture.md`](architecture.md) for the as-built version.

```
Web / Mobile Client
        |
        v
Application API
        |
        +-------------------+
        |                   |
        v                   v
Relational Database     Object Storage
(Home / Assets /        (Manuals / Receipts /
 Maintenance / History)  Photos / Warranties)
        |                   |
        |                   v
        |             Document Ingestion
        |                   |
        |             Parse / Chunk / Index
        |                   |
        +-----------> Retrieval Layer
                            |
                            v
                       AI Orchestration
                            |
                            v
                  Grounded Asset Answers
```

## Product differentiation

The product should avoid competing primarily as a reminder/checklist application.

The stronger positioning is:

1. **Every asset has a digital identity** — The application knows exactly which equipment belongs to the home rather than providing generic maintenance recommendations.
2. **Every asset has an AI expert** — The assistant understands documentation associated with the exact make/model.
3. **The home has memory** — Repairs, maintenance, parts, contractors, costs, warranty claims, and recurring issues remain attached to the asset for its lifetime.
4. **Manufacturer-grounded responses** — Answers should show their sources and distinguish manufacturer instructions from general AI reasoning.
5. **Lifecycle intelligence** — Over time the platform can reason about age, repair frequency, warranty status, maintenance, costs, and expected life to help answer questions such as: Is this worth repairing again? Which appliances are approaching end of life? What major household expenses may be approaching?

## Competitive landscape

Products already exist across portions of this space, including home inventory, maintenance, manuals, warranties, and emerging AI features. Examples identified during initial research include: HearthIQ, Homer, HomeAlmanac, Homvio, Hasset, HomeNog, Dwelluno.

Before significant development, perform a structured competitive teardown covering: asset inventory, manual discovery/storage, warranty tracking, maintenance reminders, AI/manual Q&A, source citations, service history, parts intelligence, home sharing, home-sale transfer, integrations, pricing/business model, mobile experience, data portability.

The key validation question is whether deep manual-grounded AI combined with household-specific asset history and lifecycle intelligence creates enough differentiation from existing products.

## Future capabilities / backlog

- **Model and serial label scanning** — Photograph an equipment label and automatically extract manufacturer, model, serial number, other identifiers. Potentially use the identified model to locate the correct manufacturer documentation.
- **Automated manual discovery** — Given manufacturer/model information, find the correct official manual or installation documentation and allow the user to confirm it before attaching it to the asset.
- **Receipt intelligence** — Upload or photograph a receipt and extract product, retailer, purchase date, price, model information, warranty-relevant dates.
- **Warranty intelligence** — Warranty expiration reminders, warranty document Q&A, identify whether a reported issue may still be covered, preserve warranty claim history.
- **Recall notifications** — Match registered products against authoritative manufacturer/government recall information.
- **Replacement-part intelligence** — Identify compatible filters, consumables, and replacement parts for the exact asset.
- **Maintenance generation from manuals** — Extract maintenance recommendations directly from manufacturer documentation and suggest recurring schedules for user approval.
- **Todoist / calendar integrations** — The application remains the system of record while external tools act as execution/reminder layers.
- **Contractor/service-provider history** — Associate contractors and technicians with prior service events so homeowners can quickly answer: Who serviced this last time? What did it cost? What did they replace? Would I use them again?
- **Repair-vs-replace intelligence** — Combine asset age, expected lifespan, repair history, repair cost, warranty status, maintenance history, estimated replacement cost to provide decision support rather than simply another repair log.
- **Home transfer package** — Allow a homeowner to transfer selected home records (manuals, warranties, asset inventory, service history, major improvements, contractor information, maintenance schedules) to a buyer when the property is sold.
- **Household sharing** — Support multiple members of a household with appropriate roles and permissions.
- **Smart-home integrations** — Longer term, ingest telemetry or device status from supported smart-home ecosystems where useful and privacy-appropriate.

## Safety and privacy considerations

The platform may eventually store unusually detailed information about a person's residence. Security and privacy therefore need to be first-class product requirements.

Important areas include: encryption in transit and at rest, strong authentication, household membership/authorization controls, secure object storage, signed/expiring document URLs, data minimization, auditability for shared access, secure account/home transfer, protection of addresses, serial numbers, receipts, contractor records, and home-system details, clear AI grounding and source attribution, guardrails around electrical, gas, refrigerant, structural, and other hazardous work.

## Potential product positioning

**DwellOS** — "The operating system for your home." Broad enough to support inventory, maintenance, documents, AI, lifecycle management, and future integrations.

**HouseMind** — "Your home. Now it remembers." Stronger emphasis on the AI and persistent-memory aspects of the product.

### Possible brand architecture

A future option is to separate the platform from the AI assistant identity:

- DwellOS — home platform / operating system
- Domi — conversational AI assistant

Example: *"Domi, what size filter does the upstairs HVAC need?"* — the assistant already knows which HVAC asset the user means and can answer from that equipment's documentation and history.

No final name should be adopted until basic domain, trademark, App Store, and competitive-name screening is completed.

## Development sequence

**Phase 0 — Validate**: Select a working product name; finalize problem statement and product thesis; complete competitor teardown; validate differentiation; define MVP acceptance criteria.

**Phase 1 — Foundation**: Create local VS Code workspace; choose initial technology stack; define repository structure and development conventions; design system architecture; define core database schema. *(Complete — see [`architecture.md`](architecture.md).)*

**Phase 2 — Asset platform**: Authentication; home management; room/location management; asset CRUD; document upload/storage; warranty data; maintenance records; service history.

**Phase 3 — Intelligence layer**: PDF/document extraction; chunking and metadata preservation; retrieval/indexing; asset-scoped RAG; AI answers with citations; safety/grounding rules.

**Phase 4 — Automation**: Maintenance reminders; warranty reminders; manual-derived maintenance suggestions; Todoist/calendar integration.

**Phase 5 — Advanced intelligence**: Model/serial label scanning; automated manual discovery; receipt extraction; recall monitoring; parts intelligence; repair-vs-replace recommendations; home-transfer workflow.

## Immediate next step (original)

Create the local development workspace from this repository and decide the initial technology stack before generating application code.

The first vertical slice should demonstrate the core thesis:

> Create a home → add an asset → attach its manual → ask a question → receive a grounded answer with a source citation.

If that experience is useful and reliable, the rest of the home-management platform can grow around it.
