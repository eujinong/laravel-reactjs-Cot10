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
  }

  render() {
    const {
      items, archive, group
    } = this.props;

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="text-center" >Seq</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Group</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Entry Title</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Votes</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Total Votes</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Entry ID</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Text Number</Table.HeaderCell>
            <Table.HeaderCell className="text-center">Member ID</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            items && items.length > 0 && (
              items.map((item, index) => (
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
      </Table>
    );
  }
}

export default ParticipantTable;