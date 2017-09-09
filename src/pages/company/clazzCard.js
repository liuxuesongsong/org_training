// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('SimpleCard', theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  text: {

  }
}));

class ClazzCard extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    tel: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    city: PropTypes.number.isRequired
  };


  render() {
    const {
      name,
      tel,
      email,
      level,
      city
    } = this.props;

    return (
      <div>
        <Card style={{ display: 'flex', }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <CardContent>
              <Typography type="name">
                {name}
              </Typography>
              <Typography type="tel" component="h2">
                {tel}
              </Typography>
              <Typography type="email">
                {email}
              </Typography>
              <Typography component="p">
                {level}<br />
                {city}
              </Typography>
            </CardContent>
          </div>
          <div>
            <CardActions>
              <Button dense>修改</Button>
            </CardActions>
          </div>
        </Card>
      </div>
    );
  }
}

export default ClazzCard;