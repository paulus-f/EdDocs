// /app/javascript/components/AdminDashboard/jquery.canvasjs.min.js
// /app/javascript/components/AdminDashboard/canvasjs.min.js
import React from 'react';
import axios from 'axios'
import CanvasJSReact from '../AdminDashboard/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class Reports extends React.Component {	
  constructor(props) {
    super(props);
    this.state = {
      count_limited: 0,
      count_medication: 0,
      amount_student: 0,
      count_full_completed_form: 0,
      count_allergies: 0
    }
  }

  getPercent = (amount, total) => {
    return (amount/total)*100
  }

  componentDidMount(){
    axios.get('/reports', {
      params: {
        foundation_id: this.props.foundationId
      }
    })
      .then( res => {
        console.log(res.data)
          this.setState({
          count_limited: Number(res.data.count_limited),
          count_medication: Number(res.data.count_medication),
          amount_student: Number(res.data.amount_student),
          count_full_completed_form: Number(res.data.count_full_completed_form),
          count_allergies: Number(res.data.count_allergies),
        })
      })
  }
  
	render() {
    const {count_allergies, count_full_completed_form, count_limited, count_medication, amount_student} = this.state
    
    const ac = (count_allergies/amount_student)*100

    const allergyOption = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1",
			title:{
				text: "Allergy"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
				dataPoints: [
					{ y: ac, label: "have allergy" },
					{ y: 100-ac, label: "have\'t allergy" }
				]
			}]
    }

    const mc = (count_medication/amount_student)*100

    const medicationOption = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1",
      title:{
        text: "Medication"
      },
      data: [{
        type: "pie",
        indexLabel: "{label}: {y}%",		
        startAngle: -90,
        dataPoints: [
          { y: mc, label: "have medication" },
          { y: 100-mc, label: "have\'t medication" }
        ]
      }]
    }
      
    const lc = (count_limited/amount_student)*100
    
    const limitedOption = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1",
			title:{
				text: "Limiting"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
				dataPoints: [
					{ y: lc, label: "have limiting" },
					{ y: 100-lc, label: "have\'t limiting" }
				]
			}]
    }
    
    const fcf = (count_full_completed_form/amount_student)*100

    const amountFullForm = {
			animationEnabled: true,
			title: {
				text: "Enrollment"
			},
			subtitles: [{
				text: fcf + "% Full Enrollment",
				verticalAlign: "center",
				fontSize: 16,
				dockInsidePlotArea: true
			}],
			data: [{
				type: "doughnut",
				showInLegend: true,
				indexLabel: "{name}: {y}",
				yValueFormatString: "#,###'%'",
				dataPoints: [
					{ name: "Completed Form", y: fcf },
					{ name: "Not Completed Form", y: 100-fcf },
				]
			}]
		}

		return (
		<div style={{
            marginLeft: 90,
            marginTop: 10
    }}>
			<CanvasJSChart options = {amountFullForm}/>
      <CanvasJSChart options = {limitedOption}/>
      <CanvasJSChart options = {medicationOption}/>
      <CanvasJSChart options = {allergyOption}/>
		</div>
		);
	}
}

export default Reports
