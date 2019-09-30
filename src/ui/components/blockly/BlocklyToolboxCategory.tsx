import React from "react";

import BlocklyToolboxBlock from "./BlocklyToolboxBlock";

export interface BlocklyToolboxCategoryProps {
    blocks: any[];
    categories: any[];
}

class BlocklyToolboxCategory extends React.PureComponent<BlocklyToolboxCategoryProps> {
    static defaultProps = {
        name: null,
        custom: null,
        colour: null,
        expanded: null,
        categories: null,
        blocks: null,
    };

    static renderCategory = (category: any, key: any) => {
        if (category.get("type") === "sep") {
            console.log("SEP", category);
            return <div key={key} />;
        } else if (category.get("type") === "search") {
            console.log("CATEGORY", category);
            return <div key={key} />;
        }
        return (
            <BlocklyToolboxCategory
                name={category.get("name")}
                custom={category.get("custom")}
                colour={category.get("colour")}
                expanded={category.get("expanded")}
                key={key}
                blocks={category.get("blocks")}
                categories={category.get("categories")}
            />
        );
    };

    render = () => {
        const subcategories = (this.props.categories || []).map(BlocklyToolboxCategory.renderCategory);
        const blocks = (this.props.blocks || []).map(BlocklyToolboxBlock.renderBlock);

        //  name={this.props.name} custom={this.props.custom} colour={this.props.colour} expanded={this.props.expanded}
        return (
            <div>
                {blocks}
                {subcategories}
            </div>
        );
    };
}

export default BlocklyToolboxCategory;
