var list_nohurry=[];
function AddNohurry(name,delay,lastt,todo,count)
{
    var len=list_nohurry.length;
    if(len==0)
    {
        list_nohurry.push({delay:delay,lastt:lastt,todo:todo,name:name
            ,count:count})
    }
    else {
        for(var i=0;i<len;i++)
        {
            var obj_nohurry=list_nohurry[i];
            if(obj_nohurry.name==name)//如果已经有同名任务
            {
                return;
            }
            if(delay>obj_nohurry.delay)//如果新任务耗时更长
            {
                continue;
            }
            else {//把耗时更长的任务放在队列后面
                list_nohurry.splice(i,0,{delay:delay,lastt:lastt,todo:todo,name:name
                    ,count:count});
                break;
            }
        }
    }

}
function RemoveNohurry(name)
{
    delete list_nohurry[name];
}
var lastframet,firstframet,DeltaTime;
function HandleNoHurry()//执行周期性任务
{
    if(!lastframet)
    {
        lastframet=new Date().getTime();
        firstframet=lastframet;
        DeltaTime=0;
    }
    else
    {
        var currentframet=new Date().getTime();
        DeltaTime=currentframet-lastframet;//取得两帧之间的时间
        lastframet=currentframet;
        for(var i=0;i<list_nohurry.length;i++)
        {
            var obj_nohurry=list_nohurry[i];
            if(obj_nohurry.lastt==0)
            {
                obj_nohurry.lastt=new Date().getTime();
            }
            else
            {
                var time_start=currentframet-obj_nohurry.lastt;
                if(time_start>obj_nohurry.delay)//如果经过的时间超过了每次执行周期乘以执行次数加一，则执行一次
                {
                    obj_nohurry.todo();
                    obj_nohurry.count++;
                    obj_nohurry.lastt=currentframet;
                    break;//每一帧最多只做一个费时任务，周期更短的任务放在队列前面，获得更多执行机会
                }
            }
        }
    }
}