//*****************************************************************************
//* Linegraph.js
//*
//* Plot Line graph in context
//*
//* Note: 'color_array_init();' has to be called beforehand to initialise the color array
//*        'default_showlegend,default_backgroundcolor,default_gridcolor,default_gridwidth' have to be defined
//*        'defalut_linewidth and default_line_point_spacing' have to be defined
//*
//* by Benny Lo
//* May 30, 2011
//*****************************************************************************
var LineGraph_Backgroundcolor=new Array();   //background color of the graph
var LineGraph_Gridcolor=new Array();         //the color of the grid
var LineGraph_GridWidth=new Array();         //the space between grid lines
var LineGraph_context=new Array();           //the context of the graph
var LineGraph_left=new Array();              //the left position of the graph window
var LineGraph_top=new Array();               //the top position of the graph window
var LineGraph_right=new Array();             //the right position of the graph window
var LineGraph_bottom=new Array();            //the bottom positoin of the graph window
var LineGraph_XStep=new Array();             //the width of the bar
var LineGraph_TotalNoPoints=new Array();     //the total number of bars in the graph
var LineGraph_NoVariables=new Array();       //no of variables
var LineGraph_lineWidth=new Array();         //line width
var LineGraph_VariableColor;                 //color of each variables
var LineGraph_maxvalue;          //the maximum value of the input data
var LineGraph_minvalue;          //the minimum value of the input data
var LineGraph_NoPoints=new Array();          //the no of points in the chart (ie the height of the bar chart)
var LineGraph_data;                          //the data of the graph
var LineGraph_ShowLegend=new Array();        //show the legend
var LineGraph_Legend;                        //Legend
var LineGraph_legendposx=new Array(),LineGraph_legendposy=new Array(),LineGraph_legenditemheight=new Array();
var LineGraph_legenditemwidth=new Array(),LineGraph_legendfontsize=new Array();//attributes of the legend
var default_LineGraph_showlegend=default_showlegend;//default show/hide legend
var default_LineGraph_backgroundcolor='#ff0000'; //default_backgroundcolor;
var default_LineGraph_gridcolor='#333300';       //default grid color
var default_LineGraph_gridwidth=30;              //default grid space
var default_LineGraph_Xstep=10;                  //default space between each point
var default_LineGraph_linewidth=2;               //default line width
var default_LineGraph_minvalue=0;
var default_LineGraph_maxvalue=65536;
function LineGraph_ClearAll()
{
    LineGraph_context.length=0;
}
//---------------------------------------------------------
//Create new graph
function LineGraph_AddNewGraph(  ctx,novariables,
                                left,top,right,bottom)
{   //LineGraph_AddNewGraph -> define the bar graph
    //ctx -> context
    //minvalue -> minmum value of the input data
    //maxvalue -> maximum value of the input data
    //left-> window left position
    //top -> graph top position
    //right-> width of the graph
    //bottom->height of the graph
    //-----------------------------------------
    //set the default values
    default_LineGraph_backgroundcolor=default_backgroundcolor;
    default_LineGraph_showlegend=default_showlegend;
    default_LineGraph_gridcolor=default_gridcolor;
    default_LineGraph_gridwidth=default_gridwidth;
    default_LineGraph_Xstep=default_line_point_spacing;
    default_LineGraph_linewidth=defalut_linewidth;
    default_LineGraph_minvalue=default_minvalue;
    default_LineGraph_maxvalue=default_maxvalue;
    //--------------------------
    //---------------------------------------------
    var pindex=LineGraph_context.length;
    LineGraph_context.push(ctx);    
    LineGraph_minvalue=new Array(LineGraph_context.length);
    LineGraph_maxvalue=new Array(LineGraph_context.length);
    LineGraph_left.push(left);  LineGraph_top.push(top);  LineGraph_right.push(right);   LineGraph_bottom.push(bottom);
    LineGraph_NoPoints.push((bottom-top)-default_LineGraph_linewidth*3);
    LineGraph_Backgroundcolor.push(default_LineGraph_backgroundcolor);LineGraph_Gridcolor.push(default_LineGraph_gridcolor);
    LineGraph_GridWidth.push(default_LineGraph_gridwidth);
    LineGraph_XStep.push(default_LineGraph_Xstep);
    LineGraph_ShowLegend.push(default_LineGraph_showlegend);
    LineGraph_legendposx.push(left);
    LineGraph_legendposy.push(top+5);
    LineGraph_legenditemheight.push(5);
    LineGraph_legenditemwidth.push(20);
    LineGraph_legendfontsize.push(10);
    LineGraph_NoVariables.push(novariables);
    LineGraph_TotalNoPoints.push((right-left)/(default_LineGraph_Xstep));
    LineGraph_lineWidth.push(default_LineGraph_linewidth);
    LineGraph_VariableColor=new Array(LineGraph_context.length);
    LineGraph_data=new Array(LineGraph_context.length);
    LineGraph_Legend=new Array(LineGraph_context.length);
    for (var i=0;i<LineGraph_context.length;i++)
    {
        LineGraph_data[i]=new Array(novariables);
        LineGraph_VariableColor[i]=new Array();
        LineGraph_Legend[i]=new Array();
        LineGraph_minvalue[i]=new Array();
        LineGraph_maxvalue[i]=new Array();        
        for (var j=0;j<LineGraph_NoVariables[i];j++)
        {
            LineGraph_data[i][j]=new Array();  
            var colorindex=j;
            while (colorindex>colorarray.length)
               colorindex-=colorarray.length;
            LineGraph_VariableColor[i].push(colorarray[colorindex]);
            LineGraph_Legend[i].push('Var'+j);
            LineGraph_minvalue[i].push(default_LineGraph_minvalue);
            LineGraph_maxvalue[i].push(default_LineGraph_maxvalue);
        }    
    }   
    LineGraph_DrawGrid(pindex);
    return pindex;
}
//---------------------------------------------------------
//set attribute of the graph
function LineGraph_SetChartColor(index,backgroundcolor,gridcolor,gridwidth)
{//LineGraph_SetChartColor - set the background color and grid color of the bar chart
    //index -> index of the pie chart
    //backgroundcolor -> background color of the chart
    //gridcolor -> grid line color
    //gridwidth -> spacing between grid lines
    if (index >= LineGraph_context.length||index<0)return;
    LineGraph_Backgroundcolor[index]=backgroundcolor;
    LineGraph_Gridcolor[index]=gridcolor;
    LineGraph_GridWidth[index]=gridwidth;
}
function LineGraph_SetVariableColor(index,varindex,color)
{   //LineGraph_SetVariableColor - set each variable color
    //index -> index of the bar chart
    //varindex->index of the variable
    //color-> color of the new variable
    if (index >= LineGraph_context.length||index<0)return;
    if (varindex>=LineGraph_NoVariables[index]||varindex<0)return;
    LineGraph_VariableColor[index][varindex]=color;
}
function LineGraph_SetRange(index,varindex,minvalue,maxvalue)
{   //LineGraph_SetRange - set range of each variable 
    //index -> index of the bar chart
    //varindex->index of the variable
    //minvalue -> new minimum value
    //maxvalue -> new maximum value
    if (index >= LineGraph_context.length||index<0)return;
    if (varindex>=LineGraph_NoVariables[index]||varindex<0)return;
    LineGraph_minvalue[index][varindex]=minvalue;
    LineGraph_maxvalue[index][varindex]=maxvalue;
}
function LineGraph_SetLineWidth(index,linewidth)
{   //LineGraph_SetLineWidth - set the line width
    //index -> index of the bar chart
    //linewidth-> line width
    if (index >= LineGraph_context.length||index<0)return;
    LineGraph_lineWidth[index]=linewidth;
    LineGraph_NoPoints[index]=((LineGraph_bottom[index]-LineGraph_top[index])-linewidth*3);
}
//------------------------------------------------------------
//legend functions
function LineGraph_SetLegendText(index,varindex,text)
{   //assign legend text for each variable 
    if (index >= LineGraph_context.length||index<0)return;
    if (varindex>=LineGraph_NoVariables[index]||varindex<0)return;
    LineGraph_Legend[index][varindex]=text;    
}
function LineGraph_ShowHideLegend(index,showlegend)
{   //PieChart_ShowHideLegend - show or hide the legend
    //index -> index of the pie chart
    //showlegend->show or hide the legend (ie true->show, false->hide)
    if (index >= LineGraph_context.length||index<0)return;
    LineGraph_ShowLegend[index]=showlegend;
}
function LineGraph_SetLegendAttribute(index,posx,posy,itemwidth,itemheight,fontsize)
{   //set the attribute of the legend
    //index -> index of the pie chart
    //posx -> position x of the legend
    //posy -> position y of the legend
    //itemwidth-> width of the legend line
    //itemheight->height of each legend item
    //fontsize-> font size of the legend text
    LineGraph_legendposx[index]=posx;
    LineGraph_legendposy[index]=posy;
    LineGraph_legenditemheight[index]=itemwidth;
    LineGraph_legenditemwidth[index]=itemheight;
    LineGraph_legendfontsize[index]=fontsize;
}
//-------------------------------------------------------------------------
//drawing functions
function LineGraph_ClearGraph(index)
{   //clear the background of the graph
    //index -> index of the bar chart
    LineGraph_context[index].fillStyle = LineGraph_Backgroundcolor[index]; // Work around for Chrome
	LineGraph_context[index].fillRect(LineGraph_left[index]-1,LineGraph_top[index], LineGraph_right[index]-LineGraph_left[index], LineGraph_bottom[index]-LineGraph_top[index]+1); // Fill in the canvas with white
}
function LineGraph_DrawGrid(index)
{   //draw the gride lines of the bar graph
    //index -> index of the bar chart
    LineGraph_ClearGraph(index);
	//draw the grid lines
	LineGraph_context[index].strokeStyle=LineGraph_Gridcolor[index];
    LineGraph_context[index].fillStyle=LineGraph_Gridcolor[index];
    LineGraph_context[index].lineWidth=1;                            
    LineGraph_context[index].beginPath(); 
	for (var y=LineGraph_top[index]+LineGraph_GridWidth[index];y<LineGraph_bottom[index];y+=LineGraph_GridWidth[index])
	{
        LineGraph_context[index].moveTo(LineGraph_left[index],y);
        LineGraph_context[index].lineTo(LineGraph_right[index],y);
	}
	for (var x=LineGraph_left[index]+LineGraph_GridWidth[index];x<LineGraph_right[index];x+=LineGraph_GridWidth[index])
	{
	    LineGraph_context[index].moveTo(x,LineGraph_top[index]);
	    LineGraph_context[index].lineTo(x,LineGraph_bottom[index]);
	}
	LineGraph_context[index].stroke();//free-hand lines
    LineGraph_context[index].closePath();	
}
function LineGraph_AddData(index,varindex,sensordata)
{   //LineGraph_AddData -> add data onto the bar graph data array
    //index -> index of the bar graph
    //sensordata -> sensor data
    if (index >= LineGraph_context.length||index<0)return;
    if (varindex>=LineGraph_NoVariables[index]||varindex<0)return;
    //scale the value to match the graph        
    var newvalue=(sensordata-LineGraph_minvalue[index][varindex])/(LineGraph_maxvalue[index][varindex]-LineGraph_minvalue[index][varindex])*LineGraph_NoPoints[index];
    if (sensordata>LineGraph_maxvalue[index][varindex])      newvalue=LineGraph_NoPoints[index];
    else if (sensordata<LineGraph_minvalue[index][varindex]) newvalue=0;    
    LineGraph_data[index][varindex].push(newvalue);
    if (LineGraph_data[index][varindex].length>LineGraph_TotalNoPoints[index])
        LineGraph_data[index][varindex].shift();     //shift the data array
}
function LineGraph_Plot(index)
{  //PlotLineGraph -> plot the bar graph
    if (index >= LineGraph_context.length||index<0) return;  
    LineGraph_DrawGrid(index);//clear the chart and draw the grid
    for (var j=0;j<LineGraph_NoVariables[index];j++)
    {
        if (LineGraph_data[index][j].length>0)
        {
            LineGraph_context[index].beginPath();
            LineGraph_context[index].strokeStyle=LineGraph_VariableColor[index][j];
            LineGraph_context[index].lineWidth=LineGraph_lineWidth[index];
            LineGraph_context[index].moveTo(LineGraph_left[index],LineGraph_bottom[index]-LineGraph_data[index][j][0]);
            for (var i=0;i<LineGraph_data[index][j].length;i++)        
            {
                if (LineGraph_minvalue[index][j]==0&&LineGraph_maxvalue[index][j]==1)
                {//it's a binary plot
                    if (LineGraph_data[index][j][i]>0)
                    {
                        LineGraph_context[index].lineWidth=1;
                        LineGraph_context[index].moveTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]);
                        LineGraph_context[index].lineTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]-LineGraph_data[index][j][i]);
                        LineGraph_context[index].moveTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]);
                    }
                    else //LineGraph_context[index].lineTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]-LineGraph_data[index][j][i]);
                        LineGraph_context[index].moveTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]);
                }
                else LineGraph_context[index].lineTo(LineGraph_left[index]+i*LineGraph_XStep[index],LineGraph_bottom[index]-LineGraph_data[index][j][i]);
            }                
            LineGraph_context[index].stroke();
            LineGraph_context[index].closePath();                                       
        }
    }
    //----------------------------
    //show legend
    if (LineGraph_ShowLegend[index])
    {   
        var starty=LineGraph_legendposy[index];
        var px= LineGraph_legendposx[index];
        var py=Math.max(0,starty-LineGraph_legenditemheight[index]);
        var maxlength=0;
        var ty=0;
        for (var j=0;j<LineGraph_NoVariables[index];j++)
        {
            maxlength=Math.max(maxlength,LineGraph_Legend[index][j].length);
            ty+=(LineGraph_legenditemheight[index]*2);
        }        
        var tx=maxlength*LineGraph_legendfontsize[index]+10;
        LineGraph_context[index].beginPath();
        LineGraph_context[index].globalAlpha=0.4;
        LineGraph_context[index].fillStyle=LineGraph_Gridcolor[index];
        LineGraph_context[index].fillRect(px,py,tx,ty);
        LineGraph_context[index].closePath();
        LineGraph_context[index].globalAlpha=1;
        for (var j=0;j<LineGraph_NoVariables[index];j++)
        {//show each legend item
            LineGraph_context[index].fillStyle=LineGraph_VariableColor[index][j];
            LineGraph_context[index].strokeStyle=LineGraph_VariableColor[index][j];
            LineGraph_context[index].beginPath();
            LineGraph_context[index].moveTo(LineGraph_legendposx[index],starty);    //move to the center of the circle
            LineGraph_context[index].lineTo(LineGraph_legendposx[index]+LineGraph_legenditemwidth[index],starty);//draw the start arm of the pie
            LineGraph_context[index].stroke();            
            LineGraph_context[index].closePath();            
            drawTextwithContext(LineGraph_context[index],
                        LineGraph_Legend[index][j],
                        LineGraph_legendposx[index]+LineGraph_legenditemwidth[index]+2,
                        starty+LineGraph_legendfontsize[index]/5,"Arial",
                        LineGraph_VariableColor[index][j],LineGraph_legendfontsize[index],0);
            starty+=(LineGraph_legenditemheight[index]*2);                                
        }                           
    }
      
}

//****************************************
//example
function LineGraph_example_start()
{   
    var no_var=5;//no of variables
    var win_left=12,win_right=331;
    var win_top=46,win_bottom=241;
    var minvalue=0,maxvalue=256;
    var pindex1=LineGraph_AddNewGraph( context,no_var,win_left,win_top,win_right,win_bottom);
    for (var i=0;i<no_var;i++)
    {
        var legtext='var '+i;
        LineGraph_SetLegendText(pindex1,legtext);
    }
    LineGraph_SetLegendAttribute(pindex1,win_left+5,win_top+20,10,10,10);
    LineGraph_ShowHideLegend(pindex1,true);
    LineGraph_SetVariableColor(pindex1,0,'#ffbb22');
    LineGraph_SetLineWidth(pindex1,2);	    
    LineGraph_SetChartColor(pindex1,'#222222','#00ff00',50);    
    LineGraph_SetRange(pindex1,0,-200,1000);
}
function LineGraph_example_PlotData()
{
    for (var j=0;j<200;j++)
    {
        for (var i=0;i<5;i++)
        {
            var pdata=Math.floor(Math.random()*256);
            LineGraph_AddData(0,i,pdata);
        }
    }
    LineGraph_Plot(0);    
}
