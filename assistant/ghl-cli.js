#!/usr/bin/env node
// Quick CLI to sanity-check the GHL connection and explore your sub-account.
//
// Usage:
//   node ghl-cli.js workflows      # list existing workflows (proves auth works)
//   node ghl-cli.js pipelines      # list opportunity pipelines + stage ids
//   node ghl-cli.js calendars      # list calendars
//   node ghl-cli.js search "jane"  # search contacts

require("./env");
const ghl = require("./ghl");

async function main() {
  const [cmd, arg] = process.argv.slice(2);
  switch (cmd) {
    case "workflows": {
      const wfs = await ghl.listWorkflows();
      console.log(`Found ${wfs.length} workflow(s):`);
      wfs.forEach((w) => console.log(`  ${w.id}  ${w.name}  [${w.status}]`));
      break;
    }
    case "pipelines": {
      const ps = await ghl.listPipelines();
      ps.forEach((p) => {
        console.log(`Pipeline: ${p.name} (${p.id})`);
        (p.stages || []).forEach((s) => console.log(`   stage: ${s.name} (${s.id})`));
      });
      break;
    }
    case "calendars": {
      const cals = await ghl.listCalendars();
      cals.forEach((c) => console.log(`  ${c.id}  ${c.name}`));
      break;
    }
    case "search": {
      const contacts = await ghl.searchContacts(arg || "");
      contacts.forEach((c) =>
        console.log(`  ${c.id}  ${c.firstName || ""} ${c.lastName || ""}  ${c.email || ""}`)
      );
      break;
    }
    default:
      console.log("Commands: workflows | pipelines | calendars | search <query>");
  }
}

main().catch((err) => {
  console.error(`❌ ${err.message}`);
  process.exit(1);
});
