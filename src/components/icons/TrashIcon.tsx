import React from "react";
import { Icon, IconProps } from "./index";

export const TrashIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <polyline points="3,6 5,6 21,6"></polyline>
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </Icon>
  );
};
