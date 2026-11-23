// @ts-nocheck
/* eslint-disable */
// Imperative canvas engine ported from the published "Turin Object Screening" viewer.
export function mountTurinViewer(root: HTMLElement, base: string): () => void {
"use strict";
var cv=root.querySelector("#tv-c"),ctx=cv.getContext("2d"),panel=root.querySelector("#panel"),
    loading=root.querySelector("#loading"),legend=root.querySelector("#legend");
var css=getComputedStyle(root);
function tok(n){return css.getPropertyValue(n).trim();}
var SEV=[tok("--s0"),tok("--s1"),tok("--s2"),tok("--s3")];
var BASE_COL={bld:tok("--c-bld"),veg:tok("--c-veg"),sq:tok("--c-sq"),road:tok("--c-road"),wat:tok("--c-wat"),land:tok("--c-land")};

var SETS=[{file:base+"study_area.json",kind:"aoi"},{file:base+"land_use.json",kind:"land"},
          {file:base+"water.json",kind:"wat"},
          {file:base+"vegetation.json",kind:"veg"},{file:base+"squares.json",kind:"sq"},
          {file:base+"roads.json",kind:"road"},{file:base+"buildings.json",kind:"bld"}];
var LAYER={land:0,wat:1,veg:2,sq:3,road:4,bld:5};
// In the screening view the legend doubles as a filter: each row can be switched off
// so that only the objects of interest stay on screen.
var FILT={};                       // "<mode>:<bucket>" -> false when switched off
var FKEYS={screening:["0","1","2","3","wat"],
           heat:["h0","h1","h2","h3","nm","wat"],
           drought:["d0","d1","d2","wat"],
           flood:["f0","f1","f2","f3"]};
// Which legend row an object belongs to, matching colourOf exactly. Roads are coloured
// by their own criteria count in every view, so outside the screening view they sit in
// no row of the legend and are never filtered; the same holds for anything unclassified.
function bucket(f){
  var p=f.p;
  if(mode==="screening"){
    if(f.kind==="wat")return "wat";
    return String(Math.min(3,(f.kind==="road")?(+p.n_criteria||0):(+p.N_INDICATORS||0)));
  }
  if(f.kind==="road")return null;
  if(mode==="heat"){
    if(f.kind==="wat")return "wat";
    var v=p.LST_MEAN; if(v==null)return "nm";
    return v<38?"h0":(v<41?"h1":(v<44?"h2":"h3"));
  }
  if(mode==="drought"){
    if(f.kind==="wat")return "wat";
    var y=+p.N_YEARS_STRESSED||0;
    return y===0?"d0":(y<3?"d1":"d2");
  }
  if(mode==="flood"){
    if(p.FLOODED_2016==="yes")return "f3";
    var q=+p.PGRA_M_PCT||0;
    return q<=0?"f0":(q>=100?"f2":"f1");
  }
  return null;
}
function shown(f){ var k=bucket(f); return k===null||FILT[mode+":"+k]!==false; }
var feats=[],lon0=0,lat0=0,mx=1,my=1,ready=false;
var yaw=-0.42,elev=0.62,zoom=1,mode="screening",sel=null,dragging=false;

function lerp(a,b,t){return a+(b-a)*t;}
function mix(c1,c2,t){return "rgb("+Math.round(lerp(c1[0],c2[0],t))+","+Math.round(lerp(c1[1],c2[1],t))+","+Math.round(lerp(c1[2],c2[2],t))+")";}
function rgb(h){h=h.replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function shade(col,k){var m=/rgb\((\d+),(\d+),(\d+)\)/.exec(col);var c=m?[+m[1],+m[2],+m[3]]:rgb(col);
  return "rgb("+Math.round(c[0]*k)+","+Math.round(c[1]*k)+","+Math.round(c[2]*k)+")";}

function rings(g){ // -> array of coordinate rings (outer rings only)
  if(!g)return [];
  if(g.type==="Polygon")return [g.coordinates[0]];
  if(g.type==="MultiPolygon")return g.coordinates.map(function(p){return p[0];});
  if(g.type==="LineString")return [g.coordinates];
  if(g.type==="MultiLineString")return g.coordinates;
  return [];
}

Promise.all(SETS.map(function(s){return fetch(s.file).then(function(r){return r.json();})
  .then(function(j){return {kind:s.kind,json:j};}).catch(function(){return {kind:s.kind,json:null};});}))
.then(function(res){
  var minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9,all=[];
  res.forEach(function(r){ if(!r.json)return;
    r.json.features.forEach(function(f){ all.push({kind:r.kind,p:f.properties||{},g:f.geometry}); });});
  all.forEach(function(o){ rings(o.g).forEach(function(rg){ rg.forEach(function(c){
    if(c[0]<minx)minx=c[0]; if(c[0]>maxx)maxx=c[0]; if(c[1]<miny)miny=c[1]; if(c[1]>maxy)maxy=c[1];});});});
  lon0=(minx+maxx)/2; lat0=(miny+maxy)/2;
  mx=111320*Math.cos(lat0*Math.PI/180); my=110540;
  all.forEach(function(o){
    var rs=rings(o.g).map(function(rg){
      var pts=rg.map(function(c){return [(c[0]-lon0)*mx,(c[1]-lat0)*my];});
      // normalise to counter-clockwise so wall visibility is a single test
      var a=0; for(var i=0,n=pts.length;i<n;i++){var j=(i+1)%n; a+=pts[i][0]*pts[j][1]-pts[j][0]*pts[i][1];}
      if(a<0)pts.reverse();
      return pts;});
    if(!rs.length)return;
    var cx=0,cy=0,k=0;
    rs.forEach(function(p){p.forEach(function(q){cx+=q[0];cy+=q[1];k++;});});
    var h=o.kind==="bld"?Math.max(2,+o.p.HEIGHT||3):0;
    feats.push({kind:o.kind,p:o.p,rs:rs,cx:cx/k,cy:cy/k,h:h});
  });
  bounds={minx:1e9,maxx:-1e9,miny:1e9,maxy:-1e9};
  feats.forEach(function(f){ if(f.kind==="aoi")return;   // frame the objects, not the study-area square
    f.rs.forEach(function(rg){ rg.forEach(function(q){
    if(q[0]<bounds.minx)bounds.minx=q[0]; if(q[0]>bounds.maxx)bounds.maxx=q[0];
    if(q[1]<bounds.miny)bounds.miny=q[1]; if(q[1]>bounds.maxy)bounds.maxy=q[1];});});});
  ready=true; loading.hidden=true; counts(); setLegend(); resize();
});

function counts(){
  var n=0,fl=0;
  feats.forEach(function(f){ if(f.kind==="road"||f.kind==="aoi")return; n++; if(+f.p.N_INDICATORS>0)fl++; });
  root.querySelector("#counts").innerHTML=
    '<div><b>'+n.toLocaleString("en")+'</b>objects</div>'+
    '<div><b>'+fl.toLocaleString("en")+'</b>flagged</div>'+
    '<div><b>'+Math.round(100*fl/n)+'%</b>of the district</div>';
}

// ---- colour by mode
var HEAT=[rgb("#f0e4c3"),rgb("#e4a955"),rgb("#c45a2a"),rgb("#8c2416")];
function ramp(t,stops){ t=Math.max(0,Math.min(1,t)); var s=t*(stops.length-1),i=Math.floor(s);
  if(i>=stops.length-1)return "rgb("+stops[stops.length-1].join(",")+")"; return mix(stops[i],stops[i+1],s-i);}
function colourOf(f){
  var p=f.p;
  if(f.kind==="road"){ return (+p.n_criteria>0)?SEV[Math.min(3,+p.n_criteria)]:BASE_COL.road; }
  if(f.kind==="wat"&&mode!=="flood"){ return BASE_COL.wat; }
  if(mode==="screening"){ var n=+p.N_INDICATORS||0; return n?SEV[Math.min(3,n)]:(BASE_COL[f.kind]||SEV[0]); }
  if(mode==="heat"){ var v=p.LST_MEAN; if(v==null)return BASE_COL[f.kind]||SEV[0];
    return ramp((v-34)/(45-34),HEAT); }
  if(mode==="drought"){ var y=+p.N_YEARS_STRESSED; if(!y)return BASE_COL[f.kind]||SEV[0];
    return ramp(y/5,[rgb("#e8d6a0"),rgb("#c98a2e"),rgb("#8c3b1e")]); }
  if(mode==="flood"){ if(p.FLOODED_2016==="yes")return "rgb(30,90,150)";
    var q=+p.PGRA_M_PCT; if(!q)return BASE_COL[f.kind]||SEV[0];
    return ramp(q/100,[rgb("#b8cfe0"),rgb("#2e6c9e")]); }
  return SEV[0];
}
var LEG={
 screening:["Screening result",[[BASE_COL.bld,"nothing flagged"],[SEV[1],"1 indicator"],[SEV[2],"2 indicators"],[SEV[3],"3 or more"],[BASE_COL.wat,"water"]]],
 heat:["Surface temperature, 22 July 2022",[["rgb(234,196,135)","below 38 °C"],["rgb(212,130,64)","38 to 41 °C"],["rgb(178,73,36)","41 to 44 °C"],["rgb(140,36,22)","44 °C and above"],[BASE_COL.bld,"not measured"],[BASE_COL.wat,"water, not measured"]]],
 drought:["Years when the greenery was under drought stress, 2018–2025",[[BASE_COL.bld,"none"],["rgb(213,168,92)","1 to 2 years"],["rgb(177,106,40)","3 to 4 years"],[BASE_COL.wat,"water, not assessed"]]],
 flood:["Flood exposure",[[SEV[0],"outside the hazard zone"],["rgb(184,207,224)","partly in the hazard zone"],["rgb(46,108,158)","fully in the hazard zone"],["rgb(30,90,150)","flooded in November 2016"]]]
};
function setLegend(){ var L=LEG[mode]; legend.hidden=false;
  root.querySelector("#legend-title").textContent=L[0];
  var body=root.querySelector("#legend-body"), keys=FKEYS[mode]||[];
  var h=L[1].map(function(r,i){
    var k=keys[i];
    if(!k) return '<div class="row"><span class="sw" style="background:'+r[0]+'"></span>'+r[1]+'</div>';
    return '<label class="row"><input type="checkbox" data-b="'+k+'"'+
           (FILT[mode+":"+k]!==false?" checked":"")+
           '><span class="sw" style="background:'+r[0]+'"></span>'+r[1]+'</label>';}).join("");
  var tot=0,vis=0;
  feats.forEach(function(f){ if(f.kind==="road"||f.kind==="aoi")return; tot++; if(shown(f))vis++; });
  if(vis!==tot) h+='<div class="shown">'+vis.toLocaleString("en")+' of '+
                   tot.toLocaleString("en")+' objects shown</div>';
  body.innerHTML=h;
  Array.prototype.forEach.call(body.querySelectorAll("input[data-b]"),function(cb){
    cb.addEventListener("change",function(){
      FILT[mode+":"+cb.getAttribute("data-b")]=cb.checked;
      if(sel&&!shown(sel)){ sel=null; show(null); }
      setLegend(); draw();
    });
  });
}

// ---- projection
var W=0,H=0,scale=1,ox=0,oy=0,base=1,bounds=null;
function project(x,y,z){ var c=Math.cos(yaw),s=Math.sin(yaw);
  var X=x*c-y*s, Y=x*s+y*c;
  return [ox+X*scale, oy-(Y*Math.sin(elev)+z*Math.cos(elev))*scale];
}
function resize(){
  var r=cv.parentNode.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
  W=Math.max(1,Math.round(r.width)); H=Math.max(1,Math.round(r.height));
  cv.width=W*d; cv.height=H*d; ctx.setTransform(d,0,0,d,0,0);
  draw();
}
function frame(){ // keep the district centred and filling the view as the camera turns
  if(!bounds)return;
  var c=Math.cos(yaw),s=Math.sin(yaw),se=Math.sin(elev),xs=[],ys=[];
  [[bounds.minx,bounds.miny],[bounds.maxx,bounds.miny],[bounds.maxx,bounds.maxy],[bounds.minx,bounds.maxy]]
    .forEach(function(p){ xs.push(p[0]*c-p[1]*s); ys.push((p[0]*s+p[1]*c)*se); });
  var x1=Math.min.apply(null,xs),x2=Math.max.apply(null,xs),
      y1=Math.min.apply(null,ys),y2=Math.max.apply(null,ys);
  base=Math.min(W*0.92/Math.max(1,x2-x1), H*0.84/Math.max(1,y2-y1));
  scale=base*zoom;
  ox=W/2-(x1+x2)/2*scale; oy=H/2+(y1+y2)/2*scale;
}
function draw(){
  ctx.clearRect(0,0,W,H);
  if(!ready)return;
  frame();
  var aoi=null;
  for(var ai=0;ai<feats.length;ai++) if(feats[ai].kind==="aoi"){ aoi=feats[ai]; break; }
  if(aoi){ ctx.strokeStyle="rgba(90,96,100,.55)"; ctx.lineWidth=1.2; ctx.setLineDash([7,5]);
    aoi.rs.forEach(function(rg){ ctx.beginPath();
      for(var k=0;k<rg.length;k++){ var q=project(rg[k][0],rg[k][1],0); k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]); }
      ctx.closePath(); ctx.stroke(); });
    ctx.setLineDash([]); }
  // Flat ground polygons are coplanar, so sorting them by depth alone is arbitrary and a
  // land-use area can land on top of the river. Stack them by layer first; buildings are
  // extruded and still need the painter's algorithm among themselves.
  var order=feats.filter(function(f){return f.kind!=="aoi"&&shown(f);}).sort(function(a,b){
    var ra=LAYER[a.kind]||0, rb=LAYER[b.kind]||0;
    if(ra!==rb)return ra-rb;
    var ca=Math.cos(yaw),sa=Math.sin(yaw);
    var ya=a.cx*sa+a.cy*ca, yb=b.cx*sa+b.cy*ca;
    if(yb!==ya)return yb-ya;
    return a.h-b.h;});
  var fast=dragging;
  for(var i=0;i<order.length;i++){
    var f=order[i],col=colourOf(f),isSel=(f===sel);
    if(f.kind==="road"){
      ctx.strokeStyle=isSel?tok("--accent"):col; ctx.lineWidth=isSel?4.5:3; ctx.lineJoin="round"; ctx.lineCap="round";
      f.rs.forEach(function(rg){ ctx.beginPath();
        for(var k=0;k<rg.length;k++){var q=project(rg[k][0],rg[k][1],0.4); k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}
        ctx.stroke(); });
      continue;
    }
    if(f.h>0&&!fast){ // walls, only the faces turned toward the viewer
      ctx.fillStyle=shade(col,0.66);
      for(var r0=0;r0<f.rs.length;r0++){ var rg=f.rs[r0];
        for(var k=0;k<rg.length;k++){ var p1=rg[k],p2=rg[(k+1)%rg.length];
          var c=Math.cos(yaw),s=Math.sin(yaw);
          if((p2[0]-p1[0])*c-(p2[1]-p1[1])*s<=0)continue;
          var a1=project(p1[0],p1[1],0),a2=project(p2[0],p2[1],0),
              b2=project(p2[0],p2[1],f.h),b1=project(p1[0],p1[1],f.h);
          ctx.beginPath();ctx.moveTo(a1[0],a1[1]);ctx.lineTo(a2[0],a2[1]);ctx.lineTo(b2[0],b2[1]);ctx.lineTo(b1[0],b1[1]);ctx.closePath();ctx.fill();
        } }
    }
    ctx.fillStyle=col;
    ctx.beginPath();
    for(var r1=0;r1<f.rs.length;r1++){ var rr=f.rs[r1];
      for(var m=0;m<rr.length;m++){ var pt=project(rr[m][0],rr[m][1],f.h); m?ctx.lineTo(pt[0],pt[1]):ctx.moveTo(pt[0],pt[1]); }
      ctx.closePath(); }
    ctx.fill();
    if(isSel){ ctx.strokeStyle=tok("--accent"); ctx.lineWidth=2.5; ctx.stroke(); }
    else if(f.kind==="bld"&&!fast&&scale>0.12){ ctx.strokeStyle="rgba(0,0,0,.14)"; ctx.lineWidth=0.5; ctx.stroke(); }
  }
  if(!fast){ var vg=ctx.createRadialGradient(W/2,H*0.52,Math.min(W,H)*0.25,W/2,H*0.52,Math.max(W,H)*0.72);
    vg.addColorStop(0,"rgba(0,0,0,0)"); vg.addColorStop(1,"rgba(0,0,0,.16)");
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H); }
}

