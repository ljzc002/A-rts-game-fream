var node_temp,rate_fov,rate_screen;
var sr_global=null;
var pos_stack_one,pos_stack_rts;
function InitMouse()
{
    rate_fov=Math.tan(camera0.fov/2)*2;
    var sizex=engine.getRenderWidth()//_gl.drawingBufferWidth;
    var sizey=engine.getRenderHeight()//_gl.drawingBufferHeight;
    rate_screen=sizex/sizey;
    canvas.addEventListener("blur",function(evt){//监听失去焦点
        releaseKeyStateOut();
    })
    canvas.addEventListener("focus",function(evt){//改为监听获得焦点，因为调试失去焦点时事件的先后顺序不好说
        releaseKeyStateIn();
    })
    // canvas.addEventListener("click", function(evt) {//这个监听也会在点击GUI按钮时触发！！<-click仅指鼠标左键单击？？！！
    //     onMouseClick(evt);//
    // }, false);
    // canvas.addEventListener("dblclick", function(evt) {//是否要用到鼠标双击？？
    //     onMouseDblClick(evt);//
    // }, false);
    canvas.addEventListener("pointermove",onMouseMove,false)
    canvas.addEventListener("pointerdown",onMouseDown,false)
    canvas.addEventListener("pointerup",onMouseUp,false)
    window.addEventListener("keydown", onKeyDown, false);//按键按下
    window.addEventListener("keyup", onKeyUp, false);//按键抬起
    window.onmousewheel=onMouseWheel;
    window.addEventListener("resize", function () {//canvas没有resize事件！
        if (engine) {
            engine.resize();
            var sizex=engine.getRenderWidth()//_gl.drawingBufferWidth;
            var sizey=engine.getRenderHeight()//_gl.drawingBufferHeight;
            var rate=sizex/sizey;
            rate_screen=rate;
            var size_minimap=150;
            if(sr_global)
            {
                console.log("resize and reset");
                sr_global.enableSnapshotRendering();
            }
        }
    },false);
    node_temp=new BABYLON.TransformNode("node_temp",scene);//用来提取相机的姿态矩阵
    node_temp.rotation=camera0.rotation;
}
function onMouseDblClick(evt)
{
    //var pickInfo = scene.pick(scene.pointerX, scene.pointerY, null, false, camera0);
}
function onMouseClick(evt)
{
    //console.log("onMouseClick");
    //onMouseClick会在onMouseDown和onMouseUp之后发生！所以拖拽被错误的识别为点击！！
    //if(!flag_drag)
    //evt.preventDefault();

}
var lastPointerX,lastPointerY;
var flag_view="rts";
var flag_view_index=0;//建立两重切换：按V键时在当前位置切换为自由相机，并把原位置和控制方式入栈，《-数字按键要预留其他作用！
var arr_flag_view=[{key:"i",view:"rts"},{key:"o",view:"free"},{key:"p",view:"one"},{key:"Escape",view:"free"}];//iop三键？
var obj_keystate=[];
var pso_stack;
var flag_moved=false;//在拖拽模式下有没有移动，如果没移动则等同于click
var point0,point;//拖拽时点下的第一个点
var MaxMovement;
function onMouseMove(evt)
{
    if(!evt)
    {
        evt={}
        evt.clientX=scene.pointerX;
        evt.clientY=scene.pointerY;
    }

    if(flag_view=="rts"&&flag_drag)
    {
        if(evt.preventDefault)
            evt.preventDefault();
        //var dx=-(scene.pointerX-lastPointerX)/window.innerWidth;
        //var dz=(scene.pointerY-lastPointerY)/window.innerHeight;
        var dx=-(evt.clientX-lastPointerX)/canvas.width;//engine.getRenderWidth()
        var dz=(evt.clientY-lastPointerY)/canvas.height;
        //Field Of View is set in Radians. (default is 0.8)
        camera0.position.z+=dz*(camera0.position.y)*rate_fov;
        camera0.position.x+=dx*(camera0.position.y)*rate_fov*rate_screen;
        // camera0.position.z+=dz*(camera0.position.y/600)*600;
        // camera0.position.x+=dx*(camera0.position.y/600)*600;
    }
    else if(flag_view=="one")
    {
        if(evt.preventDefault)
            evt.preventDefault();
        //绕y轴的旋转角度是根据x坐标计算的
        // var rad_y=((evt.clientX-lastPointerX)/canvas.width)*(Math.PI/1);
        // var rad_x=((evt.clientY-lastPointerY)/canvas.height)*(Math.PI/1);
        var rad_y=((evt.movementX)/canvas.width)*(Math.PI/1);
        var rad_x=((evt.movementY)/canvas.height)*(Math.PI/1);
        camera0.myRotation.y+=rad_y;
        camera0.myRotation.x+=rad_x;
        //console.log(evt.movementX);
        //one.node.rotation=camera0.rotation.clone();
    }
    lastPointerX=evt.clientX;
    lastPointerY=evt.clientY;
}
var flag_drag=false;
var downPointerX,downPointerY;
var count_myController=0;
function onMouseDown(evt)
{
    //bbl内置的pick事件导致半秒钟的延迟？！
    //不是gui或瘦实例和精灵导致的延迟，后续测试把pointerdown事件关闭
    //console.log("onMouseDown");
    //evt.preventDefault();
    if(flag_view=="rts")
    {

        flag_drag=true;
    }
}
function onMouseUp(evt)
{
    //console.log("onMouseUp");
    //evt.preventDefault();
    if(flag_view=="rts")
    {

        flag_drag=false;
    }
    //左键框选和左键拖动相冲突，可能要添加基于meshname和额外按键的功能判定
    if(evt.button==2)
    {
        //这里的点击是指针点击而不是准心点击
        //优先点击精灵？
        var pickResult = scene.pickSprite(evt.clientX, evt.clientY, null, false, camera0);
        if (pickResult.hit) {
            console.log(pickResult);
            console.log(pickResult.pickedSprite.name);
            //console.log(pickResult);
        }
        else {
            var pickInfo = scene.pick(evt.clientX, evt.clientY, null, false, camera0);
            if(pickInfo.hit)
            {
                //console.log(pickInfo);
                //console.log(pickInfo.thinInstanceIndex);
                //console.log(pickInfo.pickedMesh.id);
                if(pickInfo.pickedMesh.myType=="ground")
                {
                    var len=agents.length;
                    for (let i = 0; i < len; i++) {
                        crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(pickInfo.pickedPoint))
                    }
                }
            }
        }
    }
}
function onKeyDown(event)
{
    if(flag_view=="one") {
        event.preventDefault();
        var key = event.key;
        obj_keystate[key] = 1;
        if(obj_keystate["Shift"]==1)
        {
            obj_keystate[key.toLowerCase()] = 1;
        }
    }
}
function handleView(lastView,nextView)
{
    if(nextView=="free")
    {
        flag_drag=false;
        camera0.attachControl(canvas, true);
        if(lastView=="rts")
        {
            pos_stack_rts=camera0.position.clone();
        }
        else if(lastView=="one")
        {
            document.exitPointerLock();
            if(camera0.lines)
            {
                camera0.lines.isVisible=false;
            }
        }
        flag_view=nextView;
        releaseKeyStateIn();
    }
    else if(nextView=="rts")
    {
        camera0.detachControl();
        if(pos_stack_rts)
        {
            camera0.position=pos_stack_rts;
            camera0.rotation=new BABYLON.Vector3(hd_camera0,0,0);
        }
        if(lastView=="one")
        {
            document.exitPointerLock();
            if(camera0.lines)
            {
                camera0.lines.isVisible=false;
            }
        }
        flag_view=nextView;
        releaseKeyStateIn();
    }
    else if(nextView=="one")
    {
        if(one)
        {
            flag_drag=false;
            camera0.detachControl();
            camera0.position=one.node.node_back.getAbsolutePosition();
            camera0.rotation=one.node.rotation.clone();
            canvas.requestPointerLock(options = {unadjustedMovement: false});
            //camera0.rotation.x=0;
            //camera0.rotation.y=one.node.rotation.y;
            if(camera0.lines)
            {
                camera0.lines.isVisible=true;
            }
            flag_view=nextView;
        }//如果没有可驾驶的“载具”则这个物理运动方式不能生效！！
        else
        {

        }
    }
    //sr_global.enableSnapshotRendering();
}
function onKeyUp(event)
{
    var key = event.key;
    var len=arr_flag_view.length;
    for(var i=0;i<len;i++)//切换视角
    {
        var view=arr_flag_view[i];
        if(key==view.key)
        {
            event.preventDefault();
            if(flag_view==view.view)
            {

            }
            else {

                handleView(flag_view,view.view);

            }
            break;
        }
    }

    if(flag_view=="rts") {
        event.preventDefault();
        var key2=key.toLowerCase();
        if(key2=="w")
        {
            camera0.position.z+=step_move*(camera0.position.y/1800);
            if(camera0.position.z>10000)
            {
                camera0.position.z=10000
            }
        }
        else if(key2=="s")
        {
            camera0.position.z-=step_move*(camera0.position.y/1800)
            if(camera0.position.z<-10000)
            {
                camera0.position.z=-10000
            }
        }
        else if(key2=="a")
        {
            camera0.position.x-=step_move*(camera0.position.y/1800)
            if(camera0.position.x<-10000)
            {
                camera0.position.x=-10000
            }
        }
        else if(key2=="d")
        {
            camera0.position.x+=step_move*(camera0.position.y/1800)
            if(camera0.position.x>10000)
            {
                camera0.position.x=10000
            }
        }
    }
    else if(flag_view=="one")
    {
        event.preventDefault();

        obj_keystate[key] = 0;
        if(key=="f")
        {
            one.mesh.physicsImpostor.body.setLinearVelocity(new BABYLON.Vector3(0,0,0));
            one.mesh.physicsImpostor.body.setAngularVelocity(new BABYLON.Vector3(0,0,0));
        }
        else if(key=="c")
        {
            if(one.node.node_back.position.y==1)
            {
                one.node.node_back.position.y=0.5;
            }
            else {
                one.node.node_back.position.y=1;
            }
        }
        else if(key==" ")
        {
            var pos=one.mesh.getAbsolutePosition();
            var ray =BABYLON.Ray.CreateNewFromTo(pos,new BABYLON.Vector3(pos.x,-1,pos.z));
            var hit=scene.pickWithRay(ray,(mesh)=>(mesh.id!="node_one"&&mesh.id!="mesh_one"));
            if(hit&&hit.pickedMesh&&hit.distance<1)
            {
                console.log(hit.pickedMesh.id,pos);
                one.mesh.physicsImpostor.body.applyForce(new BABYLON.Vector3(0,600,0),pos);
            }


        }
    }
}


