// render the sliders and default parameter values
alpha = 1
beta = 1
sampleSize = 1
drawSize = 1

// render the line plot object
linePlot = new LinePlot(alpha, beta);

// render the histogram object
histChart = new HistChart();

// make slider panel to control other plots
sliderWindow = new SliderWindow(alpha, beta, sampleSize, drawSize, linePlot, histChart)

