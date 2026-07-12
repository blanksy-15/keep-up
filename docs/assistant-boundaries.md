# Assistant Boundaries

Transactional conversion consumes only suggestions already selected into confirmed workflow content. It never invokes an assistant, accepts additional proposals, or stores raw provider responses.

Assistant ports accept structured values and return structured proposals or stable errors. They receive no repositories, credentials, framework objects, provider clients, or authority to save data.

Assistant output is non-authoritative. Setup suggestions enter a draft only when the caller supplies exact proposal IDs selected by the user, and remain editable. Review summaries remain proposals until approval; carry-forward candidates also require explicit selection.

Availability and provider failures map to stable application errors without mutating state. Provider SDKs, model selection, prompts, network adapters, API routes, and UI presentation are outside this milestone.
