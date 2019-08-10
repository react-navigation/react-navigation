import * as React from 'react';

/**
 * Component which prevents updates for children if no props changed
 */
function StaticContainer(props: any) {
  return props.children;
}

export default React.memo(StaticContainer, (prevProps: any, nextProps: any) => {
  for (const prop in prevProps) {
    if (prop === 'children') {
      continue;
    }

    if (prevProps[prop] !== nextProps[prop]) {
      return false;
    }
  }

  return true;
});
