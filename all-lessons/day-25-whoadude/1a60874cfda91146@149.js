// https://observablehq.com/@thetylerwolf/day-25-whoadude@149
function _1(md){return(
md`
# Day 25 - #whoadude

If you've been following along for all 25 days, congratulations! You're on solid ground to start using D3 like a pro.

Today's example is about having fun. We can get caught up in our work, but it's important to remember to take some time and enjoy what you're doing.

Happy Holidays!

-Tyler
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _data(width,gapSize,height,d3,n)
{
  
  const noiseFactor = 0.4
  
  const xCount = Math.floor( width / gapSize ),
        yCount = Math.floor( height / gapSize ),
        numPoints = xCount * yCount
  
  const d = d3.range(numPoints).map((i) => {

    const xVal = i % xCount,
          x = xVal * gapSize,
          yVal = Math.floor( i / xCount ),
          y = yVal * gapSize,
          value = n.perlin2( x/(width * noiseFactor ) , y/(height * noiseFactor ))

    return { x, xVal, y, yVal }

  })
  
  return d
}


async function* _chart(d3,width,height,data,gapSize,n,color,Promises)
{
  
  let offset = 0,
      noiseFactor = 0.05
  
  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
  
  const svg = d3.create('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', '#1a1a1a')
  
  svg.selectAll('g')
    .data( data )
    .join('g')
      .attr('transform', d => `translate(${ margin.left + d.x },${ margin.top + d.y })`)
    .call(g => g
      .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .style('stroke', 'black')
        .style('stroke-width', 3)
        .style('stroke-linecap', 'round')
    )
  
  while(true) {
    
    svg.selectAll('line')
        .attr('x2', d => gapSize * Math.sin( 2 * Math.PI * n.perlin2(d.xVal * noiseFactor + offset, d.yVal * noiseFactor + offset) ))
        .attr('y2', d => gapSize * Math.cos( 2 * Math.PI * n.perlin2(d.xVal * noiseFactor + offset, d.yVal * noiseFactor + offset) ))
        .style('stroke', d => color(n.perlin2(d.xVal * noiseFactor + offset, d.yVal * noiseFactor + offset)))

    offset += 0.01
    
    yield svg.node()
    await Promises.tick(1000/30)
    
  }
}


function _5(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media** and **click like on this page** (top right corner). You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _gapSize(){return(
20
)}

function _color(d3){return(
d3.interpolateRainbow
)}

function _width(){return(
960
)}

function _height(){return(
500
)}

function _n(noise){return(
new noise.Noise(Math.random())
)}

function _noise(require){return(
require('https://bundle.run/noisejs@2.1.0')
)}

function _d3(require){return(
require('d3@6')
)}

function _end()
{
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id='+atob('Ry1ZSk5YRDNIUlAx');
  script.type = 'text/javascript';
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      var dataLayer = window.dataLayer;
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', atob('Ry1ZSk5YRDNIUlAx'));
  };
  document.body.appendChild(script);
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("data")).define("data", ["width","gapSize","height","d3","n"], _data);
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","gapSize","n","color","Promises"], _chart);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("gapSize")).define("gapSize", _gapSize);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("n")).define("n", ["noise"], _n);
  main.variable(observer("noise")).define("noise", ["require"], _noise);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
