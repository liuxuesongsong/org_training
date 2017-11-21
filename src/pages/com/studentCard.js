// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardActions, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
  CARD_TYPE_COMMON,
  CARD_TYPE_INFO,
  CARD_TYPE_FK,
  CARD_TYPE_ENROLL,
  CARD_TYPE_ARRANGE,
  CARD_TYPE_EXAM,
  CARD_TYPE_UNARRANGE,
  CARD_TYPE_KNOW,
  STATUS_AGREED_AGREE,
} from '../../enum';
import { getCity, getCourse, getInst } from '../../utils/helpers';
import Lang from '../../language';

class ComCard extends Component {
  static propTypes = {
    action: PropTypes.array,
    city: PropTypes.number.isRequired,
    // email: PropTypes.string,
    level: PropTypes.number.isRequired,
    // mobile: PropTypes.string,
    // name: PropTypes.string,
    // status: PropTypes.string,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    action: [],
    status: '',
  };

  state = {
    type: '',
    status: 0
  };

  buttonActions() {
    switch (this.state.type) {
      case CARD_TYPE_COMMON:
        return this.getStatusDescribe();
      case CARD_TYPE_INFO:
        return (
          <CardActions>
            <Button dense onClick={this.props.action[0]}>
              {Lang[window.Lang].pages.com.card.modify}
            </Button>
            <Button className="glyphicon glyphicon-trash" dense onClick={this.props.action[1]} />
          </CardActions>
        );
      case CARD_TYPE_FK:
        return (
          <CardActions style={{ height: '1.5rem' }}>
     
          {this.props.email==""||this.props.mobile==""||this.props.duty==""||this.props.department==""?<span>信息不完整</span>:""}
          
            <br />
            <button className="nyx-card-enrroll-button" onClick={this.props.action[1]}>
              <i className="glyphicon glyphicon-ok" /> {Lang[window.Lang].pages.com.card.enroll}
            </button>
            <br />
            <br />
            <button className="nyx-card-enrroll-button" onClick={this.props.action[0]}>
              <i className="glyphicon glyphicon-pencil " /> {"修改"}
            </button>

            <br />
            <i className="glyphicon glyphicon-trash nyx-card-enrroll-button-sm" onClick={this.props.action[2]} />
          </CardActions>
        );
      case CARD_TYPE_ENROLL:
        return (
          <CardActions style={{ height: '1.5rem' }}>
            <br />
            <button className="nyx-card-enrroll-button" onClick={this.props.action[1]}>
              <i className="glyphicon glyphicon-ok" /> {Lang[window.Lang].pages.com.card.enroll}
            </button>
            <br />
            <button className="nyx-card-enrroll-button" onClick={this.props.action[0]}>
              <i className="glyphicon glyphicon-pencil " /> {"修改"}
            </button>
            <br />
            <i className="glyphicon glyphicon-trash nyx-card-enrroll-button-sm" onClick={this.props.action[2]} />
          </CardActions>
        );
      case CARD_TYPE_ARRANGE:
        return (
          <CardActions style={{ height: '1.5rem' }}>
            {/* {this.state.status === '' ?
              (
                <button className="nyx-card-button" onClick={this.props.action[0]}>
                  已收到
                    </button>
              ) :
              (Lang[window.Lang].pages.com.card.status[1])
            } */}
          </CardActions>
        );
      case CARD_TYPE_KNOW:
        return (
          <CardActions style={{ height: '1.5rem' }}>
            {/* {this.state.status === '' ?
              (
                <div>
                  已通知
                      </div>
              ) :
              (Lang[window.Lang].pages.com.card.status[1])
            } */}
          </CardActions>
        );
      case CARD_TYPE_EXAM:
        return (
          <CardActions>
            <div>
              <button className="nyx-card-button" onClick={this.props.action[0]}>
                {Lang[window.Lang].pages.com.card.retry}
              </button>
              <button className="nyx-card-button" onClick={this.props.action[1]}>
                {Lang[window.Lang].pages.com.card.giveup}
              </button>
            </div>
          </CardActions>
        );
      case CARD_TYPE_UNARRANGE:
        return (
          <button className="nyx-card-unarrange-button" onClick={this.props.action[0]}>
            取消
          </button>
        );
      default:
        return this.getStatusDescribe();
    }
  }

  getStatusDescribe() {
    if (this.state.type === STATUS_ENROLLED) {
      if (this.state.status === STATUS_ENROLLED_REDO) {
        return <Typography type="body1">{'重新排队中'}</Typography>;
      }
    }
    if (this.state.type === STATUS_AGREED) {
      if (this.state.status === STATUS_AGREED_AGREE) {
        return <Typography type="body1">{'已通过'}</Typography>;
      }
    }
  }

  render() {
    const { type, name,department,duty, mobile, email, level, city, action, status, institution } = this.props;

    this.state.type = type;
    this.state.status = status;
    this.state.action = action;
   // console.log(institution);
    return (
      <div>
        <div className="nyx-card-list" style={{ display: 'flex' }}>
          <CardMedia
            style={{
              width: 0,
              height: 0,
            }}
            // image="/images/live-from-space.jpg"
            title="Live from space album cover"
          />
          <div className="nyx-card">
            <div className="nyx-card-body">
              <div className="nyx-card-round-ing" />
              <div className="nyx-card-first-info">
                <div className={'nyx-card-name'}>{name}</div>
                <div className={'nyx-card-name-lg'}>{getCourse(level)}</div>
                <div className={'nyx-card-name'}>{getCity(city)}</div>
              </div>
              <div className="nyx-card-second-info">
                <div className={'nyx-card-value'}>{mobile}</div>
                <div className={'nyx-card-value'}>{email}</div>
                {institution !== 0 ? <div className={'nyx-card-value'}>{getInst(institution)}</div> : null}
              </div>
            </div>
            <div className="nyx-card-action">{this.buttonActions()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ComCard;
