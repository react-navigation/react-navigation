#include <ReactNavigationInsetsPadding.h>
#include <ReactNavigationSpec.h>
#include <fbjni/fbjni.h>
#include <react/fabric/StateWrapperImpl.h>

namespace facebook::react {

const char ReactNavigationWindowInsetsViewComponentName[] = "ReactNavigationWindowInsetsView";

WindowInsetsState::WindowInsetsState(const WindowInsetsState &previousState, folly::dynamic data)
    : top(data["top"].getDouble()),
      bottom(data["bottom"].getDouble()),
      start(data["start"].getDouble()),
      end(data["end"].getDouble()),
      isRTL(data["isRTL"].getBool()),
      swapLeftAndRight(data["swapLeftAndRight"].getBool()) {}

folly::dynamic WindowInsetsState::getDynamic() const {
  return folly::dynamic::object("top", top)("bottom", bottom)("start", start)("end", end)("isRTL", isRTL)("swapLeftAndRight", swapLeftAndRight);
}

void ReactNavigationWindowInsetsViewShadowNode::adjustLayoutWithState() {
  ensureUnsealed();

  const auto &state = getStateData();

  applyInsetsPadding(yogaNode_, getConcreteProps(), state, state.swapLeftAndRight);
}

class WindowInsetsView : public jni::JavaClass<WindowInsetsView> {
 public:
  static constexpr auto kJavaDescriptor = "Lorg/reactnavigation/WindowInsetsView;";

  static void updateState(
      jni::alias_ref<WindowInsetsView> view,
      jni::alias_ref<StateWrapper::javaobject> stateWrapper,
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
        return;
      }

      state = std::static_pointer_cast<const ReactNavigationWindowInsetsViewShadowNode::ConcreteState>(wrapper->cthis()->getState());
    }

    WindowInsetsState data;

    data.top = top;
    data.bottom = bottom;
    data.start = start;
    data.end = end;
    data.isRTL = isRTL;
    data.swapLeftAndRight = swapLeftAndRight;

    state->updateState(std::move(data), EventQueue::UpdateMode::unstable_Immediate);
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
