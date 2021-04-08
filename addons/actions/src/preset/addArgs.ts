import { addActionsFromArgTypes, inferActionsFromArgTypesRegex } from './addArgsHelpers';

export const argTypesEnhancers = [addActionsFromArgTypes, inferActionsFromArgTypesRegex];
