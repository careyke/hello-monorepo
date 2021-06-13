/**
 * 行布局flexbox
 * by hermanke
 */
import React, { FC } from "react";
import FlexBox, { FlexBoxProps } from "./FlexBox";

type FlexRowProps = Omit<FlexBoxProps, "flexDirection">;

export const FlexRow: FC<FlexRowProps> = (props) => {
  const { children, ...others } = props;
  return (
    <FlexBox {...others} flexDirection="row">
      {children}
    </FlexBox>
  );
};
