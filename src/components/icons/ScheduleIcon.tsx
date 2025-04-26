import React from "react";
import { Icon, IconProps } from "./index";

export const ScheduleIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);
