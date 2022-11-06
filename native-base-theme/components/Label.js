import variable from "./../variables/platform";
import material from '@theme/variables/material';

export default (variables = variable) => {
  const labelTheme = {
    ".focused": {
      width: 0
    },
    fontSize: 17,
    fontFamily: material.fontFamily,
    fontWeight: '100'
  };

  return labelTheme;
};
