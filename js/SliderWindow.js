/** Class representing the window of sliders. */
class SliderWindow {

    /** 
     * Creates a new SliderWindow object
     */
    constructor(activeAlpha, activeBeta, activeSample, activeDraw, linePlot, histChart) {
        this.activeAlpha = activeAlpha;
        this.activeBeta = activeBeta;
        this.activeSample = activeSample;
        this.activeDraw = activeDraw;
        this.linePlot = linePlot;
        this.histChart = histChart;
        this.sampleData = [];
        this.drawSliders();
    };

    /**
     * Draws the sliders
     */
    drawSliders() {

        var that = this;

        let distScale = d3.scaleLinear().domain([0, 5]).range([0, 100]);
        let sampScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

        // appending alpha slider
        let alphaSlider = d3.select("#alpha_slider")
            .append('div').classed('slider_wrap', true).attr('id', 'alpha_slider_wrap')
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 0.1)
            .attr('max', 5)
            .attr('step', .01)
            .attr('value', that.activeAlpha);
        
        // appending svg for slider label
        let alphaSliderLabel = d3.select('#alpha_slider_wrap')
            .append('div').classed('slider-label', true)
            .append('svg')
            .attr('height', 20);

        // appending slider label
        let alphaSliderText = alphaSliderLabel.append('text')
            .text(that.activeAlpha)
            .attr('x', distScale(that.activeAlpha))
            .attr('y', 15);

        // setting the sliders input behavior
        alphaSlider.on('input', function () {
            alphaSliderText.text(this.value);
            alphaSliderText.attr('x', distScale(this.value));
            that.activeAlpha = +this.value;
            
            that.linePlot.sliderUpdate(that.activeAlpha, that.activeBeta);

        })

        // appending beta slider
        let betaSlider = d3.select("#beta_slider")
            .append('div').classed('slider_wrap', true).attr('id', 'beta_slider_wrap')
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 0.1)
            .attr('max', 5)
            .attr('step', .01)
            .attr('value', that.activeBeta);
        
        // appending svg for slider label
        let betaSliderLabel = d3.select('#beta_slider_wrap')
            .append('div').classed('slider-label', true)
            .append('svg')
            .attr('height', 20);

        // appending slider label
        let betaSliderText = betaSliderLabel.append('text')
            .text(that.activeBeta)
            .attr('x', distScale(that.activeBeta))
            .attr('y', 15);

        // setting the sliders input behavior
        betaSlider.on('input', function () {
            betaSliderText.text(this.value);
            betaSliderText.attr('x', distScale(this.value));
            that.activeBeta = +this.value;
            
            that.linePlot.sliderUpdate(that.activeAlpha, that.activeBeta);
        })

        // appending sample slider
        let sampleSlider = d3.select("#sample_slider")
            .append('div').classed('slider_wrap', true).attr('id', 'sample_slider_wrap')
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', that.activeSample);
        
        // appending svg for slider label
        let sampleSliderLabel = d3.select('#sample_slider_wrap')
            .append('div').classed('slider-label', true)
            .append('svg')
            .attr('height', 20);;

        // appending slider label
        let sampleSliderText = sampleSliderLabel.append('text')
            .text(that.activeSample)
            .attr('x', sampScale(that.activeSample))
            .attr('y', 15);

        // setting the sliders input behavior
        sampleSlider.on('input', function () {
            sampleSliderText.text(this.value);
            sampleSliderText.attr('x', sampScale(this.value));
            that.activeSample = +this.value;
            //TODO
            // make it call update plot functions
        })

        // appending draw slider
        let drawSlider = d3.select("#draw_slider")
            .append('div').classed('slider_wrap', true).attr('id', 'draw_slider_wrap')
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 0)
            .attr('max', 100)
            .attr('value', that.activeDraw);
        
        // appending svg for slider label
        let drawSliderLabel = d3.select('#draw_slider_wrap')
            .append('div').classed('slider-label', true)
            .append('svg')
            .attr('height', 20);;

        // appending slider label
        let drawSliderText = drawSliderLabel.append('text')
            .text(that.activeDraw)
            .attr('x', sampScale(that.activeDraw))
            .attr('y', 15);

        // setting the sliders input behavior
        drawSlider.on('input', function () {
            drawSliderText.text(this.value);
            drawSliderText.attr('x', sampScale(this.value));
            that.activeDraw = +this.value;
            //TODO
            // make it call update plot functions
        })

        // add functionality to the button
        let selection = d3.select("#sample_button")
            .select('input')
            .on("click", function() {
                let data; let mean;
                for (let i = 0; i < that.activeDraw; i++) {
                    data = [];
                    for (let j = 0; j < that.activeSample; j++) {
                        data.push(jStat.beta.sample(that.activeAlpha, that.activeBeta))
                    };
                    mean = d3.mean(data);
                    that.sampleData.push(mean);
                };
                // TODO
                // update histogram
                that.histChart.updateChart(that.sampleData);
                console.log('button')
            })

        

    }

}