// ---- interaction
function inPoly(px,py,ring,h){
  var hit=false;
  for(var i=0,j=ring.length-1;i<ring.length;j=i++){
    var a=project(ring[i][0],ring[i][1],h),b=project(ring[j][0],ring[j][1],h);
    if((a[1]>py)!==(b[1]>py)&&px<(b[0]-a[0])*(py-a[1])/(b[1]-a[1])+a[0])hit=!hit;}
  return hit;
}
function pick(px,py){
  var ca=Math.cos(yaw),sa=Math.sin(yaw);
  var order=feats.slice().sort(function(a,b){
    var ya=a.cx*sa+a.cy*ca, yb=b.cx*sa+b.cy*ca; return ya-yb;});
  for(var i=0;i<order.length;i++){ var f=order[i];
    if(f.kind==="road"||f.kind==="aoi"||!shown(f))continue;
    for(var r=0;r<f.rs.length;r++) if(inPoly(px,py,f.rs[r],f.h))return f; }
  for(var k=0;k<feats.length;k++){ var g=feats[k]; if(g.kind!=="road"||!shown(g))continue;
    for(var q=0;q<g.rs.length;q++){ var rg=g.rs[q];
      for(var m=0;m<rg.length-1;m++){ var a=project(rg[m][0],rg[m][1],0.4),b=project(rg[m+1][0],rg[m+1][1],0.4);
        var dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy; if(!L)continue;
        var t=Math.max(0,Math.min(1,((px-a[0])*dx+(py-a[1])*dy)/L));
        var ex=a[0]+t*dx-px,ey=a[1]+t*dy-py;
        if(ex*ex+ey*ey<36)return g; } } }
  return null;
}
var CLASS={bld:"Building",veg:"Vegetation object",sq:"Pedestrian area",road:"Road segment",wat:"Water body",land:"Land-use area"};
function num(v,d,u){ if(v===null||v===undefined||v==="")return null;
  var x=+v; if(isNaN(x))return String(v); return x.toFixed(d===undefined?2:d)+(u||""); }
