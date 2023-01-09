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

function day3() {
  const data = [
    { name: 'a', value: 1 },
    { name: 'b', value: 2 },
    { name: 'c', value: 3 },
    { name: 'd', value: 5 },
    { name: 'e', value: 8 },
  ];
  const svg = d3.select('#day-3-svg');

  const circles = svg.selectAll('circle').data(data);

  circles
    .enter()
    .append('circle')
    // set the circles' radius
    .attr('r', (d) => d.value * 10)
    // set the circles' x position
    .attr('cx', (d) => d.value * 10)
    // set the circles' y position
    .attr('cy', 80)
    .attr('fill', 'transparent')
    .attr('stroke', 'steelblue');

  const text = svg.selectAll('text').data(data);

  text
    .enter()
    .append('text')
    .attr('x', (d) => d.value * 10 * 2)
    .attr('y', 80)
    // This is a "magic number" in svg. It makes sure the text is vertically centered
    .attr('dy', '0.35em')
    // set from which direction the text expands
    .attr('text-anchor', 'end')
    // set the actual text
    .text((d) => d.name);

  return svg;
}
day3();

function day4pt1() {
  const svg = d3.select('#day-4-1');

  const data = [
    { name: 'Group 1', value: 1 },
    { name: 'Group 2', value: 2 },
    { name: 'Group 3', value: 3 },
  ];

  const fib = [0, 1, 2, 3, 5, 8];

  const groups = svg
    .selectAll('g')
    .data(data)
    .join('g')
    // translate each group to the right based on its index
    .attr('transform', (d, i) => 'translate(' + 100 * i + ',0)');

  groups
    .selectAll('rect')
    .data(fib)
    .join('rect')
    .attr('x', 10)
    .attr('y', 30)
    .attr('width', (d) => d * 10)
    .attr('height', (d) => d * 10)
    .style('fill', 'transparent')
    .style('stroke', '#ff7b57')
    .style('stroke-width', 2);

  groups
    .append('text')
    .attr('x', 10)
    .attr('y', 20)
    .attr('dy', '0.35em')
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
    .text((d) => d.name);

  return svg;
}
day4pt1();

function day5() {
  const data = [
    { year: 2005, value: 734.69 },
    { year: 2006, value: 750.7 },
    { year: 2007, value: 755.13 },
    { year: 2008, value: 694.19 },
    { year: 2009, value: 681.83 },
    { year: 2010, value: 718.98 },
    { year: 2011, value: 740.57 },
    { year: 2012, value: 752.24 },
    { year: 2013, value: 767.24 },
    { year: 2014, value: 802.45 },
    { year: 2015, value: 805.65 },
    { year: 2016, value: 935.58 },
    { year: 2017, value: 967.13 },
    { year: 2018, value: 1007.24 },
  ];
  let height = 250;
  let width = 450;
  let margin = { top: 10, right: 10, bottom: 20, left: 35 };
  let yMax = d3.max(data, (d) => d.value);
  let xDomain = data.map((d) => d.year);
  let xScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([margin.left, width - margin.right - margin.left])
    .padding(0.5);

  let yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([height - margin.bottom, margin.top]);

  let xAxis = d3.axisBottom().scale(xScale);
  // .tickSizeOuter(5);

  let yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

  const container = d3.select('#day5');

  container
    .append('g')
    .attr('class', 'bars')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.value))
    // bandwidth is a special function of scaleBand
    // it returns the width of the band (bar) based on the configuration
    // we set up earlier
    .attr('width', xScale.bandwidth())
    // remember that yScale(0) is the height of the entire chart
    // so we subtract the y position of the top of the bar yScale(d.value)
    // from it to get the total height of the bar.
    .attr('height', (d) => yScale(0) - yScale(d.value))
    .style('fill', '#7472c0');

  // Here we render the x axis
  container
    .append('g')
    // .attr('class', 'x-axis')
    // First set its container's (g) position to the
    // bottom of the chart
    .attr('transform', `translate(0,${height - margin.bottom})`)
    // then just call this to render it
    .call(xAxis);

  // it works the same for the y axis
  container
    .append('g')
    // .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis);

  return container;
}
day5();

