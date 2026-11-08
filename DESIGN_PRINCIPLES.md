# NexusBMS Design & Engineering Principles

> **"Everything should be made as simple as possible, but not simpler."**  
> — *Core Architectural Directive*

---

### 1. Radical Simplicity with Zero Compromise on Correctness
- **As simple as possible**: Eliminate unnecessary abstractions, redundant UI controls, cognitive clutter, and speculative features. Every screen, component, and button must justify its existence with a clear operational purpose.
- **...But not simpler**: Never sacrifice business integrity, strict validation, financial reconciliation accuracy, or audit accountability in the name of superficial simplicity.

### 2. Streamlined UX & Clean Information Hierarchy
- Keep views focused: one primary intent per screen (e.g. fast barcode POS checkout, executive cockpit oversight, approval queue resolution).
- Prefer intuitive defaults and zero-friction interactions (e.g. keyboard hotkeys F1-F8, auto-focus search, single-tap tender presets).
- Avoid burying core user flows under nested menus or redundant links.

### 3. Modular & Decoupled Architecture
- Clear boundary separation:
  - Countertop POS Terminal (`/pos`) operates standalone and kiosk-optimized.
  - Core Back-Office Suite (`/`) handles CRM, Approvals, Shift Audit, and Branch Management.
  - Engineering Master Plan & SRS Portal (`nexus-bms-plan-srs.vercel.app`) serves as living specification documentation.
- Maintain predictable state flow with immutable audit logging on critical business mutations.
