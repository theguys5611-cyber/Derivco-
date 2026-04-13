import assert from "assert";

const mockDb = {
  projects: {},
  milestones: {},
  collection: function (name) {
    const store = name === "milestones" ? mockDb.milestones : mockDb.projects;
    return {
      doc: (id) => ({
        set: async (data) => { store[id] = { id, ...data }; },
        get: async () => ({
          exists: !!store[id],
          data: () => store[id],
          id,
        }),
        update: async (data) => { store[id] = { ...store[id], ...data }; },
        delete: async () => { delete store[id]; },
      }),
      get: async () => ({
        docs: Object.values(store).map((p) => ({ id: p.id, data: () => p })),
      }),
    };
  },
};

async function createProject(db, userId, projectData) {
  if (!projectData.title || projectData.title.trim() === "") throw new Error("Project title is required");
  if (!projectData.stage) throw new Error("Project stage is required");
  const id = "proj_" + Date.now();
  const project = { userId, title: projectData.title.trim(), description: projectData.description || "", stage: projectData.stage, supportNeeded: projectData.supportNeeded || "", isCompleted: false, logoSvg: projectData.logoSvg || null, createdAt: new Date().toISOString() };
  await db.collection("projects").doc(id).set(project);
  return { id, ...project };
}

async function updateProject(db, projectId, userId, updates) {
  const docRef = db.collection("projects").doc(projectId);
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Project not found");
  if (snap.data().userId !== userId) throw new Error("Unauthorised: you do not own this project");
  await docRef.update(updates);
  return { id: projectId, ...snap.data(), ...updates };
}

async function markComplete(db, projectId, userId) {
  const docRef = db.collection("projects").doc(projectId);
  const snap = await docRef.get();
  if (!snap.exists) throw new Error("Project not found");
  if (snap.data().userId !== userId) throw new Error("Unauthorised: you do not own this project");
  await docRef.update({ isCompleted: true });
  return { id: projectId, ...snap.data(), isCompleted: true };
}

async function addMilestone(db, projectId, milestoneData) {
  if (!milestoneData.title || milestoneData.title.trim() === "") throw new Error("Milestone title is required");
  const id = "ms_" + Date.now();
  const milestone = { projectId, title: milestoneData.title.trim(), description: milestoneData.description || "", achievedAt: new Date().toISOString() };
  await db.collection("milestones").doc(id).set(milestone);
  return { id, ...milestone };
}

function sanitizeSvg(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/on\w+="[^"]*"/gi, "").replace(/javascript:/gi, "").trim();
}

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log("  PASS:", name);
    passed++;
  } catch (err) {
    console.log("  FAIL:", name, "-", err.message);
    failed++;
  }
}

function resetDb() {
  mockDb.projects = {};
  mockDb.milestones = {};
}

console.log("\nRunning MzansiBuilds test suite...\n");

console.log("Project creation");
await test("creates a project with valid data", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "My App", stage: "in-progress" }); assert.strictEqual(p.title, "My App"); assert.strictEqual(p.isCompleted, false); });
await test("trims whitespace from title", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "  Trimmed  ", stage: "planning" }); assert.strictEqual(p.title, "Trimmed"); });
await test("throws if title is missing", async () => { resetDb(); try { await createProject(mockDb, "user1", { stage: "planning" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Project title is required"); } });
await test("throws if title is empty string", async () => { resetDb(); try { await createProject(mockDb, "user1", { title: "   ", stage: "planning" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Project title is required"); } });
await test("throws if stage is missing", async () => { resetDb(); try { await createProject(mockDb, "user1", { title: "No Stage" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Project stage is required"); } });

console.log("\nProject updates");
await test("allows owner to update project", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "Original", stage: "planning" }); const u = await updateProject(mockDb, p.id, "user1", { title: "Updated" }); assert.strictEqual(u.title, "Updated"); });
await test("throws if non-owner updates", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "Mine", stage: "planning" }); try { await updateProject(mockDb, p.id, "intruder", { title: "Hacked" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Unauthorised: you do not own this project"); } });
await test("throws if project not found", async () => { resetDb(); try { await updateProject(mockDb, "ghost_id", "user1", { title: "Ghost" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Project not found"); } });

console.log("\nMark project complete");
await test("marks project as complete", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "Done", stage: "complete" }); const r = await markComplete(mockDb, p.id, "user1"); assert.strictEqual(r.isCompleted, true); });
await test("throws if non-owner marks complete", async () => { resetDb(); const p = await createProject(mockDb, "user1", { title: "Not Yours", stage: "in-progress" }); try { await markComplete(mockDb, p.id, "intruder"); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Unauthorised: you do not own this project"); } });

console.log("\nMilestone tracking");
await test("adds a milestone", async () => { const m = await addMilestone(mockDb, "proj_123", { title: "MVP done", description: "First version" }); assert.strictEqual(m.title, "MVP done"); assert.strictEqual(m.projectId, "proj_123"); });
await test("throws if milestone title missing", async () => { try { await addMilestone(mockDb, "proj_123", { description: "No title" }); assert.fail(); } catch (e) { assert.strictEqual(e.message, "Milestone title is required"); } });

console.log("\nGemini SVG sanitization");
await test("removes script tags", () => { const c = sanitizeSvg('<svg><script>alert("xss")</script></svg>'); assert.ok(!c.includes("<script>")); });
await test("removes inline event handlers", () => { const c = sanitizeSvg('<svg><rect onclick="alert(1)"/></svg>'); assert.ok(!c.includes("onclick")); });
await test("removes javascript: protocol", () => { const c = sanitizeSvg('<svg><a href="javascript:alert(1)">x</a></svg>'); assert.ok(!c.includes("javascript:")); });
await test("returns empty string for null", () => { assert.strictEqual(sanitizeSvg(null), ""); });
await test("returns empty string for non-string", () => { assert.strictEqual(sanitizeSvg(12345), ""); });

console.log("\n----------------------------------------");
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);