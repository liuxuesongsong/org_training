// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Card, { CardHeader, CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
  CARD_TYPE_COMMON, CARD_TYPE_INFO, CARD_TYPE_ENROLL, CARD_TYPE_ARRANGE, CARD_TYPE_EXAM, CARD_TYPE_UNARRANGE,
  STATUS_AGREED_UNDO, STATUS_AGREED_AGREE, STATUS_AGREED_REFUSED
} from '../../enum';
import {
  getCity
} from '../../utils/helpers';
import Lang from '../../language';

class ComCard extends Component {
  state = {
    type: "",
    status: 0,
    action: []
  }

  static propTypes = {
    // type: PropTypes.string.isRequired,
    // name: PropTypes.string.isRequired,
    // mobile: PropTypes.string.isRequired,
    // mail: PropTypes.string.isRequired,
    // level: PropTypes.number.isRequired,
    // city: PropTypes.number.isRequired,
    // action: PropTypes.array.isRequired,
    // status: PropTypes.string.isRequired,
    // identity_card:PropTypes.string.isRequired,
    // course_id:PropTypes.number.isRequired,
    // register:PropTypes.string.isRequired,
    // department:PropTypes.string.isRequired,
    // duty:PropTypes.string.isRequired,
    // wechat:PropTypes.string.isRequired
  };

  static defaultProps = {
    action: [],
    status: ""
  }

  buttonActions() {
    switch (this.state.type) {
      case CARD_TYPE_COMMON:
        return this.getStatusDescribe();
      case CARD_TYPE_INFO:
        return <CardActions>
          <Button 
            dense
            onClick={this.state.action[0]}>
            {Lang[window.Lang].pages.com.card.modify}
          </Button>
          <Button
           className="glyphicon glyphicon-trash"
            dense
            onClick={this.state.action[1]}>
          </Button>
        </CardActions>
      case CARD_TYPE_ENROLL:
        return <CardActions>
          <Button
            dense
            onClick={this.state.action[0]}>
            {Lang[window.Lang].pages.com.card.modify}
          </Button>
          <Button
            dense
            onClick={this.state.action[1]}>
            {Lang[window.Lang].pages.com.card.enroll}
          </Button>
          <Button
          
            dense
            onClick={this.state.action[2]}>
           <i className="glyphicon glyphicon-trash"></i>
          </Button>
        </CardActions>
      case CARD_TYPE_ARRANGE:
        return <CardActions>
          {this.state.status === "" ?
            <div>
              <Button
                dense
                id={"left"}
                onClick={this.state.action[0]}>
                {Lang[window.Lang].pages.com.card.agree}
              </Button>
              <br />
              <Button
                dense
                id={"right"}
                onClick={this.state.action[1]}>
                {Lang[window.Lang].pages.com.card.refuse}
              </Button>
            </div> : Lang[window.Lang].pages.com.card.status[1]}
        </CardActions>
      case CARD_TYPE_EXAM:
        return <CardActions>
          <Button
            dense
            id={"left"}
            onClick={this.state.action[0]}>
            {Lang[window.Lang].pages.com.card.retry}
          </Button>
          <Button
            dense
            id={"right"}
            onClick={this.state.action[1]}>
            {Lang[window.Lang].pages.com.card.giveup}
          </Button>
        </CardActions>
      case CARD_TYPE_UNARRANGE:
        return (
          <button
          className="nyx-card-unarrange-button"
           onClick={this.state.action[0]}>取消</button>
          
        )
      default:
        return this.getStatusDescribe();
    }
  }

  getStatusDescribe() {
    if (this.state.type === STATUS_ENROLLED) {
      if (this.state.status === STATUS_ENROLLED_REDO) {
        return <Typography type="body1">
          {"重新排队中"}
        </Typography>
      }
    }
    if (this.state.type === STATUS_AGREED) {
      if (this.state.status === STATUS_AGREED_AGREE) {
        return <Typography type="body1">
          {"已通过"}
        </Typography>
      }
    }
  }

  render() {
    const {
      type,
      name,
      mobile,
      email,
      level,
      city,
      action,
      status
    } = this.props;

    this.state.type = type;
    this.state.status = status;
    this.state.action = action;

    return (
      <div>
        <div className="nyx-card-list" style={{ display: 'flex', }}>
        <CardMedia
            style={{
              width: 0,
              height: 0
            }}
            //image="/images/live-from-space.jpg"
            title="Live from space album cover"
          />
          <div className="nyx-card">
            <div className="nyx-card-body">
              <div className="nyx-card-round-ing"></div>
              <div className="nyx-card-first-info">
              <div className={"nyx-card-name"}>
                  {name}
              </div>
              <div className={"nyx-card-key"}>
              {(level === 1 ? "中" : "高") + "级"}
              </div>
              <div style={{float:"right"}}>
              {getCity(city)}
              </div>
              </div>
              <div className="nyx-card-second-info">
              <span className={"nyx-card-key"}>
              {"电话:"}
              </span>
              <div className={"nyx-card-value"}>
              {mobile}
              </div>
              <div className={"nyx-card-key"}>
              {"邮件:"}
              </div>
              <div className={"nyx-card-value"}>
              {email}
              </div>
              </div>
              
              
            </div>
            <div className="nyx-card-action">
              {this.buttonActions()}
            </div>
          </div>
        </div>
        {/* <Card className="nyx-card-list" style={{ display: 'flex', }}>
          <CardMedia
            style={{
              width: 0,
              height: 0
            }}
            //image="/images/live-from-space.jpg"
            title="Live from space album cover"
          />
          <div className="nyx-card">
            <CardContent className={"nyx-card-body"}>
              <Typography className={"nyx-card-name"}>
                {name}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {"电话"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {mobile}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {"邮件"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {email}
              </Typography>
              <Typography className={"nyx-card-key"}>
                {""}<br />
              </Typography>
              <Typography className={"nyx-card-value nyx-card-value-sm"}>
                {(level === 1 ? "中" : "高") + "级"}
              </Typography>
              <Typography className={"nyx-card-key nyx-card-value-sm"}>
                {"城市"}
              </Typography>
              <Typography className={"nyx-card-value"}>
                {getCity(city)}
              </Typography>
            </CardContent>
            <div className="nyx-card-action">
              {this.buttonActions()}
            </div>
          </div>
        </Card> */}
      </div>
    );
  }
}

export default ComCard;

