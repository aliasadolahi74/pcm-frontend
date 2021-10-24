import React, { Component } from "react";
import { DatePicker } from "jalali-react-datepicker";
import { authData } from "../services/authServices";
import "../services/httpServices";
import config from "../config.json";

class Print extends Component {
  state = {
    filterStartDate: "",
    filterEndDate: "",
  };
  render() {
    return (
      <React.Fragment>
        <section className="mb-5">
          <div className="section-header">
            <h1 className="section-title">پرینت گزارش</h1>
          </div>
        </section>
        <section>
          <form
            onSubmit={this.handleSubmit}
            className="d-flex flex-column w-25 px-4 align-items-center"
          >
            <div className="mb-3">
              <DatePicker
                onClickSubmitButton={this.handleOnStartDateClick}
                label="از تاریخ: "
                className="align-self-center"
                timePicker={false}
              />
            </div>

            <div className="mb-3">
              <DatePicker
                onClickSubmitButton={this.handleOnEndDateClick}
                label="تا تاریخ: "
                timePicker={false}
              />
            </div>

            <button
              type="submit"
              onClick={this.handleSubmit}
              className="btn btn-primary mt-2 w-50"
            >
              دریافت و پرینت
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { filterStartDate, filterEndDate } = this.state;
    const deviceID = this.props.match.params.deviceID;
    window.open(
      `${config.apiBaseURL}/print-report.php?token=${authData.token}&deviceID=${deviceID}&username=${authData.username}&startDatetime=${filterStartDate}&endDatetime=${filterEndDate}`
    );
  };

  handleOnStartDateClick = ({ value }) => {
    const filterStartDate = Date.parse(value["_i"].slice(0, -3) + "T00:00:00");
    this.setState({ filterStartDate });
  };
  handleOnEndDateClick = ({ value }) => {
    const filterEndDate = Date.parse(value["_i"].slice(0, -3) + "T23:59:59");
    this.setState({ filterEndDate });
  };
}

export default Print;
