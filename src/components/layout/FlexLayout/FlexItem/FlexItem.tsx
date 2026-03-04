import { useStyleClass } from "~/hooks/useStyleClass";
import styles from "./FlexItem.module.scss";
import { PropsFlexItem } from "./interfaces";
import clsx from "clsx";

function FlexItem({ children, ...props }: PropsFlexItem) {
  const styleClass = useStyleClass(props, styles);

  return <div className={clsx(styleClass, styles.flex_item)}>{children}</div>;
}

export default FlexItem;
