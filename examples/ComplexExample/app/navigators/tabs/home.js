import { StackNavigator } from "react-navigation";

import Home from "../../components/card/home";
import Detail from "../../components/card/detail";

const options = {};

export default StackNavigator(
  {
    Home: { screen: Home },
    Detail: { screen: Detail }
  },
  options
);
