// Patch issue with interpret module not supporting esbuild (used by storybook internally)
import * as interpret from "interpret";
interpret.extensions[".ts"] = ["esbuild-register"];