function dl(rows){ var out=rows.filter(function(r){return r[1]!=null;});
  if(!out.length)return ""; return "<dl>"+out.map(function(r){return "<dt>"+r[0]+"</dt><dd>"+r[1]+"</dd>";}).join("")+"</dl>"; }
function grp(title,body,note,lead){ if(!body)return "";
  return '<div class="grp"><h3>'+title+'</h3>'+(lead?'<p class="lead">'+lead+'</p>':'')+body+
         (note?'<p class="note">'+note+'</p>':'')+'</div>'; }
function tech(t){ return ' <span class="tech">'+t+'</span>'; }
var PLURAL={bld:"buildings",veg:"green areas",sq:"pedestrian areas",wat:"water bodies",land:"land-use areas"};
function heatLead(p,kind){
  if(p.LST_MEAN==null)return null;
  var a=p.LST_ANOM_K,r=p.LST_RANK_PCT,parts=[];
  parts.push("On the summer day measured it was "+(+p.LST_MEAN).toFixed(1)+" \u00B0C here");
  if(a!=null)parts.push(Math.abs(a).toFixed(1)+" K "+(a>=0?"warmer":"cooler")+" than the district as a whole");
  if(r!=null)parts.push("warmer than "+Math.round(r)+" % of the "+(PLURAL[kind]||"objects"));
  return parts.join(", ")+".";
}
function droughtLead(p){
  var y=p.N_YEARS_STRESSED;
  if(y==null)return "Drought is not assessed for this kind of object.";
  if(+y===0)return "The greenery here held up in every summer from 2018 to 2025.";
  return "The greenery here suffered in "+y+" of the eight summers since 2018"+
    (p.YEARS_STRESSED?" ("+String(p.YEARS_STRESSED).split(";").join(", ")+")":"")+
    (p.COMPOUND_HEAT_DROUGHT==="yes"?", and in 2022 that came together with unusual surface heat":"")+".";
}
function floodLead(p){
  if(p.FLOODED_2016==="yes")return "This object lies inside the area that was actually under water in November 2016.";
  var q=p.PGRA_M_PCT;
  if(q==null)return null;
  if(+q<=0)return "It lies outside the official river-flood hazard zone.";
  if(+q>=99)return "It lies entirely inside the official river-flood hazard zone.";
  return Math.round(+q)+" % of it lies inside the official river-flood hazard zone.";
}
function greenLead(p){
  var c=p.CANOPY_PCT,i=p.IMPERV_SC_PCT,out=[];
  if(c==null&&i==null)return null;
  if(i!=null)out.push(Math.round(+i)+" % of the surface is sealed");
  if(c!=null)out.push(Math.round(+c)+" % is under tree crowns");
  return out.join(" and ")+".";
}
function trendWords(sl,pv){
  if(sl==null)return null;
  var w=(pv!=null&&+pv<0.05)?((+sl<0)?"getting less green":"getting greener"):"no clear trend";
  return w+tech((+sl).toFixed(4)+" per year, p "+(pv==null?"\u2013":(+pv).toFixed(2)));
}
function zWords(z){
  if(z==null)return null;
  return ((+z>=1)?"beyond the normal range":"within the normal range")+tech((+z).toFixed(2)+" \u00D7 normal variation");
}

