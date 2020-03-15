// /app/javascript/components/AdminDashboard/jquery.canvasjs.min.js
// /app/javascript/components/AdminDashboard/canvasjs.min.js
import React from 'react';
import axios from 'axios'
import CanvasJSReact from './canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class Statistics extends React.Component {	
  constructor(props) {
    super(props);
    this.state = {
      schools: [],
      universities: [],
      colleges: [],
      kindergartens: []
    }
  }

  getPercent = (amount, total) => {
    return (amount/total)*100
  }

  componentDidMount(){
    axios.get('/list_foundations')
      .then( res => {
          this.setState({
          schools: this.state.schools.concat(res.data.schools),
          universities: this.state.universities.concat(res.data.universities),
          colleges: this.state.colleges.concat(res.data.colleges),
          kindergartens: this.state.kindergartens.concat(res.data.kindergartens),
        })
      })
  }
  
	render() {
    const {schools, universities, colleges, kindergartens} = this.state
    var foundationsLength = schools.length + colleges.length + kindergartens.length + universities.length
    const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1",
			title:{
				text: "Foundations"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
				dataPoints: [
					{ y: this.getPercent(schools.length,foundationsLength), label: "Schools" },
					{ y: this.getPercent(colleges.length,foundationsLength), label: "College" },
					{ y: this.getPercent(kindergartens.length,foundationsLength), label: "Kindergarten" },
					{ y: this.getPercent(universities.length,foundationsLength), label: "University" },
				]
			}]
		}
		return (
		<div style={{
            marginLeft: 90,
            marginTop: 10
    }}>
			<CanvasJSChart options = {options}/>
		</div>
		);
	}
}

export default Statistics
