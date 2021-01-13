import { mount } from 'riot';

export default function renderCompiledButUnmounted(component: any) {
  mount('root', component.tagName, component.opts || {});
}
