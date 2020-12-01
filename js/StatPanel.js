/**
 * Class representing the statistics panel
 */
class StatPanel {
    /**
     * Creates a new statistics panel
     */
    constructor(histogram) {

        // controls height of svg and resulting line plot
        var margin = {top:20, right: 30, bottom:20, left:30}
        let width = 630 - margin.left - margin.right;
        let height = 350
        this.height = height
        this.margin = margin;

        // link histogram
        this.histogram = histogram;

        // create SVG element
        let svg = d3.select("#panel")
            .classed("panel", true)
            .append("svg")
            .attr("id", "panel_svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "20")
            .text("# Draws:")

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "80")
            .text("Chi-Squared Test Statistic:")

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "140")
            .text("Degrees of Freedom:")
        

        svg.append("text")
            .classed("panel_title", true)
            .attr("x", "0")
            .attr("y", "200")
            .text("P - Value:")

        // dictionary to store results of Chi-squared test
        this.results = {
            testStat:0,
            terms:[]
        };
    }

    /**
     * Updates the display panel with new sample data 
     */
    updatePanel(observations, alpha, beta) {

        // number of observations
        var N = observations.length;

        // calculate new theoretical normal
        let expectations = this.calcTheoSample(N, alpha, beta);

        // console.log(expectations)

        // bin the data
        let b_observations = this.histogram(observations)
        let b_expectations = this.histogram(expectations)

        // calculate test statistic
        this.calcChiSquaredTestStat(b_observations, b_expectations);



        // degrees of freedom
        let dof = Math.max(1, N-1)


        // p value
        let probability = 1 - jStat.chisquare.cdf(this.results.testStat, dof);

        
        console.log("Degrees of Freedom: " + dof)
        console.log("Stat: " + this.results.testStat);
        console.log("Pval : " + probability)

        // svg
        let panelSvg = d3.select("#panel_svg")
        
        // remove prior text
        panelSvg
            .selectAll(".panel_text")
            .remove()

        // draws text
        panelSvg
            .append("text")
            .classed("panel_text", true)
            .attr("x", "90")
            .attr("y", "20")
            .text(N)

        panelSvg
            .append("text")
            .classed("panel_text", true)
            .attr("x", "260")
            .attr("y", "80")
            .text(this.results.testStat)

        panelSvg
            .append("text")
            .classed("panel_text", true)
            .attr("x", "205")
            .attr("y", "140")
            .text(dof)
        
        
        // p value text
        panelSvg
            .append("text")
            .classed("panel_text", true)
            .attr("x", "100")
            .attr("y", "200")
            .text(probability)
    }

    /**
     * Calculates a sample for the theoretical normal distribution
    */
    calcTheoSample(N, alpha, beta) {
        
        // estimate mean parameter from observations
        // let mu = 0;
        // for (let o of observations) {
        //     mu += o;
        // }
        // mu /= observations.length;

        let mu = jStat.beta.mean(alpha, beta)

        // estimate the std from observations
        // let v = 0;
        // for (let o of observations) {
        //     v += (mu - o)**2;
        // }

        let v = jStat.beta.variance(alpha, beta)

        // calculate a normal sample with estimated parameters
        var expectations = []
        let theo_o = null;
        for (let i = 0; i < N; i++) {
            theo_o = jStat.normal.sample(mu, v**0.5);
            // rounding continuous values to interval bins
            if (theo_o < 0) {
                theo_o = 0;
            };
            if (theo_o > 1) {
                theo_o = 1
            };
            expectations.push(theo_o)
        }

        return expectations;
    }

    /**
     * Calculates the Chi-squared test statistic
     * @param {*} observations 
     * @param {*} expectations 
     */
    calcChiSquaredTestStat(observations, expectations) {

        let that = this;

        // Clear prior results
        this.clearResults();

        // console.log("Observations")
        // console.log(observations)
        // console.log("Expectations")
        // console.log(expectations)

        // Iterate the chi-squared procedure for each term
        for (let i = 0; i < observations.length; i++) {
            let thisTerm = this.calcSingleTerm(observations[i], expectations[i]);
            that.results.terms.push(thisTerm);
            that.results.testStat += thisTerm;
        }

        return;
    }

    /**
     * Calculates one iteration of the Chi-squared test procedure
     */
    calcSingleTerm(observed, expected) {
        if (expected.length == 0) {
            return 0;
        }
        let x = Math.pow(observed.length - expected.length, 2) / expected.length;
        // console.log("Observed: " + observed)
        // console.log("Expected: " + expected)
        // console.log(x)
        return x;
    }

    /**
     * Clears the results from previous iteration of test
     */
    clearResults() {
        this.results.testStat = 0;
        this.results.terms = [];
    }
}