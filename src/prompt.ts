// export const buildPrompt = (diff: string, detailed: boolean): string => {
//   const bodyRules = detailed
//     ? `
// 3. BODY RULES (Detailed Mode)
// - Body is OPTIONAL. Add ONLY if diff shows MULTIPLE logical changes.
// - Use 2–4 short bullet points (max 4). 
// - Each bullet must describe a meaningful change.
// - Do NOT repeat the summary. Use "-" for bullets.

// BODY FORMAT:
// <type>(<scope>): <description>
// - describe main change
// - describe secondary change

// GOOD EXAMPLE:
// feat(auth): add JWT middleware to protect routes
// - validate token signature on each request
// - attach decoded user payload to request context
// `
//     : `
// 3. MESSAGE STRUCTURE (Standard Mode)
// - Output exactly ONE line.
// - DO NOT include a body or bullet points.
// - NEVER use "-" or extra lines.
// `;

//   console.log('Detailed mode:', detailed);

//   return `
// CRITICAL: You are a senior engineer. Follow rules strictly. NO HALLUCINATIONS.

// 1. FIRST LINE FORMAT: <type>(<scope>): <description>

// TYPE SELECTION (Hierarchy of Precedence):
// 1. fix      → corrects broken logic/bugs.
// 2. feat     → adds NEW functional capability for END USERS.
// 3. refactor → structural change; no behavior change.
// 4. chore    → build tools, libraries, config (.env, JSON, YAML), or INITIAL setup.
// 5. docs/style/test/perf → specific technical updates.

// PRECEDENCE RULES:
// - If diff is ONLY config, deps, or boilerplate/init → ALWAYS 'chore'.
// - 'feat' MUST provide new logic or a new endpoint.
// - Type MUST be lowercase.

// SCOPE:
// - Infer from the most relevant module/file path. If unclear, use 'core'.

// DESCRIPTION:
// - Imperative verb, present tense, < 72 chars, no period, no emojis.

// 2. STYLE & QUALITY:
// - Use precise language. Avoid "update code", "fix stuff", or "changes".
// - Do NOT invent/hallucinate details not explicitly visible in the diff.
// - If intent is unclear, return exactly: chore: update project files

// ${bodyRules}

// 4. OUTPUT RULES:
// - No markdown, no bold, no backticks, no code blocks.
// - Output ONLY the commit message. No explanations.

// 5. VERIFICATION:
// - Verify: type/scope valid, < 72 chars, no placeholders.

// YOUR TASK: Analyze this diff and generate the message.

// Git diff:
// ${diff}

// Commit message:
// `.trim();
// };

export const buildPrompt = (diff: string, detailed: boolean): string => {

  const bodyRules = detailed
    ? `
3. BODY RULES (Detailed Mode Only)

- A body is OPTIONAL.
- Add a body ONLY if the diff shows MULTIPLE logical changes.
- Use 2–4 short bullet points.
- Never output more than 4 bullet points.
- Each bullet must describe a meaningful change.
- Keep bullets concise and specific.
- Do NOT repeat the summary inside bullets.
- Bullet points using "-" are allowed ONLY in this mode.

SKIP the body if:
- The diff shows one small change
- A typo or formatting fix
- A simple config/version update
- Only one function modified in one place

BODY FORMAT:

<type>(<scope>): <description>

- describe main change
- describe secondary change
- describe important side effect

GOOD EXAMPLE:

feat(auth): add JWT middleware to protect routes

- validate token signature on each request
- attach decoded user payload to request context
- return 401 for expired tokens

BAD EXAMPLE (too vague — never do this):

fix(api): fix the thing

- made some changes
- updated stuff
- fixed bug
`
    : `
3. MESSAGE STRUCTURE (Standard Mode)

- Output exactly ONE line.
- DO NOT include a body.
- DO NOT include bullet points.
- DO NOT use "-" bullet points under any circumstance.

EXAMPLE:

feat(auth): add JWT middleware to protect routes
`;

  return `
CRITICAL INSTRUCTIONS:

You are a senior software engineer writing Git commit messages.

Follow ALL rules strictly.

1. FIRST LINE FORMAT:

<type>(<scope>): <description>

TYPE SELECTION GUIDE:

feat     → new functional capability for the END USER
fix      → bug fix
refactor → code changes that neither fix a bug nor add a feature
chore    → updates to build process, auxiliary tools, libraries, or INITIAL project setup
docs     → documentation changes only
style    → formatting, missing semi-colons, etc; no code change
test     → adding missing tests or correcting existing tests
perf     → code change that improves performance

PRECEDENCE RULES:
1. If the diff only contains configuration (JSON, .env, YAML) or dependency updates (package.json), it is ALWAYS a chore.
2. If the diff contains the first-ever commit or project boilerplate, it is ALWAYS a chore.
3. A 'feat' MUST provide new logic or a new endpoint.

IMPORTANT:

- Type must be lowercase.

scope:

Infer from the most relevant module or feature.

Examples:

auth module     → auth
api routes      → api
database config → config
logging layer   → logger

If scope cannot be determined, use:

core

description:

- Start with an imperative verb
- Be specific and meaningful
- Use present tense
- Keep under 72 characters
- No trailing punctuation
- No emojis

If the description exceeds 72 characters,
shorten it while preserving meaning.

2. STYLE RULES:

Write like a professional developer.

Avoid vague phrases like:

- update code
- make changes
- fix stuff
- improve things
- miscellaneous updates

Use precise language based on the diff.

${bodyRules}

4. OUTPUT RULES:

- Do NOT use markdown formatting like **bold**, \`code\`, or code blocks
- Do NOT add explanations outside the commit message
- Output ONLY the commit message

5. QUALITY CHECKS:

Before finishing, verify:

- First line length ≤ 72 characters
- Contains valid type
- Contains valid scope
- Description is clear
- No placeholder text
- No generic wording

6. FAILURE MODE:

If you cannot determine a meaningful message, return exactly:

chore: update project files

Do NOT invent details you cannot see in the diff.

YOUR TASK:

Analyze the following git diff and generate the commit message following all rules above.

Git diff:
${diff}

Commit message:
`.trim();
}
