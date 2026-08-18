import React, { Component } from "react";

interface IntroProps {
  accept(): void;
  licenseName: string

}


class Intro extends Component<IntroProps> {
  render() {
    return (
      <div className="driving-school-content-box validate" >
        <div className="driving-school-top">
          <div className="driving-school-title">
            <div className="driving-school-title-img">
              <h1>{this.props.licenseName}</h1>
            </div>
          </div>

        </div>
        <p>Sunteti gata sa incepeti examenul? Daca ati invatat, apasati incepe teoria!</p>

        <button
          type="button"
          onClick={() => this.props.accept()}
        >
          Incepe teoria
        </button>
      </div>
    );
  }
}

export default Intro;
