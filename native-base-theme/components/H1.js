import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const h1Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH1,
    lineHeight: variables.lineHeightH1,
    fontFamily: material.fontBold,
  };

  return h1Theme;
};
