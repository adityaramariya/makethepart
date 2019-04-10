import React, { Component } from 'react';

class ErrorPage extends Component {
  constructor(props) {
    super(props);

    this.navigateToHomePage = this.navigateToHomePage.bind(this);
  }

  navigateToHomePage() {
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="background">

        <svg className="clouds cloud1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="512" height="512" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xmlSpace="preserve">
          <path id="cloud-icon" d="M406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 -36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63z" />
        </svg>
        <svg className="clouds cloud2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="512" height="512" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xmlSpace="preserve">
          <path id="cloud-icon" d="M406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 -36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63z" />
        </svg>
        <svg className="clouds cloud3" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="512" height="512" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xmlSpace="preserve">
          <path id="cloud-icon" d="M406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 -36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63z" />
        </svg>
        <svg className="clouds cloud4" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="512" height="512" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xmlSpace="preserve">
          <path id="cloud-icon" d="M406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 -36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63z" />
        </svg>

        <div className="wrapper">
          {/* <!-- ---------------  Text  --------------- --> */}
          <div className="errorPage">
            <h1 className="slide-in-top">Oops!</h1>
            <h3 className="slide-in-left">404</h3>
            <h4 className="slide-in-left2">Wrong address.<br />You're pretty far south.</h4>
          </div>

          {/* <!-- --------------   Penguin   ---------------- --> */}
          <div className="penguinContainer" onClick={this.navigateToHomePage}>

            <div className="penguinWrap">
              <div className="penguin">
                <div className="bodyForm1"></div>
                <div className="bodyForm2"></div>
                <div className="leftWing"></div>
                <div className="rightWing"></div>
                <div className="abdomen1"></div>
                <div className="abdomen2"></div>
                <div className="beak1"></div>
                <div className="beak2"></div>
                <div className="eyes">
                  <div id="eye1_1"></div>
                  <div id="eye2_1"></div>
                  <div id="eye1_4"></div>
                  <div id="eye2_4"></div>
                </div>
                <div className="leg1_1"></div>
                <div className="leg1_2"></div>
                <div className="leg2_1"></div>
                <div className="leg2_2"></div>
              </div>

              <span className="bubble">Homepage maybe?</span>
            </div>
          </div>
        </div>

      </div >
    );
  }
}

export default ErrorPage;
