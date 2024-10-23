import { parse, stringify } from 'jsr:@std/toml';
import { ofetch } from 'ofetch';

// deno run -A deno/update-wrangler-date.ts

const latestCompatibilityDate = await ofetch(
	'https://raw.githubusercontent.com/cloudflare/workerd/refs/heads/main/src/workerd/io/supported-compatibility-date.txt',
	{
		responseType: 'text',
	},
).then((text) => text.trim());

// parseResponse: (text) => text,

const wranglerPath = new URL('../wrangler.toml', import.meta.url);
const wranglerContent = await Deno.readTextFile(wranglerPath);
const config = parse(wranglerContent);

config.compatibility_date = latestCompatibilityDate;

await Deno.writeTextFile(wranglerPath, stringify(config));
console.log(`Updated compatibility_date to ${latestCompatibilityDate}`);

// https://raw.githubusercontent.com/cloudflare/workerd/refs/heads/main/src/workerd/io/supported-compatibility-date.txt