function show(f){
  sel=f;
  if(!f){ panel.innerHTML='<p class="empty">Select an object in the view to see the satellite measurements that were '+
    'derived for it, and the geometry each value was measured over.</p><div class="counts" id="counts"></div>';
    counts(); draw(); return; }
  var p=f.p,road=f.kind==="road";
  var n=road?(+p.n_criteria||0):(+p.N_INDICATORS||0);
  var flag=n>0?"Stressed":"Not stressed";
  var h='<p class="idline">'+CLASS[f.kind]+'</p><h2>'+(road?(p.TOPONIMO||("Segment "+p.id_int)):p.gml_id)+'</h2>'+
    '<span class="chip" style="background:'+SEV[Math.min(3,n)]+'22;color:var(--ink)">'+
    '<span class="dot" style="background:'+SEV[Math.min(3,n)]+'"></span>'+flag+
    (n?" &middot; "+n+(n>1?" indicators":" indicator"):"")+'</span>';
  if(!road){
    var appl=0;
    ["FLOOD_EXPOSURE","DROUGHT_HEAT_EXPOSURE","GREEN_INFRA_DEFICIT","DROUGHT_VEG_IMPACT"].forEach(function(k){
      if(p[k]!=null&&p[k]!=="")appl++; });
    if(appl)h+='<p class="lead" style="margin-top:10px">Of the '+appl+' checks that apply to this kind of object, '+
      (n?('it fails '+n+'.'):'it passes all.')+'</p>';
  }

  if(road){
    var Y=function(v){return (v===true||v==="True")?"yes":"no";};
    h+=grp("What was checked",dl([["In the river-flood hazard zone",Y(p.crit_flood)],
      ["Unusually hot in summer",Y(p.crit_thermal)],
      ["Greenery along the road suffered from drought",Y(p.crit_drought)],
      ["Little greenery and much sealed surface",Y(p.crit_veg_imperv)]]));
    h+=grp("Measured",dl([["Surface temperature, summer 2022",num(p.LST_MEAN,1," °C")],
      ["Sealed surface",num(p.IMPERV_PCT,1," %")],["Distance to the river",num(p.DIST_RIVER,0," m")]]),
      "One of the 82 segments of the published Chapter 3 analysis. Values are measured over buffers sized to each sensor: 10 m for the 5 cm airborne imagery, 30 m for Sentinel-2 and the thermal data.");
    panel.innerHTML=h; draw(); return;
  }

  var ctxNote = p.SUPPORT_LST==="context"
    ? "This object is smaller than one 30 m thermal pixel, so the temperature describes its surroundings, not the object itself."
    : (p.ZONE_TYPE==="ring30"
       ? "Measured over a 30 m ring around the footprint, so that several pixels contribute. It describes the surroundings of the building."
       : "The object covers at least one whole pixel, so the value is measured on the object.");

  h+=grp("Summer heat",dl([["Surface temperature, 22 July 2022",num(p.LST_MEAN,1," °C")],
      ["Compared with the district",p.LST_ANOM_K!=null?(Math.abs(p.LST_ANOM_K).toFixed(1)+" K "+(p.LST_ANOM_K>=0?"warmer":"cooler")):null],
      ["Hotter than other objects of its kind",p.LST_RANK_PCT!=null?("warmer than "+Math.round(p.LST_RANK_PCT)+" %"):null]]),
      ctxNote,heatLead(p,f.kind));

  h+=grp("Drought stress, 2018–2025",dl([
      ["Summers when the greenery suffered",p.N_YEARS_STRESSED!=null?p.N_YEARS_STRESSED+" of 8":null],
      ["Which summers",p.YEARS_STRESSED?String(p.YEARS_STRESSED).split(";").join(", "):null],
      ["Loss of greenness in 2022"+tech("NDVI"),zWords(p.DROUGHT_Z_NDVI)],
      ["Loss of moisture in 2022"+tech("NDMI"),zWords(p.DROUGHT_Z_NDMI)],
      ["How green in August 2022"+tech("0 = bare, 0.8 = dense"),num(p.NDVI_S2_AUG,2)],
      ["Change since 2018",trendWords(p.NDVI_TREND_AUG,p.NDVI_TREND_P)],
      ["Heat and drought in the same summer",p.COMPOUND_HEAT_DROUGHT||null]]),
      "Measured from Sentinel-2 satellite images. What is measured is how much greenness an object loses between April and August, with each summer compared against the other seven, so no year is assumed in advance to be the dry one. Two summers stand out, 2022 and 2025, and for different reasons: 2022 was poor from spring onwards, during the Po drought, while 2025 began with the greenest spring of the eight years and lost it during the July heat, in a year when northern Italy was in fact wetter than normal. So a summer counted here means the greenery lost condition, not necessarily that water was short.",
      droughtLead(p));

  h+=grp("River flooding",dl([
      ["Share inside the hazard zone"+tech("1-in-100 years or more often"),num(p.PGRA_M_PCT,0," %")],
      ["Was it flooded in November 2016",p.FLOODED_2016||null],
      ["Height above the nearest watercourse"+tech("lower means more exposed"),num(p.HAND_MEAN,1," m")],
      ["Flooding and drought on the same object",p.MULTI_STRESS||null]]),
      "The hazard zone comes from the official flood maps of the Po River District; the 2016 extent was mapped from satellite images by the Copernicus emergency service. Both are outlines on a map, so these shares are exact for this object.",
      floodLead(p));

  h+=grp("Greenery and hard surfaces",dl([
      ["Under tree crowns",num(p.CANOPY_PCT,1," %")],
      ["Sealed: asphalt, concrete, roofs",num(p.IMPERV_SC_PCT,1," %")]]),
      p.IMPERV_SC_PCT==null?"Sealing was mapped only along the road corridors, so there is no value here yet.":
      "Measured from the aerial survey of January 2022, at 5 cm and 50 cm detail.",
      greenLead(p));

  var mc=p.FLAG_FREQ_MC!=null?Math.round(100*p.FLAG_FREQ_MC):null;
  h+=grp("How certain is this",dl([
      ["Still flagged when the thresholds are varied",mc!=null?mc+" % of 2,000 tests":null]]),
      "The thresholds that decide \u201Cstressed\u201D are a judgement. The test moves all of them at once, 2,000 times, within reasonable limits.",
      mc==null?null:(mc>=90?"The result is stable: moving the thresholds barely changes it.":
        (mc<=10?"The result is stable: this object stays below the thresholds.":
         "This object sits near a threshold, so the answer depends on where the line is drawn.")));
  panel.innerHTML=h; draw();
}

