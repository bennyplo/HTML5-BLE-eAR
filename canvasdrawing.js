var context;    //the context of the canvas
var canvas,canvas1,canvas3,canvas2,canvas4;
var canvas_initialised=false;
var canvasWidth=480;
var canvasHeight=320;
var xscale=1.0;
var yscale=1.0;
var fontscale=Math.min(xscale,yscale);
var currentTab=0;
var noTabs=4;
var draw_timer=null;
var timeminute,timesecond,timemillsecond;
//-------------------------------------------------
var Max_SensorReadings=10;
var Max_AngleReadings=5;
var SensorReadings=new Array(Max_SensorReadings);//up to 10 sensor traces
var SensorReadingsColor=new Array();
//var startXPointsinGraph=12;
var startXPointsinGraph=0;
//var startYPointsinGraph=46;
var startYPointsinGraph=0;
//var maxXPointsinGraph=319;
var maxXPointsinGraph=480;
//var maxYPointsinGraph=195;
var maxYPointsinGraph=320;
//var XPointsinGraphstep=10;
var XPointsinGraphstep=1;
var Max_BalancePoints=30;
//---------------------------------------------
var colorarray=new Array();
var default_showlegend=false;
var default_backgroundcolor='#000000';
//var default_gridcolor='#333333';
var default_gridcolor='#ffffff';
var default_gridwidth=30;
var default_line_point_spacing=5;
var defalut_linewidth=2;
var default_minvalue=0;
var default_maxvalue=256;
var default_barwidth=15;//default width of each bar in a bar graph
var default_max_noScatterPoint=10;//maximum no of scatter points on the graph
var default_Scatter_Dim_PreviousPoints=true;//previous points will be dimmed
var default_Balance_Point_Radius=4;//radius of each circle highlighting each point in balance
var default_NoArrows=10;//default no of arrows in compass
//------------------------------------------
var nopackets=0;
var packetrate=0;
var curmarker=0;
var curprogress=0,curoverallprogress=0;
//---------------------------------
var context1=null;
var canvas1Width=0,canvas1Height=0;
var context2=null;
var canvas2Width=0,canvas2Height=0;
var context3=null;
var canvas3Width=0,canvas3Height=0;
var context4=null;
var canvas4Width=0,canvas4Height=0;
//-------------------------------------------
function color_array_init()
{   //PieChart_init - initialise the color array for the pie chart colors
    colorarray[0]='#ffffff';colorarray[1]='#ff0000';colorarray[2]='#00ff00';
    colorarray[3]='#0000ff';colorarray[4]='#ffff00';colorarray[5]='#ff00ff';
    colorarray[6]='#00ffff';colorarray[7]='#aaaaaa';colorarray[8]='#ffaaaa';
    colorarray[9]='#aaffaa';colorarray[10]='#aaaaff';colorarray[11]='#ffffaa';
    colorarray[12]='#ffaaff';colorarray[13]='#aaffff';colorarray[14]='#888888';
    colorarray[15]='#ff8888';colorarray[16]='#88ff88';colorarray[17]='#8888ff';
    colorarray[18]='#ff88ff';colorarray[19]='#ffff88';colorarray[20]='#88ffff';
    colorarray[21]='#aa8888';colorarray[22]='#aaaa88';colorarray[23]='#88aaaa';
    colorarray[24]='#aa88aa';colorarray[25]='#8888aa';
}


function addSensorPoint(sensorID,newvalue)
{
    if (sensorID<0 ||sensorID>Max_SensorReadings) return;
    if (SensorReadings[sensorID].length>=maxXPointsinGraph/XPointsinGraphstep)
        SensorReadings[sensorID].shift();
    var scaled=(newvalue/256.0)*maxYPointsinGraph;
    SensorReadings[sensorID].push(scaled);
}
function clearCanvas()
{//clear the canvas
	//context.fillStyle = '#ffffff'; // Work around for Chrome
    context.fillStyle = '#000000'; // Work around for Chrome
	context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
//	canvas.width = canvas.width; // clears the canvas 
}
function clearCanvas1()
{
    context1.fillStyle = '#000000'; // Work around for Chrome
    context1.fillRect(0,0,canvas1Width,canvas1Height);
}
function clearCanvas2()
{
    context2.fillStyle = '#000000'; // Work around for Chrome
    context2.fillRect(0,0,canvas2Width,canvas2Height);
}
function clearCanvas3()
{
    context3.fillStyle = '#000000'; // Work around for Chrome
    context3.fillRect(0,0,canvas3Width,canvas3Height);
}
function clearCanvas4()
{
    context4.fillStyle = '#000000'; // Work around for Chrome
    context4.fillRect(0,0,canvas4Width,canvas4Height);
}
function DrawProgressBar(ctx,width,height,percentage)
{
    ctx.beginPath();
    ctx.strokeStyle='#000000';
    ctx.rect(0,0,width-4,height-4);
    ctx.lineWidth=2;
    ctx.stroke();
    ctx.closePath();
    var step=((width-4)/30);
    var incre=0;
    var begx=0;
    ctx.fillStyle = '#000000'; // Work around for Chrome
    var curlevel=parseInt(percentage/100*30);
    for (var i=0;i<curlevel;i++)
    {
        var wid=parseInt(step)-2;
        ctx.fillRect(begx,0,wid,height-4);
        incre+=step;
        begx=parseInt(incre);
    }
    if (percentage >96)
        ctx.fillRect(begx,0,width-4-begx,height-4);
}

