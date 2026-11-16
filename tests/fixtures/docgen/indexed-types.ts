export interface OtherInput {
  mode?: "zeta" | "beta" | "alpha";
  seeMore?: Marko.AttrTag<
    Omit<Marko.HTML.Button, "type"> & {
      /** Shown after the label. */
      extra?: string;
    }
  >;
}
