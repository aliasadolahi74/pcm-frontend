import React, { Component } from "react";

class NumberOfStatistics extends Component {
  state = {
    title: "تعداد دستگاه‌های شما:",
  };
  render() {
    const { title } = this.state;
    const { count } = this.props;
    return (
      <div className="numberOfStatisticsContainer">{`${title} ${count} عدد`}</div>
    );
  }
}

export default NumberOfStatistics;
