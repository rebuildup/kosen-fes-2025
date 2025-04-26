import React from "react";
import { Icon, IconProps } from "./index";

export const SponsorIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1" />
    <polyline points="16 8 12 12 8 8" />
    <path d="M12 3v9" />
    <path d="M8 16h8" />
  </Icon>
);
