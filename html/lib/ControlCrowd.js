//用来控制群组导航
async function initCrowd(arr_mesh)
{
    //尝试使用TileCacheMeshProcess 技术分块构造导航网格
    navigationPlugin = await ADDONS.CreateNavigationPluginAsync();
    //const cellSize = 0.05;
    const navmeshParameters = {
        cs: 0.1,
        ch: 0.2,maxObstacles: 64,
        expectedLayersPerTile: 2,
        tileCacheMeshProcess:tp,tileSize: 32,
    }
    const { navMesh,tileCache, navMeshQuery } = await navigationPlugin.createNavMeshAsync(arr_mesh, navmeshParameters);
    visualizeCrowd(navMeshQuery);
}
var count_tile;
function tp(navMeshCreateParams,polyAreas,polyFlags){

    const STAIRS_AREA = 1;
    const DEFAULT_AREA = 0;
    const WALK_FLAG = 1;//这是水平移动消耗？
    const STAIRS_FLAG = 10;
    count_tile=0;
    const vertsCount = navMeshCreateParams.vertCount();
    const polyCount=navMeshCreateParams.polyCount();
    const indicesCount = polyCount;
    var tileX=navMeshCreateParams.tileX();//这个瓦片的水平偏移量？
    var tileY=navMeshCreateParams.tileY();
    for (let i = 0; i < polyCount; i++) {//对于每个多边形
        // compute average y of polygon vertices
        const idx0 = navMeshCreateParams.polys(i * 3 + 0);//polys是顶点的索引，例如一个正方形多边形包括四个顶点
        const idx1 = navMeshCreateParams.polys(i * 3 + 1);
        const idx2 = navMeshCreateParams.polys(i * 3 + 2);//polys(4)是65535
        //verts是顶点数据，
        //const avgY = (navMeshCreateParams.verts(idx0 * 3 + 1) + navMeshCreateParams.verts(idx1 * 3 + 1) + navMeshCreateParams.verts(idx2 * 3 + 1)) / 3;

        if (tileX>=10) {
            polyAreas.set(i,STAIRS_AREA)
            polyFlags.set(i,STAIRS_FLAG)
            //polyAreas[i] = STAIRS_AREA;
            //polyFlags[i] = STAIRS_FLAG;
        } else {
            polyAreas.set(i,DEFAULT_AREA)
            polyFlags.set(i,WALK_FLAG)
            //polyAreas[i] = DEFAULT_AREA;
            //polyFlags[i] = WALK_FLAG;
        }
        count_tile++;
    }

}
var agents,crowd,obj_agentv={};
var baseSpeed=5.0;
var agentParams = {
    radius: 0.1 + Math.random() * 0.05,
    height: 1.5,
    maxAcceleration: 11.0,
    maxSpeed: baseSpeed,
    separationWeight: 1.0,
}
function visualizeCrowd(navMeshQuery) {
    crowd = navigationPlugin.createCrowd(100, 0.15, scene);
    obj_agentv={};
    for (let i = 0; i < 100; i++) {

        const { randomPoint: position } =
            navMeshQuery.findRandomPointAroundCircle({ x: 0, y: 0, z: 0 }, 1);
        var flag_found=false;
        for(var key in obj_maparea)
        {
            if(flag_found)
            {
                break;
            }
            var arr_path=obj_maparea[key];
            var len2=arr_path.length;
            for(var j=0;j<len2;j++)
            {
                var path=arr_path[j];
                if(queryPtInPolygon({x:position.x,y:position.z},path))//如果在这个速度区域内
                {
                    agentParams.maxSpeed=parseFloat(key);
                    flag_found=true;
                    break;
                }
            }
        }
        if(!flag_found)
        {
            agentParams.maxSpeed=baseSpeed;
        }
        createAgent(agentParams, position, crowd)
    }
    //agents有固定的id吗？
    agents = crowd.getAgents();//这个方法返回的是数字索引！！

    //var len=
    //这些代理器可能被导航到不同的目标
    // function moveCrowdAgents(pickedPoint) {
    //     for (let i = 0; i < agents.length; i++) {
    //         crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(pickedPoint))
    //     }
    // }
    // return {  moveCrowdAgents, agents }

}
var obj_agentTrans={};
function createAgent(agentParams, position, crowd) {
    //单位初始化在不同区域，需使用不同的速度初始化参数！！！！

    const agentTransform = new BABYLON.TransformNode();
    const agentIndex = crowd.addAgent(position, agentParams, agentTransform);

    agentTransform.name = `agent-transform-${agentIndex}`

    const agentMesh = createAgentMesh(agentParams, agentIndex)
    agentMesh.parent = agentTransform;
    agentTransform.mydata={};
    agentTransform.mydata.maxSpeed=agentParams.maxSpeed;
    agentTransform.mydata.agentIndex=agentIndex;
    obj_agentTrans[agentTransform.name]=agentTransform;
    return { agentIndex, agentMesh, agentTransform }
}
function createAgentMesh(agentParams, agentIndex) {
    const meshName = `agent-${agentIndex}`
    let agentMesh = scene.getMeshByName(meshName);
    if (!agentMesh) {
        agentMesh = BABYLON.MeshBuilder.CreateCylinder(meshName, { height: agentParams.height, diameter: agentParams.radius * 2 }, scene)
        agentMesh.position.y += agentParams.height / 2
        agentMesh.bakeCurrentTransformIntoVertices();
        agentMesh.material=mat_global.mat_white_e;
    }

    // const matName = `agent-${agentIndex}`
    // const matAgent = scene.getMaterialByName(matName) ?? new BABYLON.StandardMaterial(matName, scene)
    // const variation = Math.random()
    // matAgent.diffuseColor = new BABYLON.Color3(0.4 + variation * 0.6, 0.3, 1.0 - variation * 0.3)
    // agentMesh.material = matAgent

    return agentMesh
}
function isPointinArena(v,path)
{
    var point={x:v[0],y:v[1]}
    return queryPtInPolygon(point,path);
}
