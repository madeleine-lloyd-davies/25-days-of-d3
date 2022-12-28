// https://observablehq.com/@thetylerwolf/day-19-interpolators@146
function _1(md){return(
md`
# Day 19 - Interpolators

Interpolators are largely invisible in D3, but if you look for them, they show up just about everywhere.
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(md){return(
md `
# Interpolators

At its most basic, an interpolator is like a linear scale with a domain of \`\`[0,1]\`\` and a range that you set yourself:
`
)}

function _4(md){return(
md `interpolator input (100 increments)`
)}

function _interpolatorValue1(html){return(
html`<input type=range min=0 max=100>`
)}

function _6(d3,interpolatorValue1){return(
d3.interpolate(0, 17)(interpolatorValue1/100)
)}

function _7(md){return(
md `
\`\`d3.interpolate()\`\` can interpolate between a lot of different types of values:
`
)}

function _8(d3,interpolatorValue1){return(
d3.interpolate('red', 'blue')(interpolatorValue1/100)
)}

function _9(d3,interpolatorValue1){return(
d3.interpolate([99, 0, 1],[-99, 1e6, 99])(interpolatorValue1/100)
)}

function _10(d3,interpolatorValue1){return(
d3.interpolate('1970-01-01','2020-01-01')(interpolatorValue1/100)
)}

function _11(md){return(
md `
But there are a lot of different kinds of interpolators that can interpolate between a lot of different things.
`
)}

function _interpolatorValue2(html){return(
html`<input type=range min=0 max=100>`
)}

function _13(d3,interpolatorValue2){return(
d3.interpolateString("0 men on the dead man's chest", "1000 men on the dead man's chest")(interpolatorValue2/100)
)}

function _14(d3,interpolatorValue2){return(
d3.interpolateObject({ a: -10, b: 33 },{ a: 1000, b: -33, c: 100 })(interpolatorValue2/100)
)}

function _15(d3,interpolatorValue2){return(
d3.interpolateTransformSvg('translate(100,100) scale(2)','translate(0, 0)')(interpolatorValue2/100)
)}

function _16(md){return(
md `
We can break interpolated values up into evenly spaced numbers by using \`\`d3.quantize()\`\` (you've seen this in previous lessons.)
`
)}

function _17(d3){return(
d3.quantize( d3.interpolate(0, 1700), 9 )
)}

function _18(d3){return(
d3.quantize( d3.interpolateRainbow, 9)
)}

function _19(md){return(
md `
There are a lot of useful ways we can apply interpolators. For example, we can use \`\`d3.interpolate()\`\` to animate along curves that wouldn't be otherwise possible.
`
)}

async function* _20(d3,Promises)
{
  const svg = d3.create('svg')
      .attr('width', 900)
      .attr('height', 500)
  
  const data = d3.range(10).map(() => ({
    x: Math.random() * 900,
    y: Math.random() * 500
  }))
   
  const line = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis)

   const path = svg
    .append('path')
    .datum( data )
      .attr('d', line)
      .style('stroke', 'black')
      .style('stroke-width', 2)
      .style('fill', 'transparent')
  
  while(true) {
    
    const length = path.node().getTotalLength(),
          int = d3.interpolate(0, length),
          x = (t) => path.node().getPointAtLength(int(t)).x,
          y = (t) => path.node().getPointAtLength(int(t)).y
    
    svg.selectAll('circle')
      .data([ data[0] ])
      .join('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .style('fill', d3.interpolateRainbow(0))
        .style('stroke', 'black')
        .attr('r', 20)
      .transition().delay(500).duration(10000)
        .attrTween('cx', () => x )
        .attrTween('cy', () => y )
        .styleTween('fill', () => d3.interpolateRainbow )

    yield svg.node()
    await Promises.tick(12000)
    
  }
  
}


function _21(md){return(
md `
# Conclusion

Interpolators are a big deal. Now you know how to use them! Of course, this is just scratching the surface. You can [learn a lot more about interpolators here](https://github.com/d3/d3-interpolate/tree/v1.3.3). In tomorrow's lesson, we'll get into animations in more detail.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-20-animations-part-2)!

Tyler
`
)}

function _22(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
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
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof interpolatorValue1")).define("viewof interpolatorValue1", ["html"], _interpolatorValue1);
  main.variable(observer("interpolatorValue1")).define("interpolatorValue1", ["Generators", "viewof interpolatorValue1"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","interpolatorValue1"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["d3","interpolatorValue1"], _8);
  main.variable(observer()).define(["d3","interpolatorValue1"], _9);
  main.variable(observer()).define(["d3","interpolatorValue1"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("viewof interpolatorValue2")).define("viewof interpolatorValue2", ["html"], _interpolatorValue2);
  main.variable(observer("interpolatorValue2")).define("interpolatorValue2", ["Generators", "viewof interpolatorValue2"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","interpolatorValue2"], _13);
  main.variable(observer()).define(["d3","interpolatorValue2"], _14);
  main.variable(observer()).define(["d3","interpolatorValue2"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["d3"], _17);
  main.variable(observer()).define(["d3"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["d3","Promises"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
