
export const buildPrompt = (diff: string, detailed: boolean): string => {
  const modeRules = detailed
    ? `
MODE: DETAILED

Include a body ONLY when the diff shows MULTIPLE distinct changes.

A distinct change includes ANY of the following:

- More than one file modified
- More than one function modified
- Logic changes plus configuration changes
- Feature changes plus tests
- Refactor combined with logic updates

SKIP the body ONLY if ALL conditions are true:

- Exactly one file modified
- Fewer than 10 changed lines
- Change is trivial (formatting, typo, version bump)

BODY FORMAT (Strict):

<type>(<scope>): <description>

(blank line)

2–4 bullet points:

- describe primary change
- describe secondary change
- describe side effect or dependency update
(optional)
- describe additional related change

BODY RULES:

- Use 2–4 bullets ONLY
- Each bullet ≤ 72 characters
- Do NOT repeat the summary
- Use "-" bullets ONLY in detailed mode
- Bullets must describe meaningful technical changes

SPECIAL BODY RULE (Dependencies):

If dependencies are modified:

- Bullets MUST name dependencies
- Include version info if visible
`
    : `
MODE: STANDARD

Output exactly ONE line.

DO NOT include:

- body text
- blank lines
- bullet points
- additional commentary

FORMAT:

<type>(<scope>): <description>
`;

  return `
CRITICAL INSTRUCTIONS:

You are a senior software engineer generating Git commit messages.

Follow ALL rules strictly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. COMMIT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<type>(<scope>): <description>

Example:

feat(auth): add JWT middleware for route protection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. TYPE SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select the MOST appropriate type.

feat
→ new functionality visible to users

fix
→ bug fix

refactor
→ internal restructuring without behavior change

chore
→ configuration, tooling, dependencies, setup

docs
→ documentation only

style
→ formatting only (no logic change)

test
→ tests added or modified

perf
→ performance improvements

PRECEDENCE RULES:

1. Config-only or dependency-only changes → chore
2. Initial project scaffolding → chore
3. New endpoints or user-facing logic → feat
4. Bug correction → fix

Type must be lowercase.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPENDENCY-SPECIFIC RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These rules apply when dependency files change.

Dependency files include:

- package.json
- package-lock.json
- pnpm-lock.yaml
- yarn.lock

WHEN dependencies are added, updated, or removed:

Use:

type: chore  
scope: deps

DESCRIPTION REQUIREMENTS:

The description MUST include dependency names.

❌ FORBIDDEN DESCRIPTIONS:

- install dependencies
- update packages
- add dependencies
- update project dependencies
- install project dependencies

These phrases are NOT allowed.

Instead:

List key dependencies explicitly.

GOOD EXAMPLES:

chore(deps): add express and dotenv dependencies

chore(deps): update lodash and axios versions

chore(deps): add zod for schema validation

IF many dependencies are modified:

List the most important 2–4 dependencies only.

Never use vague wording such as:

- numerous packages
- various dependencies
- multiple libraries

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. SCOPE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Infer the most relevant logical module.

Examples:

Authentication module → auth  
API routes → api  
Database config → config  
Logging system → logger  
UI components → ui  
Validation layer → validation  
Dependencies → deps  

If unclear:

Use:

core

Scope must:

- Be lowercase
- Be concise
- Represent the main affected area

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. DESCRIPTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The description MUST:

- Start with an imperative verb
- Use present tense
- Be specific and technical
- Be ≤ 72 characters
- Contain NO trailing punctuation
- Contain NO emojis

SPECIAL CASE — Dependencies:

If dependencies are modified:

- The description MUST name at least one dependency
- Never use generic dependency wording

Avoid vague phrases such as:

- update code
- fix issue
- improve things
- make changes
- miscellaneous updates

Bad example:

fix(api): fix stuff

Good example:

fix(api): handle null response from user service

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. MODE-SPECIFIC RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${modeRules}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Output ONLY the commit message.

Do NOT output:

- explanations
- markdown formatting
- code blocks
- bold text
- commentary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. VALIDATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before finishing, verify:

- Type is valid
- Scope is valid
- Description ≤ 72 characters
- First line format is correct
- No placeholder text
- No generic wording
- Dependency rules followed if applicable
- Output matches selected MODE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. FAILURE FALLBACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If a meaningful message cannot be determined, output EXACTLY:

chore: update project files

Do NOT invent behavior not visible in the diff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TASK:

Before generating the commit message:

Check whether dependency files are modified:

- package.json
- package-lock.json
- pnpm-lock.yaml
- yarn.lock

If yes:

Apply DEPENDENCY-SPECIFIC RULES strictly.

Analyze the following Git diff and generate a commit message.

Git diff:
${diff}

Commit message:
`.trim();
};


