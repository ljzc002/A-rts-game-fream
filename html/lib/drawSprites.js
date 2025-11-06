var arr_sprites=[];
var char_global="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890+-_.|"+str_cyhz;
var obj_czpos={},objSpriteManager={};
//要取常用的星系名！
function createManagers()
{
    for(var zm in obj_czpos) {
        var len=zm.length;
        for(var i=0;i<len;i++)
        {
            if(char_global.indexOf(zm[i])==-1)//如果字表中还没有这个字
            {
                char_global+=zm[i];
            }
        }
    }
    var can_temp_label=document.createElement("canvas");
    var len=char_global.length;
    var fontsize=32;
    var color="#ffffff";//后期染色？
    can_temp_label.width=4096;//可能是计算误差？粒子系统取的方块比canvas的方块小一点？一共4000多个字，最大估计10000个字？
    can_temp_label.height=4096;//预设7225个字的空间！
    var context=can_temp_label.getContext("2d");
    context.fillStyle="rgba(0,0,0,0)";//完全透明的背景
    context.fillRect(0,0,can_temp_label.width,can_temp_label.height);
    context.fillStyle = color;
    context.font = "bold "+fontsize+"px monospace";
    for(var i=0;i<len;i++)
    {
        var char=char_global[i];
        var x=(i%128)*fontsize;//一行85个字，在达到上百个字后误差比较明显《-这个误差是非整数跨行导致的
        //要让半角字符和全角字符和谐显示，一种可用的方法是修改这个横坐标计算规则？<-在实际添加精灵时修改
        var y=(Math.ceil((i+0.5)/128))*fontsize;
        context.fillText(char,x,y-3);
    }
    var png=can_temp_label.toDataURL("image/png");//生成PNG图片
    //console.log(png);
    //建立精灵管理器
    var spriteManager = new BABYLON.SpriteManager("spriteManagerLabel", png, 50000, fontsize, scene);
    spriteManager.renderingGroupId=3;
    spriteManager.cellWidth=fontsize;
    spriteManager.cellHeight=fontsize;
    spriteManager.isPickable = true;
    //spriteManager.isVisible=false;《-此属性无作用
    objSpriteManager.manager=spriteManager;
}
var size_char=12;
//在指定位置以精灵方式添加文字
function addSpritelabel(str,px,py,id,size,color,manager,arr_sprites,h)
{
    if(!h)
    {
        h=2
    }
    var len=str.length;
    var arr=[];
    var size_offset=0;
    for(var i=0;i<len;i++)
    {
        var char=str[i];
        var s_char=new BABYLON.Sprite("s_big_"+id+"_"+i, manager);
        var index=char_global.indexOf(char);
        if(index<0)
        {
            index=0;//用A补位
        }
        s_char.cellIndex=index;
        s_char.size=size;
        s_char.isPickable=true;
        s_char.position=new BABYLON.Vector3(px+size_offset,h,py);
        if(index<67)
        {
            s_char.isBJ=true;//是半角字符
            size_offset+=size/2;
        }
        else {
            s_char.isBJ=false;//不是半角字符
            size_offset+=size;
        }

        if(color)
        {
            s_char.color=color;
        }
        else {
            s_char.color={r:0,g:0,b:0,a:1}
        }
        arr.push(s_char);
    }
    var len=arr.length;
    for(var i=0;i<len;i++)
    {
        var s=arr[i];
        s.position.x-=size_offset/2;
    }
    arr_sprites.push({
        arr:arr,size_offset:size_offset,id:id,str:str,px:px,py:py,color:color
    })
}
