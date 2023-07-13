import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      // eslint-disable-next-line react/destructuring-assignment
      chartData: this.props.chartData,
      // eslint-disable-next-line react/destructuring-assignment
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <Chart
        // eslint-disable-next-line react/destructuring-assignment
        options={this.state.chartOptions}
        // eslint-disable-next-line react/destructuring-assignment
        series={this.state.chartData}
        type="bar"
        width="100%"
        height="100%"
      />
    );
  }
}

export default ColumnChart;
