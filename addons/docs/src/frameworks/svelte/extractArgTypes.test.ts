import svelteDoc from 'sveltedoc-parser';
import * as fs from 'fs';
import { createArgTypes } from './extractArgTypes';

const content = fs.readFileSync(`${__dirname}/sample/MockButton.svelte`, 'utf-8');

describe('Extracting Arguments', () => {
  it('should create ArgTypes', async () => {
    const doc = await svelteDoc.parse({ fileContent: content, version: 3 });

    const results = createArgTypes(doc);

    expect(results).toMatchInlineSnapshot(`
      Object {
        "rounded": Object {
          "control": Object {
            "type": "boolean",
          },
          "defaultValue": true,
          "description": null,
          "name": "rounded",
          "table": Object {
            "defaultValue": Object {
              "summary": true,
            },
          },
          "type": Object {},
        },
        "text": Object {
          "control": Object {
            "type": "text",
          },
          "defaultValue": "",
          "description": null,
          "name": "text",
          "table": Object {
            "defaultValue": Object {
              "summary": "",
            },
          },
          "type": Object {},
        },
      }
    `);
  });
});
