import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: material.fontFamily,
    color: variables.textColor,
    textAlign: 'left',
    ".note": {
      color: "#a7a7a7",
      fontSize: variables.noteFontSize
    }
  };

  return textTheme;
};
