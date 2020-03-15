import React from "react"
import  PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

const styles = theme => ({
    childForm: {
        marginBottom: 50,
    },
    fieldset: {
        width: '100%',
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});


class ChildForm extends React.Component {

    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.addToList = this.addToList.bind(this);
        this.state = {
            emergency: this.props.emergency,
            questionnaire: this.props.questionnaire,
            general_info: this.props.general_info,
            allery: this.props.general_info,
            signature: this.props.signature,
            parent_contact: this.props.parent_contact,
            child: this.props.child,
            open: {
                'General Info': false,
                'Parent contact': false,
                'Questionnaire': false,
                'Allergy': false
            }
        }
    }

    handleClose = (key) => {
        this.setState(prevState => ({
            open: {...prevState.open, [key]: false }
        }));
    };

    handleClickOpen(key) {
        console.log(key);
        this.setState(prevState => ({
            open: {...prevState.open, [key]: true }
        }));
    };


    addToList = (data) => {
        console.log(data);
        let result = [];
        if (typeof(data) !== 'undefined') {
            for (let key of Object.keys(data)) {
                if (
                    key != 'created_at' &&
                    key != 'updated_at' &&
                    key != 'profile_id' &&
                    key != 'id'
                )
                    result.push(
                        <ListItem className="mb-1" key={key}>
                            {key.replace('_', ' ')}: {data[key]}
                        </ListItem>
                    )
            }
            if (result.length)
                return result;
        }
        result.push(
            <ListItem>
                Not found
            </ListItem>
        );
        return result;
    }

    render() {
        const { classes } = this.props;
        const { emergency, allergy, parent_contact, questionnaire, general_info, open } = this.state;
        const data = [];
        const infoArray = {
            'General Info': general_info,
            'Parent contact': parent_contact,
            'Questionnaire': questionnaire,
            'Allergy': allergy
        };
        console.log(this.state);
        for (let key of Object.keys(infoArray))
        {
            let keyName = String(key);
            let openKey = open[key];
            data.push(
                <div key={key} className="d-flex justify-content-center">
                    <Button className="mt-4 mb-4" variant="outlined" color="primary" onClick={(keyName) => this.handleClickOpen(key)}>
                        {key}
                    </Button>
                    <Dialog open={openKey} onClose={(keyName) => this.handleClose(key)} aria-labelledby="simple-dialog-title">
                        <DialogTitle className="font-weight-bold text-uppercase text-center">{key}</DialogTitle>
                        <div className="d-flex justify-content-center">
                            <List>
                                {this.addToList(infoArray[key])}
                            </List>
                        </div>
                    </Dialog>
                </div>
            )
        }
        return (
            <div class="container" >
                {data}
                <div className='d-flex justify-content-center'>
                    <img style={{marginTop: '50px', width: '200px'}} src={this.state.signature}/>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(ChildForm);