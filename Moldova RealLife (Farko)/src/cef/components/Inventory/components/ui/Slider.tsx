import { createStyles, Slider, withStyles } from "@material-ui/core";

const SliderStyles = createStyles({
  colorPrimary: {
    color: "#000000",    ///#000000
  },
  root: {
    marginTop: 5,
    color: "#C4C4C4",
    height: 16,
  },
  markLabel: {
    color: "#FFFFFFaa",
    fontSize: "0.7vw",
  },
  markLabelActive: {
    color: "#FFFFFFee",
  },
  thumb: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: "#14851d",
    marginTop: -7, //-3,
    "&:focus, &:hover": {
      boxShadow: "0px 0px 30px #14851d",
    },
  },
  track: {
    backgroundColor: "#14851d",
    boxShadow: "0px 0px 3px #14851d",
  },
});

export const NewSliderStyles = withStyles(SliderStyles)(Slider); 