const c=document.getElementById("embers");
const ctx=c.getContext("2d");
function resize(){c.width=innerWidth;c.height=innerHeight}
addEventListener("resize",resize);resize();

const embers=[...Array(90)].map(()=>({
  x:Math.random()*c.width,
  y:Math.random()*c.height,
  r:Math.random()*2+1,
  v:Math.random()*0.8+0.3
}));

(function draw(){
  ctx.clearRect(0,0,c.width,c.height);
  embers.forEach(e=>{
    e.y-=e.v;
    if(e.y<0){e.y=c.height;e.x=Math.random()*c.width}
    ctx.fillStyle="rgba(255,170,120,.6)";
    ctx.beginPath();
    ctx.arc(e.x,e.y,e.r,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(draw);
})();
