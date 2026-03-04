import { useStyleClass } from "~/hooks/useStyleClass";
import styles from "./FlexLayout.module.scss";
import { PropsFlexLayout } from "./interfaces";
import clsx from "clsx";

function FlexLayout({ children, ...props }: PropsFlexLayout) {
  const styleClass = useStyleClass(props, styles);

  return <div className={clsx(styleClass, styles.flex_layout)}>{children}</div>;
}

export default FlexLayout;