function onMouseWheel(event){
    //var delta =event.wheelDelta/120;
    if(flag_view=="rts"||flag_view=="free")
    {
        if(flag_drag==false)//禁止一边拖拽一边缩放
        {
            //事件的兼容性写法
            var oEvent = event || window.event;
            //oEvent.preventDefault();
            if(oEvent.wheelDelta){//非火狐
                if(oEvent.wheelDelta > 0){//向上滚动
                    if(int_z<16)
                    {
                        int_z++;
                    }

                }else{//向下滚动
                    //if(int_z>0)
                    {
                        int_z--;
                    }
                }
            }else if(oEvent.detail){
                if(oEvent.detail > 0){//向下滚动
                    //if(int_z>0)
                    {
                        int_z--;
                    }
                }else{//向上滚动
                    if(int_z<16)
                    {
                        int_z++;
                    }

                }
            }
            int0b=Math.pow(2,-int_z/4);//向上滚动，拉近变细，int_z越大y越小
            //var int=Math.floor(Math.pow(2,int_z/4));//放大倍数

        }
    }

}
function onContextMenu(evt)
{

}

function movePOV(node,node2,vector3)
{
    var m_view=node.getWorldMatrix();
    var v_delta=BABYLON.Vector3.TransformCoordinates(vector3,m_view);
    var pos_temp=node2.position.add(v_delta);
    node2.position=pos_temp;
}
function releaseKeyStateIn(evt)
{
    for(var key in obj_keystate)
    {
        obj_keystate[key]=0;
    }
    //lastPointerX=scene.pointerX;
    //lastPointerY=scene.pointerY;
    flag_drag=false;
    camera0.myRotation={x:0,y:0,z:0};
}
function releaseKeyStateOut()
{
    for(var key in obj_keystate)
    {
        obj_keystate[key]=0;
    }
    flag_drag=false;
    camera0.myRotation={x:0,y:0,z:0};
}

