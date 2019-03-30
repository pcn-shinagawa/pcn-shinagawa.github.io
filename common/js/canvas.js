var can;
var ct;
var ox=0,oy=0,x=0,y=0;
var mf=false;
var w;
var h;

  function mam_draw_init(){
    //初期設定
    can=document.getElementById("can");
    can.addEventListener("touchstart",onDown,false);
    can.addEventListener("touchmove",onMove,false);
    can.addEventListener("touchend",onUp,false);
    can.addEventListener("mousedown",onMouseDown,false);
    can.addEventListener("mousemove",onMouseMove,false);
    can.addEventListener("mouseup",onMouseUp,false);
    w = $('#candiv').width();
    h = $('#candiv').height();
    $('#can').attr('width', w);
    $('#can').attr('height', h);
    ct=can.getContext("2d");
    ct.strokeStyle="#FFFFFF";
    ct.lineWidth=5;
    ct.lineJoin="round";
    ct.lineCap="round";
    ct.globalAlpha="1";
    
    // w1 = $('#pcnlogo').width();
    // h1 = $('#pcnlogo').height();
    // $('#pcnlogo').attr('width', w);
    // $('#pcnlogo').attr('height', h);
    // clearCan();
  }
  function onDown(event){
    mf=true;
    ox=event.touches[0].pageX-event.target.getBoundingClientRect().left;
    oy=event.touches[0].pageY-event.target.getBoundingClientRect().top;
    event.stopPropagation();
  }
  function onMove(event){
    if(mf){
      x=event.touches[0].pageX-event.target.getBoundingClientRect().left;
      y=event.touches[0].pageY-event.target.getBoundingClientRect().top;
      drawLine();
      ox=x;
      oy=y;
      event.preventDefault();
      event.stopPropagation();
    }
  }
  function onUp(event){
    mf=false;
    event.stopPropagation();
  }

  function onMouseDown(event){
    ox=event.clientX-event.target.getBoundingClientRect().left;
    oy=event.clientY-event.target.getBoundingClientRect().top ;
    mf=true;
  }
  function onMouseMove(event){
    if(mf){
      x=event.clientX-event.target.getBoundingClientRect().left;
      y=event.clientY-event.target.getBoundingClientRect().top ;
      drawLine();
      ox=x;
      oy=y;
    }
  }
  function onMouseUp(event){
    mf=false;
  }
  function drawLine(){
    ct.beginPath();
    ct.moveTo(ox,oy);
    ct.lineTo(x,y);
    ct.stroke();
  }
  function clearCan(){
    w = $('#candiv').width();
    h = $('#candiv').height();
    $('#can').attr('width', w);
    $('#can').attr('height', h);
    ct=can.getContext("2d");
    ct.strokeStyle="#FFFFFF";
    ct.lineWidth=5;
    ct.lineJoin="round";
    ct.lineCap="round";
    ct.globalAlpha="1";
    $('#pcnlogo').attr('style', 'display: none');
  }