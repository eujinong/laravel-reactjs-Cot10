/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import {
  Table,
  Pagination,
  Menu
} from 'semantic-ui-react';
import Select from 'react-select';

import _ from 'lodash';

class ParticipantTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      data: [],
      direction: null,
      activePage: 1,
      per_page: 10,
      current_perPage: { label: 10, value: 10 },
      pageOptions: [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 }
      ],
      code: []
    };

    this.handleChangePerPage = this.handleChangePerPage.bind(this);
  }

  componentDidMount() {
    if (this.props.items.length > 0) {
      this.setState({
        activePage: 1
      });
    }
    const { items } = this.props;
    const { per_page } = this.state;
    this.setState({
      data: items.slice(0, per_page)
    });
  }

  componentWillReceiveProps(props) {
    const { items } = props;
    
    if (this.props.items !== items) {
      if (props.items.length > 0) {
        this.setState({
          activePage: 1
        });
      }
      const { per_page } = this.state;
      this.setState({
        data: items.slice(0, per_page)
      });
    }
  }

  handlePaginationChange(e, { activePage }) {
    const { items } = this.props;
    const { per_page } = this.state;
    if (activePage !== 1) {
      this.setState({
        activePage,
        data: items.slice(((activePage - 1) * per_page), activePage * per_page)
      });
    } else {
      this.setState({
        activePage,
        data: items.slice(0, per_page)
      });
    }
  }

  handleSort(clickedColumn) {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending'
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    });
  }

  handleChangePerPage(page_num) {
    const { items } = this.props;
    this.setState({
      activePage: 1,
      current_perPage: page_num,
      per_page: page_num.value,
      data: items.slice(0, page_num.value)
    });
  }

  render() {
    const {
      items
    } = this.props;

    const {
      column,
      direction,
      data,
      activePage,
      per_page,
      pageOptions,
      current_perPage
    } = this.state;

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              className="text-center"
            >
              Seq
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
            >
              Group
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'title' ? direction : null}
              onClick={this.handleSort.bind(this, 'title')}
            >
              Entry Title
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'votes' ? direction : null}
              onClick={this.handleSort.bind(this, 'votes')}
            >
              Votes
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 't_votes' ? direction : null}
              onClick={this.handleSort.bind(this, 't_votes')}
            >
              Total Votes
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'entry' ? direction : null}
              onClick={this.handleSort.bind(this, 'entry')}
            >
              Entry ID
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'number' ? direction : null}
              onClick={this.handleSort.bind(this, 'number')}
            >
              Text Number
            </Table.HeaderCell>
            <Table.HeaderCell className="text-center">
              Member ID
            </Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            data && data.length > 0 && (
              data.map((item, index) => (
                <Table.Row
                  key={index}
                >
                  <Table.Cell className="text-center">{index + 1}</Table.Cell>
                  <Table.Cell className="text-center"></Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell className="text-center">{item.round_votes}</Table.Cell>
                  <Table.Cell className="text-center">{item.all_votes}</Table.Cell>
                  <Table.Cell className="text-center">{item.entry}</Table.Cell>
                  <Table.Cell className="text-center">{item.number}</Table.Cell>
                  <Table.Cell className="text-center">{item.id}</Table.Cell>
                  <Table.Cell className="text-center">
                    <a className="detail-link">Warning</a>
                    <a className="detail-link">Delete</a>
                  </Table.Cell>
                </Table.Row>
              ))
            )
          }
        </Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="1">
              <Select
                name="pageOption"
                menuPlacement="auto"
                classNamePrefix="react-select"
                placeholder="Per Page"
                defaultValue={pageOptions[0]}
                value={current_perPage}
                options={pageOptions}
                getOptionValue={option => option.label}
                getOptionLabel={option => option.value}
                onChange={(num) => {
                  this.handleChangePerPage(num);
                }}
              />
            </Table.HeaderCell>
            <Table.HeaderCell colSpan="8">
              <Menu floated="right" pagination>
                <Pagination
                  activePage={activePage}
                  onPageChange={this.handlePaginationChange.bind(this)}
                  totalPages={Math.ceil(items.length / per_page)}
                />
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

ParticipantTable.defaultProps = {
  onSelectAll: () => {},
  onSelect: () => {},
  onAdd: () => {}
};

export default ParticipantTable;