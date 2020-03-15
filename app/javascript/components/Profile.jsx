import React from "react";
import Paper from '@material-ui/core/Paper';
import Foundation from './FoundationShow'

function Parent(props)
{
    return <li className="nav-item">
        Email: {props.email}
    </li>;
}



class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            foundation: this.props.foundation,
            parent: this.props.parent,
            ava: this.props.ava
        }
    }

    render() {
        console.log(this.state);
        let parent, foundation;
        if (this.state.user.role == 'student' && (typeof(this.state.foundation) !== 'undefined')) {
            foundation = <Foundation
                current_user={this.state.current_user}
                foundation={this.state.foundation}/>
        }
        if (this.state.user.role == 'student' && (typeof(this.state.parent) !== 'undefined')) {
            parent = <Parent email={this.state.parent.email} />
        }
        return (
            <div className="row">
                <Paper className="col-8 mx-auto">
                    <div className="row p-3">
                        <div className="mb-3 mw-100 h-auto col-lg-6 col-md-7 col-sm-8 col-12">
                            <img width="auto" className="mw-100 h-auto" src={ this.state.ava } />
                        </div>
                        <ul className="nav mt-5 justify-content-start col-lg-5 col-md-4 col-sm-3 col-12">
                            <li className="nav-item font-weight-bold font-italic">
                                Email: {this.state.user.name}
                            </li>
                            { parent }
                        </ul>
                    </div>
                    {foundation}
                </Paper>
            </div>
        )
    }
}

Profile.defaultProps = {
    ava: 'http://ib.tsu.ru/wp-content/uploads/2017/10/no-ava-300x300.png'
}

export default Profile;