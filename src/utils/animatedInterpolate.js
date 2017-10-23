/**
 * get the first and last animated interpolation
 * When the return value is null, the scene should be set to invisible.
 * @returns {{first: Number, last:Number} || null}
 */
function animatedInterpolate({ scene, scenes }) {
  const activeScene = scenes.find(item => item.isActive);
  const lastIndex = scenes.length - 1;
  const activeIndex = activeScene.index;
  const scenesActiveIndex = scenes.findIndex(item => item === activeScene);
  const scenesCurrentIndex = scenes.findIndex(item => item === scene);
  const index = scene.index;
  const isBack = !scenes[lastIndex].isActive;

  let first = index - 1;
  let last = index + 1;

  if (isBack) {
    if (scenesCurrentIndex === lastIndex) {
      first = activeIndex;
    } else if (index === activeIndex && scenesCurrentIndex === scenesActiveIndex) { // eslint-disable-line
      last = lastIndex;
    } else if (scenesCurrentIndex > scenesActiveIndex || index === activeIndex) { // eslint-disable-line
      return null;
    }
  }
  return { first, last };
}

module.exports = animatedInterpolate;
