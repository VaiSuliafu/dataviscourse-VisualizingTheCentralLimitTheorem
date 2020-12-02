class EcdfChart {
  /**
   * Creates a new LinePlot object
   */
   constructor(data) {
     // controls height of svg and resulting line plot
     var margin = {top:20, right: 30, bottom:20, left:30};
     let width = 630 - margin.left - margin.right;
     let height = 350
     this.height = height;

     // create SVG element
     let svg = d3.select("ecdf_plot")
         .classed("ecdf_plot", true)
         .append("svg")
         .attr("id", "ecdf_svg")
         .attr("width", width)
         .attr("height", height);

     // X scales
     var xScale = d3.scaleLinear()
         .domain([0,1])
         .range([margin.left, width-margin.right]);
     svg.append("g")
         .attr("transform", "translate(0," + String(height-18) + ")")
         .call(d3.axisBottom(xScale));

     // Y scale
     var yScale = d3.scaleLinear()
         .domain([0,1])
         .range([height-margin.bottom, margin.top]);
     svg.append("g")
        .attr("transform", "translate(0," + String(width) + ")")
        .call(d3.axisLeft(yScale));

   }

   updateECDF(data) {
     let that = this;

     // convert array of means to array of (mean, cumulative frequency)
     let sorted = data.sort((a, b) => a-b);
     let ecdfData = [];
     const arrSum = arr => arr.reduce((a,b) => a + b, 0);
     let total = arrSum(data);
     ecdfData.push([sorted[0], sorted[0]/total]);
     for (let i = 1; i < data.length; i++) {
       ecdfData.push([sorted[i], (sorted[i] + ecdfData[i-1][1])]);
     }
     for (let i = 0; i < data.length; i++) {
       ecdfData[i][1] /= total;
     }
     console.log(sorted);
     console.log(ecdfData);

     // todo: update line Chart
     this.line = d3.line()
         .curve(d3.curveBasis)
         .x(function(d) { return xScale(d[0])})
         .y(function(d) { return yScale(d[1])});

   }

   // update theoretical cdf from beta distribution
   updateTheoretical(alpha, beta) {
     let mean = jStat.beta.mean( alpha, beta );
     let std = jStat.beta.variance( alpha, beta );

     var datum = d3.range(0, 1.05, 0.05).map(function(x) {
         return [x, Math.min(jStat.normal.cdf(x, mean, std), 10)];
     });

     return datum;
   }

}
