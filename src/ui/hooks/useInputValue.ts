import { useControlledInputValue } from "./useControleInputValue"

export const useInputValue = (initialState: string = "") => {
    const value = useControlledInputValue(initialState);

    return {
        value: value.value,
        onChange: value.onChange
    };
};