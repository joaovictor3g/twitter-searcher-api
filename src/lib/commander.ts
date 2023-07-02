import { program } from "commander";

program.option("-f, --file <path>", "Caminho do arquivo").parse(process.argv);

const options = program.opts();

const file = options.file;

export { file };
