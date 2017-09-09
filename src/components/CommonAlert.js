import React, { Component, PropTypes } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import Lang from '../language';
import { WARNING, ALERT, NOTICE } from '../enum';

/**
 * Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
 */
export default class CommonAlert extends Component {
  static propTypes = {
    show: PropTypes.bool,
    type: React.PropTypes.oneOf([WARNING, ALERT, NOTICE]),
    code: PropTypes.number,
    content: PropTypes.string,
    args: PropTypes.object,
    action: PropTypes.array,
  };

  static defaultProps = {
    show: true,
    code: 0,
    type: 'notice',
    args: {},
    content: "",
    action: []
  }

  state = {
    open: false,
  };

  warningButtons = (handleCertainClose) => {
    return <div>
      <Button
        onClick={() => {
          handleCertainClose();
        }}
      >
        {Lang[window.Lang].pages.main.certain_button}
      </Button>
    </div>
  }

  alertButtons = (handleCertainClose, handleCancelClose) => {
    return <div>
      <Button
        onClick={handleCertainClose}
      >
        {Lang[window.Lang].pages.main.certain_button}
      </Button>
      <Button
        onClick={handleCancelClose}
      >
        {Lang[window.Lang].pages.main.cancel_button}
      </Button>
    </div>
  }

  render() {
    const {
      show,
      type,
      code,
      content,
      args,
      action
    } = this.props;


    this.state.action = [
      () => {
        console.log("123")
        this.setState({ open: false });
      },
      () => {
        this.setState({ open: false });
      }
    ];
    this.state.open = show;

    return (
      <div>
        {type === "notice" ?
          <Snackbar
            open={this.state.open}
            message={code !== 0 ? Lang[window.Lang].ErrorCode[code] : content}
            autoHideDuration={1500}
            onRequestClose={() => {
              this.setState({ open: false });
            }}
          >
          </Snackbar> :
          <Dialog open={this.state.open} onRequestClose={this.handleRequestClose}>
            <DialogTitle>
              {type === "warning" ? Lang[window.Lang].components.CommonAlert.warning : Lang[window.Lang].components.CommonAlert.notice}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {code !== 0 ? Lang[window.Lang].ErrorCode[code] : (content !== "" ? content : "")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {type === "warning" ? this.warningButtons(this.state.action[0]) : this.alertButtons(action[0], action[1])}
            </DialogActions>
          </Dialog>
        }

      </div>
    );
  }
}
