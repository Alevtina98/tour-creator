declare module "react-blockly-component";
declare var Blockly: any;
declare module "react-overlay";
declare module "node-blockly";
declare module "google-blockly";
declare module "react-immutable-proptypes" {
    interface ImmutablePropTypes {
        listOf: any;
        mapOf: any;
        orderedMapOf: any;
        setOf: any;
        orderedSetOf: any;
        stackOf: any;
        iterableOf: any;
        recordOf: any;
        shape: any;
        contains: any;
        mapContains: any;
        // Primitive Types
        list: any;
        map: any;
        orderedMap: any;
        set: any;
        orderedSet: any;
        stack: any;
        seq: any;
        record: any;
        iterable: any;
    }

    export default ImmutablePropTypes
}

//declare module "xmldom";