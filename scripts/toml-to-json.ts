#!/usr/bin/env -S node --experimental-strip-types
import { parse } from 'smol-toml';
import { readFile, writeFile } from 'fs/promises';

async function convertTomlToJson() {
	try {
		// Read the wrangler.toml file
		const tomlContent = await readFile('wrangler.toml', 'utf-8');

		// Parse TOML to JavaScript object
		const parsedData = parse(tomlContent);

		// Convert to JSON with comments format (JSONC)
		const jsonContent = JSON.stringify(parsedData, null, 2);

		// Write to wrangler.jsonc
		await writeFile('wrangler.jsonc', jsonContent);

		console.log('Successfully converted wrangler.toml to wrangler.jsonc');
	} catch (error) {
		console.error('Error converting file:', error);
		process.exit(1);
	}
}

convertTomlToJson();
