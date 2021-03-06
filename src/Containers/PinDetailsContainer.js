import React from 'react';
import { connect } from 'react-redux'
import SearchResultsCard from '../Components/SearchResultsCard'
import PinDetailsCard from '../Components/PinDetailsCard'

//material UI style imports
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: 4,
  },
  gridList: {
    display: 'flex',
    width: 375,
    height: '85vh',
    textAlign:'left',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  avatar: {
    display: 'flex',
    width: 40,
    height: 40
  },
  chip: {
    margin: theme.spacing.unit,
    backgroundColor: 'white',
    textColor: 'black',
  },
});

class PinDetailsContainer extends React.Component{

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper
          zdepth={3}
          elevation={1}
          square={true}>
          <div className={classes.root} >
            <GridList
              cellHeight={180}
              className={classes.gridList}>
              {this.props.currentList ? <SearchResultsCard /> : <PinDetailsCard />}
            </GridList>
          </div>
        </Paper>
      </div>
    );
    }
}

PinDetailsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    currentMarker: state.currentMarker,
    currentList: state.currentList
  }
}

export default withStyles(styles)(connect(mapStateToProps)(PinDetailsContainer));
