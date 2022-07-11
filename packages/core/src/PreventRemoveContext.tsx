import getNamedContext from './getNamedContext';

const MISSING_CONTEXT_ERROR = "Couldn't find a prevent remove context.";

const PreventRemoveContext = getNamedContext<{
  isPrevented: boolean;
  setPrevented: React.Dispatch<boolean> | undefined;
}>('PreventRemoveContext', {
  isPrevented: false,
  setPrevented() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default PreventRemoveContext;
