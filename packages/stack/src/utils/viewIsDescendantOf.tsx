import { findNodeHandle, type HostInstance, UIManager } from 'react-native';

export function viewIsDescendantOf(
  view: HostInstance,
  ancestor: HostInstance,
  callback: (isDescendant: boolean) => void
) {
  if (typeof ancestor.contains === 'function') {
    callback(ancestor.contains(view));
    return;
  }

  if (view.isConnected === false || ancestor.isConnected === false) {
    callback(false);
    return;
  }

  const viewTag = findNodeHandle(view);
  const ancestorTag = findNodeHandle(ancestor);

  if (viewTag == null || ancestorTag == null) {
    callback(false);
    return;
  }

  UIManager.viewIsDescendantOf(
    viewTag,
    ancestorTag,
    (result: boolean | boolean[]) => {
      callback(Array.isArray(result) ? result[0] : result);
    }
  );
}
