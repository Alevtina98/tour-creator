import {format} from "date-fns";

export interface TourType {
    id: number;
    desc: string | null;
    code: string | null;
    dateCreate: string;
    dateChange: string;
    codeJS: string | null;
    name: string | null;
}
export const getInitData = (data?: Partial<TourType>): TourType => ({
    id: 0,
    name: "custom name",
    code: "<xml/>",
    codeJS: "",
    desc: "custom description",
    dateCreate: "",
    dateChange: "",
    ...data
});
export const getDateClientFormat = (str: string) => {
    const dateClientFormat: string = format(getDate(str), "dd-MM-yyyy в HH:mm:ss");
    return dateClientFormat;
};
export const getDate = (str: string) => {
    //const dateServer = new Date.UTC(str)
    return new Date(str);
};

export const getAllTours = async () => {
    const url = "http://localhost:8080/api/tour";
    const response = await fetch(url);
    const data = (await response.json()) as TourType[];
    //console.log("DATA", data);
    return data;
};
export const getTourById = async (id: string) => {
    const url = "http://localhost:8080/api/tour/" + id;
    const response = await fetch(url);
    const data = (await response.json()) as TourType;
    //console.log("DATA", data);
    return data;
};
export const deleteTourById = async (id: string) => {
    const url = "http://localhost:8080/api/tour/" + id;
    const response = await fetch(url, { method: "DELETE" });
    const data = response.ok;
    console.log("DATA", data);
    return data;
};
export const createTour = async (tour: TourType) => {
    const url = "http://localhost:8080/api/tour";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tour)
    });
    const data = (await response.json()) as TourType;
    console.log("Cозданный тур >>", data);
    //const data: boolean = response.ok;
    return data;
};
export const updateTour = async (tour: TourType) => {
    const url = "http://localhost:8080/api/tour";
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tour)
    });
    const data = (await response.json()) as TourType;
    console.log("Измененный тур >>", data);
    return data;
};