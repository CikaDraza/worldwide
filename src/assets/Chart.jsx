import React, { useEffect, useRef } from 'react'
export default function Chart(props) {
  const { valuesWti, valuesBrent, id } = props;
  const refSVG = useRef();

  const dataPointsWti = valuesWti?.slice(0, 4).map(item => ({
    period: item.period,
    value: item.value
  }));

  const dataPointsBrent = !valuesBrent ? [] : valuesBrent?.slice(0, 4).map(item => ({
    period: item.period,
    value: item.value
  }));

  function convertDateToXBrent(dateString) {
    const date = new Date(dateString);
    const startDate = new Date(dataPointsBrent[0]?.period);
    const endDate = new Date(dataPointsBrent[2]?.period);
    const numDivisions = 3; // Number of divisions
  
    // Calculate the division width
    const divisionWidth = (endDate - startDate) / numDivisions;
  
    // Calculate the division point based on the date
    let divisionPoint = 0;
    
    for (let i = 1; i <= numDivisions; i++) {
      const divisionDate = new Date(startDate.getTime() + (i * divisionWidth));
  
      if (date <= divisionDate) {
        divisionPoint = (i - 1) * (svgWidth / numDivisions);
        break;
      }
    }
  
    return divisionPoint;
  }
  
  function convertValueToYBrent(value) {
    const valueRange = [-15, 105]; // Updated range of values to include negative values
    const yRange = [svgHeight, 0]; // Range of y-coordinates
  
    // Calculate the y-coordinate
    const yCoordinate = ((value - valueRange[0]) / (valueRange[1] - valueRange[0])) * (yRange[1] - yRange[0]);
  
    return yCoordinate;
  }
  
  useEffect(() => {
    const svgElement = refSVG.current;
    const numDivisions = 4; // Number of divisions
    const divisionPoints = Array.from({ length: numDivisions }, (_, i) => (i) * (svgWidth / (numDivisions - 1)));
    // Create SVG circles based on data points
    dataPointsWti && dataPointsWti?.forEach((dataPoint, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.style.cursor = 'pointer'
      circle.setAttribute('cx', divisionPoints[dataPointsWti?.length - 1 - i]);
      circle.setAttribute('cy', dataPointsWti && dataPointsWti[dataPointsWti?.length - 1 - i]?.value);
      circle.setAttribute('r', 8);
      circle.setAttribute('stroke', '#66C7DC');
      circle.setAttribute('fill', '#252525');
      // Add the circle to your SVG container
      svgElement.appendChild(circle);
      circle.addEventListener('mouseover', (e) => {
        const tooltip = document.getElementById('tooltip-wti');
        const date = tooltip.getElementsByClassName('date')
        date[0].innerHTML = dataPoint.period;
        const values = tooltip.getElementsByClassName('value')
        values[0].innerHTML = '$' + dataPoint?.value
        tooltip.classList.remove('hidden')
      })
      circle.addEventListener('mouseleave', (e) => {
        const tooltip = document.getElementById('tooltip-wti');
        tooltip.classList.add('hidden')
      })
    });
    dataPointsBrent && dataPointsBrent?.forEach((dataPoint, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.style.cursor = 'pointer'
      svgElement.style.position = 'relative'
      circle.setAttribute('cx', divisionPoints[dataPointsBrent?.length - 1 - i]);
      circle.setAttribute('cy', dataPointsBrent && dataPointsBrent[dataPointsBrent?.length - 1 - i].value);
      circle.setAttribute('r', 8);
      circle.setAttribute('stroke', '#66C7DC');
      circle.setAttribute('fill', '#252525');
      // Add the circle to your SVG container
      svgElement.appendChild(circle);
      circle.addEventListener('mouseover', (e) => {
        const tooltip = document.getElementById('tooltip-brent');
        const date = tooltip.getElementsByClassName('date')
        date[0].innerHTML = dataPoint.period;
        const values = tooltip.getElementsByClassName('value')
        values[0].innerHTML = '$' + dataPointsBrent[i]?.value
        tooltip.classList.remove('hidden')
      })
      circle.addEventListener('mouseleave', (e) => {
        const tooltip = document.getElementById('tooltip-brent');
        tooltip.classList.add('hidden')
      })
    });

  }, [])


  const svgWidth = 360; // Width of your SVG
  const svgHeight = 265; // Height of your SVG
  
  const numDivisions = 3; // Number of divisions
    const divisionPoints = Array.from({ length: numDivisions }, (_, i) => (i + 1) * (svgWidth / numDivisions));

  return (
    <>
    <div id='tooltip-brent' className='bg-white p-2 w-40 h-16 absolute -mt-20 hidden'>
      <p className='date'></p>
      <p className='value'></p>
    </div>
    <div id='tooltip-wti' className='bg-white p-2 w-40 h-16 absolute right-40 -mt-20 hidden'>
      <p className='date'></p>
      <p className='value'></p>
    </div>
    <svg id={`${id}`} ref={refSVG} width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="1" y1="2.25338" x2="361" y2="2.25338" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="40.0912" x2="361" y2="40.0912" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="77.9291" x2="361" y2="77.9291" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="115.767" x2="361" y2="115.767" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="153.605" x2="361" y2="153.605" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="191.443" x2="361" y2="191.443" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="229.28" x2="361" y2="229.28" stroke="#59609D" strokeWidth="0.25"/>
    <line x1="1" y1="267.118" x2="361" y2="267.118" stroke="#59609D" strokeWidth="0.25"/>
    {
      id === 'wti' ?
      <>
        <path d={`M0 ${dataPointsWti[3].value} L${divisionPoints[0]} ${dataPointsWti[2].value} L${divisionPoints[1]} ${dataPointsWti[1].value} L${divisionPoints[2]} ${dataPointsWti[0].value} 1 999999H`} fill="url(#paint0_linear_5_21)"/>
        <path d={`M0 ${dataPointsWti[3].value} L${divisionPoints[0]} ${dataPointsWti[2].value} L${divisionPoints[1]} ${dataPointsWti[1].value} L${divisionPoints[2]} ${dataPointsWti[0].value}`}  stroke="#66C7DC" stroke-width="2"/>
      </>
      :
      <>
        <path d={`M0 ${dataPointsBrent[3].value} L${divisionPoints[0]} ${dataPointsBrent[2].value} L${divisionPoints[1]} ${dataPointsBrent[1].value} L${divisionPoints[2]} ${dataPointsBrent[0].value} 1 999999H`} fill="url(#paint0_linear_5_21)"/>
        <path d={`M0 ${dataPointsBrent[3].value} L${divisionPoints[0]} ${dataPointsBrent[2].value} L${divisionPoints[1]} ${dataPointsBrent[1].value} L${divisionPoints[2]} ${dataPointsBrent[0].value}`}  stroke="#66C7DC" stroke-width="2"/>
      </>
    }
    <defs>
    <linearGradient id="paint0_linear_5_21" x1="0" y1="-92.8877" x2="162.367" y2="269.371" gradientUnits="userSpaceOnUse">
    <stop stopColor="#66C7DC" stopOpacity="0.5"/>
    <stop offset="1" stopColor="#66C7DC" stopOpacity="0"/>
    </linearGradient>
    </defs>
    </svg>
    </>
  )
}
