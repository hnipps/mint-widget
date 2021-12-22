// 1. Import the extendTheme function
import {
  extendTheme as chakraExtendTheme,
} from "@chakra-ui/react";
import { Dict } from "./context/AppConfigContext";

const extendTheme = (theme: Dict | ((theme: Dict) => Dict)) => {
  const global = {};

  const newTheme = chakraExtendTheme(theme);

  newTheme.styles.global = global;
  return newTheme;
};

export default extendTheme;
