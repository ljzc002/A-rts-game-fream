var obj_maparea={
    2:[]
}
function initMap()
{
    var path_tree=[];
    path_tree.push(new BABYLON.Vector3(-32,0,32));
    path_tree.push(new BABYLON.Vector3(32,0,32));
    path_tree.push(new BABYLON.Vector3(32,0,-32));
    path_tree.push(new BABYLON.Vector3(-32,0,-32));
    var points_tree=[];
    var len=path_tree.length;
    for(var i=0;i<len;i++)
    {
        var pos=path_tree[i];
        points_tree.push({x:pos.x,y:pos.z});
    }
    obj_maparea[2].push(points_tree);
    var mesh_extrude=new BABYLON.MeshBuilder.ExtrudePolygon("mesh_extrude"
        , {shape: path_tree, depth: 1,sideOrientation:BABYLON.Mesh.DOUBLESIDE,updatable:true});
    mesh_extrude.position.y=0.5;
    mesh_extrude.mydata={};
    mesh_extrude.mydata.maxSpeed=2;
    var mat = new BABYLON.StandardMaterial("mat_tree", scene);//1
    mat.disableLighting = true;
    mat.emissiveTexture = new BABYLON.Texture("./assets/image/LANDTYPE/yulin.png", scene);
    //mat.emissiveTexture.uScale = 8;//手动设定
    //mat.emissiveTexture.vScale = 8;
    mat.freeze();
    mat_global.mat_tree=mat;
    mesh_extrude.material=mat;
    //mesh_extrude.renderingGroupId=2;
    mesh_extrude.myType="ground";
    mesh_extrude.myType1="tree";
    //根据boundbox比例重调uv？
    mesh_extrude.convertToFlatShadedMesh();//自动顶点展开
    var data_position =mesh_extrude.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    var data_uv=mesh_extrude.getVerticesData(BABYLON.VertexBuffer.UVKind);
    //var data_uv2=[];
    var data_index=mesh_extrude._geometry._indices;
    var len=data_index.length;
    var rate_scale=10;
    for(var i=0;i<len;i+=3)//默认是以2单位长度为1uv单位的，这里改为10
    {
        var i1=data_index[i];
        var i2=data_index[i+1];
        var i3=data_index[i+2];
        var vec1=new BABYLON.Vector3(data_position[i1*3],data_position[i1*3+1],data_position[i1*3+2]);
        var vec2=new BABYLON.Vector3(data_position[i2*3],data_position[i2*3+1],data_position[i2*3+2]);
        var vec3=new BABYLON.Vector3(data_position[i3*3],data_position[i3*3+1],data_position[i3*3+2]);
        var mx=Math.max(Math.abs(vec1.x-vec2.x),Math.abs(vec1.x-vec3.x),Math.abs(vec3.x-vec2.x));
        var my=Math.max(Math.abs(vec1.y-vec2.y),Math.abs(vec1.y-vec3.y),Math.abs(vec3.y-vec2.y));
        var mz=Math.max(Math.abs(vec1.z-vec2.z),Math.abs(vec1.z-vec3.z),Math.abs(vec3.z-vec2.z));
        if(my<=mx&&my<=mz)//这个三角形倾向于朝向y轴
        {

            data_uv[i1*2]=vec1.x/rate_scale;
            data_uv[i1*2+1]=vec1.z/rate_scale;
            data_uv[i2*2]=vec2.x/rate_scale;
            data_uv[i2*2+1]=vec2.z/rate_scale;
            data_uv[i3*2]=vec3.x/rate_scale;
            data_uv[i3*2+1]=vec3.z/rate_scale;
        }
        else {
            if(mx>=mz)
            {
                var rate=Math.pow(mx*mx+mz*mz,0.5)/mx;
                data_uv[i1*2]=vec1.x*rate/rate_scale;
                data_uv[i1*2+1]=vec1.y/rate_scale;
                data_uv[i2*2]=vec2.x*rate/rate_scale;
                data_uv[i2*2+1]=vec2.y/rate_scale;
                data_uv[i3*2]=vec3.x*rate/rate_scale;
                data_uv[i3*2+1]=vec3.y/rate_scale;
            }
            else {
                var rate=Math.pow(mx*mx+mz*mz,0.5)/mz;
                data_uv[i1*2]=vec1.z*rate/rate_scale;
                data_uv[i1*2+1]=vec1.y/rate_scale;
                data_uv[i2*2]=vec2.z*rate/rate_scale;
                data_uv[i2*2+1]=vec2.y/rate_scale;
                data_uv[i3*2]=vec3.z*rate/rate_scale;
                data_uv[i3*2+1]=vec3.y/rate_scale;
            }
        }
    }
    mesh_extrude.updateVerticesData(BABYLON.VertexBuffer.UVKind,data_uv);

}