// This function builds a prompt for generating Git commit messages based on a given diff and a flag indicating whether detailed mode is enabled. The prompt includes instructions for formatting the commit message, selecting the appropriate type and scope, and writing a clear description. It also provides specific rules for when to include a body with bullet points in detailed mode. The output is designed to guide the user in creating high-quality commit messages that accurately reflect the changes made in the code.

// export const buildPrompt = (diff: string, detailed: boolean): string => {

//   const bodyRules = detailed
//     ? `
// 3. BODY RULES (Detailed Mode Only)

// - A body is OPTIONAL.
// - Add a body ONLY if the diff shows MULTIPLE logical changes.
// - Use 2–4 short bullet points.
// - Never output more than 4 bullet points.
// - Each bullet must describe a meaningful change.
// - Keep bullets concise and specific.
// - Do NOT repeat the summary inside bullets.
// - Bullet points using "-" are allowed ONLY in this mode.

// SKIP the body if:
// - The diff shows one small change
// - A typo or formatting fix
// - A simple config/version update
// - Only one function modified in one place

// BODY FORMAT:

// <type>(<scope>): <description>

// - describe main change
// - describe secondary change
// - describe important side effect

// GOOD EXAMPLE:

// feat(auth): add JWT middleware to protect routes

// - validate token signature on each request
// - attach decoded user payload to request context
// - return 401 for expired tokens

// BAD EXAMPLE (too vague — never do this):

// fix(api): fix the thing

// - made some changes
// - updated stuff
// - fixed bug
// `
//     : `
// 3. MESSAGE STRUCTURE (Standard Mode)

// - Output exactly ONE line.
// - DO NOT include a body.
// - DO NOT include bullet points.
// - DO NOT use "-" bullet points under any circumstance.

// EXAMPLE:

// feat(auth): add JWT middleware to protect routes
// `;

//   return `
// CRITICAL INSTRUCTIONS:

// You are a senior software engineer writing Git commit messages.

// Follow ALL rules strictly.

// 1. FIRST LINE FORMAT:

// <type>(<scope>): <description>

// TYPE SELECTION GUIDE:

// feat     → new functional capability for the END USER
// fix      → bug fix
// refactor → code changes that neither fix a bug nor add a feature
// chore    → updates to build process, auxiliary tools, libraries, or INITIAL project setup
// docs     → documentation changes only
// style    → formatting, missing semi-colons, etc; no code change
// test     → adding missing tests or correcting existing tests
// perf     → code change that improves performance

// PRECEDENCE RULES:
// 1. If the diff only contains configuration (JSON, .env, YAML) or dependency updates (package.json), it is ALWAYS a chore.
// 2. If the diff contains the first-ever commit or project boilerplate, it is ALWAYS a chore.
// 3. A 'feat' MUST provide new logic or a new endpoint.

// IMPORTANT:

// - Type must be lowercase.

// scope:

// Infer from the most relevant module or feature.

// Examples:

// auth module     → auth
// api routes      → api
// database config → config
// logging layer   → logger

// If scope cannot be determined, use:

// core

// description:

// - Start with an imperative verb
// - Be specific and meaningful
// - Use present tense
// - Keep under 72 characters
// - No trailing punctuation
// - No emojis

// If the description exceeds 72 characters,
// shorten it while preserving meaning.

// 2. STYLE RULES:

// Write like a professional developer.

// Avoid vague phrases like:

// - update code
// - make changes
// - fix stuff
// - improve things
// - miscellaneous updates

// Use precise language based on the diff.

// ${bodyRules}

// 4. OUTPUT RULES:

// - Do NOT use markdown formatting like **bold**, \`code\`, or code blocks
// - Do NOT add explanations outside the commit message
// - Output ONLY the commit message

// 5. QUALITY CHECKS:

// Before finishing, verify:

// - First line length ≤ 72 characters
// - Contains valid type
// - Contains valid scope
// - Description is clear
// - No placeholder text
// - No generic wording

// 6. FAILURE MODE:

// If you cannot determine a meaningful message, return exactly:

// chore: update project files

// Do NOT invent details you cannot see in the diff.

// YOUR TASK:

// Analyze the following git diff and generate the commit message following all rules above.

// Git diff:
// ${diff}

// Commit message:
// `.trim();
// }


