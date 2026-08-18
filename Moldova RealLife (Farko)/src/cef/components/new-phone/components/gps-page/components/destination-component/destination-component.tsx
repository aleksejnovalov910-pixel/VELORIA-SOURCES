import { LangString } from "../../../../../../modules/lang";
import React, { Component } from "react";
import { GPSPages } from "../../enums/GPSPages.enum";
import { Point } from "../../interfaces/point.interface";
import "./destination-component.less";
import {CustomEvent} from "../../../../../../modules/custom.event";

export class DestinationComponent extends Component<
  {
    onPageChange: any;
    getIcon: any;
    point: Point;
  },
  { fullLocation: string; distance: number }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      fullLocation: "3517 W. Gray St. Utica, Pennsylvania 57867",
      distance: 1200,
    };
  }

  render() {
    return (
      <div className="np-gps-destination">
        <button
          className="np-gps-page-btn back"
          onClick={() => this.props.onPageChange(GPSPages.MAIN)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.625 12.5L3.125 8L7.625 3.5M3.75 8H12.875"
              stroke="#3A9FFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {LangString("components.new-phone.components.gps-page.components.destination-component.destination-component.006ab79d865986e5ece38e9542a03a01")}
        </button>
        <div className="np-gps-page-title">{LangString("components.new-phone.components.gps-page.components.destination-component.destination-component.57a35e87ec801e407f5dfa9688aa9847")}</div>
        <div className="np-gps-destination-point-wrap">
          <div className="np-gps-point-icon">
            {this.props.getIcon(this.props.point.category)}
          </div>
          <div className="np-gps-point-info">
            <div className="np-gps-point-name">{this.props.point.name}</div>
            <div className="np-gps-point-distance">
              {LangString("components.new-phone.components.gps-page.components.destination-component.destination-component.d9beab1d38d3ca6510ba1b4fe04bbd4a")} {this.props.point.distance}m
            </div>
          </div>
        </div>
        {/*<div className="np-gps-destination-location-info">*/}
        {/*  <div className="np-gps-destination-location">*/}
        {/*    {this.state.fullLocation}*/}
        {/*  </div>*/}
        {/*  <div className="np-gps-page-divider-v"></div>*/}
        {/*  <div className="np-gps-destination-location-distance">*/}
        {/*    {this.state.distance}м*/}
        {/*  </div>*/}
        {/*</div>*/}
        <button className="np-gps-page-btn blue" onClick={() => {
            this.props.onPageChange(GPSPages.DESTINATION_IS_SET)
            CustomEvent.triggerServer("phone:setGps", this.props.point.id)
        }}>{LangString("components.new-phone.components.gps-page.components.destination-component.destination-component.5ec4462c163fec7c75acbc197aaf4957")}</button>
      </div>
    );
  }
}
