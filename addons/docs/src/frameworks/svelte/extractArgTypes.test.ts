import svelteDoc from 'sveltedoc-parser';
import * as fs from 'fs';
import { createArgTypes } from './extractArgTypes';

const content = fs.readFileSync(`${__dirname}/sample/MockButton.svelte`, 'utf-8');

describe('Extracting Arguments', () => {
  it('should be svelte', () => {
    expect(content).toMatchInlineSnapshot(`
      <script>
        import { createEventDispatcher, afterUpdate } from 'svelte';
        export let text = '';
        export let rounded = true;

        const dispatch = createEventDispatcher();

        function onClick(event) {
          rounded = !rounded;

          dispatch('click', event);
        }

        afterUpdate(() => {
          dispatch('afterUpdate');
        });
      </script>
      <style>
        .rounded {
          border-radius: 35px;
        }

        .button {
          border: 3px solid;
          padding: 10px 20px;
          background-color: white;
          outline: none;
        }
      </style>
      <svelte:options accessors="{true}">
      </svelte:options>
      <button class="button"
              class:rounded
              on:click="{onClick}"
      >
        <strong>
          {rounded ? 'Round' : 'Square'} corners
        </strong>
        <br>
        {text}
        <slot>
        </slot>
      </button>
    `);
  });

  it('should generate ArgTypes', async () => {
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
