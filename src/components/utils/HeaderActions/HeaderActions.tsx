import styles from "./HeaderActions.module.scss";
import { PropsHeaderActions } from "./interfaces";

function HeaderActions({ title, actions }: PropsHeaderActions) {
  return (
    <header className={styles.header}>
      <h4>{title}</h4>
      {actions && actions}
    </header>
  );
}

export default HeaderActions;
