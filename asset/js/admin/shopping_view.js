/**
 *  @fileoverview View concerning Shopping.
 */

cr.define('cr.view.shopping',function(){
    var name = 'shopping';

    function Initialize() {
        //register routerManager
        routerManager.register(/shopping\//, false, shopping_setup(shopping_list));
        //register templates
        cr.ui.template.register("admin/shopping_list.html");
        cr.ui.template.register("admin/shopping_list_item.html",function(param){
            this.querySelector('button[control="edit"]').addEventListener('click',(function(obj){
                edit_shopping(obj.id);
            }).bind(null, param.shopping));
            this.querySelector('button[control="viewlog"]').addEventListener('click', (function(obj){
                cr.logger.showLogger('View Logs of Shopping',{
                    model: 'Shopping',
                    id: obj.id,
                }, cr.model.Shopping.types);
            }).bind(null,param.shopping));
            this.querySelector('button[control="start_voting"]').addEventListener('click', start_voting_shopping.bind(null, param.shopping));
            this.querySelector('button[control="delete"]').addEventListener('click', delete_shopping.bind(null, param.shopping));
        })
        cr.ui.template.register("admin/shopping_edit.html");
        cr.ui.template.register("admin/shopping_create.html");
        cr.ui.template.register("admin/shopping_start_voting.html", function(param){
            //place initialization functions to the template here.
            //will be executed when the template is rendered.
        });
    }

    /**
     * Generate Call number
     * @param {Object} obj The disk
     * @return {string} The callnumber
     */
    function cn(obj) {
        return obj.disk_type + pad(obj.id, 4);
    }

    function shopping_setup(func){
        return function(){
            cr.ui.changeSelection(name);
            document.title = 'Shopping | Film Society, HKUSTSU';
            func.apply(this,arguments);
        }
    }

    //view for the overlay of create shopping
    function create_shopping(){
        var overlay = $('multiuseOverlay'),
            title = overlay.querySelector('h1'),
            content = overlay.querySelector('.content-area'),
            button1 = $('multiuse-button1'),
            button2 = $('multiuse-button2'),
            button3 = $('multiuse-button3');
        cr.ui.resetMultiuse();
        title.textContent = 'Create New Shopping';
        button1.textContent = "Save as Draft";
        button1.removeAttribute('hidden');
        button2.textContent = "Publish as Ready";
        button2.removeAttribute('hidden');
        button3.textContent = "Cancel";
        button3.removeAttribute('hidden');
        overlay.eventTracker.add(button3, 'click', function() {
            cr.dispatchSimpleEvent(overlay, 'cancelOverlay');
        });
        cr.ui.overlay.showOverlay(overlay);
        //TODO: create the template
        var form = cr.ui.template.render_template('admin/shopping_create.html');
        content.appendChild(from);
        overlay.eventTracker.add(button1,'click', function(){
            cr.ui.showLoading();
            var payload = Application.collectForm(content);
            payload['state']='Draft';
            payload['film_1']=payload['film_1'.substr(1);
            payload['film_2']=payload['film_2'.substr(1);
            payload['film_3']=payload['film_3'.substr(1);
            payload['film_4']=payload['film_4'.substr(1);
            payload['film_5']=payload['film_5'.substr(1);
            payload['film_6']=payload['film_6'.substr(1);
            payload['film_7']=payload['film_7'.substr(1);
            payload['film_8']=payload['film_8'.substr(1);
            cr.model.Shopping.post(payload,function(){
                cr.ui.hideLoading();
                cr.dispatchSimpleEvent(overlay, 'cancelOverlay');
                history.go();
                cr.ui.showNotification('Saved','dismiss');
            });
        });

        overlay.eventTracker.add(button2,'click', function(){
            cr.ui.showLoading();
            var payload = Application.collectForm(content);
            payload['state']='Ready';
            payload['film_1']=payload['film_1'.substr(1);
            payload['film_2']=payload['film_2'.substr(1);
            payload['film_3']=payload['film_3'.substr(1);
            payload['film_4']=payload['film_4'.substr(1);
            payload['film_5']=payload['film_5'.substr(1);
            payload['film_6']=payload['film_6'.substr(1);
            payload['film_7']=payload['film_7'.substr(1);
            payload['film_8']=payload['film_8'.substr(1);
            cr.model.Shopping.post(payload,function(){
                cr.ui.hideLoading();
                cr.dispatchSimpleEvent(overlay, 'cancelOverlay');
                history.go();
                cr.ui.showNotification('Saved','dismiss');
            });
        });
    }

    //view for the overlay of editing a shopping
    function edit_shopping(id){
        var overlay = $('multiuseOverlay'),
            title = overlay.querySelector('h1'),
            content = overlay.querySelector('.content-area'),
            button2 = $('multiuse-button2'),
            button3 = $('multiuse-button3');
        cr.ui.resetMultiuse();
        title.textContent = "Edit Shopping Information";
        button2.textContent = "Save";
        button2.removeAttribute('hidden');
        button3.textContent = "Cancel";
        button3.removeAttribute('hidden');
        overlay.eventTracker.add(button3, 'click', function() {
          cr.dispatchSimpleEvent(overlay, 'cancelOverlay');
        });
        cr.ui.overlay.showOverlay(overlay);
        cr.model.Shopping.get(id,function(obj){
            //TODO: create the template
            var form = cr.ui.template.render_template('admin/shopping_edit.htmnl', {shopping: obj, cn: cn});
            content.appendChild(form);
            overlay.eventTracker.add(button2,'click',function(){
                cr.ui.showLoading();
                var payload = Application.collectForm(content);
                var regex = /^[ABC]\d{4}$/;
                if ( (payload['film_1'] && !regex.test(payload['film_1']))
                  || (payload['film_2'] && !regex.test(payload['film_2']))
                  || (payload['film_3'] && !regex.test(payload['film_3']))
                  || (payload['film_4'] && !regex.test(payload['film_4']))
                  || (payload['film_5'] && !regex.test(payload['film_5']))
                  || (payload['film_6'] && !regex.test(payload['film_6']))
                  || (payload['film_7'] && !regex.test(payload['film_7']))
                  || (payload['film_8'] && !regex.test(payload['film_8'])) ){
                    alertOverlay.setValues(
                        'Error',
                        'Call Number Error',
                        'Retry',
                        null,
                        function(){
                            cr.dispatchSimpleEvent($('alertOverlay'), 'cancelOverlay');
                            routerManager.parseHash();
                        },
                        null
                    );
                    cr.ui.overlay.showOverlay($('alertOverlay'));
                    return;
                }
                payload['film_1'] && (payload['film_1'] = payload['film_1'].substr(1));
                payload['film_2'] && (payload['film_2'] = payload['film_2'].substr(1));
                payload['film_3'] && (payload['film_3'] = payload['film_3'].substr(1));
                payload['film_4'] && (payload['film_4'] = payload['film_4'].substr(1));
                payload['film_5'] && (payload['film_5'] = payload['film_5'].substr(1));
                payload['film_6'] && (payload['film_6'] = payload['film_6'].substr(1));
                payload['film_7'] && (payload['film_7'] = payload['film_7'].substr(1));
                payload['film_8'] && (payload['film_8'] = payload['film_8'].substr(1));
                cr.model.Shopping.put(id, payload, true, function(){
                    cr.ui.hideLoading();
                    cr.dispatchSimpleEvent(overlay,'cancelOverlay');
                    history.go();
                    cr.ui.showNotification('saved','dismiss');
                });
            });
        });
    }

    function start_voting_shopping(shopping){
        alertOverlay.setValues(
            'Confirm Start Voting',
            'Confirm Start Voting?',
            'Start Voting',
            'Cancel',
            function(){
                cr.dispatchSimpleEvent($('alertOverlay'),'cancelOverlay');
                cr.ui.showLoading();
                cr.model.Shopping.put(shopping.id, {state: 'Voting'}, true, function(){
                    cr.ui.hideLoading();
                    history.go();
                    cr.ui.showNotification('Started Voting','dismiss');
                }),
            },
            function(){
                cr.dispatchSimpleEvent($('alertOverlay'), 'cancelOverlay');
            },
        );
        cr.ui.overlay.showOverlay($('alertOverlay'));
    }

    function delete_shopping(shopping){
        alertOverlay.setValues(
            'Confirm Delete',
            'Confirm Delete Shopping?',
            'Delete',
            'Cancel',
            function(){
                cr.dispatchSimpleEvent($('alertOverlay'),'cancelOverlay');
                cr.ui.showLoading();
                cr.model.Shopping.remove(shopping.id, function(){
                    cr.ui.hideLoading();
                    history.go();
                    cr.ui.showNotification('Deleted','dismiss');
                }),
            },
            function(){
                cr.dispatchSimpleEvent($('alertOverlay'), 'cancelOverlay');
            },
        );
        cr.ui.overlay.showOverlay($('alertOverlay'));

    }

    function shopping_list(query) {
        var page = query.page || 1,
            type_filter = query.type_filter ? query.type_filter.split(',') : ['Draft','Ready','Voting','Passed'],
            skeleton = cr.ui.template.render_template("admin/shopping_list.html",{filter: type_filter});
        cr.ui.replaceContent(skeleton);
        //Load data
        var list_container = skeleton.querySelector("list"),
            content = skeleton.querySelector('.content'),
            footer = skeleton.querySelector("footer"),
            api_query = "/?" + 'page=' + page + '&state__in=' + type_filter.join(','),
            pager=new cr.Pager(cr.model.Shopping, api_query);
        cr.ui.displayLoading(content);
        pager.load(load_obj);
        //Add hooks

        //Previous
        skeleton.querySelector('#page-prev').addEventListener('click', function(e) {
            page--;
            routerManager.pushState(generateURL(), false, true);
            scrollTo(0, 0);
            cr.ui.displayLoading(content);
            pager.prev(load_obj);
        });

        //Next
        skeleton.querySelector('#page-next').addEventListener('click', function(e) {
            page++;
            routerManager.pushState(generateURL(), false, true);
            scrollTo(0, 0);
            cr.ui.displayLoading(content);
            pager.next(load_obj);
        });

        //Checkboxes
        var checkbox = skeleton.querySelectorAll('header .controls input[type="checkbox"]');
        for (var i=0; i< checkbox.length; i++){
            checkbox[i].addEventListener('change',function(e){
                var type = e.target.getAttribue('filter');
                if (e.target.checked){
                    type_filter.push(type);
                }
                else{
                    type_filter.splice(type_filter.indexOf(type),1);
                }
                page=1;
                api_query = "/?" + 'page=' + page + '&state__in=' + type_filter.join(','),
                pager=new cr.Pager(cr.model.Shopping, api_query);
                routerManager.pushState(generateURL(),false,true);
                scrollTo(0,0);
                cr.ui.displayLoading(content);
                pager.load(load_obj);
            });
        }

        //Buttons
        skeleton.querySelector('#shopping-view-log').addEventListener('click',function(){
            cr.logger.showLogger('View Logs of module Shopping' , {
                model:'Shopping',
                //TODO: add types to backend_models
            }, cr.model.Shopping.types);
        });
        skeleton.querySelector('#shopping-create-show').addEventListener('click',create_shopping);
        
        function load_obj(obj_list){
            cr.ui.removeLoading(content);
            list_container.classList.add('content-loading');
            list_container.innerHTML = '';
            for (var i=0; i<obj_list.length; i++){
                var listitem = cr.ui.template.render_template("admin/shopping_list_item.html",{shopping: obj_list[i], cn: cn});
                list_container.appendChild(listitem);
            }
            if (this.has_prev) {
                footer.querySelector('.lefthub').removeAttribute('hidden');
            }
            else {
                footer.querySelector('.lefthub').setAttribute('hidden', 'true');
            }
            if (this.has_next) {
                footer.querySelector('.righthub').removeAttribute('hidden');
            }
            else {
                footer.querySelector('.righthub').setAttribute('hidden', 'true');
            }
            footer.querySelector('.centerhub > span').textContent = this.page + '/' + this.total;
            setTimeout(function(){
                list_containter.classList.remove("content-loading");
            }, 100);
        }
        function generateURL() {
            return 'shopping/?page=' + page + '&type_filter=' + type_filter.join(',');
        }
    }

    return {
        Initialize: Initialize,
    }
});

cr.view.shopping.Initialize();