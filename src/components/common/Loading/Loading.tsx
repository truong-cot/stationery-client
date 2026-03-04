"use client";

import { Fragment } from "react";
import { PropsLoading } from "./interfaces";
import styles from "./Loading.module.scss";
import Portal from "../Portal";

function Loading({ loading }: PropsLoading) {
  return (
    <Fragment>
      {loading ? (
        <Portal>
          <div className={styles.loading}>
            <span className={styles.loader}></span>
          </div>
        </Portal>
      ) : null}
    </Fragment>
  );
}

export default Loading;
