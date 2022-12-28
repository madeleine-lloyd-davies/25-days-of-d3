// https://observablehq.com/@thetylerwolf/day-24-making-good-data-vizualization@105
function _1(md){return(
md`
# Day 24 - Making Good Data Vizualization

Today, we take a break from code.
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
# Making Good Data Visualization

Today, I'm going to address the topics that I find most relevant to desiging and building good visualizations.

If you've been following along thus far, you're either a data visualization practitioner, aspiring practitioner or someone who needs to learn D3 for work and stumbled across this course. Whatever your motivation, I hope this course has been helpful to developing your skills in the field!

The purpose of this course is to teach the hard skills behind building charts using D3.js. D3 is purpose-built for data visualization and, as you've seen, makes many complex operations very easy. However, there's a lot that it can't do for you. Namely, it can't tell you the right way to visualize your data.

The work of data visualization can be broken down into three core components - **data**, **design** and **implementation**. Each of these three is a distinct skillset of its own. This is why data visualization is moving from the obscure to a growing professional field today. It's taken years for the lines between the three disciplines to blur enough that a coherent domain of expertise could grow.

If you're technically inclined - a developer or data scientist, for example, you probably don't need a reminder that sound data (accurate and clean) and a sound technical implementation are important for building a good visualization. However today, as I mentioned, is about design.

Throughout these lessons, I've made an effort to implement well-designed examples. However, it has been a balance of keeping code samples concise and instructive versus adhering to best practices. When it came to trade-offs, I went with code that was easier to understand because the purpose of these lessons is to teach the D3 library, not to teach data visualization design.
`
)}

function _4(md){return(
md `
# Design

Data visualization is an exercise in visual communication. This means effective visualization, especially of complex data sets, requires well-considered design.

Many times, I've heard design described as "making things look pretty." True, there is an aesthetic component to design, but this description overlooks the rest of this very important discipline. Design is a process of considering the context of your visualization, who it's for, their understanding of the data, the nature of the data itself and how it all comes together to form a coherent whole. Then, of course, implementing it in a way that's visually meaningful.

It's easy to lose ourselves in the tools we use to build visualizations and lose sight of our project's purpose. Or, just as bad, exhaust ourselves with the technical implementation so that design is an afterthought. This often results in charts that are misleading, confusing or just unnecessary.

There is a wealth of data visualization research that can point you in the right direction with regard to how we understand and consume data visualization. I absolutely recommend staying up-to-date on the relevant findings. I also  recommend learning how to become a better designer (we can all become better designers, even if we're already good!)

How do you become a better designer? It's really simple - read books, look at examples and practice a lot. When you compare your work with others, don't always hold yourself to the highest standard; it can be very discouraging early on. You can get there eventually, but be ready to be wrong a lot.

Be critical of the feedback you receive; people are often ready to give their opinions, but the words they use don't always communicate what they mean and occasionally they're just plain wrong. This is a tricky balance - just because you don't like the feedback, that doesn't mean it's wrong!

Color choice is a big deal. It can be hard to find resources that teach how to do it well. It's something that will come with a lot of practice, time and learning from others.

With Data visualization, we have to think about details like label placement and legends, which are not a part of most creative projects. These decisions are largely informed by the data itself and can have big design implications. For example, many maps of the United States place Alaska and Hawaii in a bottom corner because they're located so far from the country's mainland. We accept this compromise under the assumption that most Americans know where those states are actually physically located. But for those who don't, they're no better informed by these design compromises.

Some consumers will love a creative solution, while others will be turned off by new ideas. A very big part of design is understanding your audience and making something that they understand and can relate to.

This is a programming course, so you probably have some programming experience. Those of us with development experience tend to want to quantify problems and converge on an optimal solution. In creative work, things usually don't work that way. There is a lot of effort with design systems and guidelines to keep us on the right track, but when you're beyond the limits of those guidelines, you have to find a new path to follow. In these cases, math rarely provides the solution you're looking for.

Finally, it's important to have a well-defined message before you start thinking about how your visualization will look. Always design before you build!

# Conclusion

If you've read this whole lesson, nice work! I'm hesitant to endorse paid resources without careful consideration, but one great starting point is the [Material Design Data Visualization guide](https://material.io/design/communication/data-visualization.html).

A final word. If you're walking away from this saying "Yeah, sounds good, but I don't think this design stuff is *actually* that important," believe me when I tell you, you're not the first to say that! This leads to one of two eventual conclusions. First, you stick to that belief and become really good at something else - that's great! You should spend your time doing something that you care about. Alternatively, you may eventually see first-hand the impact of design and realize the best time to start learning was years ago. If you find yourself in the latter situation, take this advice: the second best time to learn is right now, so why not get started?!
`
)}

function _5(md){return(
md `See you [tomorrow](https://observablehq.com/@thetylerwolf/day-25-whoadude)!`
)}

function _6(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
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
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("end")).define("end", _end);
  return main;
}
