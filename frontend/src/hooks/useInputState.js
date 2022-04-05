import { useCallback, useState } from "react";

const useInputState = ({ defValue = '' }) => {
  const [value, setValue] = useState(defValue);

  const onChangeText = useCallback(({ target }) => {
    setValue(target.value);
  }, []);

  return [value, onChangeText];
};

export { useInputState }
