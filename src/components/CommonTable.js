import React, { Component, PropTypes } from 'react';
import ReactDataGrid from 'angon_react_data_grid';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import { Row } from 'react-data-grid';

class CommonTable extends Component {

    static propTypes = {
        table: PropTypes.object.isRequired,
        // columns: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
        handleGridSort: PropTypes.func.isRequired,
        rowGetter: PropTypes.func.isRequired,
        onRowClick: PropTypes.func.isRequired,
        renderColor: PropTypes.func.isRequired,
        maxHeight: PropTypes.number.isRequired

    };

    static defaultProps = {
        table: {},
        data: [],
        handleGridSort: (sortColumn, sortDirection) => { },
        rowGetter: (i) => { },
        onRowClick: (rowIdx, row) => { },
        renderColor: (idx) => { return "black" },
        maxHeight: 330
    };

    state = {
        columns: [],
    }

    RowRenderer = (renderColor) => {
        return {
            propTypes: {
                idx: React.PropTypes.number.isRequired
            },

            setScrollLeft(scrollBy) {
                // if you want freeze columns to work, you need to make sure you implement this as apass through
                this.refs.row.setScrollLeft(scrollBy);
            },

            getRowStyle() {
                return {
                    color: this.getRowBackground(),
                };
            },

            getRowBackground() {
                return renderColor(this.props.idx);
            },

            render: function () {
                // here we are just changing the style
                // but we could replace this with anything we liked, cards, images, etc
                // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
                return (<div style={this.getRowStyle()}><Row ref="row" {...this.props} /></div>);
            }
        }
    }

    getLayout(tableWidth) {
        if (tableWidth > 960) {
            return "lg"
        } else if (tableWidth > 600) {
            return "md"
        } else if (tableWidth <= 600) {
            return "sm"
        }
    }

    componentDidMount() {
        var tableWidth = document.getElementsByClassName('react-grid-Container')[0].offsetWidth;
        var layout = this.getLayout(tableWidth);
        const {
            table,
            data,
            handleGridSort,
            rowGetter,
            onRowClick,
            renderColor,
            maxHeight
        } = this.props;
        var columns = []
        for (var key in table) {
            columns.push(
                {
                    key: key,
                    name: table[key].name !== undefined ? table[key].name : table[key],
                    width: table[key].width !== undefined ? (layout === "lg" ? tableWidth * table[key].width / 48
                        : table[key].width * 20) : 100,
                    resizable: table[key].resizable !== undefined ? table[key].resizable : true,
                    sortable: table[key]['sortable'] !== undefined ? table[key]['sortable'] : true,
                }
            )
        }
        this.setState({
            columns: columns
        })
    }
    render() {
        const {
            table,
            data,
            handleGridSort,
            rowGetter,
            onRowClick,
            renderColor,
            maxHeight
        } = this.props;

        return (
            <div>
                <ReactDataGrid
                    id={'table'}
                    onGridSort={handleGridSort}
                    columns={this.state.columns}
                    rowGetter={rowGetter}
                    onRowClick={onRowClick}
                    rowsCount={data.length}
                    rowSelection={{
                        showCheckbox: false,
                        selectBy: {
                            isSelectedKey: 'isSelected'
                        }
                    }}
                    rowRenderer={React.createClass(this.RowRenderer(renderColor))}
                    onGridKeyDown={(e) => {
                        if (e.ctrlKey && e.keyCode === 65) {
                            e.preventDefault();

                            let rows = [];
                            this.state.data.forEach((r) => {
                                rows.push(Object.assign({}, r, { isSelected: true }));
                            });

                            this.setState({ rows });
                        }
                    }}
                    rowHeight={30}
                    minHeight={maxHeight} />
            </div>
        );
    }
}

export default withWidth()(CommonTable);
