// import * as d3 from 'd3';
function day1shape1() {
  const svgday1 = d3.select('#day-1-svg-1');
  const rect = svgday1.append('rect');
  rect
    .style('fill', 'black') // rect's fill color
    .attr('height', 20) // rect's height (in pixels)
    .attr('width', 20) // rect's width (in pixels)
    .attr('x', 10) // x position of the top-left corner
    .attr('y', 10); // y position of the top-left corner
  return svgday1;
}
day1shape1();
//sample rect, very basic

function day1shape2() {
  const svg = d3.select('#day-1-svg-2');
  const rects = svg.selectAll('rect');

  // Define the data that we will bind to our rectangles
  // each element in the array will become a new rect
  const data = [0, 1, 2, 3, 4];

  rects
    // The data join - the big moment!
    // When we do this, we tell D3 to include
    // 5 additional rects in our selection, one for each element in our data array
    .data(data)
    // Now we append the rects just like before.
    // Unlike before, when we append, we're actually
    // appending all 5 rects at once
    .join('rect')
    // ...and when we set style and attributes, we're setting them
    // for all 5 rects at once, too
    .style('fill', 'black')
    .attr('height', 20)
    .attr('width', 20)
    .attr('y', 10)
    // This positions each new rect 10 pixels to the right
    // of the last rect. We'll explain what's going on here on day 3
    .attr('x', (d, i) => {
      return 10 + i * 30;
    });

  return svg;
}
day1shape2();

function day2pt1() {
  // A scale to set y values
  const ySliderScale = d3.scaleLinear().domain([0, 140]).range([10, 130]);
  // A scale to set x values
  // Ordinal scales require domain and range values to match 1:1 to work as expected
  const xSliderScale = d3
    .scaleOrdinal()
    .domain([0, 1, 2, 3, 4])
    .range([10, 40, 70, 100, 130]);

  // A scale to set colors
  const colorSliderScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range(['#eee', 'steelblue']);

  function updateY(val) {
    rect.attr('y', ySliderScale(val));
  }
  function updateX(val) {
    rect.attr('x', xSliderScale(val));
  }
  function updateColor(val) {
    rect.style('fill', colorSliderScale(val));
  }

  d3.select('#yslider').on('input', function () {
    updateY(+this.value);
    console.log(`new y value is ${this.value}`);
  });

  d3.select('#xslider').on('input', function () {
    updateX(+this.value);
    console.log(`new x value is ${this.value}`);
  });

  d3.select('#colorslider').on('input', function () {
    updateColor(+this.value);
    console.log(`new color value is ${this.value}`);
  });

  const svg = d3.select('#day-2-svg-1');

  const rect = svg
    .append('rect')
    .attr('width', 20)
    .attr('height', 20)
    // Set the x value based on the slider value (passed into the x scale)
    .attr('x', xSliderScale(2))
    // // Same for y/y scale!
    .attr('y', ySliderScale(70))
    // // Same for color/color scale!
    .style('fill', colorSliderScale(50));

  return svg;
}
day2pt1();

function day2pt2() {
  const svgHTML = d3.select('#day-2-svg-2');
  const data = [0, 1, 2, 3, 4];
  const maxHeight = 140;

  // Set the x positions of our rects (ordinal)
  // The domain is our data because the data values
  // will be passed to the scale when we draw
  const xScale = d3.scaleOrdinal().domain(data).range([10, 40, 70, 100, 130]);

  // The domain is the minimum value of our data
  // to the maximum value of our data (continuous)
  const yScale = d3.scaleLinear().domain([0, 4]).range([10, maxHeight]);

  // Color will be set based on the value of our data
  // It's convenient to use a linear scale so we don't
  // have to define all of the colors in between by hand
  const colorScale = d3
    .scaleLinear()
    .domain([0, 4])
    .range(['#eee', 'steelblue']);

  const rect = svgHTML
    .selectAll('rect')
    // data bind
    .data(data)
    // append all 5 rects
    .join('rect')
    .attr('width', 20)
    .attr('y', 10)
    // pass in the bound data value to the scales
    // with an accessor function
    // so that we can set the value based on the scale
    .attr('x', (d) => xScale(d))
    .attr('height', (d) => yScale(d))
    .style('fill', (d) => colorScale(d));

  return svgHTML;
}
day2pt2();
