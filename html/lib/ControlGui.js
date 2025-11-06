var step_move=10;
var advancedTexture,global_panel_text,global_panel2;
//在移动端情况下，机体上没有实体按键，故gui按钮为必须选择，且在不同控制模式下gui按钮须有不同作用！
//在free模式下需要仿制freecamera作选定方向运动，在one模式下需作物理引擎推动，在rts模式下需作水平卷动
function initGuiControl()
{
    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1");
    advancedTexture.layer.layerMask=1;
    var camera=camera0;
    //左侧的运动控制按钮
    var panel2=new BABYLON.GUI.Rectangle();
    panel2.width="200px"//0.25;
    panel2.top="10px";
    panel2.left="10px";
    panel2.height="170px"//0.25;
    panel2.horizontalAlignment=BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel2.verticalAlignment=BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    panel2.thickness=0
    advancedTexture.addControl(panel2);
    global_panel2=panel2;
    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_fw","复位");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    //button_fw.top="10px";
    button_fw.left="-20px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")//在one模式下没有复位效果？
        {

            camera.position=initpos_camera0.clone();
            camera.rotation=initrot_camera0.clone();
        }
        else if(flag_view=="free")
        {
            if(pos_stack_rts)
            {
                camera.position=pos_stack_rts;
                //camera0.rotation=new BABYLON.Vector3(hd_camera0,0,0);
            }

        }
        else if(flag_view=="one")
        {
            one.node.rotation=new BABYLON.Vector3(0,0,0);
            camera0.position=one.node.node_back.getAbsolutePosition();
            camera0.rotation=one.node.rotation.clone();

        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_q","前");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="-20px";
    button_fw.top="-60px";

    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {
            camera.position.z=camera.position.z+step_move;
        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_h","后");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="-20px";
    button_fw.top="60px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {

            camera.position.z=camera.position.z-step_move;
        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_s","上");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="80px";
    button_fw.top="-60px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {
            int_z--;
            int0b=Math.pow(2,-int_z/4);
            //camera.position.y=camera.position.y+step_move;
        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_x","下");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="80px";
    button_fw.top="60px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {
            if(int_z<16)
            {
                int_z++;
            }
            //camera.position.y=camera.position.y-step_move;
            int0b=Math.pow(2,-int_z/4);
        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_z","左");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="-80px";
    //button_fw.top="-40px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {

            camera.position.x=camera.position.x-step_move;

        }
    });
    panel2.addControl(button_fw);

    var button_fw=BABYLON.GUI.Button.CreateSimpleButton("button_y","右");
    //button_fw.width=0.2;
    button_fw.height="40px";
    button_fw.width="40px";
    button_fw.left="40px";
    button_fw.color="white";
    button_fw.cornerRadius=20;
    button_fw.background="green";
    button_fw.onPointerUpObservable.add(function(){
        if(flag_view=="rts")
        {

            camera.position.x=camera.position.x+step_move;
        }
    });
    panel2.addControl(button_fw);
}