var px0=0,py0=0,y0=0,e0=0,moved=0;
cv.addEventListener("pointerdown",function(e){dragging=true;moved=0;px0=e.clientX;py0=e.clientY;y0=yaw;e0=elev;
  cv.classList.add("dragging");cv.setPointerCapture(e.pointerId);});
cv.addEventListener("pointermove",function(e){ if(!dragging)return;
  var dx=e.clientX-px0,dy=e.clientY-py0; moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));
  yaw=y0+dx*0.006; elev=Math.max(0.18,Math.min(1.5,e0+dy*0.004)); draw();});
function endDrag(e){ if(!dragging)return; dragging=false; cv.classList.remove("dragging"); draw();
  if(moved<5){ var r=cv.getBoundingClientRect(); show(pick(e.clientX-r.left,e.clientY-r.top)); } }
cv.addEventListener("pointerup",endDrag);
cv.addEventListener("pointercancel",function(){dragging=false;cv.classList.remove("dragging");draw();});
cv.addEventListener("wheel",function(e){e.preventDefault();zoom=Math.max(0.4,Math.min(14,zoom*(e.deltaY<0?1.12:0.89)));draw();},{passive:false});
cv.addEventListener("dblclick",function(){yaw=-0.42;elev=0.62;zoom=1;draw();});
root.querySelectorAll("[data-mode]").forEach(function(b){
  b.addEventListener("click",function(){
    root.querySelectorAll("[data-mode]").forEach(function(o){o.setAttribute("aria-pressed",o===b?"true":"false");});
    mode=b.dataset.mode; setLegend(); draw();});});
window.addEventListener("resize",resize);
resize();
return function(){ window.removeEventListener("resize",resize); };

}
