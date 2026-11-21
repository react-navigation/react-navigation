#include <ReactNavigationScrollInsets.h>
#include <ReactNavigationSpec.h>
#include <fbjni/fbjni.h>
#include <react/fabric/StateWrapperImpl.h>

namespace facebook::react {

const char ReactNavigationWindowInsetsViewComponentName[] = "ReactNavigationWindowInsetsView";

WindowInsetsState::WindowInsetsState(const WindowInsetsState &previousState, folly::dynamic data)
    : contentTag(data["contentTag"].getInt()),
      previousContentTag(previousState.contentTag != contentTag ? previousState.contentTag : 0),
      top(data["top"].getDouble()),
      bottom(data["bottom"].getDouble()),
      start(data["start"].getDouble()),
      end(data["end"].getDouble()),
      isRTL(data["isRTL"].getBool()),
      swapLeftAndRight(data["swapLeftAndRight"].getBool()) {}

folly::dynamic WindowInsetsState::getDynamic() const {
  return folly::dynamic::object("contentTag", contentTag)("top", top)("bottom", bottom)("start", start)("end", end)("isRTL", isRTL)("swapLeftAndRight", swapLeftAndRight);
}

void ReactNavigationWindowInsetsViewShadowNode::adjustLayoutWithState() {
  ensureUnsealed();

  const auto &state = getStateData();
  const auto &props = getConcreteProps();

  if (!props.adjustScrollInsets) {
    applyInsetsPadding(yogaNode_, props, state, state.swapLeftAndRight);
    return;
  }

  applyScrollInsets(yogaNode_, props.edges, state, state.swapLeftAndRight);
}

void ReactNavigationWindowInsetsViewShadowNode::appendChild(const std::shared_ptr<const ShadowNode> &child) {
  ConcreteViewShadowNode::appendChild(child);

  if (getConcreteProps().adjustScrollInsets) {
    adjustLayoutWithState();
  }
}

class WindowInsetsView : public jni::JavaClass<WindowInsetsView> {
 public:
  static constexpr auto kJavaDescriptor = "Lorg/reactnavigation/WindowInsetsView;";

  static jboolean updateState(
      jni::alias_ref<WindowInsetsView> view,
      jni::alias_ref<StateWrapper::javaobject> stateWrapper,
      jint contentTag,
      jfloat top,
      jfloat bottom,
      jfloat start,
      jfloat end,
      jboolean isRTL,
      jboolean swapLeftAndRight) {
    auto wrapper = jni::static_ref_cast<StateWrapperImpl::javaobject>(stateWrapper);
    static const auto isValid = StateWrapperImpl::javaClassStatic()->getMethod<jboolean()>("isValid");

    ReactNavigationWindowInsetsViewShadowNode::ConcreteState::Shared state;

    {
      // FIXME: React Native destroys state wrappers on another thread when a surface stops
      // So we hold the wrapper's Java monitor, which resetNative also holds, until we own the state
      auto lock = wrapper->lock();

      if (!isValid(wrapper)) {
        return false;
      }

      state = std::static_pointer_cast<const ReactNavigationWindowInsetsViewShadowNode::ConcreteState>(wrapper->cthis()->getState());
    }

    WindowInsetsState data;

    data.contentTag = contentTag;
    data.previousContentTag = contentTag != state->getData().contentTag ? state->getData().contentTag : 0;
    data.top = top;
    data.bottom = bottom;
    data.start = start;
    data.end = end;
    data.isRTL = isRTL;
    data.swapLeftAndRight = swapLeftAndRight;

    state->updateState(std::move(data), EventQueue::UpdateMode::unstable_Immediate);
    return true;
  }

  static void registerNatives() {
    javaClassStatic()->registerNatives({makeNativeMethod("updateState", WindowInsetsView::updateState)});
  }
};

}

JNIEXPORT jint JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    facebook::react::WindowInsetsView::registerNatives();
  });
}