function day6() {
  const USData = [
    { type: 'Poultry', value: 48.9954 },
    { type: 'Beef', value: 25.9887 },
    { type: 'Pig', value: 22.9373 },
    { type: 'Sheep', value: 0.4869 },
  ];
  const height = 500;
  const width = 900;
  const colors = ['#976393', '#685489', '#43457f', '#ff9b83'];
  const colorScale = d3.scaleOrdinal(
    USData.map((d) => d.type),
    colors
  );

  const arc = d3
    .arc()
    // After some trial-and-error, half (0.5) of the full radius gives a nice appearance
    // To see a pie chart, just change this to zero
    .innerRadius((0.5 * height) / 2)
    // Outer radius is less than the full radius because our labels will sit outside of the donut
    .outerRadius((0.85 * height) / 2);

  const pie = d3
    .pie()
    // An accessor to tell the pie where to find the data values
    .value((d) => d.value);

  const labelArcs = d3
    .arc()
    .innerRadius((0.95 * height) / 2)
    .outerRadius((0.95 * height) / 2);

  const pieArcs = pie(USData);

  const svg = d3.select('#day6');

  // Append our donut container group
  svg
    .append('g')
    .attr('class', 'donut-container')

    // The donut arcs will be centered around this point
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .selectAll('path')

    // Our data is the arcs, rather than the data object
    // so that we have access to the arc data for rendering the paths
    .data(pieArcs)
    .join('path')
    .style('stroke', 'white')
    .style('stroke-width', 2)
    .style('fill', (d) => colorScale(d.data.type))
    // here we pass the arc generator. Remember, an accessor function
    // receives the data (d) as the first argument, so rather than doing (d) => arc(d)
    // we can just pass it like below. In this case, our data is the arc descriptor object
    // so the d attribute will be set to the arc's path string. Take a minute to let that sink in
    .attr('d', arc);

  // The labels container will need the same setup because it uses an arc, as well
  const text = svg
    .append('g')
    .attr('class', 'labels-container')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .selectAll('text')
    // We use the data arcs so we have access to the label data
    .data(pieArcs)
    .join('text')
    // We use the label arcs here to get their centroid
    // a centroid is the center point of a shape (in this case the arc)
    // remember that our label arc has the same inner and outer radius
    // so the arc is centered just outside the radius of our donut.
    // Refer back to the labelArcs setup and think about that for a minute!
    .attr('transform', (d) => `translate(${labelArcs.centroid(d)})`)
    .attr('text-anchor', 'middle');

  // This section explained below
  text
    .selectAll('tspan')
    // 1
    .data((d) => [d.data.type, d.data.value.toFixed(1) + ' kg'])
    // 2
    .join('tspan')
    .attr('x', 0)
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
    .style('font-weight', (d, i) => (i ? undefined : 'bold'))
    .style('fill', '#222')
    //3
    .attr('dy', (d, i) => (i ? '1.2em' : 0))
    .text((d) => d);

  return svg;
}
day6();

async function day7() {
  const allData = await d3
    .csv('data/big-mac-raw-index@1.csv')
    .map(({ date, name, dollar_price, iso_a3 }) => ({
      name,
      iso: iso_a3,
      date: new Date(date),
      price: dollar_price,
    }));
  const data = [
    allData.filter(({ iso }) => iso === 'USA'),
    allData.filter(({ iso }) => iso === 'SWE'),
    allData.filter(({ iso }) => iso === 'CHN'),
    allData.filter(({ iso }) => iso === 'EUZ'),
  ];
  const width = 900;
  const height = 500;
  const margin = {
    top: 10,
    right: 80,
    bottom: 30,
    left: 35,
  };
  const countryNames = data.map((d) => d[0].name);
  const colors = d3.scaleOrdinal(countryNames, d3.schemeCategory10);
  const startDate = data[0][0].date;
  const endDate = data[0][data[0].length - 1].date;
  const xScale = d3.scaleTime(
    // domain
    [startDate, endDate],
    // range
    [margin.left, width - margin.right]
  );
  const yMax = 8;
  const yScale = d3.scaleLinear(
    [1, yMax],
    [height - margin.bottom, margin.top]
  );
  const formatter = d3.format('$.2f');
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => formatter(d));
  const xAxis = d3.axisBottom(xScale);
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.price))
    .curve(d3.curveNatural);
  const svg = d3
    .select('#day7')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('class', 'big-mac-line')
    // Using our line generator here
    .attr('d', line)
    // Every data point in the array has a name key
    // so we just grab the one from d[0]
    .style('stroke', (d) => colors(d[0].name))
    .style('stroke-width', 2)
    .style('fill', 'transparent');

  // This places the labels to the right of each line
  d3.select(svg)
    .selectAll('text.label')
    .data(data)
    .join('text')
    .attr('class', 'label')
    // place the ticks to the right of the chart
    .attr('x', width - margin.right + 5)
    // Place the ticks at the same y position as
    // the last y value of the line (remember, d is our array of points)
    .attr(
      'y',
      (d) => yScale(d[d.length - 1].price) + (d[0].name === 'Sweden' ? -10 : 0)
    )
    .attr('dy', '0.35em')
    .style('fill', (d) => colors(d[0].name))
    .style('font-family', 'sans-serif')
    .style('font-size', 12)
    .text((d) => d[0].name);

  d3.select(svg)
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  d3.select(svg)
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis)
    // This removes the vertical line on the axis between the ticks and the rest of the chart.
    // Purely an aesthetic choice
    .selectAll('.domain')
    .remove();

  return svg;
}
day7();
//note still troubleshooting day 7 and hoping to move on through all 25 days!
