export abstract class JsPackageManager {
  public abstract initPackageJson(): void;

  public abstract getRunStorybookCommand(): string;
}