var pos_last;
var delta;
var v_delta;
var x_lastquery,z_lastquery,y_lastquery;
var count_initasync=2;//有两项异步初始化内容
function MyBeforeRender0()
{
    MyBeforeRender();
}
//var sr_global=null;
var sceneInstrumentation;
var count_lost=0;
var flag_lost=false;
var bool_render=true;
var flag_showlayerindex=false;
function MyBeforeRender()
{
    //sr_global= new BABYLON.SnapshotRenderingHelper(scene);
    //@@@@engine.resize();//似乎要以某种方式重建canvas才可使用快速SR，否则会在一秒后丢失内容
    //是某些与SR有关的变量失去了引用，触发了浏览器的CPP GC，在调试模式下则可能是一直有引用存在的！！！！
    //sr_global.enableSnapshotRendering();
    //int0=1*(camera0.position.y/600);
    //int0b=int0;

    console.log("MyBeforeRender");
    //sceneInstrumentation = new BABYLON.SceneInstrumentation(scene);//用来进行计时
    //sceneInstrumentation.captureFrameTime = true;
    engine.hideLoadingUI();
    //sr_global.enableSnapshotRendering();


    // setTimeout(function(){
    //     canvas.width=canvas.width-1;
    //     engine.resize();
    //     sr_global.enableSnapshotRendering();
    // },1000)

    scene.registerBeforeRender(
        function(){
            if(skybox)
            {
                //sr_global.updateMesh(skybox);
            }


            if(flag_view=="rts"||flag_view=="free")
            {
                if(int0b!=int0)
                {

                    if(int0b<1)
                    {
                        //reDrawThings(int0b);//在事件中触发会造成屏幕闪烁！！

                    }

                }
            }
            if(flag_view=="one")
            {
                //one.node.rotation.y=camera0.rotation.y;
                var flag_speed=2;
                //var m_view=node_temp.getWorldMatrix();
                if(obj_keystate["Shift"]==1)//Shift+w的event.key不是Shift和w，而是W！！！！
                {
                    flag_speed=10;
                }
                delta=engine.getDeltaTime();
                flag_speed=flag_speed*engine.getDeltaTime()/10;
                var v_temp=new BABYLON.Vector3(0,0,0);//用它来改变物体的受力状态
                if(obj_keystate["w"]==1)
                {
                    v_temp.z+=1*flag_speed;

                }
                if(obj_keystate["s"]==1)
                {
                    v_temp.z-=1*flag_speed;
                }
                if(obj_keystate["d"]==1)
                {
                    v_temp.x+=0.5*flag_speed;
                }
                if(obj_keystate["a"]==1)
                {
                    v_temp.x-=0.5*flag_speed;
                }
                if(v_temp.x!=0||v_temp.z!=0)
                {
                    //console.log("force",v_temp)
                    var force=newland.vecToGlobal(v_temp,one.node);
                    force=force.subtract(one.node.getAbsolutePosition()).scale(1);//取姿态信息，去除位置信息
                    var pos=one.node.getAbsolutePosition();
                    one.mesh.physicsImpostor.body.applyForce(force,pos);
                }
                //var force=new BABYLON.Vector3(0,-1,0);
                //one.node.position=one.mesh.position.clone();//此修改可改善显示体落后于仿真体的情况，但在高速运动时会发生剧烈抖动，相反的落后式设置在极高速时则保持平稳
                //v_delta=BABYLON.Vector3.TransformCoordinates(v_temp,m_view);
            }
        }
    )
    scene.registerAfterRender(
        function(){

            for(var key in obj_agentTrans)//对于每一个导航代理的变换节点
            {
                var agentTrans=obj_agentTrans[key];
                var agentIndex=agentTrans.mydata.agentIndex;
                var maxSpeed=agentTrans.mydata.maxSpeed;//当前速度
                if(crowd._agentDestinationArmed[agentIndex])
                //if(crowd.getAgentNextTargetPath(agentIndex))//如果这个导航器有下一移动目标
                {
                    var flag_found=false;
                    var position=crowd.getAgentPosition(agentIndex);
                    for(var key2 in obj_maparea)
                    {
                        if(flag_found)
                        {
                            break;
                        }
                        // if(key2==maxSpeed)//相同的速度区域不必重复考虑<-也要判断是否在同速区域内，如不在同速区则可能在base区域中！！！！
                        // {
                        //     continue;
                        // }
                        var arr_path=obj_maparea[key2];
                        var len2=arr_path.length;
                        for(var j=0;j<len2;j++)
                        {
                            var path=arr_path[j];
                            if(queryPtInPolygon({x:position.x,y:position.z},path))//如果在这个速度区域内
                            {
                                if(key2!=(maxSpeed+""))
                                {
                                    var v2=parseFloat(key2);
                                    agentTrans.mydata.maxSpeed=v2;
                                    agentParams.maxSpeed=v2;
                                    crowd.updateAgentParameters(agentIndex,agentParams);
                                }

                                flag_found=true;
                                break;
                            }
                        }
                    }
                    if(!flag_found&&maxSpeed!=baseSpeed)
                    {
                        agentTrans.mydata.maxSpeed=baseSpeed;
                        agentParams.maxSpeed=baseSpeed;
                        crowd.updateAgentParameters(agentIndex,agentParams);
                    }
                }

            }
            if(flag_view=="rts"||flag_view=="free")
            {
                if(int0b!=int0)
                {
                    camera0.position.y=600*int0b;
                    int0=int0b;//更新上一放大倍数
                }
            }

            if(camera0.position.y<75)//较近时显示文字，较远时隐藏
            {
                if(!flag_showlayerindex)
                {
                    flag_showlayerindex=true;
                    objSpriteManager.manager.renderingGroupId=2;//精灵管理器是否受快照影响？
                    //sr_global.enableSnapshotRendering();
                }
            }
            else
            {
                if(flag_showlayerindex)
                {
                    flag_showlayerindex=false;
                    objSpriteManager.manager.renderingGroupId=0;
                    //sr_global.enableSnapshotRendering();
                }
            }
        }
    )
    engine.runRenderLoop(function () {
        //engine.hideLoadingUI();
        var int_fps=engine.getFps().toFixed();
        if (divFps) {
            divFps.innerHTML =  int_fps+ " fps";
        }

        //sr_global.updateMesh(one.node);//物理引擎似乎不受快照模式限制？？！！
        //sr_global.updateMesh(one.mesh);
        //if(flag_runningstate=="fastsr")
        //{
        scene.render();
        //}

    });
}
function sort_compare(a,b)//从近到远
{
    return a.distance-b.distance;
}
function sort_compare2(a,b)//从远到近
{
    return b.distance-a.distance;
}
var flag_text_near=false;
