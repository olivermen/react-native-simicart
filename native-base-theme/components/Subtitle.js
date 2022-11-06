import { Platform } from "react-native";

import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const subtitleTheme = {
    fontSize: variables.subTitleFontSize,
    fontFamily: material.fontFamily,
    color: variables.subtitleColor,
    textAlign: "center",
    paddingLeft: Platform.OS === "ios" ? 4 : 0,
    marginLeft: Platform.OS === "ios" ? undefined : -3
  };

  return subtitleTheme;
};
