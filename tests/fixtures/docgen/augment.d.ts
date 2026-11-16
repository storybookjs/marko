// Patches a native attribute into Marko's own types, as ebayui-core does.
declare global {
  namespace Marko {
    interface HTMLAttributes {
      /** Added by the project, but still a native attribute. */
      "docgen-augmented"?: string;
    }
  }
}

export {};
