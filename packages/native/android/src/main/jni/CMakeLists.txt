cmake_minimum_required(VERSION 3.13)

set(LIB_ANDROID_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../..)
set(LIB_GENERATED_DIR ${LIB_ANDROID_DIR}/build/generated/source/codegen/jni)
set(LIB_COMPONENTS_DIR ${LIB_GENERATED_DIR}/react/renderer/components/ReactNavigationSpec)

file(GLOB LIB_CODEGEN_SRCS CONFIGURE_DEPENDS ${LIB_GENERATED_DIR}/*.cpp ${LIB_COMPONENTS_DIR}/*.cpp)

add_library(react_codegen_ReactNavigationSpec SHARED WindowInsetsView.cpp ${LIB_CODEGEN_SRCS})

target_include_directories(
  react_codegen_ReactNavigationSpec
  PUBLIC
  .
  ${LIB_ANDROID_DIR}/../cpp
  ${LIB_GENERATED_DIR}
)

target_link_libraries(react_codegen_ReactNavigationSpec fbjni jsi reactnative)

target_compile_reactnative_options(react_codegen_ReactNavigationSpec PRIVATE)
