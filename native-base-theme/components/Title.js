import { Platform } from "react-native";

import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const titleTheme = {
    fontSize: variables.titleFontSize,
    fontFamily: material.fontBold,
    color: variables.titleFontColor,
    fontWeight: Platform.OS === "ios" ? "700" : undefined,
    textAlign: "center",
    paddingLeft: Platform.OS === "ios" ? 4 : 0,
    marginLeft: Platform.OS === "ios" ? undefined : -3,
    paddingTop: 1
  };

  return titleTheme;
};
