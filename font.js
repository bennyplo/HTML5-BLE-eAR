//********************************************************************
//* font.js
//*
//* Draw text in context
//*
//* by Benny Lo
//* May 29 2011
//********************************************************************
function drawTextwithContext(ctx,text,posx,posy,font,color,size,stroke)
{   //drawTextwithContext
    //ctx = context
    //text= string
    //posx= start position x
    //posy= start position y
    //font= font type, ex. Arial
    //color=font color, ex. #ff0000
    //size =font size
    //stroke=stroke or fill text (if stroke==false -> filled text)
    ctx.fillStyle = color;
    //ctx.font = "20pt Arial";
    ctx.font=size+"pt "+font;
    ctx.strokeStyle=color;
    if (stroke)
        ctx.strokeText(text,posx,posy);
    else ctx.fillText(text, posx, posy);     
}

