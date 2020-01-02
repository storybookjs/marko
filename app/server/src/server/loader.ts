import { compileCsfModule } from '../lib/compiler';

export default (content: string) => {
  return compileCsfModule(JSON.parse(content));
};
