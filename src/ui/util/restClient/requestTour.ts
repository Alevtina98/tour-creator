export interface ScriptValue {
    key: string;
    name: string | null;
    desc: string | null;
    code: string | null;
    codeJS: string | null;
    dateCreate: string;
    dateChange: string;
}
export const getInitData = (data?: Partial<ScriptValue>): ScriptValue => ({
    key: "custom-key",
    name: "custom name",
    code: "<xml/>",
    codeJS: "",
    desc: "custom description",
    dateCreate: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)",
    dateChange: "Thu Oct 24 2019 10:52:15 GMT+0300 (Москва, стандартное время)",
    ...data
});
export const getAllTours = async () => {
    const url = "http://localhost:8080/api/all_tours";
    const response = await fetch(url);
    const data = (await response.json()) as ScriptValue[];
    //console.log("DATA", data);
    return data;
};
export const getTourById = async (id: string) => {
    const url = "http://localhost:8080/api/tour/" + id;
    const response = await fetch(url);
    const data = (await response.json()) as ScriptValue;
    //console.log("DATA", data);
    return data;
};
