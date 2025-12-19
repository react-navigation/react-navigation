require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "ReactNavigationNativeModule"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = "Satyajit Sahoo <satyajit.happy@gmail.com> (https://github.com/satya164/), Michał Osadnik <micosa97@gmail.com> (https://github.com/osdnk/)"

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/react-navigation/react-navigation.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.private_header_files = "ios/**/*.h"

  install_modules_dependencies(s)
end
