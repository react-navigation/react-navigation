import { useEffect } from "react";
import {
    EventArg,
    NavigationProp,
    useNavigation,
    useRoute,
  } from "@react-navigation/core";
  
  export default function useFocusedTabPressed(callback: () => void) {
    const navigation = useNavigation();
    const route = useRoute();
  
    useEffect(() => {
      let tabNavigations: NavigationProp<ReactNavigation.RootParamList>[] = [];
      let currentNavigation = navigation;
  
      while (currentNavigation) {
        if (currentNavigation.getState().type === "tab") {
          tabNavigations.push(currentNavigation);
        }
  
        currentNavigation = currentNavigation.getParent();
      }
  
      if (tabNavigations.length === 0) {
        return;
      }
  
      const unsubscribers = tabNavigations.map((tab) => {
        return tab.addListener(
          // @ts-expect-error
          "tabPress",
          (e: EventArg<"tabPress", true>) => {
            const isFocused = navigation.isFocused();
            const isFirst =
              tabNavigations.includes(navigation) ||
              navigation.getState().routes[0].key === route.key;
            requestAnimationFrame(() => {
              if (isFocused && isFirst && !e.defaultPrevented) {
                callback();
              }
            });
          }
        );
      });
  
      return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
      };
    }, [navigation, callback, route.key]);
  }
  