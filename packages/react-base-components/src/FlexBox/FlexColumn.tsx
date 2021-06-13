/**
 * 列布局flexbox
 * by hermanke
 */
import React, { FC } from "react";
import FlexBox, { FlexBoxProps } from "./FlexBox";

type FlexColumnProps = Omit<FlexBoxProps, "flexDirection">;

export const FlexColumn: FC<FlexColumnProps> = (props) => {
  const { children, ...others } = props;
  return (
    <FlexBox {...others} flexDirection="column">
      {children}
    </FlexBox>
  );
};
