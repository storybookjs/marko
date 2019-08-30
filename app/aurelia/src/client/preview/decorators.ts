import { StoryFn } from "@storybook/addons";
import { StoryFnAureliaReturnType } from "./types";
import { IRegistry, IContainer } from "@aurelia/kernel";

export const addRegistries = (...items: IRegistry[]) => (storyFn: StoryFn<StoryFnAureliaReturnType>) => {
    const story = storyFn();
    story.items = story.items || [];
    story.items.push(...items);

    return {
        ...story,
        items
    };
};

export type Component = {
    item?: unknown,
    aliases?: string[]
}

export const addComponents = (...components: Component[] | unknown[]) => (storyFn: StoryFn<StoryFnAureliaReturnType>) => {
    const story = storyFn();
    story.components = story.components || [];
    story.components.push(...components);

    return {
        ...story,
        components
    };
};

export const addContainer = (container: IContainer) => (storyFn: StoryFn<StoryFnAureliaReturnType>) => {
    const story = storyFn();

    return {
        ...story,
        container
    };
};