function redraw()
{
   
    clearCanvas();
   // DrawProgressBar(context,canvasWidth,canvasHeight,curprogress);
    redraw1();
}

function redraw1()
{
    clearCanvas1();
   // DrawProgressBar(context1,canvas1Width,canvas1Height,curoverallprogress);
}

function redraw2()
{
    clearCanvas2();
    //DrawProgressBar(context2,canvas2Width,canvas2Height,curoverallprogress);
}

function redraw3()
{
    clearCanvas3();
   // DrawProgressBar(context3,canvas3Width,canvas3Height,curoverallprogress);
}
function redraw4()
{
    clearCanvas4();
   // DrawProgressBar(context3,canvas3Width,canvas3Height,curoverallprogress);
}
function draw_resetTimer()
{
    if (draw_timer)
    {
        window.clearTimeout(draw_timer);
        draw_timer=null;
    }
    draw_timer=window.setTimeout(OndrawTimer,100);
}
function OndrawTimer()
{
    curprogress++;
    if (curprogress>100)curprogress=0;
    curoverallprogress-=10;
    if (curoverallprogress<0)curoverallprogress=100;
    redraw();
    draw_resetTimer();
}
function mouse_down(e)
{
    var mouseX = e.pageX- this.offsetLeft;// Mouse move location
    var mouseY = e.pageY - this.offsetTop;   
}

function mouse_up(e)
{
   var mouseX = e.pageX- this.offsetLeft;// Mouse move location
   var mouseY = e.pageY - this.offsetTop;
}

function mouse_move(e)
{
   var mouseX = e.pageX- this.offsetLeft;// Mouse move location
   var mouseY = e.pageY - this.offsetTop;

}
function mouse_over(e)
{
   
}
function touch_start(e)
{//handler for iPad/iPhone touch start event
	var targetEvent =  e.touches.item(0);  
	var mouseX=targetEvent.clientX-this.offsetLeft;
	var mouseY=targetEvent.clientY -this.offsetTop;	
	
   //if (slidehit ==1)
    if (mouseY < canvasHeight*yscale)
        e.preventDefault();//prevent the default touch function (ie stop the scrolling/zooming etc)
}
function touch_end(e)
{//handler for iPad/iPhone touch end event
   
}
function touch_move(e)
{//handler for iPad/iPhone touch moving event
    var targetEvent =  e.touches.item(0);  
	var mouseX=targetEvent.clientX-this.offsetLeft;
	var mouseY=targetEvent.clientY -this.offsetTop;
}
function draw()
{
    //-------------------------------------------
    //draw background image + graph
    canvas=document.getElementById('left_accelerometer');
    if (canvas.getContext)
    {
        //var ssize=GetBrowserSize();
        //xscale = (window.innerWidth-20)/480;
        //yscale = (window.innerHeight-20)/320; 
        //canvas.width=window.innerWidth-20;
        //canvas.height=window.innerHeight;
        canvasWidth=canvas.width;
        canvasHeight=canvas.height;
        if (draw_timer)
        {
            window.clearTimeout(draw_timer); 
            draw_timer=null;
        }    
        context=canvas.getContext('2d');
        //add event handlers for touch events
	    canvas.addEventListener('touchstart',touch_start,false);
	    canvas.addEventListener('touchend',touch_end,false);
	    canvas.addEventListener('touchmove',touch_move,false);
	    canvas.addEventListener("mousedown",mouse_down,false);
	    canvas.addEventListener("mouseup",mouse_up,false);
	    canvas.addEventListener("mousemove",mouse_move,false);
	    canvas.addEventListener("mouseover",mouse_over,false);
	    color_array_init();//initialise the color array 

	    //setTimer();
        //draw1();
        //redraw();
        //draw_resetTimer();
        canvas_initialised=true;       	   

       
        //LneGraph_SetRange(pindex1,0,-6,6);
        //LineGraph_SetRange(pindex1,1,-6,6);
        //LineGraph_SetRange(pindex1,2,-6,6);
      draw1();
      draw2();
      draw3();
      draw4();
        redraw();

    }    
}

