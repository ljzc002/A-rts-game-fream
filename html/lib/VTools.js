//在xyz描述下的2维和3维向量计算方法
var vxz={},vxyz={}
vxz.distance=function(a,b)//取平面两点间距离
{
    return Math.pow(Math.pow(a.x-b.x,2)+Math.pow(a.z-b.z,2),0.5);
}
vxz.substract=function(posFrom,posTo)//取两个二元向量的差向量
{
    var posRes={x:posTo.x-posFrom.x,z:posTo.z-posFrom.z};
    return posRes;
}
vxz.normal=function(pos)//标准化二元向量
{
    var length=Math.pow(pos.x*pos.x+pos.z*pos.z,0.5);
    var posRes;
    if(length!=0)
    {
        posRes={x:pos.x/length,z:pos.z/length};
    }
    else
    {
        posRes=pos;
    }
    return posRes;
}
vxz.times=function(pos,times)//二元向量伸缩
{
    var posRes={x:pos.x*times,z:pos.z*times};
    return posRes;
}
vxz.add=function(unit1,unit2)
{
    var posRes={x:unit1.x+unit2.x,z:unit1.z+unit2.z};
    return posRes;
}
vxz.isSameSide=function(vec1,vec2)
{
    var side=vec1.x*vec2.x+vec1.z*vec2.z;
    return side;
}

vxyz.distance=function(a,b)//取空间两点间距离
{
    return Math.pow(Math.pow(a.x-b.x,2)+Math.pow(a.y-b.y,2)+Math.pow(a.z-b.z,2),0.5);
}
vxyz.normal=function(pos)//标准化三元向量
{
    var length=Math.pow(pos.x*pos.x+pos.y*pos.y+pos.z*pos.z,0.5);
    var posRes;
    if(length!=0)
    {
        posRes={x:pos.x/length,y:pos.y/length,z:pos.z/length};
    }
    else
    {
        posRes=pos;
    }
    return posRes;
}
vxyz.times=function(pos,times)//三元向量伸缩
{
    var posRes={x:pos.x*times,y:pos.y*times,z:pos.z*times};
    return posRes;
}
//判断一条路径是否是凹多边形，以及凸多边形的顺逆时针属性（俯视）
//[[0, 0], [0, 5], [5, 5], [2, 2], [5, 0]]
function IsConcavePolygon(points){
  let direction = 0;
  var dir_res=0;
  for(let i = 0, l = points.length; i < l; i++){
    let res = getAngleBy3Point(points[i == 0 ? (l - 1) : (i - 1)], points[i], points[i == (l - 1) ? 0 : (i + 1)])
    if(res.direction!=0)
    {
      dir_res=res.direction;
    }
    //console.log(res)
    //乘积小于0，说明方向不一致，为凹多边形
    if(direction * res.direction < 0){
      return "adbx";//凹多边形
    }
    direction = direction || res.direction
  }
  if(dir_res>0)
  {
    return "nsz";//逆时针
  }
  else if(dir_res<0)
  {
    return "ssz";//逆时针
  }
  else if(dir_res==0)
  {
    return "zx";//直线
  }
}
function getAngleBy3Point(point1, point2, point3) {
  let xa = point2[0] - point1[0]
  let xb = point3[0] - point2[0]
  let ya = point2[1] - point1[1]
  let yb = point3[1] - point2[1]

  //direction 大于0 逆时针, 小于0 顺时针, 等于0 平行
  let angle = 0, direction = 0

  let _a = Math.sqrt(xa * xa + ya * ya)
  let _b = Math.sqrt(xb * xb + yb * yb)
  if(_a && _b){
    let p = xa * xb + ya * yb

    angle = Math.acos(p / (_a * _b))
    angle = angle / Math.PI * 180
    direction = xa * yb - ya * xb
    direction = direction < 0 ? -1 : direction > 0 ? 1 : 0
  }

  return { angle, direction }
}

class Point2D
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r)
{
  if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    return true;

  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r)
{

  // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  let val = (q.y - p.y) * (r.x - q.x) -
    (q.x - p.x) * (r.y - q.y);

  if (val == 0) return 0; // collinear

  return (val > 0)? 1: 2; // clock or counterclock wise
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2)
{

  // Find the four orientations needed for general and
  // special cases
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4)
    return true;

  // Special Cases
  // p1, q1 and p2 are collinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) return true;

  // p1, q1 and q2 are collinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) return true;

  // p2, q2 and p1 are collinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) return true;

  // p2, q2 and q1 are collinear and q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) return true;

  return false; // Doesn't fall in any of the above cases
}
//判断点是否在多边形范围内
function queryPtInPolygon(point, polygon)
{
  var p1, p2, p3, p4;

  p1 = point;
  p2 = { x: 1000000000000, y: point.y };

  var count = 0;
  //对每条边都和射线作对比
  for (var i = 0; i < polygon.length - 1; i++) {
    p3 = polygon[i];

    p4 = polygon[i + 1];
    if (doIntersect(p1, p2, p3, p4) == true) {
      count++;
    }
  }
  p3 = polygon[polygon.length - 1];

  p4 = polygon[0];
  if (doIntersect(p1, p2, p3, p4) == true) {
    count++;
  }

  return (count % 2 == 0) ? false : true;


  //判断两条线段是否相交
  function checkCross(p1, p2, p3, p4) {
    var v1 = { x: p1.x - p3.x, y: p1.y - p3.y },
      v2 = { x: p2.x - p3.x, y: p2.y - p3.y },

      v3 = { x: p4.x - p3.x, y: p4.y - p3.y },
      v = crossMul(v1, v3) * crossMul(v2, v3);

    v1 = { x: p3.x - p1.x, y: p3.y - p1.y };
    v2 = { x: p4.x - p1.x, y: p4.y - p1.y };

    v3 = { x: p2.x - p1.x, y: p2.y - p1.y };
    return (v <= 0 && crossMul(v1, v3) * crossMul(v2, v3) <= 0) ? true : false;

  }//这个叉乘法计算相交存在bug！例如如果p3p4不够长，也会被判断为相交！！！！

  //计算向量叉乘
  function crossMul(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
  }
}

