/* eslint-disable react/no-array-index-key */

import React, {createRef} from 'react';
import { is } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';


import BlocklyToolboxCategory from './BlocklyToolboxCategory';
import BlocklyToolboxBlock from './BlocklyToolboxBlock';
export interface BlocklyToolboxProps{
  categories: ImmutablePropTypes["list"];
  blocks: ImmutablePropTypes["list"];
  processCategory: any;
  didUpdate: any;
}

class BlocklyToolbox extends React.Component <BlocklyToolboxProps> {
  // rootNode: any = null;
  rootNode = createRef();
  static defaultProps = {
    categories: null,
    blocks: null,
    processCategory: null,
    didUpdate: null,
  };

  componentDidMount = () => {
    this.props.didUpdate();
  };

  shouldComponentUpdate = (nextProps: any) => !(
    is(nextProps.categories, this.props.categories) && is(nextProps.blocks, this.props.blocks)
  );

  componentDidUpdate = () => {
    this.props.didUpdate();
  };


  getRootNode = () => this.rootNode.current;

  processCategory = (category: any) => {
    let processedCategory = category;

    if (processedCategory.has('categories')) {
      processedCategory = category.update('categories', (subcategories: any) => subcategories.map(this.processCategory));
    }

    if (this.props.processCategory) {
      return this.props.processCategory(processedCategory);
    }

    return processedCategory;
  };

  renderCategories = (categories: any[]) => categories.map((category, i) => {
    if (category.get('type') === 'sep') {
      return <sep key={`sep_${i}`} />;
    } else if (category.get('type') === 'search') {
      return <search key={`search_${i}`} />;
    }
    return (<BlocklyToolboxCategory
      name={category.get('name')}
      custom={category.get('custom')}
      colour={category.get('colour')}
      expanded={category.get('expanded')}
      key={`category_${category.get('name')}_${i}`}
      blocks={category.get('blocks')}
      categories={category.get('categories')}
    />);
  });

  render = () => {
    if (this.props.categories) {
      return (
        <xml style={{ display: 'none' }} ref={this.rootNode}>
          {this.renderCategories(this.props.categories.map(this.processCategory))}
        </xml>
      );
    }
    return (
      <xml style={{ display: 'none' }} ref={this.rootNode}>
        {this.props.blocks.map(BlocklyToolboxBlock.renderBlock)}
      </xml>
    );
  }
}

export default BlocklyToolbox;
