/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { Component } from 'react';
import {
  Table,
} from 'semantic-ui-react';

import _ from 'lodash';

class ParticipantTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column: null,
      data: [],
      direction: null,
    }
  }

  componentDidMount() {
    const { items } = this.props;
    this.setState({
      data: items
    });
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

  render() {
    const {
      archive, group
    } = this.props;

    const {
      column,
      direction,
      data
    } = this.state;

    return (
      <Table sortable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center">Seq</Table.HeaderCell>
            <Table.HeaderCell className="text-center">New Seq</Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'title' ? direction : null}
              onClick={this.handleSort.bind(this, 'title')}
            >
              Entry Title
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'round_votes' ? direction : null}
              onClick={this.handleSort.bind(this, 'round_votes')}
            >
              Votes
            </Table.HeaderCell>
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'all_votes' ? direction : null}
              onClick={this.handleSort.bind(this, 'all_votes')}
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
            <Table.HeaderCell
              className="text-center"
              sorted={column === 'id' ? direction : null}
              onClick={this.handleSort.bind(this, 'id')}
            >
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
                  disabled={parseInt(item.all_votes) > archive ? false : true}
                  key={index}
                >
                  <Table.Cell className="text-center">
                    {("000" + (index + 1)).slice(-4)}
                  </Table.Cell>
                  <Table.Cell className="text-center">
                    {
                      parseInt(item.all_votes) > archive && group > 0 && (
                        ("000" + ((index - index % group) / group + 1)).slice(-4)
                      )
                    }
                  </Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell className="text-center">{parseInt(item.round_votes)}</Table.Cell>
                  <Table.Cell className="text-center">{parseInt(item.all_votes)}</Table.Cell>
                  <Table.Cell className="text-center">{item.entry}</Table.Cell>
                  <Table.Cell className="text-center">{item.number}</Table.Cell>
                  <Table.Cell className="text-center">{parseInt(item.id)}</Table.Cell>
                  <Table.Cell className="text-center">
                    <a className="detail-link">Warning</a>
                    <a className="detail-link">Delete</a>
                  </Table.Cell>
                </Table.Row>
              ))
            )
          }
        </Table.Body>
      </Table>
    );
  }
}

export default ParticipantTable;