import { openDB, DBSchema } from "idb";
import { IDBPDatabase } from "idb/lib/entry";
import { TourType } from "./tour";

interface MyDB extends DBSchema {
    script: {
        value: TourType;
        key: string;
    };
}
/*export interface TourType {
    key: string;
    name: string;
    desc: string;
    code: string;
    dateCreate: string;
    dateChange: string;
}*/
async function IDB(): Promise<IDBPDatabase<MyDB>> {
    const db = await openDB<MyDB>("tours", 1, {
        upgrade(db) {
            const scriptStore = db.createObjectStore("script");
            //scriptStore.createIndex('by-price', 'price');
        }
    });
    // console.log("InitScript -> ",NewScript);
    // This works
    // await db.put("script", script, "0");
    // await db.put("script", Script, Script.name);
    /*await db.put('script', NewScript,  '2');*/

    // console.log(">>>", await db.getAll("script"));

    // This fails at compile time, as the 'favourite-number' store expects a number.
    // await db.put('script', 'Twelve', 'Jake');
    //await db.get("products", "4")

    // const script =
    //     await db.get('script', "AnyScriptName");
    // console.log("scriptDB -> ",script);
    return db;
}
export default IDB;
