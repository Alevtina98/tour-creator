import { TourType } from "../tour";

export interface RequestInterface {
    url: string;
    method?: string;
    data?: {};
}
export type ResponseDataType = "TourType" | "TourType[]";

export const getTourList = async (response: Response) => {
    try {
        return (await response.json()) as TourType[];
    } catch (error) {
        console.log("ОШИБКА: Не удалось получить json как TourType[] из ответа сервера ", response, error);
        return null;
    }
};
export const getTour = async (response: Response) => {
    try {
        return (await response.json()) as TourType;
    } catch (error) {
        console.log("ОШИБКА: Не удалось получить json как TourType из ответа сервера ", response, error);
        return null;
    }
};
export const getResult = async (request: RequestInterface, responseDataType?: ResponseDataType) => {
    let requestInit: RequestInit | undefined = undefined;
    request.method ? (requestInit = { method: request.method }) : null;
    request.data
        ? (requestInit = {
              ...requestInit,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(request.data)
          })
        : null;
    try {
        const response = await fetch(request.url, requestInit);
        try {
            switch (responseDataType) {
                case "TourType":
                    return await getTour(response);
                case "TourType[]":
                    return await getTourList(response);
                default:
                    return true;
            }
        } catch (error) {
            console.log("ОШИБКА: Ответ сервера содержит ошибку", error);
            return null;
        }
    } catch (error) {
        console.log("ОШИБКА: Не удалось сделать запрос на сервер", error);
        return null;
    }
};
export const getAllTours = async () => {
    const request: RequestInterface = {
        url: "http://localhost:8080/webapp_war/api/tour"
    };
    try {
        return await getResult(request, "TourType[]");
    } catch (error) {
        console.log("ОШИБКА: Не удалось получить список туров", error);
        return null;
    }
};

export const getTourById = async (id: number) => {
    const request: RequestInterface = {
        url: "http://localhost:8080/webapp_war/api/tour/" + id.toString()
    };
    try {
        return await getResult(request, "TourType");
    } catch (error) {
        console.log("ОШИБКА: Не удалось получить тур", error);
        return null;
    }
};
export const deleteTourById = async (id: number) => {
    const request: RequestInterface = {
        url: "http://localhost:8080/webapp_war/api/tour/" + id.toString(),
        method: "DELETE"
    };
    try {
        return await getResult(request);
    } catch (error) {
        console.log("ОШИБКА: Не удалось удалить тур", error);
        return null;
    }
};
export const createTour = async (tour: TourType) => {
    const request: RequestInterface = {
        url: "http://localhost:8080/webapp_war/api/tour",
        method: "POST",
        data: tour
    };
    try {
        return await getResult(request, "TourType");
    } catch (error) {
        console.log("ОШИБКА: Не удалось создать тур", error);
        return null;
    }
};
export const updateTour = async (tour: TourType) => {
    const request: RequestInterface = {
        url: "http://localhost:8080/webapp_war/api/tour",
        method: "PUT",
        data: tour
    };
    try {
        return await getResult(request, "TourType");
    } catch (error) {
        console.log("ОШИБКА: Не удалось сохранить измененный тур", error);
        return null;
    }
};
