import useWindowWidth from "~/hooks/useWindowWidth";
import styles from "./WrapperFormPostion.module.scss";
import { PropsWrapperFormPostion } from "./interfaces";
import FlexLayout from "~/components/layout/FlexLayout";
import FlexItem from "~/components/layout/FlexLayout/FlexItem";

function WrapperFormPostion({
  width,
  title,
  actions,
  nodes,
  children,
}: PropsWrapperFormPostion) {
  const widthWindow = useWindowWidth({ debounceMs: 100 });

  return (
    <div
      style={{ width: widthWindow <= width ? "100vw" : `${width}px` }}
      className={styles.wrapper_form_postion}
    >
      <FlexLayout column gap-12>
        <div className={styles.top}>
          <div className={styles.head}>
            <h4 className={styles.title}>{title}</h4>
            {nodes && <div className={styles.nodes}>{nodes}</div>}
          </div>
          {actions && actions}
        </div>
        <FlexItem flex-1 overflow-x>
          {children}
        </FlexItem>
      </FlexLayout>
    </div>
  );
}

export default WrapperFormPostion;
