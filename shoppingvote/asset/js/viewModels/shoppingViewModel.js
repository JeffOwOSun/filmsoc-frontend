/**
 * shoppingViewModel.js
 */

cr.define('cr.view.shopping',function(){
    var model=cr.model.Shopping;
    var shoppingTemplate;
    var diskTemplate;
    var container;
    var renderData=null;
    function show(){
        //make requests
        renderData={};
        var r=new cr.APIRequest(model,"GET","/?limit=1", true);
        r.onload=function(event){
            var data=event.recObj;
            if (data.objects.length>0){
            //convert the data to desired format
                //filter the entire shopping first
                var object = model.filter(data.objects[0]);
                //then filter each disk
                var disks=[];
                //by the way count total votes
                var total=0;
                for (var i=1;i<=8;i++){
                    var objDisk=cr.model.Disk.filter(object['film_'+i]);
                    var disk={};
                    //convert replicable fields of objDisk into array items for auto-generation
                    disk.itemArray=[
                        {
                            name:"Director",
                            content:objDisk.director_en+' / '+objDisk.director_ch,
                        },
                        {
                            name:"Stars",
                            content:objDisk.actors.join(', '),
                        },
                        {
                            name:"Category",
                            content:objDisk.category,
                        },
                        {
                            name:"Tags",
                            content:objDisk.tags.join(' '),
                        },
                        {
                            name:"Length",
                            content:objDisk.length+' min.',
                        },
                        {
                            name:"IMDB Link",
                            content:objDisk.imdb_url,
                            href:"www.imdb.com/title/"+objDisk.imdb_url,
                        },
                        {
                            name:"Call Number",
                            content:objDisk.disk_type+objDisk.id,
                        },
                        {
                            name:"Disk Type",
                            content:(function(){
                                switch (objDisk.disk_type){
                                    case 'A':
                                        return 'VCD';
                                        break;
                                    case 'B':
                                        return 'DVD';
                                        break;
                                    case 'C':
                                        return 'BD';
                                        break;
                                }
                            })(),
                        },
                        {
                            name:"Borrowed",
                            content:objDisk.borrow_cnt+' time(s)',
                        },
                        {
                            name:"Disk State",
                            content:objDisk.avail_type,
                        },
                    ];
                    disk.cover_url=objDisk.cover_url? cr.settings.uploadBase+objDisk.cover_url.url : 'http://ihome.ust.hk/~su_film/asset/css/question.png';
                    disk.desc_en=objDisk.desc_en;
                    disk.desc_ch=objDisk.desc_ch;
                    disk.title_ch=objDisk.title_ch;
                    disk.title_en=objDisk.title_en;
                    disk.index=i;
                    disk.votes=object['vote_cnt_'+i];
                    disks.push(disk);
                    //count votes
                    total+=disk.votes;
                }
                // now that disks[] is populated with filtered disks
                // combine the disks array and total count to our renderData
                
                for (var key in disks){
                    disks[key].percentage=total==0?0:100*disks[key].votes/total;
                }
                renderData.disks=disks;
                renderData.remarks=object.remarks;
                renderData.id=object.id;
                renderData.state=object.state;
                renderData.title="Shopping Vote";
                renderData.user=cr.user?true:false;
                //divide disks into two parts
                var i=0;
                renderData.disks_1=[];
                for (i=0; i<4; i++){
                    renderData.disks_1.push(renderData.disks[i]);
                }
                renderData.disks_2=[];
                for (i=4; i<8; i++){
                    renderData.disks_2.push(renderData.disks[i]);
                }

                //our renderData object is ready.

                //render template
                container.html(shoppingTemplate.render(renderData));
                //hook event handlers
                //because the href in the template are already filled, the response will be handled
                //by the routeManager
            }
            else{
                //when there are not anything available:
                renderData.disks=[];
                renderData.title="Shopping Vote";
                //render template
                container.html(shoppingTemplate.render(renderData));
            }
        };
        r.onerror=cr.errorHandler;
        r.send();
        
    }

    function initialize(){
        shoppingTemplate = $.templates("#shoppingTmpl");
        container = $("#content-wrapper");
        diskTemplate= $.templates("#diskTmpl");
        //hook this view onto navBar
        //hook show() onto routeManager      
        //
        
        cr.routeManager.get("#!shopping/",function(){
            show();
        });
        cr.routeManager.get("#!shopping/vote/:index/",function(){
            var routeContext=this;            
            var index = this.params['index'];
            //can wrap this part into a separate function later on.
            var dialogInstance = new BootstrapDialog({closable: false});
            dialogInstance.realize();
            dialogInstance.getModalContent().html('<div class="alert alert-info" role="alert" style="margin-bottom: 0">Sending...</div>');
            dialogInstance.open();

            var r=new cr.APIRequest(model, "POST", "/"+renderData.id+"/vote/");
            r.onload=function(ev){
                dialogInstance.close();
                //Question, what does those custom views return? how to use them here?
                cr.ui.showAlert("Success! You still have:<b>"+ev.recObj.votes_left+"</b> votes left!","success",2000);
                routeContext.redirect("#!shopping/");
            };
            r.onerror=function(ev){
                dialogInstance.close();
                cr.errorHandler(ev);
                routeContext.redirect("#!shopping/");
            }
            r.sendJSON({film_id: index});
        });
        cr.routeManager.get("#!shopping/detail/:index/",function(){
            var routeContext=this;
            var index = this.params['index'];
            var diskContext={};

            if (!renderData){
                routeContext.redirect("#!shopping/");
            } else {
                for (var key in renderData.disks){
                    if (renderData.disks[key].index==index){
                        diskContext=renderData.disks[key];
                        break;
                    }
                }

                var dialogInstance = new BootstrapDialog({
                    //hook redirection upon closure of the dialog.
                    title: diskContext.title_en+'/'+diskContext.title_ch,
                    onhide:function(dialogRef){
                        routeContext.redirect("#!shopping/");
                    },
                });
                dialogInstance.realize();
                dialogInstance.getModalBody().html(diskTemplate.render(diskContext));
                dialogInstance.getModalFooter().hide();
                
                dialogInstance.open();
            }
        })
        
    }
    return{
        initialize: initialize,
    }
});
$(document).on('ready',cr.view.shopping.initialize);