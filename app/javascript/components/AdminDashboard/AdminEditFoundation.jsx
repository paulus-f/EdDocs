import React from 'react';
import FoundationEdit from '../FoundationEditForm'
import PanelManagers from './PanelManagers'

class AdminEditFoundation extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div>
        <PanelManagers  foundation = {this.props.foundation}/>
        <FoundationEdit foundation={this.props.foundation}/>
      </div>
    );
  }
}

export default AdminEditFoundation
