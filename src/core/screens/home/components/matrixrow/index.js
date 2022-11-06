import React from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import Row from './row';
import md5 from 'md5';

class MatrixRow extends React.Component {
    constructor(props) {
        super(props);
        this.matrixListRows = [];
        this.matrixItems = [];
        this.home_data = this.props.data;
        this.generateMatrixListItems();
    }

    generateMatrixListItems = () => {
        this.matrixListRows = [];
        let matrixMap = {};
        let homeCategories = this.home_data.home.homecategories.homecategories;
        for (let index in homeCategories) {
            let homeCate = homeCategories[index];
            if (!matrixMap[homeCate.matrix_row]) {
                matrixMap[homeCate.matrix_row] = [];
            }
            matrixMap[homeCate.matrix_row].push(homeCate);
        }
        let homeProductList = this.home_data.home.homeproductlists.homeproductlists;
        for (let index in homeProductList) {
            let homeProducts = homeProductList[index];
            if (!matrixMap[homeProducts.matrix_row]) {
                matrixMap[homeProducts.matrix_row] = [];
            }
            matrixMap[homeProducts.matrix_row].push(homeProducts);
        }

        for (let key in matrixMap) {
            this.matrixListRows.splice(key, 0, matrixMap[key]);
        }
    }
    renderMatrixItem = (item) => {
        return (<Row items={item} />);
    }
    render() {
        return (
            <FlatList
                data={this.matrixListRows}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => md5(index)}
                renderItem={({ item }) =>
                    this.renderMatrixItem(item)
                } />
        )

    }

}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(MatrixRow);
//export default MatrixRow;
