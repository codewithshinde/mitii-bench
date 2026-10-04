#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();
program
  .command("db:seed")
  .option("--count <number>", "records to seed", "10")
  .action((opts) => {
    const count = Number(opts.count);
    console.log(JSON.stringify({ command: "db:seed", count, seeded: count }));
  });

program.parse(process.argv);
