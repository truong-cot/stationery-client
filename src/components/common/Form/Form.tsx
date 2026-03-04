import React, { useCallback, useMemo, useState } from "react";

import { PropsForm } from "./interfaces";
import { ContextForm } from "./contexts";

function Form<T extends Record<string, any>>({
  form,
  setForm,
  onSubmit,
  heightFull = false,
  children,
}: PropsForm<T>) {
  const convertForm = Object.fromEntries(
    Object.entries(form).map(([key]) => [key, null])
  ) as Record<keyof T, string | null>;

  const [countValidate, setCountValidate] = useState<number>(0);
  const [errorText, setErrorText] =
    useState<Record<keyof T, string | null>>(convertForm);
  const [validate, setValidate] = useState<Record<keyof T, boolean> | null>(
    null
  );

  const isDone = useMemo(() => {
    if (!validate) {
      return false;
    }

    for (let i in validate) {
      if (!validate[i]) {
        return false;
      }
    }

    return true;
  }, [validate]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isDone) {
        onSubmit && onSubmit();
      } else {
        setCountValidate(countValidate + 1);
      }
    },
    [countValidate, isDone, onSubmit]
  );

  return (
    <ContextForm.Provider
      value={{
        form,
        setForm,
        errorText,
        setErrorText,
        setValidate,
        countValidate,
        setCountValidate,
        isDone,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ height: heightFull ? "100%" : "auto" }}
      >
        {children}
      </form>
    </ContextForm.Provider>
  );
}

export default Form;