function draw1()
{
    canvas1=document.getElementById('right_accelerometer');
    if (canvas1.getContext)
    {
        //canvas1.width=window.innerWidth-20;
        canvas1Width=canvas1.width;
        canvas1Height=canvas1.height;
        context1=canvas1.getContext('2d');
        redraw1();            
    }
}
function draw2()
{
    canvas2=document.getElementById('left_gyro');
    if (canvas2.getContext)
    {
        //canvas1.width=window.innerWidth-20;
        canvas2Width=canvas2.width;
        canvas2Height=canvas2.height;
        context2=canvas2.getContext('2d');
        redraw2();
      
    }
}

function draw3()
{
    canvas3=document.getElementById('right_gyro');
    if (canvas3.getContext)
    {
        //canvas1.width=window.innerWidth-20;
        canvas3Width=canvas3.width;
        canvas3Height=canvas3.height;
        context3=canvas3.getContext('2d');
        redraw3();
        /* LineGraph_ClearAll();
         var no_var=3;//no of variables
        var win_left=6,win_right=canvas3Width-6;
        var win_top=6,win_bottom=canvas3Height-6;
        var minvalue=-6,maxvalue=6;        
        var pindex1=LineGraph_AddNewGraph( context,no_var,win_left,win_top,win_right,win_bottom);
        LineGraph_SetLegendAttribute(pindex1,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex1,true);
        LineGraph_SetVariableColor(pindex1,0,'#ffbb22');
        LineGraph_SetLineWidth(pindex1,2);      
        LineGraph_SetChartColor(pindex1,'#222222','#888800',50);    
        
        var pindex2=LineGraph_AddNewGraph( context1,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex2,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex2,true);
        LineGraph_SetVariableColor(pindex2,0,'#ffffff');
        LineGraph_SetLineWidth(pindex2,2);      
        LineGraph_SetChartColor(pindex2,'#222222','#888800',50);    


        var pindex3=LineGraph_AddNewGraph( context2,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex3,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex3,true);
        LineGraph_SetVariableColor(pindex3,0,'#ffffff');
        LineGraph_SetLineWidth(pindex3,2);      
        LineGraph_SetChartColor(pindex3,'#222222','#888800',50);    

        var pindex4=LineGraph_AddNewGraph( context3,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex4,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex4,true);
        LineGraph_SetVariableColor(pindex4,0,'#ffffff');
        LineGraph_SetLineWidth(pindex4,2);      
        LineGraph_SetChartColor(pindex4,'#222222','#888800',50);    

        LineGraph_SetLegendText(pindex1,0,"x");
        LineGraph_SetLegendText(pindex1,1,"y");
        LineGraph_SetLegendText(pindex1,2,"z");
        LineGraph_SetLegendText(pindex2,0,"x");
        LineGraph_SetLegendText(pindex2,1,"y");
        LineGraph_SetLegendText(pindex2,2,"z");
        LineGraph_SetLegendText(pindex3,0,"x");
        LineGraph_SetLegendText(pindex3,1,"y");
        LineGraph_SetLegendText(pindex3,2,"z");
        LineGraph_SetLegendText(pindex4,0,"x");
        LineGraph_SetLegendText(pindex4,1,"y");
        LineGraph_SetLegendText(pindex4,2,"z");

        
        LineGraph_SetRange(pindex2,0,-16,6);
        LineGraph_SetRange(pindex2,1,-16,6);
        LineGraph_SetRange(pindex2,2,-16,6);
        LineGraph_SetRange(pindex1,0,-16,6);
        LineGraph_SetRange(pindex1,1,-16,6);
        LineGraph_SetRange(pindex1,2,-16,6);
        LineGraph_SetRange(pindex3,0,-1600,1600);
        LineGraph_SetRange(pindex3,1,-1600,1600);
        LineGraph_SetRange(pindex3,2,-1600,1600);
        LineGraph_SetRange(pindex4,0,-1600,1600);
        LineGraph_SetRange(pindex4,1,-1600,1600);
        LineGraph_SetRange(pindex4,2,-1600,1600);*/
        //console.log("No line graphs:"+LineGraph_context.length);      
    }
}
function draw4()
{
   canvas4=document.getElementById('detection_canvas');
    if (canvas4.getContext)
    {
        //canvas1.width=window.innerWidth-20;
        canvas4Width=canvas4.width;
        canvas4Height=canvas4.height;
        context4=canvas4.getContext('2d');
        redraw4();
         LineGraph_ClearAll();
         var no_var=3;//no of variables
        var win_left=6,win_right=canvas3Width-6;
        var win_top=6,win_bottom=canvas3Height-6;
        var minvalue=-6,maxvalue=6;        
        var pindex1=LineGraph_AddNewGraph( context,no_var,win_left,win_top,win_right,win_bottom);
        LineGraph_SetLegendAttribute(pindex1,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex1,true);
        LineGraph_SetVariableColor(pindex1,0,'#ffbb22');
        LineGraph_SetLineWidth(pindex1,2);      
        LineGraph_SetChartColor(pindex1,'#222222','#888800',50);    
        
        var pindex2=LineGraph_AddNewGraph( context1,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex2,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex2,true);
        LineGraph_SetVariableColor(pindex2,0,'#ffffff');
        LineGraph_SetLineWidth(pindex2,2);      
        LineGraph_SetChartColor(pindex2,'#222222','#888800',50);    


        var pindex3=LineGraph_AddNewGraph( context2,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex3,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex3,true);
        LineGraph_SetVariableColor(pindex3,0,'#ffffff');
        LineGraph_SetLineWidth(pindex3,2);      
        LineGraph_SetChartColor(pindex3,'#222222','#888800',50);    

        var pindex4=LineGraph_AddNewGraph( context3,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex4,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex4,true);
        LineGraph_SetVariableColor(pindex4,0,'#ffffff');
        LineGraph_SetLineWidth(pindex4,2);      
        LineGraph_SetChartColor(pindex4,'#222222','#888800',50);    

        no_var=4;
         var win_left=6,win_right=canvas4Width-6;
        var win_top=6,win_bottom=canvas4Height-6;
        var pindex5=LineGraph_AddNewGraph( context4,no_var,win_left,win_top,win_right,win_bottom);        
        LineGraph_SetLegendAttribute(pindex5,win_left+5,win_top+20,10,10,10);
        LineGraph_ShowHideLegend(pindex5,true);
        LineGraph_SetVariableColor(pindex5,0,'#ffffff');
        LineGraph_SetLineWidth(pindex5,2);      
        LineGraph_SetChartColor(pindex5,'#222222','#888800',50);    

        LineGraph_SetLegendText(pindex1,0,"x");
        LineGraph_SetLegendText(pindex1,1,"y");
        LineGraph_SetLegendText(pindex1,2,"z");
        LineGraph_SetLegendText(pindex2,0,"x");
        LineGraph_SetLegendText(pindex2,1,"y");
        LineGraph_SetLegendText(pindex2,2,"z");
        LineGraph_SetLegendText(pindex3,0,"x");
        LineGraph_SetLegendText(pindex3,1,"y");
        LineGraph_SetLegendText(pindex3,2,"z");
        LineGraph_SetLegendText(pindex4,0,"x");
        LineGraph_SetLegendText(pindex4,1,"y");
        LineGraph_SetLegendText(pindex4,2,"z");
        LineGraph_SetLegendText(pindex5,0,"LHS");
        LineGraph_SetLegendText(pindex5,1,"LTO");
        LineGraph_SetLegendText(pindex5,2,"RHS");
        LineGraph_SetLegendText(pindex5,3,"RTO");
        
        LineGraph_SetRange(pindex2,0,-32768,32768);
        LineGraph_SetRange(pindex2,1,-32768,32768);
        LineGraph_SetRange(pindex2,2,-32768,32768);
        LineGraph_SetRange(pindex1,0,-32768,32768);
        LineGraph_SetRange(pindex1,1,-32768,32768);
        LineGraph_SetRange(pindex1,2,-32768,32768);
        LineGraph_SetRange(pindex3,0,-32768,32768);
        LineGraph_SetRange(pindex3,1,-32768,32768);
        LineGraph_SetRange(pindex3,2,-32768,32768);
        LineGraph_SetRange(pindex4,0,0,50);
        LineGraph_SetRange(pindex4,1,0,50);
        LineGraph_SetRange(pindex4,2,0,50);
        LineGraph_SetRange(pindex5,0,-32768,32768);
        LineGraph_SetRange(pindex5,1,-32768,32768);
        LineGraph_SetRange(pindex5,2,-32768,32768);
        LineGraph_SetRange(pindex5,3,-32768,32768);

        
        
        //console.log("No line graphs:"+LineGraph_context.length);   
    }
}
