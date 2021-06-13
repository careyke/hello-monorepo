/**
 * 弹性盒子
 */
import React, { FC, CSSProperties, Ref } from "react";
import FlexBoxClass from "./FlexBox.module.less";
import classnames from "classnames";

type FlexProps = {
  flexDirection: CSSProperties["flexDirection"];
  flexGrow?: CSSProperties["flexGrow"];
  flexShrink?: CSSProperties["flexShrink"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexWrap?: CSSProperties["flexWrap"];
};

export type FlexBoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  FlexProps &
  InnerRef<Ref<HTMLDivElement>>;

type FlexAttrKey = keyof FlexProps;

const FlexBox: FC<FlexBoxProps> = (props) => {
  const {
    children,
    style,
    className = "",
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    alignItems,
    justifyContent,
    innerRef,
    ...others
  } = props;
  const flexObject = {
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    alignItems,
    justifyContent,
  };
  const flexClass = classnames({
    [FlexBoxClass.flexbox]: true,
    [className]: !!className,
  });
  const getStyle = () => {
    const flexStyle: CommonObject = {};
    Object.keys(flexObject).forEach((key) => {
      if (flexObject[key as FlexAttrKey] !== undefined) {
        flexStyle[key] = flexObject[key as FlexAttrKey];
      }
    });
    return { ...flexStyle, ...style };
  };

  return (
    <div ref={innerRef} className={flexClass} style={getStyle()} {...others}>
      {children}
    </div>
  );
};

export default FlexBox;
