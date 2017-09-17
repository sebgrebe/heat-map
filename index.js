$(document).ready(function() {
       $.ajax({
                            url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
                            dataType: 'json',
                            error: (xhr,errorType) => {
                                   alert(errorType)
                            },
                            success: (data) => {
                                   const base_temp = data['baseTemperature']
                                   const month_var = data['monthlyVariance']
                                   const months = ["January", "February", "March", "April", "May", "June",
                                                        "July", "August", "September", "October", "November", "December"];
                                   function NumToMonth(num) {
                                          return months[num-1]
                                   }
                               
                                   function varToCol(variance) {
                                          if (variance > 0) {
                                                 return 'rgb(255, '+Math.round(255-(variance)*(255/4))+',0)'
                                          }
                                          else {
                                                 return 'rgb('+Math.round(255+variance*(255/6))+',255,'+Math.round(-variance*(255/6))+')'
                                          }
                                   }
                                   function createXTicks(){
                                          var array = [1753];
                                          for (var i=0;i<(2015-1760)/10;i++) {
                                                 if (1760+i*10 !== 2010) {
                                                 array.push(1760+i*10)}
                                          }
                                          array.push(2015)
                                          return array
                                   }
                                   const padding_left = 70;
                                   const padding_top = 0;
                                   const padding_bottom = 80;
                                   const padding_right = 100;
                                   const w = 1000;
                                   const h = window.innerHeight-140;
                                   const graph = document.getElementById('graph');
                                   const svg = d3.select(graph)
                                                        .append('svg')
                                                        .attr('width',w)
                                                        .attr('height',h);
                                   const xScale = d3.scaleLinear()
                                          .domain([1753,2015])
                                          .range([padding_left,w-padding_right])
                                   const yScale = d3.scaleTime()
                                          .domain([12, 1])
                                          .range([h-padding_bottom,padding_top])
                                   const xticks = createXTicks();       
                                   const yticks = [1,2,3,4,5,6,7,8,9,10,11,12]
                                   const xAxis = d3.axisBottom(xScale)
                                                 .tickValues(xticks)
                                                 .tickFormat(d3.format("d"))
                                   
                                   const yAxis = d3.axisLeft(yScale)
                                                 .tickValues(yticks)
                                                 .tickFormat(function(d,i){ return months[i].substr(0,3) })
                                                 .tickSize(0)
                                   
                                   //x-Axis
                                   svg.append('g')
                                          .attr("transform", "translate(0, " + (h - padding_bottom + h/12) + ")")
                                          .call(xAxis)
                                   
                                   //y-Axis
                                   svg.append('g')
                                          .attr("transform", "translate("+padding_left+", "+h/24+")")
                                          .call(yAxis)  
                                   
                                   //bars
                                   svg.selectAll('rect')
                                          .data(month_var)
                                          .enter()
                                          .append('rect')
                                          .attr("x", (d,i) => xScale(d['year']))
                                          .attr("y", (d,i) => yScale(d['month']))
                                          .attr('width',3)
                                          .attr('height',h/12)
                                          .attr('fill', (d) => varToCol(d['variance']))
                                          .attr('class','bar')

                                   //tooltips
                                   svg.selectAll('rect')
                                          .data(month_var)
                                          .on('mouseover',(d,i) =>
                                                 svg.append('foreignObject')
                                                 .attr("x", xScale(d['year'])+10)
                                                 .attr("y", yScale(d['month']))
                                                 .attr('width', 120)
                                                 .attr('height',60)
                                                 .append('xhtml:div')
                                                 .html('<b>Year: </b>'+d['year']+'</br>'+
                                                        '<b>Month: </b>'+NumToMonth(d['month'])+'</br>'+
                                                        '<b>Temperature: </b>'+Math.round((base_temp+d['variance'])*10)/10+'&#8451;')
                                                 .attr('class','tip')
                                                 )
                                          .on('mouseout',() =>
                                                 svg.selectAll('foreignObject').remove()
                                                 )

                                   //y-label
                                   svg.append('text')
                                   .text("Months")
                                   .attr('x',20)
                                   .attr('y',h-padding_bottom-h/12*6)
                                   .attr('class','label_y')

                                   //x-label
                                   svg.append('text')
                                   .text("Year")
                                   .attr('x',w/2+padding_left-padding_right)
                                   .attr('y',h)
                                   .attr('class','label_x')

                            }                                  
                     });
       })