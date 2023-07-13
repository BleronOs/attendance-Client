import React from 'react';
import ReactApexChart from 'react-apexcharts';

class PieChart extends React.Component {
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
      <ReactApexChart
        // eslint-disable-next-line react/destructuring-assignment
        options={this.state.chartOptions}
        // eslint-disable-next-line react/destructuring-assignment
        series={this.state.chartData}
        type="pie"
        width="100%"
        height="55%"
      />
    );
  }
}

export default PieChart;
